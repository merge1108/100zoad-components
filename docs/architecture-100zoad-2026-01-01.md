# 시스템 아키텍처 문서: 100zoad

**날짜:** 2026-01-01
**작성자:** merge (System Architect)
**버전:** 1.0
**프로젝트 유형:** web-app
**프로젝트 레벨:** 3 (Complex - 12-40 stories)
**상태:** Draft

---

## 문서 개요

이 문서는 100zoad 웹 컴포넌트 시스템의 소프트웨어 아키텍처를 정의합니다. PRD의 모든 기능/비기능 요구사항을 충족하는 시스템 설계를 제공하며, Phase 4 (Sprint Planning) 이전에 승인되어야 합니다.

**관련 문서:**
- 제품 브리프: `docs/product-brief-100zoad-2026-01-01.md`
- PRD: `docs/prd-100zoad-2026-01-01.md`

---

## 요약 (Executive Summary)

### 프로젝트 목표

부동산 분양 홍보 랜딩페이지를 위한 **규격화된 웹 컴포넌트 시스템**을 개발합니다. Cloudflare Pages와 Shadow DOM을 활용하여 아임웹 기반 웹디자인 및 개발 시간을 대폭 단축하고, 코드 지식이 없는 팀원(오너)도 안전하게 스타일과 문구를 수정할 수 있도록 합니다.

### 핵심 아키텍처 결정

1. **Component-Based Micro-Frontend Architecture**
   - 5개 독립 웹 컴포넌트 (헤더, 푸터, 입력폼, 퀵메뉴, 모바일 내비게이터)
   - Shadow DOM 스타일 격리
   - Config-driven 설계 (main.html 중앙 집중식 설정)

2. **서버리스 아키텍처**
   - Cloudflare Pages: 컴포넌트 호스팅 및 CDN
   - Cloudflare Workers: Airtable API 프록시 (API 키 보호)
   - Airtable: 리드 데이터 저장

3. **경량 기술 스택**
   - Vanilla JavaScript (프레임워크 없음) → 번들 크기 최소화
   - ES2020+ Custom Elements + Shadow DOM
   - Vite 빌드 도구

### 아키텍처 드라이버 (Top 3 NFR)

| 우선순위 | NFR | 아키텍처적 영향 | 충족 전략 |
|----------|-----|-----------------|-----------|
| **1** | NFR-008<br>비개발자 친화성 | - Config-driven 설계 필수<br>- 직관적 Config 구조<br>- 명확한 오류 메시지 | - Window.CONFIG 전역 객체<br>- 한글 주석<br>- Config 검증 및 가이드 문서 |
| **2** | NFR-001<br>성능 (3초 로딩) | - 경량 기술 스택<br>- CDN 최적화<br>- 코드 분할 | - Vanilla JS (30-50KB)<br>- Cloudflare CDN (300+ PoP)<br>- 병렬 로딩 |
| **3** | NFR-006<br>Graceful Degradation | - Fallback Layer 필수<br>- 컴포넌트별 독립성<br>- 핵심 기능 보장 | - 3초 타임아웃 + 폴백 HTML<br>- 컴포넌트별 실패 처리<br>- 입력폼/전화 항상 작동 |

---

## 1. 고수준 아키텍처

### 1.1 아키텍처 패턴

**선택한 패턴:** Component-Based Micro-Frontend Architecture

**근거:**
- 5개 독립 웹 컴포넌트가 각각 독립적으로 로드, 렌더링, 실패 처리
- Shadow DOM으로 완전한 스타일/DOM 격리
- 단일 Config 객체로 모든 컴포넌트 제어
- NFR-006 (Graceful Degradation) 충족을 위해 부분 실패 허용

### 1.2 시스템 컴포넌트 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                      아임웹 랜딩페이지                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  main.html (Config Layer)                 │  │
│  │  - Window.CONFIG 전역 객체                                │  │
│  │  - 5개 컴포넌트 설정 (header, footer, form, quick, nav)   │  │
│  │  - Airtable/GTM 연동 설정                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Web Components (Cloudflare Pages CDN)             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │  │
│  │  │ Header   │  │ Footer   │  │  Form    │  (Shadow DOM)  │  │
│  │  │Component │  │Component │  │Component │                │  │
│  │  └──────────┘  └──────────┘  └──────────┘                │  │
│  │  ┌──────────┐  ┌──────────┐                              │  │
│  │  │QuickMenu │  │ Mobile   │  (Shadow DOM)                │  │
│  │  │Component │  │Navigator │                              │  │
│  │  └──────────┘  └──────────┘                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Integration Layer                            │  │
│  │  - Airtable API (Cloudflare Worker 경유)                 │  │
│  │  - GTM/GA4 dataLayer                                      │  │
│  │  - 구글애즈 전환 추적                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                Fallback Layer                             │  │
│  │  - 입력폼 폴백 (아임웹 내장 HTML form)                     │  │
│  │  - 헤더 폴백 (로고 + 전화번호)                            │  │
│  │  - 컴포넌트별 타임아웃 (3초)                              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 레이어:**

