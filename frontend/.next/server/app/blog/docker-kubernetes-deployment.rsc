2:I[1344,["518","static/chunks/518-db630b946e945006.js","481","static/chunks/481-ca005a81abcbc31c.js","308","static/chunks/app/blog/%5Bslug%5D/page-f925cf69c09ee81c.js"],"default"]
4:I[893,["518","static/chunks/518-db630b946e945006.js","481","static/chunks/481-ca005a81abcbc31c.js","308","static/chunks/app/blog/%5Bslug%5D/page-f925cf69c09ee81c.js"],"default"]
6:I[4297,["518","static/chunks/518-db630b946e945006.js","481","static/chunks/481-ca005a81abcbc31c.js","308","static/chunks/app/blog/%5Bslug%5D/page-f925cf69c09ee81c.js"],"default"]
7:I[4707,[],""]
9:I[6423,[],""]
a:I[8596,["185","static/chunks/app/layout-563ec2edc9a48b24.js"],"LanguageProvider"]
3:T1705,<br/># Docker와 Kubernetes를 활용한 배포 자동화<br/><br/>현대 소프트웨어 개발에서 컨테이너 기반의 배포는 이제 필수가 되었습니다. 이 포스트에서는 Docker와 Kubernetes를 사용하여 안정적이고 확장 가능한 배포 파이프라인을 구축하는 방법을 알아보겠습니다.<br/><br/>## 왜 컨테이너인가?<br/><br/>컨테이너는 애플리케이션과 그 종속성을 하나의 패키지로 묶어주는 기술입니다. 이를 통해 다음과 같은 이점을 얻을 수 있습니다:<br/><br/>- **환경 일관성**: "내 컴퓨터에서는 잘 돌아가는데"라는 말은 이제 과거의 일<br/>- **빠른 배포**: 가벼운 컨테이너로 빠른 시작 시간<br/>- **확장성**: 필요에 따라 컨테이너를 쉽게 늘리거나 줄임<br/>- **자원 효율성**: VM보다 적은 자원으로 더 많은 애플리케이션 실행<br/><br/>## Docker 기본 설정<br/><br/>먼저 애플리케이션을 Docker화해보겠습니다.<br/><br/>```dockerfile<br/># Dockerfile<br/>FROM node:18-alpine<br/><br/>WORKDIR /app<br/><br/># package.json과 package-lock.json 복사<br/>COPY package*.json ./<br/><br/># 의존성 설치<br/>RUN npm ci --only=production<br/><br/># 애플리케이션 코드 복사<br/>COPY . .<br/><br/># 빌드<br/>RUN npm run build<br/><br/># 포트 노출<br/>EXPOSE 3000<br/><br/># 애플리케이션 실행<br/>CMD ["npm", "start"]<br/>```<br/><br/>## Docker Compose로 로컬 개발<br/><br/>```yaml<br/># docker-compose.yml<br/>version: '3.8'<br/><br/>services:<br/>  app:<br/>    build: .<br/>    ports:<br/>      - "3000:3000"<br/>    environment:<br/>      - NODE_ENV=development<br/>    volumes:<br/>      - .:/app<br/>      - /app/node_modules<br/><br/>  db:<br/>    image: postgres:14<br/>    environment:<br/>      POSTGRES_DB: myapp<br/>      POSTGRES_USER: user<br/>      POSTGRES_PASSWORD: password<br/>    ports:<br/>      - "5432:5432"<br/>    volumes:<br/>      - postgres_data:/var/lib/postgresql/data<br/><br/>volumes:<br/>  postgres_data:<br/>```<br/><br/>## Kubernetes 배포<br/><br/>Kubernetes에서는 여러 리소스를 통해 애플리케이션을 관리합니다.<br/><br/>### Deployment<br/><br/>```yaml<br/># k8s/deployment.yaml<br/>apiVersion: apps/v1<br/>kind: Deployment<br/>metadata:<br/>  name: myapp<br/>  labels:<br/>    app: myapp<br/>spec:<br/>  replicas: 3<br/>  selector:<br/>    matchLabels:<br/>      app: myapp<br/>  template:<br/>    metadata:<br/>      labels:<br/>        app: myapp<br/>    spec:<br/>      containers:<br/>      - name: myapp<br/>        image: myapp:latest<br/>        ports:<br/>        - containerPort: 3000<br/>        env:<br/>        - name: NODE_ENV<br/>          value: "production"<br/>        resources:<br/>          requests:<br/>            memory: "128Mi"<br/>            cpu: "100m"<br/>          limits:<br/>            memory: "256Mi"<br/>            cpu: "200m"<br/>```<br/><br/>### Service<br/><br/>```yaml<br/># k8s/service.yaml<br/>apiVersion: v1<br/>kind: Service<br/>metadata:<br/>  name: myapp-service<br/>spec:<br/>  selector:<br/>    app: myapp<br/>  ports:<br/>  - port: 80<br/>    targetPort: 3000<br/>  type: LoadBalancer<br/>```<br/><br/>## CI/CD 파이프라인<br/><br/>GitHub Actions를 사용한 자동 배포 파이프라인입니다.<br/><br/>```yaml<br/># .github/workflows/deploy.yml<br/>name: Deploy to Kubernetes<br/><br/>on:<br/>  push:<br/>    branches: [main]<br/><br/>jobs:<br/>  deploy:<br/>    runs-on: ubuntu-latest<br/><br/>    steps:<br/>    - uses: actions/checkout@v2<br/><br/>    - name: Build Docker image<br/>      run: |<br/>        docker build -t myapp:${{ github.sha }} .<br/>        docker tag myapp:${{ github.sha }} myapp:latest<br/><br/>    - name: Push to registry<br/>      run: |<br/>        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin<br/>        docker push myapp:${{ github.sha }}<br/>        docker push myapp:latest<br/><br/>    - name: Deploy to Kubernetes<br/>      run: |<br/>        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig<br/>        export KUBECONFIG=kubeconfig<br/>        kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}<br/>        kubectl rollout status deployment/myapp<br/>```<br/><br/>## 모니터링과 로깅<br/><br/>Kubernetes 환경에서는 모니터링이 매우 중요합니다.<br/><br/>```yaml<br/># k8s/monitoring.yaml<br/>apiVersion: v1<br/>kind: ConfigMap<br/>metadata:<br/>  name: prometheus-config<br/>data:<br/>  prometheus.yml: |<br/>    global:<br/>      scrape_interval: 15s<br/>    scrape_configs:<br/>    - job_name: 'kubernetes-pods'<br/>      kubernetes_sd_configs:<br/>      - role: pod<br/>```<br/><br/>## 보안 고려사항<br/><br/>- **이미지 스캔**: 컨테이너 이미지의 취약점 검사<br/>- **시크릿 관리**: 민감한 정보를 Kubernetes Secret으로 관리<br/>- **네트워크 정책**: 파드 간 통신 제한<br/>- **RBAC**: 역할 기반 접근 제어<br/><br/>## 성능 최적화<br/><br/>1. **멀티 스테이지 빌드**: 최종 이미지 크기 줄이기<br/>2. **리소스 제한**: 메모리와 CPU 사용량 제한<br/>3. **헬스 체크**: Liveness와 Readiness 프로브 설정<br/>4. **수평적 확장**: HPA(Horizontal Pod Autoscaler) 활용<br/><br/>## 마무리<br/><br/>Docker와 Kubernetes를 활용한 배포 자동화는 복잡해 보이지만, 한번 구축하면 매우 안정적이고 확장 가능한 시스템을 얻을 수 있습니다.<br/><br/>다음 포스트에서는 Helm을 활용한 Kubernetes 애플리케이션 패키징에 대해 알아보겠습니다.5:T13c1,
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

