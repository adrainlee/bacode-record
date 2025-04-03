from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, date
import pandas as pd
import io

from ..models.base import get_db
from ..schemas.schemas import (
    Scan, ScanCreate, ScanQuery, ScanResponse, 
    ScanExportQuery, ScanCreateResponse
)
from ..crud.crud import (
    create_scan, get_scan, get_scans, 
    get_scans_for_export, clear_all_scans
)

router = APIRouter()

@router.post("/scans", response_model=ScanCreateResponse)
def create_scan_endpoint(scan: ScanCreate, db: Session = Depends(get_db)):
    """创建新的扫描记录"""
    scan_result, is_duplicate, message = create_scan(db=db, scan=scan)
    if scan_result is None:
        raise HTTPException(status_code=500, detail=message)
        
    return {
        "scan": scan_result,
        "is_duplicate": is_duplicate,
        "message": message
    }

@router.get("/scans", response_model=ScanResponse)
def read_scans(
    barcode: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """获取扫描记录列表，支持筛选条件"""
    try:
        # 转换日期字符串为datetime对象
        start_datetime = datetime.fromisoformat(start_date) if start_date else None
        end_datetime = datetime.fromisoformat(end_date) if end_date else None
        
        query = ScanQuery(
            barcode=barcode,
            start_date=start_datetime,
            end_date=end_datetime,
            skip=skip,
            limit=limit
        )
        
        scans, total = get_scans(db, query=query)
        return {"scans": scans, "total": total}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"日期格式无效: {str(e)}")

@router.delete("/scans")
def clear_scans(db: Session = Depends(get_db)):
    """清空所有扫描记录"""
    try:
        count = clear_all_scans(db)
        return {"message": f"成功清空 {count} 条记录"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"清空记录失败: {str(e)}")

@router.get("/scans/export")
def export_scans(
    barcode: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """导出扫描记录为Excel"""
    try:
        # 转换日期字符串为datetime对象
        start_datetime = datetime.fromisoformat(start_date) if start_date else None
        end_datetime = datetime.fromisoformat(end_date) if end_date else None
        
        query = ScanExportQuery(
            barcode=barcode,
            start_date=start_datetime,
            end_date=end_datetime
        )
        
        scans = get_scans_for_export(db, query=query)
        
        # 转换为DataFrame
        data = []
        for scan in scans:
            data.append({
                "ID": scan.id,
                "条码": scan.barcode,
                "扫描时间": scan.scanned_at.strftime("%Y-%m-%d %H:%M:%S"),
                "备注": scan.notes or ""
            })
        
        if not data:
            # 如果没有数据，仍然创建一个空的DataFrame保持列结构
            data = [{
                "ID": "",
                "条码": "",
                "扫描时间": "",
                "备注": ""
            }]
        
        df = pd.DataFrame(data)
        
        # 创建Excel文件
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name="扫描记录")
        
        output.seek(0)
        
        # 生成文件名
        filename = f"barcode_scans_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"日期格式无效: {str(e)}")

@router.get("/scans/{scan_id}", response_model=Scan)
def read_scan(scan_id: int, db: Session = Depends(get_db)):
    """获取单个扫描记录"""
    db_scan = get_scan(db, scan_id=scan_id)
    if db_scan is None:
        raise HTTPException(status_code=404, detail="扫描记录未找到")
    return db_scan