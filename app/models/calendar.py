from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, func
from core.base import Base


class EventCategory(Base):
    __tablename__ = "event_category"

    category_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    color = Column(String(20), nullable=True)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class CalendarEvent(Base):
    __tablename__ = "calendar_event"

    event_id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    category_id = Column(
        Integer,
        ForeignKey("event_category.category_id"),
        nullable=False
    )

    created_by = Column(
        String(50),
        ForeignKey("Users.user_id"),
        nullable=False
    )

    title = Column(String(150), nullable=False)
    content = Column(Text, nullable=True)

    start_at = Column(DateTime, nullable=False)
    end_at = Column(DateTime, nullable=False)

    location = Column(String(100), nullable=True)

    is_important = Column(Boolean, nullable=False, default=False)
    is_visible = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )