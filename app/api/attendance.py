from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db 
from app.schemas.attendance import SessionResponse, AttendanceVerifyRequest, AttendanceVerifyResponse, SessionCreate, AttendanceRecordResponse, AttendanceUpdateRequest
from app.services import attendance as attendance_service
from datetime import date, datetime
from typing import List

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/session", response_model=SessionResponse)
async def create_session(session_data: SessionCreate, db: Session = Depends(get_db)):
    """관리자용: 새로운 출석 세션과 6자리 랜덤 코드를 생성합니다."""
    return await attendance_service.create_attendance_session(db=db, duration_minutes=session_data.duration_minutes)

@router.post("/verify", response_model=AttendanceVerifyResponse)
async def verify_attendance(request: AttendanceVerifyRequest, db: Session = Depends(get_db)):
    """유저용: 6자리 코드를 입력하여 출석을 인증합니다."""
    record = await attendance_service.verify_attendance(
        db=db, 
        user_id=request.user_id, 
        auth_code=request.auth_code
    )
    return AttendanceVerifyResponse(
        message="출석이 완료되었습니다.",
        attended_at=record.attended_at
    )

@router.get("/records", response_model=List[AttendanceRecordResponse])
async def get_attendance_records(
    target_date: date = Query(..., description="조회할 날짜 (YYYY-MM-DD)"), 
    db = Depends(get_db)
):
    """관리자용: 특정 날짜의 출석 목록을 조회합니다."""
    
    records = await attendance_service.get_records_by_date(db=db, target_date=target_date)
    
    return records

@router.put("/records/{record_id}", response_model=AttendanceRecordResponse)
async def update_attendance_record(
    record_id: int, 
    request: AttendanceUpdateRequest, 
    db = Depends(get_db)
):
    return await attendance_service.update_attendance(
        db=db, 
        record_id=record_id, 
        target_date=request.attendance_date 
    )