from pydantic import BaseModel
from typing import List, Optional

class PantryItemCreate(BaseModel):
    name: str
    category: str
    quantity: float
    unit: str
    price: float
    purchase_date: str
    expiry_date: str
    min_threshold: Optional[float] = 1.0
    daily_burn_rate: Optional[float] = 0.2
    notes: Optional[str] = ""

class PantryItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    price: Optional[float] = None
    purchase_date: Optional[str] = None
    expiry_date: Optional[str] = None
    min_threshold: Optional[float] = None
    daily_burn_rate: Optional[float] = None
    notes: Optional[str] = None

class PantryItemResponse(BaseModel):
    id: int
    name: str
    category: str
    quantity: float
    unit: str
    price: float
    purchase_date: str
    expiry_date: str
    status: str
    min_threshold: float
    daily_burn_rate: float
    notes: str
    days_left: int

class ReceiptExtractedItem(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    quantity: float
    unit: str
    price: float
    confidence: float = 0.95

class ConfirmReceiptRequest(BaseModel):
    store_name: str
    items: List[ReceiptExtractedItem]
    total_amount: float

class VerificationRequest(BaseModel):
    calculation_type: str = "food_waste_and_savings"

class VerificationResponse(BaseModel):
    calculation_type: str
    status: str
    verified: bool
    input_hash: str
    output_hash: str
    state_root: str
    timestamp: str
    formula: str
    details: dict
