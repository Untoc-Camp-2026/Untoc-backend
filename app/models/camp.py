from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func

from core.base import Base

class CampProject(Base):
    __tablename__ = "camp_projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    term = Column(String(255), nullable=False)
    image_url = Column(String(255), nullable=True)
    team_name = Column(String(255), nullable=True)
    description = Column(String(255), nullable=True)
    content = Column(Text, nullable=True)
    subject = Column(String(255), nullable=True)
    leader_name = Column(String(255), nullable=True)
    member_names = Column(String(255), nullable=True)
    display_order = Column(Integer, nullable=True)
    is_visible = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)