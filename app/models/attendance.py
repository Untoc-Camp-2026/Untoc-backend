from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Enum as SQLEnum, UniqueConstraint
from datetime import datetime
from core.base import Base 
import enum

# 사용자가 출석할 수 있는 방을 생성하고 관리하기 위한 테이블
class AttendanceSession(Base):  
    __tablename__ = "attendance_session" 

    id = Column(Integer, primary_key=True, autoincrement=True)
    auth_code = Column(String(6), nullable=False) 
    created_at = Column(DateTime, default=datetime.utcnow) 
    expires_at = Column(DateTime, nullable=False) 

# 출석 상태에 대한 여부
class AttendanceStatus(str, enum.Enum):
    PRESENT = "출석"
    ABSENT = "결석"

# 출석 목록에 대한 정보
class AttendanceRecord(Base):
    __tablename__ = "attendance_record" 

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    user_id = Column(String(50), ForeignKey("Users.user_id"), nullable=False) 
    
    session_id = Column(Integer, ForeignKey("attendance_session.id"), nullable=True) 
    
    date = Column(Date, nullable=False) 
    
    status = Column(SQLEnum(AttendanceStatus), default=AttendanceStatus.PRESENT)
    
    attended_at = Column(DateTime, nullable=True)

    __table_args__ = (
        UniqueConstraint('user_id', 'date', name='uq_user_date'),
    )