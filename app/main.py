from fastapi import FastAPI
from core.base import Base
from core.database import engine
from models import user,attendance
from fastapi.middleware.cors import CORSMiddleware
from api import user,attendance
from api import user, attendance, board, calendar, gallery, camp

from models.user import User
from models.calendar import EventCategory, CalendarEvent
from models.camp import CampProject
from api import user, attendance, board, calendar, file

from models.user import User
from models.calendar import EventCategory, CalendarEvent
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
app.include_router(calendar.router)
app.include_router(gallery.router)
app.include_router(camp.router)
app.include_router(file.router, prefix="/api/files", tags=["Files"])
