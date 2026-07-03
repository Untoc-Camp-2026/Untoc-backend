# app/core/security.py
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext

# 비밀번호 해싱을 위한 설정 (Bcrypt 알고리즘 사용)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT 토큰 설정
SECRET_KEY = "your-super-flexible-and-very-long-secret-key-here" #추후 변경해야함
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 #토큰 유효시간 -> 일단 1시간으로 설정

def verify_password(plain_password: str, hashed_password: str) -> bool:
    #평문 비밀번호와 해시된 비밀번호 비교
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    #기본 비밀번호 설정시 해시값을 얻기 위해 필요한 함수
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    #토큰 생성
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    # 토큰 만료 시간 추가
    to_encode.update({"exp": expire})
    
    # JWT 토큰 발행
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt