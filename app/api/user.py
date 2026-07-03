from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from core.database import get_db  
from services.user import authenticate_user, create_user
from core.security import create_access_token, SECRET_KEY, ALGORITHM, get_password_hash, verify_password
from schemas.user import Token  
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from enum import Enum
from models.user import User
from sqlalchemy.future import select
from jose import JWTError, jwt

from fastapi import UploadFile, File
import os
import shutil
import uuid
import pandas as pd
import io

router = APIRouter()

class RoleEnum(str, Enum):
    backend = "BACKEND"
    frontend = "FRONTEND"
class UserCreate(BaseModel):
    user_id: str
    password: str
    name: str
    generation: float
    role: Optional[RoleEnum] = None
class UserProfileUpdate(BaseModel):
    introduction: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str
class ProfileImageUpdate(BaseModel):
    profile_image_url: str
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
async def get_current_user(token: str= Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="토큰이 올바르지 않습니다.",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id:str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    stmt = select(User).where(User.user_id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if user is None:
        raise credentials_exception
    return user
@router.post("/login")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(db, user_id=form_data.username, password=form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 맞지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.user_id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    new_user = await create_user(db, user_data)
    
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 존재하는 아이디입니다.",
        )
    
    return {
        "message": "회원가입 성공!",
        "user_id": new_user.user_id
    }



#로그인 확인용
@router.get("/me")
async def test_login(token: str = Depends(oauth2_scheme)):
    return {
        "message": "로그인 성공!",
        "token": token
    }

@router.put("/me/profile")
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if profile_data.introduction is not None:
        current_user.introduction = profile_data.introduction
    await db.commit()
    await db.refresh(current_user)
    return {"message": "프로필이 성공적으로 업데이트 되었습니다!"}
@router.put("/me/password")
async def update_password(
    password_data: UserPasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not verify_password(password_data.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="기존 비밀번호가 일치하지 않습니다.")
    current_user.password = get_password_hash(password_data.new_password)
    await db.commit()
    return {"message": "비밀번호가 성공적으로 변경되었습니다!"}
UPLOAD_DIR = "uploads/profiles"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.patch("/me/profile-image")
async def update_profile_image(
    image_data: ProfileImageUpdate,
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
    ):
    current_user.profile_image_url = image_data.profile_image_url
    await db.commit()
    await db.refresh(current_user)
    return {"message": "프로필 이미지가 성공적으로 업데이트 되었습니다!",
            "profile_image_url": current_user.profile_image_url}
@router.post("/admin/signup/excel")
async def signup_via_excel(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user.admin_status:
        raise HTTPException(status_code=403, detail="관리자만 접근할 수 있습니다.")

    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.")

    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        df = df.where(pd.notnull(df), None) 
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"엑셀 파일을 읽는 중 오류가 발생했습니다: {str(e)}")

    success_count = 0
    error_list = []

    for index, row in df.iterrows():
        try:
            user_data = UserCreate(
                user_id=str(row['user_id']),
                password=str(row['password']),
                name=str(row['name']),
                generation=float(row['generation']),
                role=row.get('role') if row.get('role') else None
            )
            new_user = await create_user(db, user_data)
            if new_user:
                success_count += 1
            else:
                error_list.append(f"{(index + 2)}번째 줄 실패: 이미 존재하는 아이디 ({row['user_id']})")
        except Exception as e:
            error_list.append(f"{(index + 2)}번째 줄 실패: 데이터 형식 오류 ({str(e)})")

    return {
        "message": f"엑셀 처리 완료! (성공: {success_count}명, 실패: {len(error_list)}명)",
        "errors": error_list
    }

def get_current_admin(current_user: User = Depends(get_current_user)):
    """현재 로그인한 유저가 관리자(admin_status == 1)인지 확인하는 함수"""
    
    # admin_status 값이 1이 아니라면 403 에러(권한 없음)를 발생시킴
    if current_user.admin_status != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="관리자 권한이 없습니다."
        )
    
    # 관리자가 맞다면 그대로 유저 정보를 통과시킴!
    return current_user