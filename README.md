# 100zoad Web Components

부동산 분양 랜딩페이지를 위한 규격화된 웹 컴포넌트 시스템

## 📋 프로젝트 개요

100zoad는 아임웹 기반 랜딩페이지를 빠르게 구축할 수 있는 웹 컴포넌트 라이브러리입니다.

**핵심 특징:**
- 🎯 5개 독립 컴포넌트 (헤더, 푸터, 입력폼, 퀵메뉴, 모바일 내비게이터)
- 🎨 Shadow DOM 스타일 격리 (아임웹 충돌 없음)
- ⚙️ Config-driven 설계 (코드 수정 없이 설정으로 제어)
- ⚡ 초경량 (<50KB, Vanilla JS)
- 🚀 Cloudflare Pages 호스팅

## 🏗️ 프로젝트 구조

```
100zoad/
├── src/                    # 소스 코드
│   ├── components/        # 웹 컴포넌트
│   │   ├── header/       # 헤더 컴포넌트
│   │   ├── footer/       # 푸터 컴포넌트
│   │   ├── form/         # 입력폼 컴포넌트
│   │   ├── quickmenu/    # PC 퀵메뉴
│   │   └── mobile-nav/   # 모바일 내비게이터
│   ├── core/             # 핵심 시스템
│   │   ├── config-parser.js    # Config 파싱
│   │   └── base-component.js   # 베이스 클래스
│   └── main.js           # 개발 환경 엔트리포인트
├── workers/              # Cloudflare Workers (API 프록시)
├── public/               # 정적 파일
├── docs/                 # 문서
├── dist/                 # 빌드 결과물
├── vite.config.js        # Vite 설정
├── package.json          # 프로젝트 메타데이터
└── README.md            # 이 파일
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 4. 빌드 미리보기

```bash
npm run preview
```

## 📦 NPM 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Vite 개발 서버 실행 (HMR 포함) |
| `npm run build` | 프로덕션 빌드 (ES2020+) |
| `npm run preview` | 빌드 결과물 미리보기 |

## 🛠️ 기술 스택

- **프론트엔드:** Vanilla JavaScript (ES2020+)
- **Web Components:** Custom Elements + Shadow DOM
- **빌드 도구:** Vite 5.x
- **호스팅:** Cloudflare Pages
- **API 프록시:** Cloudflare Workers
- **데이터베이스:** Airtable

## 📖 개발 가이드

### 컴포넌트 개발

각 컴포넌트는 다음 구조를 따릅니다:

```javascript
// src/components/example/example.js
class ExampleComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* 컴포넌트 스타일 */
      </style>
      <div>컴포넌트 내용</div>
    `;
  }
}

customElements.define('zoad-example', ExampleComponent);
```

### Config 시스템

모든 컴포넌트는 `Window.CONFIG` 객체에서 설정을 읽습니다:

```javascript
Window.CONFIG = {
  header: { /* 헤더 설정 */ },
  footer: { /* 푸터 설정 */ },
  form: { /* 입력폼 설정 */ },
  // ...
};
```

## 🌐 Cloudflare Pages 배포

### 초기 설정

1. Cloudflare Dashboard에서 프로젝트 생성
2. GitHub 저장소 연결
3. 빌드 설정:
   - **빌드 명령어:** `npm run build`
   - **빌드 출력 디렉토리:** `dist`
   - **Node 버전:** 20

### 자동 배포

`main` 브랜치에 푸시하면 자동으로 배포됩니다.

## 📚 관련 문서

- [아키텍처 문서](docs/architecture-100zoad-2026-01-01.md)
- [PRD](docs/prd-100zoad-2026-01-01.md)
- [Sprint Plan](docs/sprint-plan-100zoad-2026-01-01.md)

## 🤝 기여

이 프로젝트는 BMAD Method v6를 사용하여 개발되었습니다.

## 📄 라이선스

MIT License

## 📧 문의

프로젝트 관련 문의: merge@100zoad.local

---

**현재 상태:** Sprint 0 - MVP 개발 중 🚧
