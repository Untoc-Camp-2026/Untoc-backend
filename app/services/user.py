from sqlalchemy.orm import Session
from sqlalchemy.future  import select   
from models.user import User
from core.security import verify_password
#사용자 인증 로직 (해시)
async def authenticate_user(db, user_id: str, password: str):
    stmt = select(User).where(User.user_id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        return False
        
    if not verify_password(password, user.password):
        return False
        
    return user