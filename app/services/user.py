from sqlalchemy.orm import Session
from sqlalchemy.future  import select   
from models.user import User
from core.security import verify_password
from core.security import get_password_hash
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
#회원가입 로직
async def create_user(db, user_data):
    stmt = select(User).where(User.user_id == user_data.user_id)
    result = await db.execute(stmt)
    if result.scalars().first():
        return None  

    hashed_password = get_password_hash(user_data.password)


    new_user = User(
        user_id=user_data.user_id,
        password=hashed_password,
        name=user_data.name,
        role=user_data.role,
        generation=user_data.generation,
        activity_status=True,
        admin_status=True
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user