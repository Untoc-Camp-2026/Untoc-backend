# /front/Dockerfile

# 1. Node.js 환경 가져오기 (Next.js 14 이상은 Node 18 이상 권장)
FROM node:18-alpine

# 2. 작업할 기본 폴더 설정
WORKDIR /app

# 3. 패키지 정보(package.json 등) 복사 후 라이브러리 설치
COPY package*.json ./
RUN npm install

# 4. 프론트엔드 전체 코드 복사
COPY . .

# 5. Next.js 빌드 (운영 환경용으로 최적화)
RUN npm run build

# 6. 외부와 통신할 포트 번호 명시
EXPOSE 3000

# 7. 컨테이너가 켜질 때 실행할 명령어
CMD ["npm", "run", "start"]