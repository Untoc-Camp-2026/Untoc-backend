from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from fastapi import HTTPException, status
from models.board import Board
from schemas.board import BoardCreate, BoardUpdate
from models.user import User

async def create_board(db: AsyncSession, board_data: BoardCreate, user_id: str):
    new_board = Board(
        user_id=user_id,
        title=board_data.title,
        content=board_data.content,
        category=board_data.category,
        anonymous=board_data.anonymous,
        file_url=board_data.file_url
    )
    db.add(new_board)
    await db.commit()
    await db.refresh(new_board)
    return new_board

async def get_board_detail(db: AsyncSession, board_id: int, current_user_id: str = None):
    stmt = select(Board).where(Board.board_id == board_id)
    result = await db.execute(stmt)
    board = result.scalars().first()
    
    if not board:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
        
    is_owner = (current_user_id == board.user_id) if current_user_id else False
    display_user_id = "익명" if board.anonymous else board.user_id
    
    return {
        "board_id": board.board_id,
        "user_id": display_user_id,
        "title": board.title,
        "content": board.content,
        "category": board.category,
        "anonymous": board.anonymous,
        "file_url": board.file_url,
        "is_owner": is_owner
    }

async def update_board(db: AsyncSession, board_id: int, board_data: BoardUpdate, current_user: User):
    stmt = select(Board).where(Board.board_id == board_id)
    result = await db.execute(stmt)
    board = result.scalars().first()
    
    if not board:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    if board.user_id != current_user.user_id and not current_user.admin_status:
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다.")
        
    board.title = board_data.title
    board.content = board_data.content
    board.category = board_data.category
    board.anonymous = board_data.anonymous
    board.file_url = board_data.file_url
    
    await db.commit()
    await db.refresh(board)
    return board

async def delete_board(db: AsyncSession, board_id: int, current_user):
    stmt = select(Board).where(Board.board_id == board_id)
    result = await db.execute(stmt)
    board = result.scalars().first()
    
    if not board:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
        
    # 작성자 본인이거나 관리자인지 확인
    if board.user_id != current_user.user_id and not current_user.admin_status:
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다.")
        
    await db.delete(board)
    await db.commit()
    return True

async def get_board_list(db: AsyncSession, category: str, title: str = None, page: int = 1):
    limit = 10
    offset = (page - 1) * limit
    
    # 기본 쿼리 생성
    stmt = select(Board).where(Board.category == category)
    count_stmt = select(func.count()).select_from(Board).where(Board.category == category)
    
    # 검색어가 있을 경우 조건 추가
    if title:
        stmt = stmt.where(Board.title.contains(title))
        count_stmt = count_stmt.where(Board.title.contains(title))
        
    # 정렬 및 페이징
    stmt = stmt.order_by(Board.board_id.desc()).offset(offset).limit(limit)
    
    # 데이터 조회
    result = await db.execute(stmt)
    boards = result.scalars().all()
    
    count_result = await db.execute(count_stmt)
    total_count = count_result.scalar()
    
    # 익명 마스킹 처리
    items = []
    for board in boards:
        display_user_id = "익명" if board.anonymous else board.user_id
        items.append({
            "board_id": board.board_id,
            "user_id": display_user_id,
            "title": board.title,
            "content": board.content,
            "category": board.category,
            "anonymous": board.anonymous,
            "file_url": board.file_url
        })
        
    return {"total_count": total_count, "items": items}