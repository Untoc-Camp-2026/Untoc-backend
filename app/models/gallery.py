from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from core.base import Base

class Gallery(Base):
    __tablename__ = "gallerys"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    year = Column(Integer, nullable=False)
    semester = Column(Integer, nullable=False)
    name = Column(String(100), nullable=False)
    image_url = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    afmojweapfmewpoajfope