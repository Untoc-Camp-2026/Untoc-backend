from fastapi import FastAPI
from core.base import Base
from core.database import engine
from api import attendance
from fastapi.middleware.cors import CORSMiddleware
from api import user
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(attendance.router)
app.include_router(user.router)
