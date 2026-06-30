from fastapi import FastAPI
from core.base import Base
from core.database import engine
app = FastAPI()


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        