# Cloudflare Pages 배포 가이드

> **100zoad 웹 컴포넌트를 Cloudflare Pages에 배포하고 아임웹에 통합하는 방법**

---

## 🎯 배포 전략 개요

### 기존 방식의 문제점
- ❌ 각 컴포넌트를 수동으로 HTML 파일로 복사
- ❌ 중복 코드 발생
- ❌ 업데이트 시 모든 파일을 다시 수정
- ❌ 유지보수 어려움

### 새로운 방식 (Cloudflare Pages 활용)
- ✅ 한 번의 배포로 모든 사이트 자동 업데이트
- ✅ 아임웹 HTML이 매우 간단 (CONFIG만 수정)
- ✅ 버전 관리 용이
- ✅ 빠른 CDN 배포

---

## 📁 프로젝트 구조

```
100zoad/
├── src/                    # 소스 코드
│   ├── components/        # 웹 컴포넌트
│   └── main.js           # 진입점
├── dist/                  # 빌드 결과물 (Cloudflare Pages에 배포)
│   ├── index.html
│   └── assets/
│       ├── main-xxx.js   # 메인 JS
│       ├── header-xxx.js
│       ├── footer-xxx.js
│       ├── form-xxx.js
│       ├── quickmenu-xxx.js
│       └── mobile-nav-xxx.js
└── imweb/
    └── templates/         # 아임웹 통합 템플릿
        └── imweb-template-cloudflare.html
```

---

## 🚀 배포 절차

### 1단계: GitHub 저장소 준비

```bash
# GitHub에 푸시
git add .
git commit -m "feat: Cloudflare Pages 배포 준비"
git push origin main
```

### 2단계: Cloudflare Pages 설정

#### 2-1. Cloudflare Dashboard 접속
1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인
2. 좌측 메뉴 > **Pages** 클릭
3. **Create a project** 클릭

#### 2-2. GitHub 저장소 연결
1. **Connect to Git** 선택
2. GitHub 계정 연결 (처음이라면 권한 승인)
3. 저장소 선택: `100zoad` (또는 실제 저장소명)
4. **Begin setup** 클릭

#### 2-3. 빌드 설정
- **Project name:** `100zoad` (또는 원하는 이름)
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables:** (필요 시)
  - `NODE_VERSION`: `18` (권장)

#### 2-4. 배포 시작
1. **Save and Deploy** 클릭
2. 빌드 진행 상황 확인
3. 배포 완료 후 URL 확인
   - 예시: `https://100zoad.pages.dev`

---

## 3단계: 아임웹 통합

### 3-1. 템플릿 파일 열기
`imweb/templates/imweb-template-cloudflare.html` 파일을 텍스트 에디터로 엽니다.

### 3-2. Cloudflare Pages URL 설정
```javascript
// 13번째 줄 근처
const CLOUDFLARE_URL = 'https://YOUR-PROJECT.pages.dev';
```
를
```javascript
const CLOUDFLARE_URL = 'https://100zoad.pages.dev'; // 실제 배포 URL로 변경
```
로 수정합니다.

### 3-3. 빌드 파일명 확인 및 업데이트

**중요:** 빌드 시마다 파일명이 변경됩니다!

1. Cloudflare Pages 대시보드에서 배포 완료 확인
2. 배포된 사이트 방문: `https://100zoad.pages.dev`
3. 개발자 도구(F12) > **Sources** 탭
4. `assets/main-xxx.js` 파일명 확인 (예: `main-CuMLdMIh.js`)
5. 템플릿 파일에서 파일명 업데이트:

```javascript
// 19번째 줄 근처
script.src = `${CLOUDFLARE_URL}/assets/main-CuMLdMIh.js`; // 실제 파일명으로 변경
```

