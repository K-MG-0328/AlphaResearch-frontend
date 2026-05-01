# workflow의 platforms 설정이 자동으로 처리
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install --frozen-lockfile --loglevel=error

# 앱 코드 복사
COPY . .

# Next.js 빌드
RUN npm run build

# 멀티스테이지로 런타임 이미지 경량화
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY package*.json ./

# 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]
