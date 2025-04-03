from sqlalchemy import Column, Integer, String, DateTime, Text, UniqueConstraint
from sqlalchemy.sql import func
from .base import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    barcode = Column(String, index=True, nullable=False, unique=True)
    scanned_at = Column(DateTime, default=func.now(), nullable=False)
    notes = Column(Text, nullable=True)  # 可选的备注字段

    # 添加唯一约束
    __table_args__ = (
        UniqueConstraint('barcode', name='uq_scan_barcode'),
    )

    def __repr__(self):
        return f"<Scan(id={self.id}, barcode={self.barcode}, scanned_at={self.scanned_at})>"