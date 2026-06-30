from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from variable import SQLALCHEMY_DATABASE_URL

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_recycle=3600, 
    pool_pre_ping=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, 
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session