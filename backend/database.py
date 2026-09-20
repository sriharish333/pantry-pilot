import sqlite3
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "pantry_pilot.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Table: pantry_items
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pantry_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        price REAL NOT NULL,
        purchase_date TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        status TEXT NOT NULL,
        min_threshold REAL NOT NULL DEFAULT 1.0,
        daily_burn_rate REAL NOT NULL DEFAULT 0.2,
        notes TEXT DEFAULT ''
    )
    """)

    # Table: receipt_history
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS receipt_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_name TEXT NOT NULL,
        scan_date TEXT NOT NULL,
        total_amount REAL NOT NULL,
        item_count INTEGER NOT NULL,
        raw_text TEXT DEFAULT ''
    )
    """)

    # Table: audit_verifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        calc_name TEXT NOT NULL,
        input_hash TEXT NOT NULL,
        output_hash TEXT NOT NULL,
        state_root TEXT NOT NULL,
        verified_at TEXT NOT NULL,
        formula TEXT NOT NULL,
        proof_json TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()
    seed_initial_data()

def seed_initial_data(force=False):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM pantry_items")
    count = cursor.fetchone()[0]
    
    if count == 0 or force:
        if force:
            cursor.execute("DELETE FROM pantry_items")
            cursor.execute("DELETE FROM receipt_history")
            cursor.execute("DELETE FROM audit_verifications")
            
        now = datetime.now()
        
        # Sample items precisely matching user requirement:
        # Milk – 2 packets, Rice – 5 kg, Tomato – 1 kg, Eggs – 12, Bread – 1 packet, Potato – 2 kg, Cooking Oil – 1 litre
        sample_items = [
            {
                "name": "Milk",
                "category": "Dairy",
                "quantity": 2.0,
                "unit": "packets",
                "price": 66.0,
                "purchase_date": (now - timedelta(days=2)).strftime("%Y-%m-%d"),
                "expiry_date": (now + timedelta(days=4)).strftime("%Y-%m-%d"),
                "status": "Fresh",
                "min_threshold": 1.0,
                "daily_burn_rate": 0.35,
                "notes": "Amul Taaza Milk, 500ml pouch"
            },
            {
                "name": "Rice",
                "category": "Grains",
                "quantity": 5.0,
                "unit": "kg",
                "price": 350.0,
                "purchase_date": (now - timedelta(days=7)).strftime("%Y-%m-%d"),
                "expiry_date": (now + timedelta(days=80)).strftime("%Y-%m-%d"),
                "status": "Fresh",
                "min_threshold": 1.5,
                "daily_burn_rate": 0.08,
                "notes": "India Gate Basmati Rice"
            },
            {
                "name": "Tomato",
                "category": "Produce",
                "quantity": 1.0,
                "unit": "kg",
                "price": 40.0,
                "purchase_date": (now - timedelta(days=4)).strftime("%Y-%m-%d"),
                "expiry_date": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
                "status": "Expiring Soon",
                "min_threshold": 0.5,
                "daily_burn_rate": 0.25,
                "notes": "Fresh local hybrid tomatoes"
            },
            {
                "name": "Eggs",
                "category": "Dairy & Eggs",
                "quantity": 12.0,
                "unit": "pcs",
                "price": 84.0,
                "purchase_date": (now - timedelta(days=3)).strftime("%Y-%m-%d"),
                "expiry_date": (now + timedelta(days=11)).strftime("%Y-%m-%d"),
                "status": "Fresh",
                "min_threshold": 4.0,
                "daily_burn_rate": 1.2,
                "notes": "Farm fresh white eggs"
            },
            {
                "name": "Bread",
                "category": "Bakery",
                "quantity": 1.0,
                "unit": "packet",
                "price": 45.0,
                "purchase_date": (now - timedelta(days=3)).strftime("%Y-%m-%d"),
                "expiry_date": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
                "status": "Expiring Soon",
                "min_threshold": 1.0,
                "daily_burn_rate": 0.28,
                "notes": "Modern 100% Whole Wheat Bread"
            },
            {
                "name": "Potato",
                "category": "Produce",
                "quantity": 2.0,
                "unit": "kg",
                "price": 60.0,
                "purchase_date": (now - timedelta(days=5)).strftime("%Y-%m-%d"),
                "expiry_date": (now + timedelta(days=19)).strftime("%Y-%m-%d"),
                "status": "Fresh",
                "min_threshold": 1.0,
                "daily_burn_rate": 0.12,
                "notes": "Fresh Jyoti Potatoes"
            },
            {
                "name": "Cooking Oil",
                "category": "Pantry",
                "quantity": 1.0,
                "unit": "litre",
                "price": 165.0,
                "purchase_date": (now - timedelta(days=10)).strftime("%Y-%m-%d"),
                "expiry_date": (now + timedelta(days=75)).strftime("%Y-%m-%d"),
                "status": "Fresh",
                "min_threshold": 0.3,
                "daily_burn_rate": 0.02,
                "notes": "Fortune Refined Sunflower Oil"
            }
        ]

        for item in sample_items:
            cursor.execute("""
            INSERT INTO pantry_items (name, category, quantity, unit, price, purchase_date, expiry_date, status, min_threshold, daily_burn_rate, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item["name"], item["category"], item["quantity"], item["unit"],
                item["price"], item["purchase_date"], item["expiry_date"],
                item["status"], item["min_threshold"], item["daily_burn_rate"], item["notes"]
            ))

        # Sample initial receipt history in INR
        cursor.execute("""
        INSERT INTO receipt_history (store_name, scan_date, total_amount, item_count, raw_text)
        VALUES (?, ?, ?, ?, ?)
        """, (
            "Reliance Fresh Supermarket",
            (now - timedelta(days=3)).strftime("%Y-%m-%d"),
            810.0,
            7,
            "Reliance Fresh #104\nMilk 2 pk ₹66.00\nRice 5kg ₹350.00\nTomato 1kg ₹40.00\nEggs 12ct ₹84.00\nBread 1pk ₹45.00\nPotato 2kg ₹60.00\nCooking Oil 1L ₹165.00\nTOTAL ₹810.00"
        ))

        conn.commit()

    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully with sample pantry data.")
