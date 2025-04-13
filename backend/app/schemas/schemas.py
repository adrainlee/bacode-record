from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ScanBase(BaseModel):
    barcode: str
    notes: Optional[str] = None

class ScanCreate(ScanBase):
    pass

class Scan(ScanBase):
    id: int
    scanned_at: datetime

    class Config:
        from_attributes = True # Pydantic V2 使用 from_attributes 替代 orm_mode

class ScanCreateResponse(BaseModel):
    scan: Scan
    is_duplicate: bool
    message: str

class ScanQuery(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    barcode: Optional[str] = None
    skip: Optional[int] = 0
    limit: Optional[int] = 100

class ScanExportQuery(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    barcode: Optional[str] = None

class ScanResponse(BaseModel):
    scans: List[Scan]
    total: int