1. **Config Layer** (main.html)
   - 역할: 중앙 집중식 설정 관리
   - 구현: Window.CONFIG 객체
   - 비개발자 수정: 주석 가이드 + 명확한 키 이름

2. **Web Components Layer**
   - 역할: 5개 독립 컴포넌트 렌더링
   - 구현: Custom Elements + Shadow DOM
   - 격리: 아임웹 스타일과 완전 분리

3. **Integration Layer**
   - 역할: 외부 서비스 연동 (Airtable, GTM/GA4)
   - 구현: 이벤트 기반 통신

4. **Fallback Layer**
   - 역할: Graceful Degradation (NFR-006)
   - 구현: 컴포넌트별 타임아웃 + 폴백 HTML

### 1.3 데이터 흐름

**Flow 1: 페이지 초기 로딩**

```
1. 아임웹 페이지 로드
   ↓
2. main.html config 파싱 (Window.CONFIG)
   ↓
3. Cloudflare Pages에서 컴포넌트 스크립트 로드 (병렬)
   ↓
4. 각 컴포넌트 customElements.define() 등록
   ↓
5. 컴포넌트 렌더링 (config 읽기)
   ↓
6. Shadow DOM 생성 및 스타일 적용
   ↓
7. 이벤트 리스너 등록 (클릭, 제출 등)
```

**Flow 2: 입력폼 제출**

```
1. 사용자 입력 → 필드 검증 (클라이언트)
   ↓
2. 필수 동의 체크박스 확인
   ↓
3. 데이터 수집 (이름, 전화번호, 선택 필드)
   ↓
4. Cloudflare Worker (서버리스 함수) 호출
   ↓ (API 키 안전)
5. Airtable API POST 요청
   ↓
6. 성공 → 성공 메시지 팝업 + 폼 초기화
   ↓
7. GTM/GA4 전환 이벤트 송출 (form_submit)
   ↓
8. 향상된 전환: 이름/전화 해시화 → 구글애즈
```

**Flow 3: 컴포넌트 로딩 실패 (Graceful Degradation)**

```
1. 컴포넌트 스크립트 로드 시도
   ↓
2. 타임아웃 3초 경과 OR 네트워크 오류
   ↓
3. 컴포넌트별 폴백 전략:
   - 입력폼 → 아임웹 내장 HTML form 표시
   - 헤더 → 로고 + 전화번호만 표시
   - 퀵메뉴/내비게이터 → 숨김 처리
   ↓
4. 콘솔 로그 기록 (디버깅용)
   ↓
5. 핵심 기능 (리드 수집, 전화걸기) 유지
```

---

## 2. 기술 스택

| 레이어 | 기술 | 버전/플랜 | 선택 근거 |
|--------|------|-----------|-----------|
| **Frontend** |
| 컴포넌트 프레임워크 | Vanilla JavaScript + Web Components | ES2020+ | - 프레임워크 오버헤드 없음 (NFR-001 성능)<br>- Shadow DOM 네이티브 지원<br>- 번들 크기 최소화<br>- 모든 브라우저 지원 (FR-026) |
| 스타일링 | CSS3 (Shadow DOM 내부) | - | - 아임웹 스타일 격리 (FR-021)<br>- 컴포넌트별 독립 스타일 |
| 빌드 도구 | Vite | 5.x | - 빠른 개발 서버 (HMR)<br>- ES Modules 네이티브 지원<br>- 프로덕션 빌드 최적화<br>- Cloudflare Pages 호환 |
| **Hosting & CDN** |
| 호스팅 | Cloudflare Pages | 무료 플랜 | - 무제한 요청/대역폭<br>- 글로벌 CDN (성능)<br>- HTTPS 자동 (NFR-003)<br>- 빌드 500회/월 (충분) |
| 서버리스 함수 | Cloudflare Workers | 무료 플랜 | - Airtable API 키 보호 (NFR-004)<br>- 100,000 req/일 (충분)<br>- 에지 컴퓨팅 (빠른 응답) |
| **Backend & Data** |
| 데이터베이스 | Airtable | Team 플랜 | - 100,000 automation/월<br>- 50 req/s<br>- 월 1,000 리드 처리 충분 (2% 사용률)<br>- API 간편 |
| 자동화 | Make.com | 사용자 플랜 | - 리드 전송 워크플로우<br>- Airtable → 외부 시스템 연동 |
| **Analytics & Marketing** |
| 태그 관리 | Google Tag Manager | 무료 | - 이벤트 태그 관리<br>- dataLayer 지원 |
| 분석 | Google Analytics 4 | 무료 | - 월 1,000만 이벤트<br>- 전환 데이터 수집 |
| 광고 추적 | Google Ads | 광고비 기반 | - 향상된 전환 추적<br>- 이름/전화 해시화 |
| **Platform** |
| 랜딩페이지 플랫폼 | 아임웹 | 프로 플랜 | - 코드위젯 지원<br>- 섹션 구조<br>- 게시판 (이미지 호스팅) |

