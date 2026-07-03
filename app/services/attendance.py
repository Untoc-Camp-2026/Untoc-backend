import random
from datetime import timezone, time, datetime, timedelta, date
from datetime import datetime, timedelta, date as date_type
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.attendance import AttendanceSession, AttendanceRecord, AttendanceStatus
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

# 날짜별 조회 로직
async def get_records_by_date(db, target_date: date_type):
    """
    특정 날짜의 모든 출석/결석 기록을 가져옵니다.
    이제 DB에 'date' 컬럼이 있으므로 복잡한 시간 계산 없이 바로 검색합니다!
    """
    result = await db.execute(
        select(AttendanceRecord).filter(AttendanceRecord.date == target_date)
    )
    records = result.scalars().all()
    
    return records

# 유저 출석 인증 로직
async def verify_attendance(db, user_id: str, auth_code: str): 
    # 1. 세션(출석 방) 조회 및 유효기간 검증 (기존 코드와 동일)
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

    # 🌟 2. 한국 시간 기준으로 '오늘 날짜' 구하기
    today_kst = (datetime.utcnow() + timedelta(hours=9)).date()

    # 3. 오늘 날짜의 출석 기록이 있는지 확인
    query = select(AttendanceRecord).filter_by(user_id=user_id, date=today_kst)
    existing_record = (await db.execute(query)).scalars().first()

    if existing_record:
        if existing_record.status == AttendanceStatus.PRESENT:
            raise HTTPException(status_code=400, detail="오늘은 이미 출석하셨습니다.")
        else:
            # 관리자가 '결석'으로 미리 만들어 둔 기록이 있다면 '출석'으로 덮어씀
            existing_record.status = AttendanceStatus.PRESENT
            existing_record.session_id = session.id
            existing_record.attended_at = datetime.utcnow()
            record = existing_record
    else:
        # 4. 새로운 출석 기록 생성
        record = AttendanceRecord(
            user_id=user_id, 
            session_id=session.id,
            date=today_kst,
            status=AttendanceStatus.PRESENT,
            attended_at=datetime.utcnow()
        )
        db.add(record)

    await db.commit()
    await db.refresh(record)
    return record

# 관리자용: 출석 상태 수동 변경 (결석 <-> 출석)
async def update_attendance_status(db, user_id: str, target_date: date_type, status: AttendanceStatus):
    query = select(AttendanceRecord).filter_by(user_id=user_id, date=target_date)
    record = (await db.execute(query)).scalars().first()
    
    if record:
        # 기록이 있으면 상태만 업데이트
        record.status = status
    else:
        # 기록이 없으면 지정한 날짜에 새로운 상태(예: 결석)로 데이터 생성
        record = AttendanceRecord(
            user_id=user_id,
            date=target_date,
            status=status
        )
        db.add(record)
        
    await db.commit()
    await db.refresh(record)
    return record