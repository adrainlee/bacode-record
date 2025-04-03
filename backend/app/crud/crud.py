from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
from typing import Optional, List, Tuple

from ..models.models import Scan
from ..schemas.schemas import ScanCreate, ScanQuery, ScanExportQuery

def get_scan_by_barcode(db: Session, barcode: str) -> Optional[Scan]:
    """根据条码获取扫描记录"""
    return db.query(Scan).filter(Scan.barcode == barcode).first()

def create_scan(db: Session, scan: ScanCreate) -> Tuple[Optional[Scan], bool, str]:
    """
    创建新的扫描记录
    返回值：(scan对象, 是否为重复记录, 消息)
    """
    # 先检查条码是否已存在
    existing_scan = get_scan_by_barcode(db, scan.barcode)
    if existing_scan:
        return (existing_scan, True, f"条码 {scan.barcode} 已存在，扫描时间：{existing_scan.scanned_at}")

    try:
        db_scan = Scan(barcode=scan.barcode, notes=scan.notes)
        db.add(db_scan)
        db.commit()
        db.refresh(db_scan)
        return (db_scan, False, "扫描成功")
    except IntegrityError:
        db.rollback()
        # 再次检查，以防在并发情况下刚刚被其他请求创建
        existing_scan = get_scan_by_barcode(db, scan.barcode)
        if existing_scan:
            return (existing_scan, True, f"条码 {scan.barcode} 已存在，扫描时间：{existing_scan.scanned_at}")
        return (None, False, "创建记录失败")

def get_scan(db: Session, scan_id: int) -> Optional[Scan]:
    """获取单个扫描记录"""
    return db.query(Scan).filter(Scan.id == scan_id).first()

def get_scan_filters(query: ScanQuery | ScanExportQuery) -> list:
    """生成查询过滤条件"""
    filters = []
    
    if query.barcode:
        filters.append(Scan.barcode.contains(query.barcode))
    
    if query.start_date:
        filters.append(Scan.scanned_at >= query.start_date)
    
    if query.end_date:
        # 将结束日期调整为当天的最后一刻
        end_date = query.end_date.replace(hour=23, minute=59, second=59, microsecond=999999)
        filters.append(Scan.scanned_at <= end_date)
    
    return filters

def get_scans(db: Session, query: ScanQuery) -> Tuple[List[Scan], int]:
    """获取多个扫描记录，支持筛选条件和分页"""
    filters = get_scan_filters(query)
    base_query = db.query(Scan)
    
    if filters:
        base_query = base_query.filter(and_(*filters))
    
    total = base_query.count()
    scans = base_query.order_by(Scan.scanned_at.desc()).offset(query.skip).limit(query.limit).all()
    
    return scans, total

def get_scans_for_export(db: Session, query: ScanExportQuery) -> List[Scan]:
    """获取用于导出的扫描记录"""
    filters = get_scan_filters(query)
    base_query = db.query(Scan)
    
    if filters:
        base_query = base_query.filter(and_(*filters))
    
    # 导出所有符合条件的记录，按时间倒序排序
    scans = base_query.order_by(Scan.scanned_at.desc()).all()
    return scans

def clear_all_scans(db: Session) -> int:
    """
    清空所有扫描记录
    返回值：删除的记录数量
    """
    try:
        # 获取记录总数
        count = db.query(Scan).count()
        
        # 删除所有记录
        db.query(Scan).delete()
        db.commit()
        
        return count
    except Exception as e:
        db.rollback()
        raise e