from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.core.base import Base 

class AttendanceSession(Base):  
    __tablename__ = "attendance_session" 

    id = Column(Integer, primary_key=True, autoincrement=True)
    auth_code = Column(String(6), nullable=False) 
    created_at = Column(DateTime, default=datetime.utcnow) 
    expires_at = Column(DateTime, nullable=False) 

class AttendanceRecord(Base):
    __tablename__ = "attendance_record" 

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False) # ForeignKey("user.user_id") 
    session_id = Column(Integer, ForeignKey("attendance_session.id"), nullable=False) 
    attended_at = Column(DateTime, default=datetime.utcnow) 