**핵심 기술 선택 논리:**

1. **Vanilla JavaScript (프레임워크 없음)**
   - NFR-001 (3초 로딩) 충족 위해 번들 크기 최소화 필수
   - React/Vue/Svelte는 프레임워크 오버헤드 20-50KB 추가
   - Web Components는 브라우저 네이티브 API (0KB 오버헤드)

2. **Cloudflare Workers (서버리스 함수)**
   - NFR-004 (API 키 보안) 충족
   - 클라이언트 사이드에서 Airtable API 직접 호출 시 API 키 노출 위험
   - Workers는 config에 API 키 노출하지 않고 안전하게 전송 가능

3. **Shadow DOM**
   - FR-021 (아임웹 스타일 격리) 필수
   - 아임웹 기본 CSS가 컴포넌트에 영향 주지 않음
   - 컴포넌트 스타일이 아임웹 페이지에 영향 주지 않음

---

## 3. 시스템 컴포넌트 상세 설계

### 3.1 Header Component

**책임:**
- PC: 최대 6개 메뉴 항목 표시
- 모바일: 햄버거 메뉴 표시
- "관심고객등록" 특수 메뉴 처리 (CSS 애니메이션 + 입력폼 이동)
- 원페이지/멀티페이지 네비게이션 처리

**Config 인터페이스:**
```javascript
Window.CONFIG = {
  header: {
    logo: {
      url: "https://...",  // 512x512px PNG
      alt: "현장명"
    },
    pageType: "onepage",  // "onepage" | "multipage"
    menu: [
      { text: "메뉴1", target: "#section1" },  // 최대 6개
      // ...
    ],
    specialMenu: {
      text: "관심고객등록",
      animation: "pulse",  // "pulse" | "glow" | "bounce"
      target: "#form-section"
    },
    mobile: {
      breakpoint: 768,  // px
      hamburgerPosition: "right"
    },
    styles: {
      bgColor: "#ffffff",
      textColor: "#333333",
      hoverColor: "#007bff"
    }
  }
}
```

**FR 매핑:** FR-001, FR-002, FR-003, FR-004, FR-005

---

### 3.2 Footer Component

**책임:**
- 2단 레이아웃: 현장정보 + 대행사정보
- 법적 정보 링크 (이용약관, 개인정보처리방침)
- 반응형: PC 가로, 모바일 세로

**Config 인터페이스:**
```javascript
Window.CONFIG = {
  footer: {
    line1: {
      siteName: "현장명",
      phone: "010-1234-5678"
    },
    line2: {
      company: "대행사 회사명",
      ceo: "대표자",
      phone: "02-1234-5678",
      businessNumber: "123-45-67890"
    },
    legal: {
      termsUrl: "https://...",
      privacyUrl: "https://...",
      openIn: "popup"  // "popup" | "newTab"
    },
    styles: {
      bgColor: "#f8f9fa",
      textColor: "#666666"
    }
  }
}
```

**FR 매핑:** FR-006, FR-007, FR-008

---

### 3.3 Form Component

**책임:**
- 필수 필드 (이름, 전화번호) + 동적 선택 필드
- 전화번호 실시간 하이픈 삽입
- 이용약관/개인정보처리방침 동의 체크박스
- Airtable 전송 (Cloudflare Worker 경유)
- 팝업/섹션 두 가지 표시 방식

**Config 인터페이스:**
```javascript
Window.CONFIG = {
  form: {
    displayMode: "both",  // "popup" | "section" | "both"
    fields: {
      name: { label: "이름", placeholder: "홍길동", required: true },
      phone: { label: "전화번호", placeholder: "010-0000-0000", required: true },
      additional: [
        {
          type: "text",
          name: "address",
          label: "주소",
          required: false
        },
        {
          type: "dropdown",
          name: "visitTime",
          label: "방문 희망 시간",
          options: ["오전", "오후", "저녁"],
          required: true
        },
        {
          type: "datetime",
          name: "visitDate",
          label: "방문 희망 날짜",
          required: false
        }
      ]
    },
    legal: {
      termsText: "이용약관 전문...",
      privacyText: "개인정보처리방침 전문..."
    },
    messages: {
      success: "신청이 완료되었습니다.",
      error: "제출 중 오류가 발생했습니다."
    },
    airtable: {
      workerUrl: "https://worker.your-domain.workers.dev/submit"
    }
  }
}
```

**내부 메서드:**
- `formatPhone(event)`: 전화번호 실시간 하이픈 삽입
- `validateForm()`: 필수 필드 + 전화번호 형식 검증
- `handleSubmit()`: Cloudflare Worker 호출 → Airtable 전송
- `trackConversion()`: GTM/GA4 form_submit 이벤트 + 향상된 전환 (해시화)

**FR 매핑:** FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-024

---

### 3.4 QuickMenu Component (PC)

**책임:**
- PC 화면 우측 중앙에 최대 4개 버튼 고정
- 입력폼 팝업, 전화걸기, URL 이동 액션
- GTM/GA4 클릭 이벤트 추적