### 3-4. CONFIG 설정 (고객사별로 수정)
```javascript
window.ZOAD_CONFIG = {
  meta: {
    siteName: '두산위브더제니스 센트럴천안', // 현장명 변경
    version: '1.0.0',
    lastUpdated: '2026-01-02'
  },
  header: {
    logo: {
      url: 'https://cdn.imweb.me/upload/.../logo.png', // 로고 URL 변경
      alt: '현장명'
    },
    menu: [
      { text: '사업안내', target: '#section1' }, // 메뉴 변경
      { text: '입지안내', target: '#section2' }
    ]
    // ... 나머지 설정
  }
  // ... 나머지 설정
};
```

### 3-5. 아임웹 업로드
1. 아임웹 관리자 > 디자인 모드 진입
2. 페이지 상단에 **HTML 섹션** 추가
3. 템플릿 파일 내용 **전체 복사**
4. HTML 섹션에 **붙여넣기**
5. **저장**

---

## 🔄 업데이트 프로세스

### 코드 수정 후 배포

```bash
# 1. 코드 수정
# 2. 로컬 테스트
npm run dev

# 3. GitHub 푸시
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main

# 4. Cloudflare Pages 자동 재배포 (약 1-2분 소요)
# 5. 모든 아임웹 사이트 자동 업데이트! ✨
```

**중요:** Cloudflare Pages가 자동으로 재배포하므로, 모든 아임웹 사이트가 즉시 업데이트됩니다!

---

## 📝 템플릿 사용 예시

### 예시 1: 두산위브 김준수 고객사

```html
<!-- 1. Cloudflare Pages URL 설정 -->
<script type="module" crossorigin>
  const CLOUDFLARE_URL = 'https://100zoad.pages.dev';
  const script = document.createElement('script');
  script.type = 'module';
  script.src = `${CLOUDFLARE_URL}/assets/main-CuMLdMIh.js`;
  document.head.appendChild(script);
</script>

<!-- 2. CONFIG 설정 -->
<script>
window.ZOAD_CONFIG = {
  meta: {
    siteName: '두산위브더제니스 센트럴천안'
  },
  header: {
    logo: {
      url: 'https://cdn.imweb.me/upload/S20251124bbc848073a8d6/46f6b8cc97277.png',
      alt: '두산위브더제니스 센트럴천안'
    },
    menu: [
      { text: '사업안내', target: '#section1' },
      { text: '입지안내', target: '#section2' },
      { text: '프리미엄', target: '#section3' },
      { text: '평면안내', target: '#section4' }
    ],
    specialMenu: {
      text: '관심고객등록',
      target: '#form-section',
      animation: 'pulse'
    }
  },
  form: {
    airtable: {
      workerUrl: 'https://100zoad-airtable-proxy.choiwseok.workers.dev/submit'
    }
  },
  footer: {
    line1: {
      siteName: '두산위브더제니스 센트럴천안',
      phone: '1666-3170'
    },
    line2: {
      company: '럿셀',
      ceo: '최우석',
      phone: '010-4997-7087',
      businessNumber: '466-23-01872'
    }
  }
};
</script>

<!-- 3. 컴포넌트 배치 -->
<zoad-header></zoad-header>
<zoad-quickmenu></zoad-quickmenu>
<zoad-mobile-nav></zoad-mobile-nav>
<div id="form-section"><zoad-form></zoad-form></div>
<zoad-footer></zoad-footer>
```

---

## 🧪 테스트 체크리스트

배포 후 반드시 확인:

### 로컬 테스트
```bash
npm run build
npm run preview
```
- [ ] http://localhost:4173 접속
- [ ] 모든 컴포넌트 정상 로드 확인
- [ ] Console 오류 없음

