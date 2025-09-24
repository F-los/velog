# 배포 가이드

## 백엔드 배포 (Koyeb)

### 1. 사전 준비
- GitHub 리포지토리에 코드 푸시
- PostgreSQL 데이터베이스 준비 (Koyeb PostgreSQL 또는 외부 서비스)

### 2. Koyeb 배포 설정
1. Koyeb 계정 생성 및 로그인
2. "Create Web Service" 선택
3. GitHub 리포지토리 연결
4. 다음 설정 적용:
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npm run start:prod`
   - **Port**: `8000`
   - **Health Check Path**: `/`

### 3. 환경변수 설정
```
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-netlify-site.netlify.app
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-here
JWT_EXPIRES_IN=12h
DATABASE_URL=postgresql://user:password@host:port/database
DISABLE_DB=false
```

## 프론트엔드 배포 (Netlify)

### 1. Netlify 배포 설정
1. Netlify 계정 생성 및 로그인
2. "New site from Git" 선택
3. GitHub 리포지토리 연결
4. Build 설정:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
   - **Base Directory**: `frontend`

### 2. 환경변수 설정
```
NEXT_PUBLIC_API_URL=https://your-koyeb-backend.koyeb.app
NEXT_PUBLIC_SITE_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_SITE_NAME=Velog Clone
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 3. 도메인 설정 (선택사항)
- Netlify 대시보드에서 custom domain 설정
- DNS 레코드 업데이트

## 배포 후 확인사항

1. **백엔드 상태 확인**
   - `https://your-koyeb-backend.koyeb.app` 접속
   - API 엔드포인트 동작 확인

2. **프론트엔드 상태 확인**
   - `https://your-netlify-site.netlify.app` 접속
   - 로그인/회원가입 기능 테스트

3. **CORS 설정 확인**
   - 브라우저 개발자 도구에서 네트워크 탭 확인
   - CORS 에러가 없는지 검증

## 주의사항

- JWT 시크릿은 반드시 복잡한 값으로 설정
- 데이터베이스 연결 정보는 안전하게 관리
- 환경변수는 각 플랫폼의 대시보드에서 설정 (코드에 포함하지 않음)
- 백엔드 배포 완료 후 프론트엔드의 API URL을 업데이트