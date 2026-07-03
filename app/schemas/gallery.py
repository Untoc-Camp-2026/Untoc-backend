from pydantic import BaseModel
from datetime import datetime

class GalleryBase(BaseModel):
    year: int
    semester: int
    name : str

class GalleryCreate(GalleryBase):
    image_url: str
class GalleryResponse(GalleryBase):
    id: int
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True