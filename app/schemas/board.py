from pydantic import BaseModel
from typing import Optional, List
from models.board import CategoryEnum
from datetime import datetime


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
    comments: List[CommentResponse] = [] # 상세 조회 시 댓글 리스트도 반환하도록 추가

class BoardListResponse(BaseModel):
    total_count: int
    items: List[BoardResponse]


class CommentCreate(BaseModel):
    content: str
    anonymous: bool = False

class CommentUpdate(BaseModel):
    content: str
    anonymous: bool

class CommentResponse(BaseModel):
    comment_id: int
    board_id: int
    user_id: str
    content: str
    anonymous: bool
    created_at: datetime
    is_owner: bool  # 프론트에서 수정/삭제 버튼을 띄우기 위해 필요함

    class Config:
        from_attributes = True