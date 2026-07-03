import random
from datetime import datetime, timedelta, date, timezone, time
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.attendance import AttendanceSession, AttendanceRecord
from sqlalchemy import select, cast, Date
from models.user import User

# 출석 세션 생성 및 출석 코드 생성 로직
async def create_attendance_session(db: Session, duration_minutes: int = 3):
    auth_code = f"{random.randint(0, 999999):06d}"
    
    expires_at = datetime.utcnow() + timedelta(minutes=duration_minutes)

    new_session = AttendanceSession(auth_code=auth_code, expires_at=expires_at)
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    
    return new_session

# 출석 인증 로직
async def verify_attendance(db, user_id: str, auth_code: str): 
    result_user = await db.execute(select(User).filter(User.user_id == user_id))
    user = result_user.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="가입되지 않은 유저입니다.")
    
    result_session = await db.execute(
        select(AttendanceSession)
        .filter(AttendanceSession.auth_code == auth_code)
        .order_by(AttendanceSession.created_at.desc())
    )
    session = result_session.scalars().first()  

    if not session:
        raise HTTPException(status_code=404, detail="유효하지 않은 출석 코드입니다.")

    if datetime.utcnow() > session.expires_at:
        raise HTTPException(status_code=400, detail="출석 코드가 만료되었습니다.")

    result_record = await db.execute(
        select(AttendanceRecord).filter(
            AttendanceRecord.user_id == user_id,
            AttendanceRecord.session_id == session.id
        )
    )
    existing_record = result_record.scalars().first()

    if existing_record:
        raise HTTPException(status_code=400, detail="이미 출석이 완료되었습니다.")

    new_record = AttendanceRecord(user_id=user_id, session_id=session.id)
    db.add(new_record)

    await db.commit()
    await db.refresh(new_record)

    return new_record

# 날짜별 조회 로직
async def get_records_by_date(db, target_date: date):
    start_dt = datetime.combine(target_date, datetime.min.time()) - timedelta(hours=9)
    end_dt = start_dt + timedelta(days=1)
    
    result = await db.execute(
        select(AttendanceRecord)
        .filter(AttendanceRecord.attended_at >= start_dt)
        .filter(AttendanceRecord.attended_at < end_dt)
    )
    
    return result.scalars().all()

# 출석 시간 수정 로직
async def update_attendance(db, record_id: int, target_date: date):
    result = await db.execute(select(AttendanceRecord).filter(AttendanceRecord.id == record_id))
    record = result.scalars().first()
    
    if not record:
        raise HTTPException(status_code=404, detail="해당 출석 기록을 찾을 수 없습니다.")
    
    record.attended_at = datetime.combine(target_date, time(0, 0))
    
    await db.commit()
    await db.refresh(record)
    return record