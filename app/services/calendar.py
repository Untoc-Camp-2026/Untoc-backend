from datetime import datetime
from sqlalchemy import select
from models.calendar import EventCategory, CalendarEvent

# Pydantic v1/v2 호환을 위해 수정 데이터 추출 방식 분리
# Pydantic 버전 차이를 고려해서, 수정 요청에서 실제로 들어온 값만 골라내는 함수
def _get_update_data(schema):
    if hasattr(schema, "model_dump"):
        return schema.model_dump(exclude_unset=True)
    return schema.dict(exclude_unset=True)

# 일정 카테고리 생성 (새 일정 카테고리를 DB에 저장)
async def create_category(db, category_data):
    new_category = EventCategory(
        name=category_data.name,
        color=category_data.color,
        description=category_data.description,
    )

    db.add(new_category)
    await db.commit()
    await db.refresh(new_category)

    return new_category

# 전체 일정 카테고리 조회
async def get_categories(db):
    stmt = select(EventCategory).order_by(EventCategory.category_id)
    result = await db.execute(stmt)
    return result.scalars().all()

# 일정 생성
async def create_event(db, event_data, user_id: str):
    # 존재하는 카테고리인지 확인
    category = await db.get(EventCategory, event_data.category_id)

    if not category:
        return None

    new_event = CalendarEvent(
        category_id=event_data.category_id,
        created_by=user_id,
        title=event_data.title,
        content=event_data.content,
        start_at=event_data.start_at,
        end_at=event_data.end_at,
        location=event_data.location,
        is_important=event_data.is_important,
        is_visible=True,
    )

    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)

    return new_event

# 월별 일정 조회
async def get_month_events(db, year: int, month: int):
    month_start = datetime(year, month, 1)

    # 다음 달 시작일 계산
    if month == 12:
        next_month_start = datetime(year + 1, 1, 1)
    else:
        next_month_start = datetime(year, month + 1, 1)

    # 해당 월에 걸쳐 있는 일정 조회
    stmt = (
        select(CalendarEvent)
        .where(CalendarEvent.is_visible == True) # 숨김 처리되지 않은 일정만 조회
        .where(CalendarEvent.start_at < next_month_start) # 일정 시작일이 다음 달 시작일보다 빠른 일정
        .where(CalendarEvent.end_at >= month_start) # 일정 종료일이 이번 달 시작일 이후인 일정
        # 2026-06-30 ~ 2026-07-02 이 일정도 7월 캘린더에 보여야하므로
        
        .order_by(CalendarEvent.start_at)
    )

    result = await db.execute(stmt)
    return result.scalars().all()

# 이달의 주요 일정 조회
async def get_important_events(db, year: int, month: int):
    month_start = datetime(year, month, 1)

    # 다음 달 시작일 계산
    if month == 12:
        next_month_start = datetime(year + 1, 1, 1)
    else:
        next_month_start = datetime(year, month + 1, 1)

    stmt = (
        select(CalendarEvent)
        .where(CalendarEvent.is_visible == True)
        .where(CalendarEvent.is_important == True)
        .where(CalendarEvent.start_at < next_month_start)
        .where(CalendarEvent.end_at >= month_start)
        .order_by(CalendarEvent.start_at)
    )

    result = await db.execute(stmt)
    return result.scalars().all()

# 일정 상세 조회
async def get_event_by_id(db, event_id: int):
    stmt = (
        select(CalendarEvent)
        .where(CalendarEvent.event_id == event_id)
        .where(CalendarEvent.is_visible == True)
    )

    result = await db.execute(stmt)
    return result.scalars().first()

# 일정 수정
async def update_event(db, event_id: int, event_data):
    event = await get_event_by_id(db, event_id)

    if not event:
        return None

    update_data = _get_update_data(event_data)

    # 카테고리 변경 시 존재하는 카테고리인지 확인
    if "category_id" in update_data:
        category = await db.get(EventCategory, update_data["category_id"])
        if not category:
            return "CATEGORY_NOT_FOUND"

    # 전달받은 값만 수정
    for key, value in update_data.items():
        setattr(event, key, value)

    await db.commit()
    await db.refresh(event)

    return event

# 일정 삭제
# 실제 삭제하지 않고 is_visible 값을 False로 바꾸는 방식
async def delete_event(db, event_id: int):
    event = await get_event_by_id(db, event_id)

    if not event:
        return None

    event.is_visible = False

    await db.commit()
    await db.refresh(event)

    return event