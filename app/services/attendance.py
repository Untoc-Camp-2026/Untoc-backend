import random
from datetime import timezone, time, datetime, timedelta, date
from datetime import datetime, timedelta, date as date_type
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.attendance import AttendanceSession, AttendanceRecord, AttendanceStatus
from sqlalchemy import select, cast, Date
from models.user import User
import secrets
import string

# 1. 출석 방 생성 & 전체 활동 유저 '결석' 명단 미리 만들기
async def create_attendance_session(db, duration_minutes: int):
   # 🌟 랜덤한 6자리 숫자 코드 생성!
    new_auth_code = "".join(secrets.choice(string.digits) for _ in range(6))
    
    # 출석 세션(방) 생성할 때 auth_code를 꼭 같이 넣어줍니다.
    expires_at = datetime.utcnow() + timedelta(minutes=duration_minutes)
    session = AttendanceSession(auth_code=new_auth_code, expires_at=expires_at)
    
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    # 한국 시간 기준으로 '오늘 날짜' 구하기
    today_kst = (datetime.utcnow() + timedelta(hours=9)).date()
    
    # 활동 중인(activity_status == 1/True) 전체 유저 불러오기
    active_users_result = await db.execute(
        select(User).filter(User.activity_status == True)
    )
    active_users = active_users_result.scalars().all()
    
    # 오늘 이미 명단이 만들어진 사람이 있는지 확인 (중복 생성 방지)
    existing_records_result = await db.execute(
        select(AttendanceRecord).filter(AttendanceRecord.date == today_kst)
    )
    existing_user_ids = {record.user_id for record in existing_records_result.scalars().all()}
    
    # 명단에 없는 활동 유저들을 '결석' 상태로 쫙 깔아주기
    for user in active_users:
        if user.user_id not in existing_user_ids:
            new_record = AttendanceRecord(
                user_id=user.user_id,
                session_id=session.id,
                date=today_kst,
                status=AttendanceStatus.ABSENT, # 기본값: 결석
                attended_at=None
            )
            db.add(new_record)
            
    await db.commit()
    return session

# 3. 특정 날짜의 출석 명단 조회 (이전에 수정했던 초간단 버전)
async def get_records_by_date(db, target_date: date_type):
    result = await db.execute(
        select(AttendanceRecord).filter(AttendanceRecord.date == target_date)
    )
    records = result.scalars().all()
    return records

# 2. 유저 출석 인증 (결석 -> 출석으로 변경)
async def verify_attendance(db, user_id: str, auth_code: str): 
    # 세션 검증
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

    today_kst = (datetime.utcnow() + timedelta(hours=9)).date()

    # 내 출석 명단 칸 찾기
    query = select(AttendanceRecord).filter_by(user_id=user_id, date=today_kst)
    record = (await db.execute(query)).scalars().first()

    if record:
        if record.status == AttendanceStatus.PRESENT:
            raise HTTPException(status_code=400, detail="오늘은 이미 출석하셨습니다.")
        
        # '결석' 칸을 '출석'으로 업데이트
        record.status = AttendanceStatus.PRESENT
        record.session_id = session.id
        record.attended_at = datetime.utcnow()
    else:
        # 혹시 방금 가입해서 아침 명단에 없던 유저라면 새로 만들어줌
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

# 4. 관리자가 수동으로 출석/결석 상태 수정
async def update_attendance_status(db, user_id: str, target_date: date_type, status: AttendanceStatus):
    query = select(AttendanceRecord).filter_by(user_id=user_id, date=target_date)
    record = (await db.execute(query)).scalars().first()
    
    if record:
        # 기록이 있으면 상태만 업데이트
        record.status = status
    else:
        # 기록이 없으면 지정한 날짜에 새로운 상태로 데이터 생성
        record = AttendanceRecord(
            user_id=user_id,
            date=target_date,
            status=status
        )
        db.add(record)
        
    await db.commit()
    await db.refresh(record)
    return record