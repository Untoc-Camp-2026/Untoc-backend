from pydantic import BaseModel
from typing import Optional, List
from models.board import CategoryEnum


class BoardCreate(BaseModel):
    title: str
    content: str
    category: CategoryEnum
    anonymous: bool = False
    file_url: Optional[str] = None

class BoardUpdate(BaseModel):
    title: str
    content: str
    category: CategoryEnum
    anonymous: bool
    file_url: Optional[str] = None

class BoardResponse(BaseModel):
    board_id: int
    user_id: str  # 익명일 경우 "익명"으로 매핑됨
    title: str
    content: str
    category: CategoryEnum
    anonymous: bool
    file_url: Optional[str] = None

    class Config:
        from_attributes = True

class BoardDetailResponse(BoardResponse):
    is_owner: bool

class BoardListResponse(BaseModel):
    total_count: int
    items: List[BoardResponse]