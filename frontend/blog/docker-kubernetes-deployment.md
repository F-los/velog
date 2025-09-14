---
title: "Docker와 Kubernetes를 활용한 배포 자동화"
excerpt: "컨테이너 기반의 현대적인 배포 파이프라인을 구축하는 방법을 단계별로 설명합니다."
date: "2024-01-10"
author: "김태회"
category: "DevOps"
tags: ["Docker", "Kubernetes", "CI/CD"]
---

# Docker와 Kubernetes를 활용한 배포 자동화

현대 소프트웨어 개발에서 컨테이너 기반의 배포는 이제 필수가 되었습니다. 이 포스트에서는 Docker와 Kubernetes를 사용하여 안정적이고 확장 가능한 배포 파이프라인을 구축하는 방법을 알아보겠습니다.

## 왜 컨테이너인가?

컨테이너는 애플리케이션과 그 종속성을 하나의 패키지로 묶어주는 기술입니다. 이를 통해 다음과 같은 이점을 얻을 수 있습니다:

- **환경 일관성**: "내 컴퓨터에서는 잘 돌아가는데"라는 말은 이제 과거의 일
- **빠른 배포**: 가벼운 컨테이너로 빠른 시작 시간
- **확장성**: 필요에 따라 컨테이너를 쉽게 늘리거나 줄임
- **자원 효율성**: VM보다 적은 자원으로 더 많은 애플리케이션 실행

## Docker 기본 설정

먼저 애플리케이션을 Docker화해보겠습니다.

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 애플리케이션 코드 복사
COPY . .

# 빌드
RUN npm run build

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "start"]
```

## Docker Compose로 로컬 개발

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Kubernetes 배포

Kubernetes에서는 여러 리소스를 통해 애플리케이션을 관리합니다.

### Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

### Service

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## CI/CD 파이프라인

GitHub Actions를 사용한 자동 배포 파이프라인입니다.

```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Build Docker image
      run: |
        docker build -t myapp:${{ github.sha }} .
        docker tag myapp:${{ github.sha }} myapp:latest

    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push myapp:${{ github.sha }}
        docker push myapp:latest

    - name: Deploy to Kubernetes
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig
        kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
        kubectl rollout status deployment/myapp
```

## 모니터링과 로깅

Kubernetes 환경에서는 모니터링이 매우 중요합니다.

```yaml
# k8s/monitoring.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
```

## 보안 고려사항

- **이미지 스캔**: 컨테이너 이미지의 취약점 검사
- **시크릿 관리**: 민감한 정보를 Kubernetes Secret으로 관리
- **네트워크 정책**: 파드 간 통신 제한
- **RBAC**: 역할 기반 접근 제어

## 성능 최적화

1. **멀티 스테이지 빌드**: 최종 이미지 크기 줄이기
2. **리소스 제한**: 메모리와 CPU 사용량 제한
3. **헬스 체크**: Liveness와 Readiness 프로브 설정
4. **수평적 확장**: HPA(Horizontal Pod Autoscaler) 활용

## 마무리

Docker와 Kubernetes를 활용한 배포 자동화는 복잡해 보이지만, 한번 구축하면 매우 안정적이고 확장 가능한 시스템을 얻을 수 있습니다.

다음 포스트에서는 Helm을 활용한 Kubernetes 애플리케이션 패키징에 대해 알아보겠습니다.