**Config 인터페이스:**
```javascript
Window.CONFIG = {
  quickMenu: {
    enabled: true,
    position: {
      right: "30px",
      top: "50%"
    },
    buttons: [
      {
        text: "입력폼",
        icon: "📝",
        action: "openForm",  // "openForm" | "call" | "link"
        color: "#007bff"
      },
      {
        text: "전화걸기",
        icon: "📞",
        action: "call",
        phone: "010-1234-5678",
        color: "#28a745"
      }
      // 최대 4개
    ]
  }
}
```

**FR 매핑:** FR-015, FR-016

---

### 3.5 MobileNavigator Component

**책임:**
- 모바일 화면 최하단에 최대 3개 버튼 고정
- QuickMenu와 동일한 액션 (입력폼, 전화, URL)

**Config 인터페이스:**
```javascript
Window.CONFIG = {
  mobileNav: {
    enabled: true,
    buttons: [
      {
        text: "상담신청",
        icon: "📝",
        action: "openForm",
        color: "#007bff"
      },
      {
        text: "전화",
        icon: "📞",
        action: "call",
        phone: "010-1234-5678",
        color: "#28a745"
      }
      // 최대 3개
    ]
  }
}
```

**FR 매핑:** FR-017, FR-018

---

## 4. 데이터 아키텍처

### 4.1 Airtable 데이터 모델

**테이블: Leads (리드 정보)**

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `id` | Auto Number | ✓ | Airtable 자동 생성 |
| `이름` | Single Line Text | ✓ | 신청자 이름 |
| `전화번호` | Phone Number | ✓ | 하이픈 포함 형식 (010-1234-5678) |
| `현장명` | Single Line Text | ✓ | 어느 랜딩페이지에서 왔는지 |
| `제출시간` | Date & Time | ✓ | 자동 타임스탬프 |
| `주소` | Long Text | - | 선택 필드 (동적) |
| `방문희망시간` | Single Select | - | 드롭다운 선택 ("오전", "오후", "저녁") |
| `방문희망날짜` | Date | - | 날짜 선택 |
| `방문희망시각` | Single Line Text | - | 시간 선택 |
| `유입경로` | Single Line Text | ✓ | UTM 파라미터 기반 ("google-ads", "naver-sa") |
| `페이지URL` | URL | ✓ | 신청한 페이지 |
| `처리상태` | Single Select | ✓ | "신규", "연락중", "상담완료", "전환실패" |
| `상담사메모` | Long Text | - | 상담사가 직접 작성 |

**데이터 보존:**
- 보존 기간: 3년 (법적 요구사항)
- 백업: Airtable 자동 백업 + 월 1회 CSV 수동 백업

---

### 4.2 Config 데이터 구조

**Window.CONFIG 스키마:** (상세 내용은 `docs/CONFIG-SCHEMA.md` 참조)

```javascript
Window.CONFIG = {
  meta: { siteName, version, lastUpdated },
  header: { logo, pageType, menu, specialMenu, mobile, styles },
  footer: { line1, line2, legal, styles },
  form: { displayMode, fields, legal, messages, airtable, styles },
  quickMenu: { enabled, position, buttons, styles },
  mobileNav: { enabled, buttons, styles },
  responsive: { breakpoint },
  analytics: { gtm, ga4, googleAds, events },
  fallback: { enabled, timeout, components }
}
```

---

## 5. API 아키텍처

### 5.1 Cloudflare Worker API

**엔드포인트: `/submit` (입력폼 제출)**

**요청:**
```http
POST https://lead-submit.your-project.workers.dev/submit
Content-Type: application/json

{
  "이름": "홍길동",
  "전화번호": "010-1234-5678",
  "현장명": "강남아파트",
  "주소": "서울시 강남구...",
  "방문희망시간": "오전",
  "페이지URL": "https://your-site.imweb.me/page1",
  "유입경로": "google-ads"
}
```

**응답 (성공):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "recordId": "recXXXXXXXXXXXXXX",
  "message": "신청이 완료되었습니다"
}
```

**Worker 구현:**
- Origin 검증 (아임웹 도메인만 허용)
- IP 기반 Rate Limiting (1분에 3회)
- 데이터 검증 (필수 필드, 전화번호 형식, 스팸 필터)
- Airtable API 호출 (API 키는 Worker 환경변수에 안전 저장)

**보안:**
- API 키: Cloudflare Worker 환경변수에만 저장 (NFR-004)
- HTTPS 전용 (NFR-003)
- CORS 제한 (특정 도메인만 허용)

---

### 5.2 GTM/GA4/Google Ads 이벤트 API

**GTM dataLayer Push (클라이언트 사이드):**

```javascript
// 입력폼 제출 성공 시
window.dataLayer.push({
  event: 'form_submit',
  event_category: 'conversion',
  enhanced_conversion_data: {
    phone_number_sha256: sha256Hash(phone)
  }
});

