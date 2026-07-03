from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db 
from schemas.attendance import SessionResponse, AttendanceVerifyRequest, SessionCreate, AttendanceRecordResponse
from schemas.attendance import SessionResponse, AttendanceVerifyRequest, AttendanceVerifyResponse, SessionCreate, AttendanceRecordResponse, AttendanceUpdateRequest
from services import attendance as attendance_service
from datetime import date, datetime
from typing import List
from api.user import get_current_user, get_current_admin
from schemas.attendance import AttendanceAdminUpdateRequest
from models.user import User
from api.dependencies import get_current_user

# 모든 api 주소 앞에 /attendance 붙히기, Attendance라는 그룹으로 묶어주기
router = APIRouter(prefix="/attendance", tags=["Attendance"])

# 🔒 1. 관리자 전용: 새로운 세션을 열어주는 기능
@router.post("/session", response_model=SessionResponse)
async def create_session(
    session_data: SessionCreate, 
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin) # 자물쇠
):
    """관리자용: 새로운 출석 세션과 6자리 랜덤 코드를 생성합니다."""
    return await attendance_service.create_attendance_session(db=db, duration_minutes=session_data.duration_minutes)

# 🔓 2. 일반 유저용: 코드를 인증하는 기능
@router.post("/verify")
async def check_in(
    request: AttendanceVerifyRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # 일반 로그인 확인
):
    """로그인된 유저가 출석 코드를 통해 하루 1회 출석합니다."""
    record = await attendance_service.verify_attendance(
        db=db, 
        user_id=current_user.user_id, # 객체에서 아이디만 추출
        auth_code=request.auth_code
    )
    return {"message": "오늘 출석이 완료되었습니다!", "date": record.date, "status": record.status}

# 🔒 3. 관리자 전용: 특정 날짜의 출석명단을 가져오는 기능
@router.get("/records", response_model=List[AttendanceRecordResponse])
async def get_attendance_records(
    target_date: date = Query(..., description="조회할 날짜 (YYYY-MM-DD)"), 
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin) # 자물쇠
):
    """관리자용: 특정 날짜의 출석 목록을 조회합니다."""
    records = await attendance_service.get_records_by_date(db=db, target_date=target_date)
    return records

# 🔒 4. 관리자 전용: 기록된 출석을 수정하는 기능
@router.patch("/admin/update-status", response_model=AttendanceRecordResponse)
async def admin_update_status(
    request: AttendanceAdminUpdateRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin) # 자물쇠
):
    """관리자가 특정 유저의 특정 날짜 출석/결석 상태를 변경합니다."""
    record = await attendance_service.update_attendance_status(
        db=db,
        user_id=request.user_id,
        target_date=request.target_date,
        status=request.status
    )
    return record