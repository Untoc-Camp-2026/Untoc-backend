import asyncio

from sqlalchemy import select

from core.base import Base
from core.database import engine, AsyncSessionLocal
from core.security import get_password_hash
from models.user import User


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


async def seed_users() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
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

        await session.commit()
    # 명시적으로 엔진 리소스를 해제하여 aiomysql 연결이 이벤트 루프 종료 시점에 남지 않도록 함
    try:
        await engine.dispose()
    except Exception:
        pass


if __name__ == "__main__":
    asyncio.run(seed_users())