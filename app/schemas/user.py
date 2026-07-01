# app/schemas/user.py
from pydantic import BaseModel

class Token(BaseModel):
    """로그인 성공 시 클라이언트에게 반환할 응답 구조"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """토큰의 복호화된 내용(Payload)을 담을 구조"""
    username: str | None = None