// 전화걸기 클릭 시
window.dataLayer.push({
  event: 'call_click',
  event_category: 'conversion',
  phone_number: '1588-1234'
});
```

**향상된 전환 추적 (Enhanced Conversions):**
```javascript
// SHA-256 해시 함수
async function sha256Hash(message) {
  const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 이름/전화 해시화
const phoneHash = await sha256Hash('821012345678');  // +82 + 하이픈 제거

gtag('set', 'user_data', {
  phone_number_sha256: phoneHash
});
```

---

## 6. NFR 커버리지

### NFR-001: 초기 로딩 시간 (3초 이내)

**목표:** 모든 컴포넌트 초기 로딩 완료 3초 이내

**아키텍처 충족 전략:**
- **경량 기술 스택**: Vanilla JS (프레임워크 없음), 총 번들 30-50KB
- **Cloudflare CDN**: 전 세계 300+ PoP, 에지 캐싱, Brotli 압축
- **병렬 로딩**: 5개 컴포넌트 스크립트 병렬 로드 (HTTP/2)
- **코드 분할**: 컴포넌트별 독립 파일
- **Lazy Loading**: 입력폼 팝업은 클릭 시 로딩

**예상 로딩 시간:** 1,100ms (< 3초) ✓

---

### NFR-002: 런타임 성능

**목표:** 버튼 클릭 100ms, 입력폼 제출 2초, 스크롤 60fps

**아키텍처 충족 전략:**
- **버튼 클릭**: 이벤트 위임 (Shadow DOM 내부), 동기 처리 → 10-30ms
- **입력폼 제출**: Cloudflare Worker 50-100ms + Airtable API 200-500ms → 300-600ms
- **스크롤 애니메이션**: CSS `scroll-behavior: smooth`, GPU 가속 → 60fps 유지

---

### NFR-003: 데이터 전송 암호화 (HTTPS)

**목표:** 모든 개인정보 전송 HTTPS 암호화

**아키텍처 충족:**
- **브라우저 → Cloudflare Pages**: Cloudflare 자동 SSL/TLS, HTTP → HTTPS 리다이렉트
- **브라우저 → Cloudflare Worker**: Workers 기본 HTTPS 지원, TLS 1.3
- **Cloudflare Worker → Airtable**: Airtable API는 HTTPS 전용, TLS 1.2+
- **Mixed Content 방지**: Config에서 모든 URL 검증 (http:// 발견 시 경고)

---

### NFR-004: API 키 보안

**목표:** API 키 노출 금지

**아키텍처 충족:**
- **Airtable API Key**: Cloudflare Worker 환경변수에만 저장, 클라이언트 코드에 절대 노출 안 함
- **클라이언트 측 Config**: API 키 없이 Worker URL만 포함
- **Worker 환경변수**: Cloudflare Dashboard에서 설정, `.env` 파일 .gitignore

---

### NFR-005: 개인정보 처리 규정 준수

**목표:** 개인정보보호법 준수

**아키텍처 충족:**
- **명시적 동의**: 이용약관/개인정보처리방침 체크박스 (필수), 체크 없이 제출 불가
- **수집 목적/항목/보유기간 명시**: Config의 `legal.privacyText`에 명시
- **접근 제어**: Airtable IP 화이트리스트 권장, Worker Origin 검증
- **향상된 전환 추적**: 이름/전화번호 SHA-256 해시화, 원본 데이터는 Google에 전송 안 됨

---

### NFR-006: Graceful Degradation (컴포넌트 로딩 실패 시 폴백)

**목표:** Cloudflare Pages 장애 시에도 핵심 기능 유지

**아키텍처 충족:**
- **컴포넌트별 타임아웃**: 3초 경과 시 폴백 전략 실행
- **폴백 HTML**: 아임웹 페이지에 미리 삽입 (헤더 폴백: 로고 + 전화번호, 입력폼 폴백: HTML form)
- **핵심 기능 보장**: 리드 수집 (폴백 HTML form → Airtable Webhook), 전화 상담 (폴백 헤더의 tel: 링크)

---

### NFR-007: 입력폼 제출 오류 처리

**목표:** 명확한 오류 메시지 + 재제출 가능

**아키텍처 충족:**
- **클라이언트 검증**: 즉시 필드별 오류 메시지 표시
- **서버 검증 실패 (400)**: 서버 오류 메시지 표시, 재제출 버튼 제공
- **Rate Limiting (429)**: "1분 후 다시 시도" 메시지
- **서버 오류 (5xx)**: "일시적 오류" 메시지, "다시 제출" 버튼
- **네트워크 오류**: "인터넷 연결 확인" 메시지
- **입력 데이터 유지**: 모든 오류 시나리오에서 사용자 입력 보존

---

### NFR-008: 비개발자 Config 수정 가능성

**목표:** 코드 지식 없는 오너가 Config 수정 가능

**아키텍처 충족:**
- **직관적 Config 구조**: 명확한 키 이름, 계층 구조
- **한글 주석**: 모든 config 항목에 설명 주석, 예시 값 포함
- **Config 검증**: 오류 시 명확한 오류 메시지 (어떤 항목이 잘못되었는지)
- **오너 교육 가이드**: `docs/CONFIG-GUIDE.md` 제공
- **Config 템플릿**: 5개 현장별 템플릿 (복사-붙여넣기만으로 시작)

---

### NFR-009: 코드 품질 및 문서화

**목표:** 읽기 쉽고 유지보수 가능한 코드 + 충분한 문서화

**아키텍처 충족:**
- **JSDoc 주석**: 모든 함수/클래스에 JSDoc, `@param`, `@returns`, `@example` 포함
- **컴포넌트별 README**: `components/*/README.md` (5개)
- **Config 스키마 문서**: `docs/CONFIG-SCHEMA.md`
- **배포 가이드**: `docs/DEPLOYMENT.md`
- **이벤트 추적 명세서**: `docs/ANALYTICS-SPEC.md`
- **코드 린팅**: ESLint + Prettier

---

### NFR-010: 아임웹 코드위젯 호환성

**목표:** 아임웹 환경에서 정상 작동

**아키텍처 충족:**
- **JavaScript 실행**: ES2020+ 문법, `<script type="module">` 지원
- **Shadow DOM 격리**: 모든 컴포넌트 Shadow DOM 사용, 아임웹 CSS 완전 격리
- **섹션 ID 기반 스크롤**: `document.querySelector(config.target)` 사용, 아임웹 섹션 ID 형식 지원
- **게시판 이미지 URL**: 아임웹 게시판 업로드 URL 형식 지원 (`https://cdn.imweb.me/...`)
- **페이지 네비게이션**: 멀티페이지 상대/절대 URL 지원

---

## 7. 개발 및 배포 전략

### 7.1 개발 워크플로우

**Day 1: MVP 개발 (2026-01-01, 총 10시간)**

| 시간 | 작업 | 결과물 |
|------|------|--------|
| 09:00-10:00 (1h) | 프로젝트 초기 설정 | Git 저장소, Vite 프로젝트, Cloudflare Pages 생성 |
| 10:00-12:00 (2h) | Config 시스템 개발 | Window.CONFIG 스키마, 검증 로직, 템플릿 3개 |
| 13:00-15:00 (2h) | Header Component 개발 | Custom Element, Shadow DOM, PC/모바일 반응형 |
| 15:00-17:00 (2h) | Form Component 개발 | 필수/선택 필드, 하이픈 삽입, 동의 체크박스, 검증 |
| 17:00-18:00 (1h) | Cloudflare Worker 개발 | /submit 엔드포인트, Airtable 연동, Rate Limiting |
| 18:00-19:00 (1h) | QuickMenu + MobileNav 개발 | 버튼 렌더링, 액션 처리, 반응형 전환 |
| 19:00-20:00 (1h) | 통합 테스트 및 배포 | 아임웹 통합, Cloudflare 배포, 실제 환경 테스트 |

**Day 2-4: 안정화 (2026-01-02 ~ 2026-01-04)**

- **Day 2**: GTM/GA4/구글애즈 이벤트 통합, 성능 최적화, Footer Component
- **Day 3**: Graceful Degradation 폴백, 오류 처리 강화, 크로스 브라우저 테스트
- **Day 4**: 문서화, 오너 교육, 실제 랜딩페이지 3개 테스트, 버그 수정

---

### 7.2 배포 전략

**Cloudflare Pages 배포:**
- GitHub Actions 자동 배포 (`main` 브랜치 푸시 시)
- Vite 빌드 → `dist/` 폴더 배포
- 배포 URL: `https://100zoad-components.pages.dev/header.js` (5개 컴포넌트)

**Cloudflare Worker 배포:**
- Wrangler CLI 사용: `npx wrangler deploy`
- 환경변수: AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID
- 배포 URL: `https://lead-submit.your-project.workers.dev/submit`

**아임웹 통합:**
- main.html (Config + 컴포넌트 로드) → 아임웹 코드위젯 상단 삽입
- `<custom-header>`, `<custom-form>` 등 → 아임웹 페이지 본문에 삽입

---

## 8. 요구사항 추적성 매트릭스

### 8.1 Functional Requirements (FR) 커버리지

| FR ID | 요구사항 | 아키텍처 컴포넌트 |
|-------|----------|-------------------|
| FR-001~FR-005 | 헤더 컴포넌트 | Header Component |
| FR-006~FR-008 | 푸터 컴포넌트 | Footer Component |
| FR-009~FR-014, FR-024 | 입력폼 및 리드 관리 | Form Component + Cloudflare Worker |
| FR-015~FR-018 | 퀵메뉴 및 내비게이터 | QuickMenu + MobileNavigator |
| FR-019~FR-021 | Config 시스템 | Config Layer + All Components |
| FR-022~FR-023 | 이벤트 추적 | Integration Layer (GTM/GA4) |
| FR-025~FR-026 | 반응형 & 호환성 | All Components (반응형 로직) |

**FR 커버리지: 26/26 (100%)**

---

### 8.2 Non-Functional Requirements (NFR) 커버리지

| NFR ID | 요구사항 | 아키텍처 레이어/전략 |
|--------|----------|----------------------|
| NFR-001 | 초기 로딩 3초 이내 | Tech Stack (Vanilla JS), Cloudflare CDN, 병렬 로딩 |
| NFR-002 | 런타임 성능 | Components 이벤트 최적화, CSS GPU 가속 |
| NFR-003 | HTTPS 암호화 | Cloudflare Pages SSL, Worker HTTPS, Airtable HTTPS |
| NFR-004 | API 키 보안 | Cloudflare Worker 환경변수, Origin 검증 |
| NFR-005 | 개인정보 규정 준수 | Form Component 동의 체크박스, Worker 검증, 해시화 |
| NFR-006 | Graceful Degradation | Fallback Layer, 컴포넌트별 타임아웃, 폴백 HTML |
| NFR-007 | 오류 처리 | Form Component `handleSubmit()`, Worker 검증 |
| NFR-008 | 비개발자 친화성 | Config Layer 설계, 한글 주석, CONFIG-GUIDE.md |
| NFR-009 | 코드 품질 & 문서화 | JSDoc, 컴포넌트별 README, Config 스키마 문서 |
| NFR-010 | 아임웹 호환성 | Shadow DOM 격리, 섹션 ID 스크롤, 코드위젯 테스트 |

**NFR 커버리지: 10/10 (100%)**

---

### 8.3 Epic → 아키텍처 컴포넌트 매핑

| Epic ID | Epic Name | 아키텍처 컴포넌트 |
|---------|-----------|-------------------|
| EPIC-001 | 헤더 컴포넌트 | Header Component |
| EPIC-002 | 푸터 컴포넌트 | Footer Component |
| EPIC-003 | 입력폼 및 리드 관리 | Form Component + Cloudflare Worker |
| EPIC-004 | 퀵메뉴 및 내비게이터 | QuickMenu + MobileNavigator |
| EPIC-005 | Config 시스템 | Config Layer + All Components |
| EPIC-006 | 이벤트 추적 | Integration Layer (GTM/GA4) |
| EPIC-007 | 반응형 & 호환성 | All Components (반응형 로직) |
| EPIC-008 | 성능, 보안, 안정성 | Tech Stack, Fallback Layer, API Architecture |

**Epic 커버리지: 8/8 (100%)**

---

## 9. 미해결 질문 해결 현황

| 질문 | 아키텍처 결정 | 추가 액션 필요 |
|------|---------------|----------------|
| **1. 아임웹 프로 플랜 트래픽 제한** | 현재 아키텍처는 트래픽 무관 (컴포넌트는 Cloudflare Pages 호스팅) | ✓ 아임웹 고객센터 문의 필요 (Phase 4 이전) |
| **2. Cloudflare Pages 프로젝트 구조** | **단일 프로젝트 권장** (하나의 저장소, 배포 1회로 모든 클라이언트 업데이트) | ✗ 아키텍처에서 결정 완료 |
| **3. Airtable API 호출 방식** | **서버리스 함수 경유 권장** (Cloudflare Worker, API 키 보호) | ✗ 아키텍처에서 결정 완료 |

---

## 10. 리스크 및 완화 전략

| 리스크 | 가능성 | 영향 | 완화 전략 |
|--------|--------|------|-----------|
| **Cloudflare Pages 일시 장애** | 낮음 | 높음 | - NFR-006 Graceful Degradation 구현<br>- 폴백 HTML로 핵심 기능 유지<br>- 모니터링: Cloudflare Analytics |
| **Airtable API Rate Limit 초과** | 낮음 | 중간 | - Team 플랜: 50 req/s (충분)<br>- Worker에서 Exponential backoff retry<br>- 일 1,000 리드는 0.01 req/s (2% 사용률) |
| **아임웹 트래픽 제한 초과** | 중간 | 높음 | - 아임웹 고객센터 사전 문의<br>- 트래픽 모니터링<br>- 필요 시 플랜 업그레이드 |
| **GTM/GA4 이벤트 누락** | 낮음 | 중간 | - GTM Preview 모드로 테스트<br>- dataLayer 검증<br>- 이벤트 로그 콘솔 출력 (개발 환경) |
| **Config 설정 오류 (오너 실수)** | 중간 | 낮음 | - Config 검증 로직 + 명확한 오류 메시지<br>- CONFIG-GUIDE.md 교육 문서<br>- 템플릿 제공 (복사-붙여넣기) |

---

## 11. 성능 예산 (Performance Budget)

| 메트릭 | 목표 | 실제 예상 | 측정 방법 |
|--------|------|-----------|-----------|
| **초기 로딩 시간** | < 3초 | ~1.1초 | Lighthouse Performance |
| **총 번들 크기** | < 100KB | 30-50KB | Vite 빌드 결과 |
| **버튼 클릭 반응** | < 100ms | 10-30ms | Chrome DevTools Performance |
| **입력폼 제출** | < 2초 | 300-600ms | Worker + Airtable API 응답 시간 |
| **스크롤 FPS** | 60fps | 60fps | Chrome DevTools Rendering |
| **Lighthouse 점수** | > 90 | 95 예상 | Lighthouse |

---

## 12. 보안 체크리스트

- [x] HTTPS 강제 적용 (Cloudflare Pages 자동)
- [x] API 키 환경변수 저장 (Worker)
- [x] Origin 검증 (아임웹 도메인만 허용)
- [x] Rate Limiting (IP 기반, 1분 3회)
- [x] 입력 검증 (클라이언트 + 서버)
- [x] 개인정보 동의 체크박스 필수
- [x] 향상된 전환 추적 해시화
- [ ] Airtable IP 화이트리스트 (권장, 선택)
- [ ] Cloudflare Turnstile CAPTCHA (향후 스팸 방지용, 선택)

---

## 13. 테스트 전략

| 테스트 유형 | 범위 | 도구 | 책임 |
|-------------|------|------|------|
| **단위 테스트** (선택) | 컴포넌트 메서드 (formatPhone, validateForm 등) | Vitest | 개발자 |
| **통합 테스트** (필수) | 컴포넌트 로딩, 입력폼 제출, GTM 이벤트 | Chrome DevTools, GTM Preview | 개발자 |
| **크로스 브라우저** (필수) | Chrome, Safari, Firefox, Edge | BrowserStack (선택) | 개발자 |
| **성능 테스트** (필수) | Lighthouse Performance > 90 | Lighthouse | 개발자 |
| **보안 테스트** (권장) | HTTPS, API 키 노출, CORS | Chrome DevTools Security | 개발자 |
| **사용자 수락 테스트** (필수) | 실제 랜딩페이지 3개 테스트 | 수동 테스트 | 오너 + 개발자 |

---

## 14. 다음 단계

### Phase 4: Sprint Planning (아키텍처 승인 후)

**명령어:** `/sprint-planning`

**목적:** 8개 Epic을 35-50개 상세 사용자 스토리로 세분화하고, Day 1 MVP 및 Day 2-4 안정화 스프린트를 계획합니다.

**다룰 내용:**
- Epic별 상세 스토리 작성
- 각 스토리에 수용 기준 정의
- 스토리 포인트 추정
- 스프린트 할당 (Day 1: EPIC-001~005, Day 2-4: EPIC-006~008)
- 우선순위 조정

---

## 15. 승인 및 사인오프

### 아키텍처 검토 체크리스트

- [ ] 모든 FR 요구사항 충족 확인 (26/26)
- [ ] 모든 NFR 요구사항 충족 확인 (10/10)
- [ ] 아키텍처 드라이버 우선순위 적절성 확인
- [ ] 기술 스택 선택 타당성 확인
- [ ] 보안 전략 충분성 확인
- [ ] 성능 목표 달성 가능성 확인
- [ ] Graceful Degradation 전략 적절성 확인
- [ ] 개발 일정 (Day 1 MVP, Day 2-4 안정화) 현실성 확인

### 승인 상태

- [ ] Product Owner (오너)
- [ ] Engineering Lead (개발자/디자이너 - 본인)
- [ ] System Architect (본인)

---

## 16. 부록

### A. 참고 문서

- PRD: `docs/prd-100zoad-2026-01-01.md`
- Product Brief: `docs/product-brief-100zoad-2026-01-01.md`
- Config 가이드: `docs/CONFIG-GUIDE.md` (Phase 4에서 작성 예정)
- Config 스키마: `docs/CONFIG-SCHEMA.md` (Phase 4에서 작성 예정)
- 배포 가이드: `docs/DEPLOYMENT.md` (Phase 4에서 작성 예정)

### B. 용어집

| 용어 | 정의 |
|------|------|
| **Shadow DOM** | 웹 컴포넌트 내부 스타일/DOM 격리를 위한 브라우저 네이티브 기술 |
| **Cloudflare Pages** | Cloudflare의 정적 사이트 호스팅 및 CDN 서비스 |
| **Cloudflare Workers** | Cloudflare의 서버리스 함수 (에지 컴퓨팅) |
| **Airtable** | 클라우드 기반 데이터베이스 (스프레드시트 + DB 하이브리드) |
| **GTM** | Google Tag Manager (태그 관리 도구) |
| **GA4** | Google Analytics 4 (웹 분석 도구) |
| **향상된 전환 추적** | 이름/전화번호 해시화하여 Google Ads에 전송, 전환 정확도 개선 |
| **Graceful Degradation** | 시스템 일부 실패 시에도 핵심 기능 유지하는 설계 철학 |
| **Config-driven** | 코드 수정 없이 Config 파일로 동작 제어하는 설계 패턴 |

---

**이 문서는 BMAD Method v6 - Phase 3 (Solutioning)을 사용하여 작성되었습니다.**

*계속하려면: `/workflow-status`를 실행하여 진행 상황과 다음 권장 워크플로우를 확인하세요.*
