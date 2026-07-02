from fastapi import FastAPI
from app.core.base import Base
from app.core.database import engine
from app.api import attendance
app = FastAPI()
app.include_router(attendance.router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        