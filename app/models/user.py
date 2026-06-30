from sqlalchemy import Column, Integer, Varchar , Boolean, Enum

class  User(Base):
    __tablename__ = "Users"
    user_id = Column(Varchar(50), primary_key = True, index = True)
    password = Column(Varchar(500) , default='webebeb', nullable = False)
    name = Column(Varchar(50), nullable = False)
    role = Column(Enum('BACKEND', 'FRONTEND'))
    generation = Column(Integer)
    activity_status = Column(Boolean, default=1, nullable = False)
    admin_status = Column(Boolean, default=0, nullable = False)

