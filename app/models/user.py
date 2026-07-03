from sqlalchemy import Column, Integer, String , Boolean, Enum
from core.base import Base
class  User(Base):
    __tablename__ = "Users"
    user_id = Column(String(50), primary_key = True, index = True)
    password = Column(String(500) , nullable = False)
    name = Column(String(50), nullable = False)
    role = Column(Enum('BACKEND', 'FRONTEND'))
    generation = Column(Integer)
    activity_status = Column(Boolean, default=1, nullable = False)
    admin_status = Column(Boolean, default=0, nullable = False)

#webebeb 해시값 - $2a$12$NcG9Y3izqe.WLhPKblhbv.WfACgbmUtdzHI6xNOnprQmPuOyr2GdG