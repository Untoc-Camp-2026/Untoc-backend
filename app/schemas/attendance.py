from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional
from models.attendance import AttendanceStatus

# 관리지가 세션을 만들었을 때, 생성된 정보를 응답으로 돌려주는 기능
class SessionResponse(BaseModel):
    id: int
    auth_code: str
    expires_at: datetime

    class Config:
        from_attributes = True

# 관리자가 세션을 생성할 때, 입력받아야할 정보
class SessionCreate(BaseModel):
    title: str               
    location: str           
    duration_minutes: int   


# 관리자가 출석부 목록을 볼 때 반환되는 형태
class AttendanceRecordResponse(BaseModel):
    user_id: str
    date: date
    status: AttendanceStatus
    attended_at: Optional[datetime] = None

    class Config:
        from_attributes = True 

# 유저가 출석할 때 보내는 요청 (토큰으로 user_id를 받으므로 auth_code만 필요)
class AttendanceVerifyRequest(BaseModel):
    auth_code: str

# 관리자가 출석/결석 상태를 변경할 때 보내는 요청
class AttendanceAdminUpdateRequest(BaseModel):
    user_id: str
    target_date: date
    status: AttendanceStatus # "출석" 또는 "결석"