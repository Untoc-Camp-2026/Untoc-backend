from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

# 일정 카테고리 생성 요청 데이터
class EventCategoryCreate(BaseModel):
    name: str
    color: Optional[str] = None
    description: Optional[str] = None

# 일정 카테고리 응답 데이터
class EventCategoryResponse(BaseModel):
    category_id: int
    name: str
    color: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime

    # SQLAlchemy 모델 객체를 Pydantic 응답으로 변환하기 위한 설정
    model_config = ConfigDict(from_attributes=True)

# 일정 생성 요청 데이터
class CalendarEventCreate(BaseModel):
    category_id: int
    title: str
    content: Optional[str] = None
    start_at: datetime
    end_at: datetime
    location: Optional[str] = None
    is_important: bool = False

# 일정 수정 요청 데이터
# 모든 필드를 Optional로 둬서 일부 값만 수정할 수 있게
class CalendarEventUpdate(BaseModel):
    category_id: Optional[int] = None
    title: Optional[str] = None
    content: Optional[str] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    location: Optional[str] = None
    is_important: Optional[bool] = None
    is_visible: Optional[bool] = None

# 일정 응답 데이터
class CalendarEventResponse(BaseModel):
    event_id: int
    category_id: int
    created_by: str
    title: str
    content: Optional[str] = None
    start_at: datetime
    end_at: datetime
    location: Optional[str] = None
    is_important: bool
    is_visible: bool
    created_at: datetime
    updated_at: datetime

    # SQLAlchemy 모델 객체를 Pydantic 응답으로 변환하기 위한 설정
    model_config = ConfigDict(from_attributes=True)