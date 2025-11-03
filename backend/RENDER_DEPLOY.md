# Render.com 배포 가이드

## 배포 준비사항

### 1. Render.com 계정 생성
- [Render.com](https://render.com)에서 계정 생성 (GitHub 연동 권장)

### 2. 환경 변수 설정
Render.com 대시보드에서 다음 환경 변수들을 설정해야 합니다:

```
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=<your-frontend-url>
```

또는 개별 데이터베이스 설정:
```
DATABASE_HOST=<your-database-host>
DATABASE_PORT=5432
DATABASE_USERNAME=<your-db-username>
DATABASE_PASSWORD=<your-db-password>
DATABASE_NAME=<your-db-name>
```

## Render.com 배포 방법

### 방법 1: Web Service (Docker)

1. Render Dashboard에서 "New +" → "Web Service" 선택
2. GitHub 저장소 연결
3. 다음 설정 입력:
   - **Name**: velog-backend (또는 원하는 이름)
   - **Region**: 가까운 지역 선택 (예: Oregon, Singapore)
   - **Branch**: main (또는 배포할 브랜치)
   - **Root Directory**: backend
   - **Runtime**: Docker
   - **Instance Type**: Free (또는 원하는 플랜)

4. Environment 탭에서 위의 환경 변수들 추가

5. "Create Web Service" 클릭

### 방법 2: render.yaml 사용 (Infrastructure as Code)

프로젝트 루트에 `render.yaml` 파일 생성:

```yaml
services:
  - type: web
    name: velog-backend
    runtime: docker
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 8000
      - key: DATABASE_HOST
        sync: false
      - key: DATABASE_PORT
        value: 5432
      - key: DATABASE_USERNAME
        sync: false
      - key: DATABASE_PASSWORD
        sync: false
      - key: DATABASE_NAME
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        sync: false
    healthCheckPath: /health
```

## PostgreSQL 데이터베이스 설정

### Render.com PostgreSQL 생성

1. Render Dashboard → "New +" → "PostgreSQL"
2. 데이터베이스 이름 입력 (예: velog-db)
3. Region 선택 (Web Service와 동일한 지역 권장)
4. 생성 후 "Internal Database URL" 복사
5. Web Service의 환경 변수에 `DATABASE_URL`로 추가

예시:
```
DATABASE_URL=postgresql://velog_user:xxxxx@dpg-xxxxx-a.oregon-postgres.render.com/velog_db
```

### Prisma 마이그레이션 실행

데이터베이스 생성 후 스키마 마이그레이션이 필요합니다:

**옵션 1: Render Shell에서 실행**
1. Render Dashboard → 배포된 Web Service 선택
2. "Shell" 탭 클릭
3. 다음 명령 실행:
```bash
npx prisma migrate deploy
```

**옵션 2: 로컬에서 실행**
```bash
# DATABASE_URL 환경 변수 설정
export DATABASE_URL="postgresql://user:password@host:5432/dbname"

# 마이그레이션 실행
npx prisma migrate deploy
```

**옵션 3: Dockerfile에 추가 (권장하지 않음)**
마이그레이션은 배포 시가 아닌 별도로 관리하는 것을 권장합니다.

## Health Check

Dockerfile에 헬스체크가 포함되어 있습니다. NestJS 앱에 `/health` 엔드포인트가 있는지 확인하세요.

없다면 다음과 같이 추가:

```typescript
// src/app.controller.ts
@Get('health')
healthCheck() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

## 배포 후 확인사항

1. Logs 탭에서 배포 로그 확인
2. 애플리케이션이 정상적으로 시작되는지 확인
3. Health check 엔드포인트 테스트: `https://your-app.onrender.com/health`
4. API 엔드포인트 테스트

## 자동 배포

GitHub에 push하면 자동으로 Render.com에서 빌드 및 배포가 시작됩니다.

## 주의사항

1. **Free 플랜의 제약사항**:
   - 15분간 요청이 없으면 자동으로 슬립 모드 진입
   - 다음 요청 시 30초 정도 깨어나는 시간 필요
   - 월 750시간 무료 (약 한 달)

2. **환경 변수 보안**:
   - JWT_SECRET, DATABASE_PASSWORD 등은 반드시 강력한 값 사용
   - .env 파일은 절대 Git에 커밋하지 말 것

3. **CORS 설정**:
   - FRONTEND_URL을 프론트엔드 배포 URL로 정확히 설정

## 트러블슈팅

### 빌드 실패 시
- Logs에서 에러 메시지 확인
- package.json의 dependencies 확인
- Node 버전 호환성 확인 (현재 Node 22 사용)

### 데이터베이스 연결 실패 시
- DATABASE_HOST, PORT, USERNAME, PASSWORD 확인
- Render PostgreSQL의 경우 Internal URL 사용
- 방화벽 설정 확인

### 앱이 시작되지 않을 때
- PORT 환경 변수가 올바르게 설정되었는지 확인
- main.ts에서 0.0.0.0으로 listen하고 있는지 확인
- Health check 엔드포인트가 존재하는지 확인

## 추가 리소스

- [Render.com Documentation](https://render.com/docs)
- [Docker Deployment Guide](https://render.com/docs/deploy-node-express-app)

