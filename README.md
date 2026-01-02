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

---

## 👤 오너를 위한 가이드

**코드 지식이 없어도 괜찮습니다!** 100zoad는 설정 파일(Config)만 수정하면 현장별로 커스터마이징할 수 있습니다.

### 🎯 Config로 할 수 있는 것

- ✅ 로고 이미지 변경
- ✅ 메뉴 항목 추가/삭제/수정
- ✅ 색상 변경 (배경색, 텍스트 색 등)
- ✅ 전화번호, 회사명 등 정보 수정
- ✅ 입력폼 필드 추가/삭제
- ✅ 버튼 문구 변경

### 📚 오너 학습 경로

1. **[main.html](main.html) 템플릿 열기**
   - 모든 설정이 한글 주석으로 설명되어 있습니다
   - 주석을 읽고 값만 수정하면 됩니다

2. **[examples/](examples/) 폴더에서 예시 확인**
   - `example-1-onepage-simple.html`: 간단한 원페이지
   - `example-2-multipage-full.html`: 풀 구성 멀티페이지
   - `example-3-minimal-form.html`: 입력폼만 사용

3. **[docs/config-guide.md](docs/config-guide.md) 가이드 읽기**
   - 단계별 설정 방법
   - 오류 해결 가이드
   - 자주 묻는 질문 (FAQ)

### ⚠️ 주의사항

1. **따옴표(' 또는 ")를 지우지 마세요**
2. **쉼표(,)를 함부로 추가/삭제하지 마세요**
3. **중괄호 { }와 대괄호 [ ]를 임의로 변경하지 마세요**
4. **수정 전에 항상 백업하세요**

### 🆘 오류가 발생하면?

1. **브라우저 개발자 도구 열기**
   - Windows/Linux: `F12`
   - Mac: `Cmd+Option+I`

2. **Console 탭에서 오류 메시지 확인**
   - 빨간색 오류 메시지를 읽어보세요
   - [docs/config-guide.md](docs/config-guide.md)의 "오류 해결 가이드" 참조

3. **백업 파일로 복원**
   - 수정 전 백업 파일을 열어서 복사-붙여넣기

4. **도움 요청**
   - 이메일: merge@100zoad.local
   - Console 스크린샷 첨부

---

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
├── imweb/                # 아임웹 배포용 파일
│   └── doosanweve_kimjunsu/  # 고객사별 폴더
│       ├── main.html     # 메인 페이지
│       ├── form.html     # 폼 컴포넌트
│       └── footer.html   # 푸터 컴포넌트
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

**✅ 라이브 URL:** https://100zoad-components.pages.dev

### 배포 정보

- **GitHub 레포지토리:** https://github.com/merge1108/100zoad-components
- **프로덕션 브랜치:** master
- **빌드 명령어:** `npm run build`
- **빌드 출력:** `dist/`
- **자동 배포:** ✅ 활성화

### 자동 배포

`master` 브랜치에 푸시하면 자동으로 배포됩니다.

```bash
git add .
git commit -m "feat: 새 기능 추가"
git push origin master
# → Cloudflare Pages가 자동으로 빌드 & 배포
```

## 📚 관련 문서

### 오너용 문서
- **[Config 설정 가이드](docs/config-guide.md)** ⭐ 필독!
- **[main.html 템플릿](main.html)** - 한글 주석 포함
- **[사용 예시](examples/)** - 3가지 시나리오

### 개발자용 문서
- [아키텍처 문서](docs/architecture-100zoad-2026-01-01.md)
- [PRD](docs/prd-100zoad-2026-01-01.md)
- [Sprint Plan](docs/sprint-plan-100zoad-2026-01-01.md)
- [Cloudflare Worker 배포](docs/WORKER-DEPLOYMENT.md)

## 🤝 기여

이 프로젝트는 BMAD Method v6를 사용하여 개발되었습니다.

## 📄 라이선스

MIT License

## 📧 문의

프로젝트 관련 문의: merge@100zoad.local

---

## 📈 프로젝트 진행 상황

**현재 Sprint:** Sprint 4 - 아임웹 배포 최적화 🚀

### 완료된 Sprint
- ✅ **Sprint 0** (22pt) - MVP LAUNCH: 핵심 리드 수집 기능 구현
- ✅ **Sprint 1** (22pt) - 사용자 경험 완성: 헤더, 푸터, 퀵메뉴, 모바일 내비게이터
- ✅ **Sprint 2** (25pt) - 기능 확장 및 마케팅 연동: 동적 필드, 이벤트 추적, 반응형
- ✅ **Sprint 3** (16pt) - 최적화 및 문서화: 성능 최적화, 크로스 브라우저 호환성
- 🔄 **Sprint 4** (5/12pt) - 아임웹 배포 최적화: 렌더링 이슈 해결 중

### 최근 완료된 주요 기능
- ✅ 헤더/푸터 컴포넌트 (Shadow DOM 스타일 격리)
- ✅ 입력폼 (필수 필드 + 동적 추가 필드)
- ✅ Airtable 연동 (Cloudflare Worker 경유)
- ✅ GTM/GA4 이벤트 추적
- ✅ PC 퀵메뉴 + 모바일 내비게이터
- ✅ 반응형 디자인 (PC/모바일)
- ✅ 크로스 브라우저 호환성
- ✅ Graceful Degradation (폴백 시스템)
- ✅ 파비콘 자동 설정
- ✅ 비전환 이벤트 추적
- ✅ **[NEW]** 아임웹 환경 헤더 렌더링 이슈 해결 (STORY-IMWEB-004)

### 진행 중인 작업
- 🔄 Pretendard 폰트 강제 적용 (STORY-IMWEB-001)
- 🔄 Form 버튼 초기 상태 수정 (STORY-IMWEB-002)
- 🔄 Form 성공 메시지 초기 상태 수정 (STORY-IMWEB-003)

**총 진행률:** 85/98 포인트 (86.7% 완료)

---

## 🔄 최근 업데이트

### 2026-01-02
- **STORY-IMWEB-004 완료**: 아임웹 환경에서 헤더 배경색 및 메뉴 렌더링 이슈 해결
  - CSS 우선순위 강화 (`!important` 추가, z-index 9999)
  - JavaScript 강제 스타일 적용 (`forceHeaderStyles()` 메서드)
  - 모든 Acceptance Criteria 충족 (5/5)
- **STORY-022 완료**: 비전환 이벤트 추적 구현 (GTM/GA4)
- **STORY-007 완료**: 파비콘 자동 설정

### 2026-01-01
- Sprint 0-3 완료 (85 포인트)
- MVP 기능 완성 및 아임웹 통합 테스트 완료

**변경 이력 상세:** [CHANGELOG.md](CHANGELOG.md) 참조

---
