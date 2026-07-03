from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, Enum, DateTime
from sqlalchemy.sql import func
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

class Comment(Base):
    __tablename__ = "comment"

    comment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # 게시글 삭제 시 댓글도 연쇄 삭제되도록 ondelete="CASCADE" 설정 [cite: 4]
    board_id = Column(Integer, ForeignKey("board.board_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(50), ForeignKey("Users.user_id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    anonymous = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())