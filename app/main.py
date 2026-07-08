from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core.base import Base
from core.database import engine

from models.user import User
from models.calendar import EventCategory, CalendarEvent
from models.camp import CampProject
from models import user, attendance

from api import user, attendance, board, calendar, gallery, camp, file

app = FastAPI()

# ⭕ 프론트엔드 주소(포트 없음)를 정확하게 허용하도록 수정했습니다.
origins = [
    "http://127.0.0.1",
    "http://localhost",
    "http://localhost:3000",
    "http://161.33.19.121"  
]

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(user.router, tags=["Users"])
app.include_router(board.router, prefix="/api/boards", tags=["Boards"])
app.include_router(attendance.router)
app.include_router(calendar.router)
app.include_router(gallery.router)
app.include_router(camp.router)
app.include_router(file.router, prefix="/api/files", tags=["Files"])