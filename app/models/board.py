from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, Enum
from core.base import Base
import enum

class CategoryEnum(str, enum.Enum):
    GAME = "GAME"
    STUDY = "STUDY"
    EXAM = "EXAM"
    JOB = "JOB"
    FREE = "FREE"

class Board(Base):
    __tablename__ = "board"

    board_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(50), ForeignKey("Users.user_id"), nullable=False)
    category = Column(Enum(CategoryEnum), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    file_url = Column(String(500), nullable=True)
    anonymous = Column(Boolean, default=False, nullable=False)