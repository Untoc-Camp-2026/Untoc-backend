from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import SECRET_KEY, ALGORITHM
from models.user import User
from schemas.calendar import (
    EventCategoryCreate,
    EventCategoryResponse,
    CalendarEventCreate,
    CalendarEventUpdate,
    CalendarEventResponse,
)
from services.calendar import (
    create_category,
    get_categories,
    create_event,
    get_month_events,
    get_important_events,
    get_event_by_id,
    update_event,
    delete_event,
)


router = APIRouter(prefix="/calendar", tags=["calendar"])

# 로그인 시 발급받은 Bearer 토큰을 가져오기 위한 설정
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# 현재 로그인한 사용자 조회
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="로그인이 필요합니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # JWT 토큰 해석
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    # 토큰에서 가져온 user_id로 사용자 조회
    stmt = select(User).where(User.user_id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if user is None:
        raise credentials_exception

    return user

# 관리자 권한 확인
async def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.admin_status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자만 접근할 수 있습니다.",
        )

    return current_user

# 일정 카테고리 생성
@router.post(
    "/categories",
    response_model=EventCategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_calendar_category(
    category_data: EventCategoryCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    return await create_category(db, category_data)

# 일정 카테고리 목록 조회
@router.get("/categories", response_model=List[EventCategoryResponse])
async def read_categories(db: AsyncSession = Depends(get_db)):
    return await get_categories(db)

# 일정 생성
@router.post(
    "/events",
    response_model=CalendarEventResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_calendar_event(
    event_data: CalendarEventCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    new_event = await create_event(db, event_data, admin_user.user_id)

    if not new_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="존재하지 않는 카테고리입니다.",
        )

    return new_event

# 월별 일정 조회
@router.get("/events", response_model=List[CalendarEventResponse])
async def read_month_events(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    db: AsyncSession = Depends(get_db),
):
    return await get_month_events(db, year, month)

# 이달의 주요 일정 조회
@router.get("/events/important", response_model=List[CalendarEventResponse])
async def read_important_events(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    db: AsyncSession = Depends(get_db),
):
    return await get_important_events(db, year, month)

# 일정 상세 조회
@router.get("/events/{event_id}", response_model=CalendarEventResponse)
async def read_event_detail(
    event_id: int,
    db: AsyncSession = Depends(get_db),
):
    event = await get_event_by_id(db, event_id)

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="존재하지 않는 일정입니다.",
        )

    return event

# 일정 수정
@router.patch("/events/{event_id}", response_model=CalendarEventResponse)
async def update_calendar_event(
    event_id: int,
    event_data: CalendarEventUpdate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    updated_event = await update_event(db, event_id, event_data)

    if updated_event == "CATEGORY_NOT_FOUND":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="존재하지 않는 카테고리입니다.",
        )

    if not updated_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="존재하지 않는 일정입니다.",
        )

    return updated_event

# 일정 삭제
# 실제 DB row 삭제가 아니라 is_visible=False로 숨김 처리
@router.delete("/events/{event_id}")
async def delete_calendar_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    deleted_event = await delete_event(db, event_id)

    if not deleted_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="존재하지 않는 일정입니다.",
        )

    return {
        "message": "일정이 삭제되었습니다.",
        "event_id": event_id,
    }