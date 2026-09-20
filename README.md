# PantryPilot – Smart Pantry Assistant 🚀

PantryPilot is an AI-powered smart pantry assistant designed to eliminate duplicate grocery purchases, prevent food spoilage before expiration, automate receipt extraction, and cryptographically verify household grocery savings.

---

## 🌟 Modules & Features

### 1. 📊 Interactive Dashboard
- **Real-time KPI Cards**: Total pantry items, items expiring soon (≤ 3 days), items running low, estimated monthly grocery spending, and estimated food waste.
- **Quick Action Bar**: 1-click jumps to Scan Receipt, View Pantry, Get Suggestions, and Verify Calculation.
- **Live Expiry Ticker**: Instant alerts on items that require cooking priority.

### 2. 🧾 OCR Receipt Scanner
- **Camera / File Upload**: Drag-and-drop or snapshot grocery receipts.
- **Preset Supermarket Bills**: 1-click test receipts for **FreshMart**, **Trader Joe's**, and **Costco Wholesale Bulk** for instant hackathon demonstrations without needing physical bills.
- **Automatic Item Extraction**: Extracts Item Name, Quantity, Unit, Price, and Category.
- **Editable Table**: Modify, add, or delete extracted rows before confirming.
- **"Confirm & Add to Pantry"**: Inserts new items or merges quantities with existing inventory.

### 3. 🥫 Smart Pantry Inventory
- **Full Inventory View**: Displays Name, Category badge, Quantity & Unit, Purchase Date, Estimated Expiry Date, and Status (`Fresh`, `Expiring Soon`, `Expired`, `Low Stock`).
- **Interactive Controls**: Instant inline quantity increment/decrement (`+` / `-`), manual item creation modal, and deletion.
- **Search & Filters**: Real-time keyword search and category/status filter pills.

### 4. 🧠 AI Consumption & Expiry Predictor
- **Household Burn Rate Analysis**: Computes consumption velocity ($\beta$ units/day) and days until exhaustion.
- **Natural Language Explanations**: E.g., *"Milk is usually consumed within 5 days based on your previous usage (burn rate: 0.35 packets/day)."*
- **Replenishment Timeline**: Flags which staples are depleting in $\le 5$ days.
- **Waste Loss Quantification**: Calculates exact potential dollar loss if perishable items are not consumed in time.

### 5. 🛒 Smart BUY / DON'T BUY Recommendations
- **Split-View Decision Engine**:
  - **BUY**: Items running low or predicted to run out soon.
  - **DON'T BUY**: Overstocked staples (e.g., Rice 5 kg, Cooking Oil 1 L) and perishable items expiring soon to prevent duplicate purchases.
- **Explanatory Justification**: Clear reason displayed alongside every recommendation.
- **Quick Shopping List**: Add items to your active shopping list with one tap.

### 6. 🚨 Expiry & Inventory Alerts
- Dynamic severity warnings (`Critical`, `Warning`, `Info`) for items expiring today, expiring in $\le 2$ days, or overstocked items.

### 7. 📈 Savings & Waste Analytics
- **Category Spending Breakdown**: Visual distribution across Dairy, Produce, Bakery, Grains, and Pantry.
- **Food Waste Reduction Trend**: Visual comparison showing $\sim 72\%$ reduction in food waste with PantryPilot vs without.
- **Household Protection Metrics**: Potential monthly savings and dollar value of duplicate purchases avoided.

### 8. 🛡️ Cryptographic Verification Layer
- **Verifiable Computation**: Computes canonical input hashes, deterministic waste loss formulas, and Merkle-leaf state roots (`0x...`).
- **"Calculation verified" Certificate**: Displays step-by-step mathematical proof breakdown, output digest, and audit log history.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons
- **Backend**: Python 3.13, FastAPI, Uvicorn, SQLite
- **OCR Engine**: Tesseract OCR wrapper + intelligent regex heuristic parser + realistic supermarket presets
- **Verification**: Cryptographic SHA-256 state-root hashing & verifiable ledger computation

---

## ⚡ Quick Start

### 1. Launch All with One Click
Double-click `run_all.bat` or run:
```bash
.\run_all.bat
```

### 2. Manual Startup

#### Backend:
```powershell
cd backend
py start_server.py
```
*Backend API runs at: `http://127.0.0.1:8000`*
*Interactive Swagger Docs: `http://127.0.0.1:8000/docs`*

#### Frontend (Development):
```powershell
cd frontend
$env:PATH = "C:\Users\SRIHARISH\.gemini\antigravity\scratch\nodejs;" + $env:PATH
npm run dev
```
*Frontend runs at: `http://127.0.0.1:5173`*

---

## 📋 Hackathon Demo Flow

1. **Open Dashboard**:
   - Notice the 7 pre-seeded grocery items:
     - `Milk – 2 packets`
     - `Rice – 5 kg`
     - `Tomato – 1 kg`
     - `Eggs – 12`
     - `Bread – 1 packet`
     - `Potato – 2 kg`
     - `Cooking Oil – 1 litre`
2. **Scan a Grocery Receipt**:
   - Navigate to **Receipt Scanner** tab.
   - Click one of the preset bills (e.g. **FreshMart** or **Trader Joe's**) or upload your own receipt.
   - Inspect the live OCR terminal and editable extracted table.
   - Click **"Confirm & Add to Pantry"**.
3. **Inspect Smart Pantry**:
   - Observe the updated inventory, freshness status badges, and adjust quantities with `+` / `-`.
4. **Explore AI Predictions**:
   - Check the consumption velocity explanations (e.g., *"Milk is usually consumed within 5 days based on your previous usage."*).
5. **Review BUY / DON'T BUY Recommendations**:
   - See how Rice and Cooking Oil are flagged under **DON'T BUY** to prevent duplicate purchases.
6. **Check Savings & Waste Insights**:
   - Review spending by category and the food waste reduction chart.
7. **Verify Calculation**:
   - Click **"Verify Calculation"** on any screen or the top navbar.
   - Review the green **"Calculation verified"** banner, SHA-256 state root, and mathematical audit proof.
