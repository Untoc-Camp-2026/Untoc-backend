from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CampProjectBase(BaseModel):
    term: str
    image_url: Optional[str] = None
    team_name: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    subject: Optional[str] = None
    leader_name: Optional[str] = None
    member_names: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: bool = True


class CampProjectCreate(CampProjectBase):
    pass


class CampProjectUpdate(BaseModel):
    term: Optional[str] = None
    image_url: Optional[str] = None
    team_name: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    subject: Optional[str] = None
    leader_name: Optional[str] = None
    member_names: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class CampProjectResponse(CampProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True