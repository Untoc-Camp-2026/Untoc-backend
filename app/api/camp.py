from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from schemas.camp import (
    CampProjectCreate,
    CampProjectUpdate,
    CampProjectResponse,
)
from services import camp as camp_service


router = APIRouter(
    prefix="/api/camp",
    tags=["Camp Projects"]
)


# 캠프 기수 목록 조회
# 예: ["26-1", "25-2", "25-1"]
@router.get("/terms", response_model=List[str])
async def get_camp_terms(
    db: AsyncSession = Depends(get_db),
):
    return await camp_service.get_camp_terms(db)


# 캠프 작품 목록 조회
# term 값을 넘기면 해당 기수 작품만 조회
# 예: /api/camp/projects?term=26-1
@router.get("/projects", response_model=List[CampProjectResponse])
async def get_camp_projects(
    term: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await camp_service.get_camp_projects(db, term)


# 캠프 작품 상세 조회
# 카드 클릭 시 팝업에 보여줄 데이터 조회
@router.get("/projects/{project_id}", response_model=CampProjectResponse)
async def get_camp_project_detail(
    project_id: int,
    db: AsyncSession = Depends(get_db),
):
    project = await camp_service.get_camp_project_detail(db, project_id)

    if not project:
        raise HTTPException(status_code=404, detail="해당 캠프 작품을 찾을 수 없습니다.")

    return project


# 캠프 작품 생성
# 관리자 또는 Swagger 테스트용
@router.post("/projects", response_model=CampProjectResponse)
async def create_camp_project(
    project_data: CampProjectCreate,
    db: AsyncSession = Depends(get_db),
):
    return await camp_service.create_camp_project(db, project_data)


# 캠프 작품 수정
# 전달받은 값만 수정
@router.put("/projects/{project_id}", response_model=CampProjectResponse)
async def update_camp_project(
    project_id: int,
    project_data: CampProjectUpdate,
    db: AsyncSession = Depends(get_db),
):
    project = await camp_service.update_camp_project(db, project_id, project_data)

    if not project:
        raise HTTPException(status_code=404, detail="수정할 캠프 작품을 찾을 수 없습니다.")

    return project


# 캠프 작품 삭제
# 실제 삭제가 아니라 is_visible=False로 숨김 처리
@router.delete("/projects/{project_id}")
async def delete_camp_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
):
    success = await camp_service.delete_camp_project(db, project_id)

    if not success:
        raise HTTPException(status_code=404, detail="삭제할 캠프 작품을 찾을 수 없습니다.")

    return {
        "message": "캠프 작품이 삭제 처리되었습니다."
    }