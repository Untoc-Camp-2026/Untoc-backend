from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from core.database import get_db  
from services.user import authenticate_user
from core.security import create_access_token
from schemas.user import Token  

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
@router.post("/login")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
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

@router.get("/me")
async def test_login(token: str = Depends(oauth2_scheme)):
    return {
        "message": "로그인 성공!",
        "token": token
    }