from datetime import datetime
from typing import Optional

from fastapi import Form
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
    @classmethod
    def as_form(
        cls,
        term: str = Form(...),
        image_url: Optional[str] = Form(None),
        team_name: Optional[str] = Form(None),
        description: Optional[str] = Form(None),
        content: Optional[str] = Form(None),
        subject: Optional[str] = Form(None),
        leader_name: Optional[str] = Form(None),
        member_names: Optional[str] = Form(None),
        display_order: Optional[int] = Form(None),
        is_visible: bool = Form(True),
    ):
        return cls(
            term=term,
            image_url=image_url,
            team_name=team_name,
            description=description,
            content=content,
            subject=subject,
            leader_name=leader_name,
            member_names=member_names,
            display_order=display_order,
            is_visible=is_visible,
        )


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

    @classmethod
    def as_form(
        cls,
        term: Optional[str] = Form(None),
        image_url: Optional[str] = Form(None),
        team_name: Optional[str] = Form(None),
        description: Optional[str] = Form(None),
        content: Optional[str] = Form(None),
        subject: Optional[str] = Form(None),
        leader_name: Optional[str] = Form(None),
        member_names: Optional[str] = Form(None),
        display_order: Optional[int] = Form(None),
        is_visible: Optional[bool] = Form(None),
    ):
        data = {}

        if term is not None:
            data["term"] = term
        if image_url is not None:
            data["image_url"] = image_url
        if team_name is not None:
            data["team_name"] = team_name
        if description is not None:
            data["description"] = description
        if content is not None:
            data["content"] = content
        if subject is not None:
            data["subject"] = subject
        if leader_name is not None:
            data["leader_name"] = leader_name
        if member_names is not None:
            data["member_names"] = member_names
        if display_order is not None:
            data["display_order"] = display_order
        if is_visible is not None:
            data["is_visible"] = is_visible

        return cls(**data)


class CampProjectResponse(CampProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True