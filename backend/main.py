from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional, List
import json

from database import get_db, init_db, seed_initial_data
from models import PantryItemCreate, PantryItemUpdate, ConfirmReceiptRequest, VerificationRequest
from ocr_service import process_receipt_image, get_preset_receipt, SAMPLE_RECEIPTS
from ai_engine import (
    generate_predictions, 
    generate_recommendations, 
    generate_expiry_alerts, 
    compute_savings_insights,
    calculate_days_remaining,
    evaluate_item_status
)
from verifier import verify_calculation

app = FastAPI(
    title="PantryPilot API",
    description="Smart AI-Powered Pantry Assistant API",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def root():
    return {
        "app": "PantryPilot API",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

# ----------------- PANTRY ENDPOINTS -----------------

@app.get("/api/pantry")
def get_pantry():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pantry_items ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    items = []
    for r in rows:
        d = dict(r)
        d["days_left"] = calculate_days_remaining(d["expiry_date"])
        d["status"] = evaluate_item_status(d)
        items.append(d)
    return {"items": items, "total_count": len(items)}

@app.post("/api/pantry")
def add_pantry_item(item: PantryItemCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    status = "Fresh"
    days_left = calculate_days_remaining(item.expiry_date)
    if days_left == 0:
        status = "Expired"
    elif days_left <= 3:
        status = "Expiring Soon"
    elif item.quantity <= (item.min_threshold or 1.0):
        status = "Low Stock"

    cursor.execute("""
    INSERT INTO pantry_items (name, category, quantity, unit, price, purchase_date, expiry_date, status, min_threshold, daily_burn_rate, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        item.name, item.category, item.quantity, item.unit,
        item.price, item.purchase_date, item.expiry_date,
        status, item.min_threshold or 1.0, item.daily_burn_rate or 0.2, item.notes or ""
    ))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"id": new_id, "message": f"Added {item.name} to pantry successfully"}

@app.put("/api/pantry/{item_id}")
def update_pantry_item(item_id: int, item: PantryItemUpdate):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM pantry_items WHERE id = ?", (item_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Item not found")

    data = dict(existing)
    update_fields = item.dict(exclude_unset=True)
    for k, v in update_fields.items():
        if v is not None:
            data[k] = v

    data["status"] = evaluate_item_status(data)

    cursor.execute("""
    UPDATE pantry_items
    SET name=?, category=?, quantity=?, unit=?, price=?, purchase_date=?, expiry_date=?, status=?, min_threshold=?, daily_burn_rate=?, notes=?
    WHERE id=?
    """, (
        data["name"], data["category"], data["quantity"], data["unit"],
        data["price"], data["purchase_date"], data["expiry_date"],
        data["status"], data["min_threshold"], data["daily_burn_rate"],
        data["notes"], item_id
    ))
    conn.commit()
    conn.close()
    return {"message": "Updated successfully", "item": data}

@app.delete("/api/pantry/{item_id}")
def delete_pantry_item(item_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM pantry_items WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return {"message": "Item deleted successfully"}

@app.post("/api/reset")
def reset_pantry_data():
    seed_initial_data(force=True)
    return {"message": "Pantry re-initialized with sample grocery data!"}

# ----------------- RECEIPT SCANNER ENDPOINTS -----------------

@app.post("/api/receipt/scan")
async def scan_receipt(
    file: Optional[UploadFile] = File(None),
    preset_id: Optional[str] = Form(None)
):
    if preset_id and preset_id in SAMPLE_RECEIPTS:
        return get_preset_receipt(preset_id)

    if file:
        file_bytes = await file.read()
        return process_receipt_image(file_bytes, file.filename)

    # If neither provided, default to freshmart preset
    return get_preset_receipt("freshmart")

@app.get("/api/receipt/presets")
def get_presets():
    return {
        "presets": [
            {
                "id": "freshmart",
                "name": "FreshMart Groceries (7 items)",
                "description": "Milk, Eggs, Tomatoes, Bread, Potatoes, Rice, Cooking Oil"
            },
            {
                "id": "trader_joes",
                "name": "Trader Joe's Organic (6 items)",
                "description": "Greek Yogurt, Spinach, Cheddar, Bananas, Almond Milk, Avocados"
            },
            {
                "id": "costco",
                "name": "Costco Wholesale Bulk (4 items)",
                "description": "Oat Milk 6pk, Chicken Breast, Quinoa, Olive Oil 2L"
            }
        ]
    }

@app.post("/api/receipt/confirm")
def confirm_receipt(payload: ConfirmReceiptRequest):
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now()
    purchase_date = now.strftime("%Y-%m-%d")

    # Record receipt history
    cursor.execute("""
    INSERT INTO receipt_history (store_name, scan_date, total_amount, item_count, raw_text)
    VALUES (?, ?, ?, ?, ?)
    """, (
        payload.store_name, purchase_date, payload.total_amount, len(payload.items),
        f"Receipt confirmed from {payload.store_name} on {purchase_date}"
    ))

    added_count = 0
    updated_count = 0

    for it in payload.items:
        # Check if item with similar name already exists
        cursor.execute("SELECT id, quantity, price FROM pantry_items WHERE LOWER(name) = LOWER(?)", (it.name.strip(),))
        match = cursor.fetchone()
        
        # Shelf life heuristic based on category
        shelf_days = 7
        cat = it.category.lower()
        if "dairy" in cat:
            shelf_days = 6
        elif "produce" in cat:
            shelf_days = 5
        elif "bakery" in cat:
            shelf_days = 4
        elif "grain" in cat:
            shelf_days = 90
        elif "pantry" in cat:
            shelf_days = 60
        elif "meat" in cat:
            shelf_days = 4

        expiry_date = (now + timedelta(days=shelf_days)).strftime("%Y-%m-%d")

        if match:
            # Update existing quantity
            new_qty = float(match["quantity"]) + it.quantity
            cursor.execute("""
            UPDATE pantry_items 
            SET quantity=?, price=?, purchase_date=?, expiry_date=?, status='Fresh'
            WHERE id=?
            """, (new_qty, it.price, purchase_date, expiry_date, match["id"]))
            updated_count += 1
        else:
            # Insert new
            cursor.execute("""
            INSERT INTO pantry_items (name, category, quantity, unit, price, purchase_date, expiry_date, status, min_threshold, daily_burn_rate, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                it.name, it.category, it.quantity, it.unit,
                it.price, purchase_date, expiry_date, "Fresh",
                1.0, 0.25, f"Added from receipt ({payload.store_name})"
            ))
            added_count += 1

    conn.commit()
    conn.close()

    return {
        "message": f"Successfully processed receipt: {added_count} new items added, {updated_count} existing items updated.",
        "added_count": added_count,
        "updated_count": updated_count
    }

# ----------------- AI, RECOMMENDATIONS & INSIGHTS -----------------

def fetch_all_items():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pantry_items")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@app.get("/api/predictions")
def get_predictions():
    items = fetch_all_items()
    return generate_predictions(items)

@app.get("/api/recommendations")
def get_recommendations():
    items = fetch_all_items()
    return generate_recommendations(items)

@app.get("/api/alerts")
def get_alerts():
    items = fetch_all_items()
    return {"alerts": generate_expiry_alerts(items)}

@app.get("/api/insights")
def get_insights():
    items = fetch_all_items()
    return compute_savings_insights(items)

# ----------------- VERIFICATION LAYER -----------------

@app.post("/api/verify")
def run_verification(req: VerificationRequest):
    items = fetch_all_items()
    result = verify_calculation(items, req.calculation_type)

    # Save to audit table
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO audit_verifications (calc_name, input_hash, output_hash, state_root, verified_at, formula, proof_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        result["calculation_type"],
        result["input_hash"],
        result["output_hash"],
        result["state_root"],
        result["timestamp"],
        result["formula"],
        json.dumps(result["details"])
    ))
    conn.commit()
    conn.close()

    return result

@app.get("/api/verify/history")
def get_verification_history():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_verifications ORDER BY id DESC LIMIT 10")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"history": rows}

# Mount frontend production build if available
import os
from starlette.staticfiles import StaticFiles
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")

