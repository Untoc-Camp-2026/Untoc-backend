import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

# 내 프로젝트 안에 파일이 저장될 폴더 이름 지정
UPLOAD_DIR = "uploads"

# 서버를 켰을 때 'uploads' 폴더가 없으면 자동으로 만들어주는 코드
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # 1. 파일이 저장될 경로 (예: uploads/my_photo.jpg)
        file_path = f"{UPLOAD_DIR}/{file.filename}"

        # 2. 내 컴퓨터(VSCode 폴더)에 파일을 찐으로 저장하는 로직
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 3. 프론트엔드에게 "이 주소로 들어오면 파일 볼 수 있어!"라고 URL 알려줌
        return {"file_url": f"/{file_path}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail="파일 업로드 실패")