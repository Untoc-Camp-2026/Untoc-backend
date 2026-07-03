from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.database import get_db
from core.security import SECRET_KEY, ALGORITHM
from models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# 필수 로그인 검증
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="토큰이 유효하지 않습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
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

# 선택적 로그인 검증 (목록, 상세 조회 시 비회원도 볼 수 있게 하려면 사용)
async def get_optional_current_user(token: str = None, db: AsyncSession = Depends(get_db)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        stmt = select(User).where(User.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalars().first()
    except JWTError:
        return None