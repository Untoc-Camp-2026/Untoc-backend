from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from core.database import get_db  
from services.user import authenticate_user, create_user
from core.security import create_access_token
from schemas.user import Token  
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from enum import Enum

router = APIRouter()

class RoleEnum(str, Enum):
    backend = "BACKEND"
    frontend = "FRONTEND"
class UserCreate(BaseModel):
    user_id: str
    password: str
    name: str
    generation: int
    role: Optional[RoleEnum] = None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
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