다음 포스트에서는 Helm을 활용한 Kubernetes 애플리케이션 패키징에 대해 알아보겠습니다.8:["slug","docker-kubernetes-deployment","d"]
0:["lfdazvTdhEswHs6voOjbX",[[["",{"children":["blog",{"children":[["slug","docker-kubernetes-deployment","d"],{"children":["__PAGE__?{\"slug\":\"docker-kubernetes-deployment\"}",{}]}]}]},"$undefined","$undefined",true],["",{"children":["blog",{"children":[["slug","docker-kubernetes-deployment","d"],{"children":["__PAGE__",{},[["$L1",["$","div",null,{"className":"bg-gray-50 min-h-screen","children":[["$","$L2",null,{}],["$","main",null,{"className":"pt-20","children":[["$","section",null,{"className":"bg-white","children":["$","div",null,{"className":"max-w-4xl mx-auto px-4 py-12","children":["$","div",null,{"children":[["$","a",null,{"href":"/blog","className":"inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":20,"height":20,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-arrow-left","children":[["$","path","1l729n",{"d":"m12 19-7-7 7-7"}],["$","path","x3x0zl",{"d":"M19 12H5"}],"$undefined"]}],"블로그로 돌아가기"]}],["$","div",null,{"className":"mb-6","children":["$","span",null,{"className":"px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium","children":"DevOps"}]}],["$","h1",null,{"className":"text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight","children":"Docker와 Kubernetes를 활용한 배포 자동화"}],["$","div",null,{"className":"flex flex-wrap items-center gap-6 text-gray-600 mb-8","children":[["$","div",null,{"className":"flex items-center gap-2","children":[["$","img",null,{"src":"https://via.placeholder.com/40x40","alt":"김태회","className":"w-10 h-10 rounded-full"}],["$","span",null,{"className":"font-medium","children":"김태회"}]]}],["$","div",null,{"className":"flex items-center gap-1","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":16,"height":16,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-calendar","children":[["$","rect","eu3xkr",{"width":"18","height":"18","x":"3","y":"4","rx":"2","ry":"2"}],["$","line","m3sa8f",{"x1":"16","x2":"16","y1":"2","y2":"6"}],["$","line","18kwsl",{"x1":"8","x2":"8","y1":"2","y2":"6"}],["$","line","xt86sb",{"x1":"3","x2":"21","y1":"10","y2":"10"}],"$undefined"]}],"2024년 1월 10일"]}],["$","div",null,{"className":"flex items-center gap-1","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":16,"height":16,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-clock","children":[["$","circle","1mglay",{"cx":"12","cy":"12","r":"10"}],["$","polyline","68esgv",{"points":"12 6 12 12 16 14"}],"$undefined"]}],"5 min read"]}]]}],null]}]}]}],["$","section",null,{"className":"bg-white","children":["$","div",null,{"className":"max-w-4xl mx-auto px-4 pb-12","children":[["$","div",null,{"className":"prose prose-lg max-w-none   prose-headings:text-gray-900   prose-p:text-gray-700 prose-p:leading-relaxed   prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline   prose-strong:text-gray-900   prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded   prose-pre:bg-gray-900 prose-pre:text-gray-100","dangerouslySetInnerHTML":{"__html":"$3"}}],["$","div",null,{"className":"flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200","children":[["$","span","Docker",{"className":"inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-tag","children":[["$","path","14b2ls",{"d":"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"}],["$","path","7u93v4",{"d":"M7 7h.01"}],"$undefined"]}],"Docker"]}],["$","span","Kubernetes",{"className":"inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-tag","children":[["$","path","14b2ls",{"d":"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"}],["$","path","7u93v4",{"d":"M7 7h.01"}],"$undefined"]}],"Kubernetes"]}],["$","span","CI/CD",{"className":"inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":14,"height":14,"viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","strokeWidth":2,"strokeLinecap":"round","strokeLinejoin":"round","className":"lucide lucide-tag","children":[["$","path","14b2ls",{"d":"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"}],["$","path","7u93v4",{"d":"M7 7h.01"}],"$undefined"]}],"CI/CD"]}]]}],["$","$L4",null,{"post":{"slug":"docker-kubernetes-deployment","title":"Docker와 Kubernetes를 활용한 배포 자동화","excerpt":"컨테이너 기반의 현대적인 배포 파이프라인을 구축하는 방법을 단계별로 설명합니다.","content":"$5","date":"2024-01-10","author":"김태회","category":"DevOps","tags":["Docker","Kubernetes","CI/CD"],"readingTime":"5 min read","image":null}}]]}]}],["$","section",null,{"id":"comments","className":"bg-gray-50","children":["$","div",null,{"className":"max-w-4xl mx-auto px-4 py-12","children":["$","$L6",null,{"postSlug":"docker-kubernetes-deployment"}]}]}]]}]]}],null],null],null]},[null,["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","blog","children","$8","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]],null]},[null,["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","blog","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]],null]},[[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/d94babb66ce58f09.css","precedence":"next","crossOrigin":"$undefined"}]],["$","html",null,{"lang":"en","className":"scroll-smooth","children":["$","body",null,{"className":"font-sans antialiased bg-white text-gray-900","children":["$","$La",null,{"children":["$","div",null,{"className":"min-h-screen","children":["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":"404"}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[]}]}]}]}]}]],null],null],["$Lb",null]]]]
b:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"Taehoe Kim - Backend Developer Portfolio"}],["$","meta","3",{"name":"description","content":"Portfolio of Taehoe Kim, a developer who loves building scalable and reliable backend systems."}],["$","meta","4",{"name":"author","content":"Taehoe Kim"}],["$","meta","5",{"name":"keywords","content":"backend,developer,portfolio,Java,Spring Boot,Python,Node.js,AWS"}],["$","meta","6",{"property":"og:title","content":"Taehoe Kim - Backend Developer Portfolio"}],["$","meta","7",{"property":"og:description","content":"A developer who loves building scalable and reliable backend systems"}],["$","meta","8",{"property":"og:locale","content":"en_US"}],["$","meta","9",{"property":"og:type","content":"website"}],["$","meta","10",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","11",{"name":"twitter:title","content":"Taehoe Kim - Backend Developer Portfolio"}],["$","meta","12",{"name":"twitter:description","content":"A developer who loves building scalable and reliable backend systems"}]]
1:null
