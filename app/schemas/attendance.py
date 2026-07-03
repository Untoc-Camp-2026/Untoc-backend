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

# 사용자가 출석을 요청할 때 보내는 정보
class AttendanceVerifyRequest(BaseModel):
    user_id: str
    auth_code: str

# 출석 인증 성공 시 돌아오는 정보
class AttendanceVerifyResponse(BaseModel):
    message: str
    attended_at: datetime

# 관리자가 출석 기록을 조회할 때, 데이터베이스의 출석 기록을 json형태로 보여주기 위한 형식
class AttendanceRecordResponse(BaseModel):
    id: int
    user_id: str
    session_id: int
    attended_at: datetime

    class Config:
        from_attributes = True 

# 관리자가 출석 날짜를 수정할 때, 어떤 날짜로 바꿀지 입력받는 정보
class AttendanceUpdateRequest(BaseModel):
    attendance_date: date

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