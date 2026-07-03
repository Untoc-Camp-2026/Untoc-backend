from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import os
import shutil
import uuid

from core.database import get_db
from models.gallery import Gallery
from schemas.gallery import GalleryResponse
from models.user import User
from api.user import get_current_user

router = APIRouter(prefix="/gallery", tags=["Gallery"])

UPLOAD_DIR = "uploads/gallery"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[GalleryResponse])
async def get_galleries(
    year: Optional[int] = Query(None, description="검색할 년도 (예: 2026)"),
    semester: Optional[int] = Query(None, description="검색할 학기 (예: 1)"),
    name: Optional[str] = Query(None, description="검색할 활동 이름 (예: OT)"),
    db: AsyncSession = Depends(get_db)
):
    """
    갤러리 목록 조회 API (조건 검색 추가)
    년도, 학기, 활동 이름을 조건으로 넣으면 해당하는 사진만 가져옵니다.
    아무 조건도 넣지 않으면 전체 목록을 가져옵니다.
    """
    stmt = select(Gallery)
    
    # 💡 프론트엔드에서 조건(파라미터)을 보냈다면 쿼리에 필터(where)를 추가합니다.
    if year is not None:
        stmt = stmt.where(Gallery.year == year)
    if semester is not None:
        stmt = stmt.where(Gallery.semester == semester)
    if name is not None:
        stmt = stmt.where(Gallery.name == name)

    # 기존과 동일하게 정렬 추가
    stmt = stmt.order_by(
        Gallery.year.desc(), 
        Gallery.semester.desc(), 
        Gallery.created_at.desc()
    )
    
    result = await db.execute(stmt)
    galleries = result.scalars().all()
    
    return galleries

@router.post("", response_model=GalleryResponse, status_code=status.HTTP_201_CREATED)
async def upload_gallery(
    year: int = Form(...),       # generation 대신 year로 받음
    semester: int = Form(...),
    name: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    갤러리 업로드 API
    """
    if not current_user.admin_status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="관리자만 갤러리 사진을 업로드할 수 있습니다."
        )

    extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    image_url = f"/{UPLOAD_DIR}/{unique_filename}"

    new_gallery = Gallery(
        year=year,               # DB에 year 저장
        semester=semester,
        name=name,
        image_url=image_url
    )
    
    db.add(new_gallery)
    await db.commit()
    await db.refresh(new_gallery)
    
    return new_gallery