### Cloudflare Pages 테스트
- [ ] 배포 완료 확인 (Cloudflare Dashboard)
- [ ] 배포 URL 접속 (https://100zoad.pages.dev)
- [ ] 모든 컴포넌트 정상 로드 확인
- [ ] Console 오류 없음

### 아임웹 통합 테스트
- [ ] 헤더 정상 표시
- [ ] 메뉴 클릭 시 스크롤 이동
- [ ] 퀵메뉴 (PC 우측) 표시
- [ ] 모바일 내비게이터 (하단) 표시 (768px 이하)
- [ ] 입력폼 제출 및 Airtable 저장 확인
- [ ] 푸터 정상 표시

### 반응형 테스트
- [ ] PC 화면 (1920px 이상)
- [ ] 태블릿 (768px - 1024px)
- [ ] 모바일 (375px - 768px)

### 크로스 브라우저 테스트
- [ ] Chrome (권장)
- [ ] Safari (iOS)
- [ ] Edge
- [ ] Firefox

---

## ⚠️ 주의사항

### 1. 빌드 파일명 변경
- **문제:** Vite는 빌드 시마다 파일명을 변경합니다 (예: `main-CuMLdMIh.js`)
- **해결:**
  - 배포 후 Cloudflare Pages에서 파일명 확인
  - 템플릿 파일의 `script.src` 업데이트
  - **향후 개선:** 배포 스크립트로 자동화 예정

### 2. CORS 문제
- Cloudflare Pages는 기본적으로 CORS를 허용합니다
- 문제 발생 시 `_headers` 파일 생성:
  ```
  /*
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Methods: GET, POST, OPTIONS
  ```

### 3. Airtable Worker URL
- Cloudflare Worker와 Cloudflare Pages는 별도 서비스입니다
- Worker URL은 기존 그대로 사용: `https://100zoad-airtable-proxy.choiwseok.workers.dev/submit`

### 4. 캐시 문제
- 브라우저 캐시로 인해 업데이트가 즉시 반영 안 될 수 있음
- **해결:** Ctrl+Shift+R (강제 새로고침)

---

## 🐛 문제 해결

### Q1. Cloudflare Pages 배포 실패
```
Error: Build command failed
```
**해결:**
1. 로컬에서 빌드 테스트: `npm run build`
2. package.json 확인: `"build": "vite build"` 있는지
3. Node.js 버전 확인: 18 이상 권장

### Q2. 아임웹에서 컴포넌트가 보이지 않음
```
Console: Uncaught SyntaxError: Unexpected token '<'
```
**해결:**
1. Cloudflare Pages URL이 올바른지 확인
2. 빌드 파일명이 실제와 일치하는지 확인
3. 개발자 도구 > Network 탭에서 404 오류 확인

### Q3. 스타일이 깨짐
**해결:**
1. Pretendard 폰트 로드 확인
2. Shadow DOM 사용 여부 확인
3. 아임웹 CSS와 충돌 확인

### Q4. 입력폼 제출 실패
```
Console: Failed to fetch
```
**해결:**
1. Cloudflare Worker URL 확인
2. Worker가 정상 작동하는지 확인
3. Network 탭에서 요청/응답 확인

---

## 🔮 향후 개선 계획

### 1. 배포 자동화 스크립트
```bash
# TODO: 구현 예정
npm run deploy:cloudflare
# -> 빌드 + Cloudflare Pages 배포 + 템플릿 자동 업데이트
```

### 2. 파일명 해시 제거
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main.js', // 고정 파일명
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
};
```

### 3. 버전 관리
- CONFIG에 버전 명시
- 버전 불일치 시 경고 메시지

### 4. 에러 추적
- Sentry 또는 Cloudflare Analytics 통합
- 실시간 에러 모니터링

---

## 📞 지원

배포 중 문제가 발생하면 다음 정보를 포함하여 문의하세요:

- 고객사명
- Cloudflare Pages URL
- 오류 메시지 (Console 스크린샷)
- 브라우저 정보
- 모바일/PC 여부

**이메일:** merge@100zoad.local

---

## 📚 참고 자료

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Vite 빌드 가이드](https://vitejs.dev/guide/build.html)
- [100zoad 아키텍처 문서](./architecture-100zoad-2026-01-01.md)
- [100zoad 배포 가이드 (기존)](./imweb-deployment-guide.md)
