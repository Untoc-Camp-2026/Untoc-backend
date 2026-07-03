from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from api.dependencies import get_current_user, get_optional_current_user, oauth2_scheme
from schemas.board import BoardCreate, BoardUpdate, BoardDetailResponse, BoardListResponse, CommentCreate, CommentUpdate
from services import board as board_service
from models.user import User

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_new_board(
    board_data: BoardCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await board_service.create_board(db, board_data, current_user.user_id)

@router.get("/{board_id}", response_model=BoardDetailResponse)
async def read_board_detail(
    board_id: int, 
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme) # 선택적 로그인을 원하면 get_optional_current_user 활용 가능
):
    # API 요청 시 토큰을 받아 유저를 확인
    current_user = await get_optional_current_user(token, db)
    current_user_id = current_user.user_id if current_user else None
    
    return await board_service.get_board_detail(db, board_id, current_user_id)

@router.put("/{board_id}")
async def update_existing_board(
    board_id: int, 
    board_data: BoardUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await board_service.update_board(db, board_id, board_data, current_user)

@router.delete("/{board_id}", status_code=status.HTTP_200_OK)
async def delete_existing_board(
    board_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await board_service.delete_board(db, board_id, current_user)
    return {"message": "삭제되었습니다."}

@router.get("/", response_model=BoardListResponse)
async def read_boards(
    category: str = Query(...),
    title: str = Query(None),
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db)
):
    return await board_service.get_board_list(db, category, title, page)

# 1. 댓글 작성
@router.post("/{board_id}/comments", status_code=status.HTTP_201_CREATED)
async def create_new_comment(
    board_id: int,
    comment_data: CommentCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await board_service.create_comment(db, board_id, comment_data, current_user.user_id)

# 2. 댓글 수정 
# prefix="/api/boards"가 걸려 있으므로 실제 경로는 PUT /api/boards/comments/{comment_id} 가 됨 [cite: 14]
@router.put("/comments/{comment_id}")
async def update_existing_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await board_service.update_comment(db, comment_id, comment_data, current_user)

# 3. 댓글 삭제
@router.delete("/comments/{comment_id}", status_code=status.HTTP_200_OK)
async def delete_existing_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await board_service.delete_comment(db, comment_id, current_user)
    return {"message": "댓글이 삭제되었습니다."}