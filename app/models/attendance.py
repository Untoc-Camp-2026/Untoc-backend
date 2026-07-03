from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from core.base import Base 

# 사용자가 출석할 수 있는 방을 생성하고 관리하기 위한 테이블
class AttendanceSession(Base):  
    __tablename__ = "attendance_session" 

    id = Column(Integer, primary_key=True, autoincrement=True)
    auth_code = Column(String(6), nullable=False) 
    created_at = Column(DateTime, default=datetime.utcnow) 
    expires_at = Column(DateTime, nullable=False) 

# 출석했는지를 저장하는 출석부 같은 테이블
class AttendanceRecord(Base):
    __tablename__ = "attendance_record" 

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("User.user_id"), nullable=False)
    session_id = Column(Integer, ForeignKey("attendance_session.id"), nullable=False) 
    attended_at = Column(DateTime, default=datetime.utcnow) 