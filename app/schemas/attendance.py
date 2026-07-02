from pydantic import BaseModel
from datetime import datetime, date
from typing import List

class SessionResponse(BaseModel):
    id: int
    auth_code: str
    expires_at: datetime

    class Config:
        from_attributes = True

class SessionCreate(BaseModel):
    title: str               
    location: str           
    duration_minutes: int   

class AttendanceVerifyRequest(BaseModel):
    user_id: str
    auth_code: str

class AttendanceVerifyResponse(BaseModel):
    message: str
    attended_at: datetime

class AttendanceRecordResponse(BaseModel):
    id: int
    user_id: str
    session_id: int
    attended_at: datetime

    class Config:
        from_attributes = True 

class AttendanceUpdateRequest(BaseModel):
    attendance_date: date