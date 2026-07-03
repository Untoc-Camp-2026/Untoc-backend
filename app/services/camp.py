from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.camp import CampProject
from schemas.camp import CampProjectCreate, CampProjectUpdate

# 캠프 기수 목록 조회
# 예: ["26-1", "25-2", "25-1"]
async def get_camp_terms(db: AsyncSession) -> List[str]:
    result = await db.execute(
        select(CampProject.term)
        .where(CampProject.is_visible == True)
        .distinct()
        .order_by(CampProject.term.desc())
    )

    return result.scalars().all()

# 캠프 작품 목록 조회
# term 값이 있으면 해당 기수의 작품만 조회
# term 값이 없으면 전체 작품 조회
async def get_camp_projects(
    db: AsyncSession,
    term: Optional[str] = None,
) -> List[CampProject]:
    query = select(CampProject).where(CampProject.is_visible == True)

    # 특정 기수가 선택된 경우 필터링
    if term:
        query = query.where(CampProject.term == term)

    # display_order가 작은 순서대로 먼저 보여주고,
    # 같은 순서라면 id가 큰 최신 데이터부터 보여줌
    query = query.order_by(
        CampProject.display_order.asc(),
        CampProject.id.desc()
    )

    result = await db.execute(query)
    return result.scalars().all()

# 캠프 작품 상세 조회
# 카드 클릭 시 팝업에 보여줄 상세 데이터를 조회
async def get_camp_project_detail(
    db: AsyncSession,
    project_id: int,
) -> Optional[CampProject]:
    result = await db.execute(
        select(CampProject).where(
            CampProject.id == project_id,
            CampProject.is_visible == True
        )
    )

    return result.scalar_one_or_none()

# 캠프 작품 생성
# 관리자 페이지나 Swagger에서 새 작품을 등록할 때 사용
async def create_camp_project(
    db: AsyncSession,
    project_data: CampProjectCreate,
) -> CampProject:
    # Pydantic schema 데이터를 SQLAlchemy 모델 객체로 변환
    new_project = CampProject(**project_data.model_dump())

    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)

    return new_project

# 캠프 작품 수정
# project_id에 해당하는 작품을 찾아서 전달받은 값만 수정
async def update_camp_project(
    db: AsyncSession,
    project_id: int,
    project_data: CampProjectUpdate,
) -> Optional[CampProject]:
    result = await db.execute(
        select(CampProject).where(CampProject.id == project_id)
    )
    project = result.scalar_one_or_none()

    # 수정할 작품이 없으면 None 반환
    if not project:
        return None

    # 요청에 포함된 값만 가져와서 수정
    update_data = project_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(project, key, value)

    await db.commit()
    await db.refresh(project)

    return project

# 캠프 작품 삭제
# 실제 DB 행을 삭제하지 않고 is_visible=False로 바꿔서 숨김 처리
async def delete_camp_project(
    db: AsyncSession,
    project_id: int,
) -> bool:
    result = await db.execute(
        select(CampProject).where(CampProject.id == project_id)
    )
    project = result.scalar_one_or_none()

    # 삭제할 작품이 없으면 False 반환
    if not project:
        return False

    # 사용자 화면에서 보이지 않도록 처리
    project.is_visible = False

    await db.commit()

    return True