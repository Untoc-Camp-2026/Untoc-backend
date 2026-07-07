import asyncio
from sqlalchemy import select

from core.base import Base
from core.database import engine, AsyncSessionLocal
from core.security import get_password_hash
from models.user import User
from models.calendar import EventCategory  # 💡 캘린더 카테고리 모델 추가

# 1. 초기 유저 데이터
SEED_USERS = [
    {
        "user_id": "admin",
        "password": "admin1234",
        "name": "관리자",
        "role": "BACKEND",
        "generation": 1.0,
        "admin_status": True,
    },
    {
        "user_id": "member",
        "password": "member1234",
        "name": "일반회원",
        "role": "FRONTEND",
        "generation": 1.0,
        "admin_status": False,
    },
]

# 2. 💡 고정 카테고리 데이터 추가
SEED_CATEGORIES = [
    {"name": "Meet Up", "color": "#FF6B6B", "description": "그동안의 활동을 공유하는 자리리"},
    {"name": "스터디 / 프로젝트", "color": "#4DABF7", "description": "소그룹 학술 스터디 및 프로젝트 일정"},
    {"name": "네트워킹 / 행사", "color": "#51CF66", "description": "MT, 소풍, 번개 등 친목 및 외부 행사"},
    {"name": "기타 / 공지", "color": "#FCC419", "description": "그 외 기타 동아리 공지 일정"},
]


async def seed_data() -> None:
    # 테이블이 없으면 생성
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # --------------------------------------------------------
        # [유저 시딩 로직]
        # --------------------------------------------------------
        for seed in SEED_USERS:
            stmt = select(User).where(User.user_id == seed["user_id"])
            result = await session.execute(stmt)
            existing_user = result.scalars().first()

            if existing_user:
                continue

            session.add(
                User(
                    user_id=seed["user_id"],
                    password=get_password_hash(seed["password"]),
                    name=seed["name"],
                    role=seed["role"],
                    generation=seed["generation"],
                    activity_status=True,
                    admin_status=seed["admin_status"],
                )
            )

        # --------------------------------------------------------
        # 💡 [카테고리 시딩 로직 추가]
        # --------------------------------------------------------
        for cat_seed in SEED_CATEGORIES:
            # 중복으로 들어가는 것을 방지하기 위해 이름으로 검사
            stmt = select(EventCategory).where(EventCategory.name == cat_seed["name"])
            result = await session.execute(stmt)
            existing_cat = result.scalars().first()

            if existing_cat:
                continue

            session.add(
                EventCategory(
                    name=cat_seed["name"],
                    color=cat_seed["color"],
                    description=cat_seed["description"]
                )
            )

        await session.commit()
        
    # 명시적으로 엔진 리소스를 해제
    try:
        await engine.dispose()
    except Exception:
        pass


if __name__ == "__main__":
    asyncio.run(seed_data())