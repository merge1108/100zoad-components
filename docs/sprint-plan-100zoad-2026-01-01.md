# 스프린트 계획: 100zoad

**날짜:** 2026-01-01
**Scrum Master:** merge (Claude Code 조력)
**프로젝트 레벨:** 3 (Complex - 12-40 stories)
**총 스토리:** 29개
**총 포인트:** 86 포인트
**계획 스프린트:** 4개 (Sprint 0-3)

---

## 요약 (Executive Summary)

100zoad 웹 컴포넌트 시스템을 **4일간 4개 스프린트**로 개발합니다. Sprint 0 (오늘)에는 최소 기능 MVP (리드 수집)을 구현하여 즉시 비즈니스 가치를 검증하고, 이후 3개 스프린트로 전체 시스템을 완성합니다.

**핵심 지표:**
- 총 스토리: 29개
- 총 포인트: 86 포인트
- 스프린트: 4개
- 팀 역량: 1명 (주니어) + Claude Code 조력 = 약 10pt/일
- 목표 완료: 2026-01-04 (4일차)

**스프린트별 분배:**
- Sprint 0 (오늘): 19pt - MVP (리드 수집 기능)
- Sprint 1 (내일): 22pt - UX 완성 (헤더, 푸터, 퀵메뉴, 내비게이터)
- Sprint 2 (2일차): 25pt - 기능 확장 (동적 필드, 이벤트 추적, 반응형)
- Sprint 3 (3일차): 20pt - 최적화 및 문서화

---

## 스토리 인벤토리

### EPIC-001: 헤더 컴포넌트 (14 포인트)

#### STORY-004: PC 헤더 메뉴 기본 구조
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 5

**User Story:**
사용자로서, PC 화면에서 로고와 최대 6개의 메뉴 항목을 볼 수 있어 페이지 내비게이션을 할 수 있습니다.

**Acceptance Criteria:**
- [ ] 로고 이미지 표시 (config.header.logo)
- [ ] 최대 6개 메뉴 항목 (config.header.menu)
- [ ] 스크롤 시 상단 고정 (position: fixed)
- [ ] Config로 색상, 폰트, 레이아웃 조정

**Technical Notes:**
- Custom Element: `<zoad-header>`
- FR-001 충족
- 파일: `src/components/header/header.js`

**Dependencies:** STORY-003

**Sprint:** Sprint 1

---

#### STORY-005: 헤더 "관심고객등록" 특수 메뉴
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 3

**User Story:**
마케터로서, 헤더 우측에 "관심고객등록" 메뉴를 눈에 띄게 표시하여 리드 전환을 유도하고 싶습니다.

**Acceptance Criteria:**
- [ ] 맨 오른쪽 메뉴로 고정
- [ ] CSS 애니메이션 (config로 타입 선택: pulse, shake, glow)
- [ ] 원페이지: 입력폼 섹션으로 부드러운 스크롤
- [ ] 멀티페이지: 입력폼 페이지로 이동
- [ ] Config로 타겟 섹션 ID/URL 설정

**Technical Notes:**
- FR-002, FR-003 충족
- Smooth scroll: `element.scrollIntoView({ behavior: 'smooth' })`

**Dependencies:** STORY-004

**Sprint:** Sprint 2

---

#### STORY-006: 모바일 햄버거 메뉴
**Epic:** EPIC-001 | **Priority:** Must Have | **Points:** 5

**User Story:**
모바일 사용자로서, 햄버거 메뉴를 통해 전체 메뉴를 펼쳐볼 수 있습니다.

**Acceptance Criteria:**
- [ ] 모바일 브레이크포인트(기본: 768px) 이하에서 햄버거 아이콘 표시
- [ ] 햄버거 클릭 시 사이드/전체 메뉴 펼침
- [ ] 펼친 메뉴 상단에 로고 표시
- [ ] 메뉴 항목 클릭 시 메뉴 자동 닫힘
- [ ] Config로 햄버거 위치, 메뉴 스타일 조정

**Technical Notes:**
- FR-004 충족
- 반응형 CSS: `@media (max-width: 768px)`

**Dependencies:** STORY-004

**Sprint:** Sprint 2

---

#### STORY-007: 파비콘 자동 설정
**Epic:** EPIC-001 | **Priority:** Should Have | **Points:** 1

**User Story:**
사용자로서, 브라우저 탭에 현장 로고가 파비콘으로 표시되어 브랜드를 인식할 수 있습니다.

**Acceptance Criteria:**
- [ ] Config의 로고 URL을 파비콘으로 자동 설정
- [ ] 512x512px PNG 지원
- [ ] 브라우저 탭에 파비콘 표시

**Technical Notes:**
- FR-005 충족
- JavaScript: `document.querySelector('link[rel="icon"]').href = logoUrl`

**Dependencies:** STORY-004

**Sprint:** Sprint 3

---

### EPIC-002: 푸터 컴포넌트 (4 포인트)

#### STORY-008: 푸터 2단 레이아웃
**Epic:** EPIC-002 | **Priority:** Must Have | **Points:** 3

**User Story:**
사용자로서, 푸터에서 현장정보와 대행사정보를 명확히 구분하여 볼 수 있습니다.

**Acceptance Criteria:**
- [ ] 1단: 현장명, 상담사 전화번호 (config에서 설정)
- [ ] 2단: 대행사 회사명, 대표자, 전화번호, 사업자번호
- [ ] Config로 모든 텍스트, 스타일 조정 가능
- [ ] PC: 2단 가로 레이아웃 / 모바일: 세로 스택

**Technical Notes:**
- Custom Element: `<zoad-footer>`
- FR-006, FR-008 충족
- 파일: `src/components/footer/footer.js`

**Dependencies:** STORY-003

**Sprint:** Sprint 1

---

#### STORY-009: 푸터 법적 정보 링크
**Epic:** EPIC-002 | **Priority:** Must Have | **Points:** 1

**User Story:**
사용자로서, 이용약관과 개인정보처리방침을 푸터에서 쉽게 찾아볼 수 있습니다.

**Acceptance Criteria:**
- [ ] 이용약관 링크 (config로 URL 설정)
- [ ] 개인정보처리방침 링크 (config로 URL 설정)
- [ ] 클릭 시 새 창 또는 팝업으로 열기 (config로 선택)

**Technical Notes:**
- FR-007 충족
- `target="_blank"` 또는 팝업 모달

**Dependencies:** STORY-008

**Sprint:** Sprint 2

---

### EPIC-003: 입력폼 및 리드 관리 (21 포인트)

#### STORY-010: 입력폼 필수 필드 (이름, 전화번호)
**Epic:** EPIC-003 | **Priority:** Must Have | **Points:** 3

**User Story:**
리드로서, 이름과 전화번호를 입력하여 관심 등록을 할 수 있습니다.

**Acceptance Criteria:**
- [ ] 이름 입력 필드 (텍스트)
- [ ] 전화번호 입력 필드 (기본 입력, 하이픈 자동 삽입은 STORY-011)
- [ ] 필수 필드 미입력 시 제출 불가
- [ ] 필드 라벨 및 플레이스홀더 config로 조정 가능

**Technical Notes:**
- Custom Element: `<zoad-form>`
- FR-009 충족
- 파일: `src/components/form/form.js`

**Dependencies:** STORY-003

**Sprint:** Sprint 0 ✓

---

#### STORY-011: 전화번호 실시간 하이픈 삽입
**Epic:** EPIC-003 | **Priority:** Must Have | **Points:** 2

**User Story:**
리드로서, 전화번호 입력 시 자동으로 하이픈이 삽입되어 읽기 쉬운 형식으로 볼 수 있습니다.

**Acceptance Criteria:**
- [ ] 입력 중 자동 하이픈 삽입 (예: 010-1234-5678)
- [ ] 숫자만 허용 (영문, 특수문자 입력 차단)
- [ ] 유효한 전화번호 형식 검증
- [ ] 잘못된 형식 시 오류 메시지 표시

**Technical Notes:**
- FR-011 충족
- JavaScript: `input.addEventListener('input', formatPhoneNumber)`

**Dependencies:** STORY-010

**Sprint:** Sprint 1

---

#### STORY-012: 선택 필드 동적 구성
**Epic:** EPIC-003 | **Priority:** Must Have | **Points:** 5

**User Story:**
마케터로서, Config에서 선택 필드를 추가/제거하여 현장별로 맞춤 입력폼을 만들고 싶습니다.

**Acceptance Criteria:**
- [ ] 지원 필드 타입: 텍스트, 전화번호, 드롭다운, 날짜+시간(세트)
- [ ] Config에서 필드 추가/제거
- [ ] 각 필드별 필수/선택 설정
- [ ] 드롭다운 옵션 config로 설정
- [ ] 날짜+시간은 하나의 세트로 표시

**Technical Notes:**
- FR-010 충족
- Config 예시:
  ```javascript
  fields: [
    { type: 'text', label: '방문인원', required: false },
    { type: 'dropdown', label: '관심평형', options: ['59㎡', '84㎡'], required: true },
    { type: 'datetime', label: '방문 희망 시간', required: false }
  ]
  ```

**Dependencies:** STORY-010

**Sprint:** Sprint 2

---

#### STORY-013: 법적 동의 체크박스
**Epic:** EPIC-003 | **Priority:** Must Have | **Points:** 2

**User Story:**
리드로서, 이용약관과 개인정보처리방침을 확인하고 동의하여 법적 요구사항을 충족할 수 있습니다.

**Acceptance Criteria:**
- [ ] 이용약관 동의 체크박스 (필수)
- [ ] 개인정보처리방침 동의 체크박스 (필수)
- [ ] 각 체크박스 옆에 "보기" 링크 → 클릭 시 팝업으로 전문 표시
- [ ] 체크하지 않으면 제출 불가
- [ ] 전문 내용은 config로 설정

**Technical Notes:**
- FR-012 충족
- NFR-005 (개인정보 처리 규정 준수)

**Dependencies:** STORY-010

**Sprint:** Sprint 1

---

#### STORY-014: Cloudflare Worker - Airtable API 프록시
**Epic:** EPIC-003 | **Priority:** Must Have | **Points:** 5

**User Story:**
개발자로서, API 키를 안전하게 보호하면서 Airtable에 리드를 전송하고 싶습니다.

**Acceptance Criteria:**
- [ ] Cloudflare Worker 함수 생성
- [ ] 입력폼 데이터를 JSON으로 수신
- [ ] Airtable API로 레코드 생성 (Base ID, Table ID, API Key 환경변수)
- [ ] HTTPS 암호화 전송
- [ ] 성공/실패 응답 반환
- [ ] CORS 헤더 설정

**Technical Notes:**
- FR-024, NFR-004 충족
- 파일: `workers/airtable-proxy.js`
- Cloudflare Workers 배포 필요

**Dependencies:** 없음 (병렬 작업 가능)

**Sprint:** Sprint 0 ✓

---

#### STORY-015: 입력폼 제출 및 성공 메시지
**Epic:** EPIC-003 | **Priority:** Must Have | **Points:** 3

**User Story:**
리드로서, 입력폼 제출 후 성공 메시지를 보고 등록이 완료되었음을 확인할 수 있습니다.

**Acceptance Criteria:**
- [ ] HTTP POST로 Cloudflare Worker에 데이터 전송
- [ ] 제출 성공 시 성공 메시지 팝업
- [ ] 제출 실패 시 오류 메시지 표시
- [ ] 성공 메시지 내용 config로 설정
- [ ] 팝업 확인 후 입력폼 초기화
- [ ] 제출 중 로딩 인디케이터 표시

**Technical Notes:**
- FR-013, NFR-007 충족
- Fetch API 사용

**Dependencies:** STORY-010, STORY-014

**Sprint:** Sprint 0 ✓

---

#### STORY-016: 입력폼 팝업 및 섹션 모드
**Epic:** EPIC-003 | **Priority:** Must Have | **Points:** 3

**User Story:**
사용자로서, 팝업 또는 섹션 형태로 입력폼을 접근하여 편리하게 등록할 수 있습니다.

**Acceptance Criteria:**
- [ ] 팝업 모드: 퀵메뉴/모바일 내비게이터 버튼 클릭 시 모달 팝업
- [ ] 섹션 모드: 아임웹 코드위젯에 배치, 헤더에서 스크롤/이동
- [ ] 두 모드 모두 동일한 필드 구성
- [ ] 팝업 닫기 버튼 제공
- [ ] Config로 팝업 스타일 조정

**Technical Notes:**
- FR-014 충족
- 팝업: `<dialog>` 또는 커스텀 모달

**Dependencies:** STORY-010

**Sprint:** Sprint 1

---

### EPIC-004: 퀵메뉴 및 모바일 내비게이터 (10 포인트)

#### STORY-017: PC 퀵메뉴 고정 버튼
**Epic:** EPIC-004 | **Priority:** Must Have | **Points:** 3

**User Story:**
PC 사용자로서, 화면 우측에 고정된 퀵메뉴 버튼을 통해 언제든지 입력폼이나 전화걸기를 할 수 있습니다.

**Acceptance Criteria:**
- [ ] 최대 4개 버튼 지원
- [ ] 위치: PC 화면 우측, 중앙에서 살짝 아래 (fixed position)
- [ ] 필수 버튼: 입력폼 팝업, 전화걸기
- [ ] Config로 버튼 개수, 문구, 아이콘, 색상, 액션 설정
- [ ] 스크롤 시에도 고정 위치 유지
- [ ] 모바일 화면에서는 숨김

**Technical Notes:**
- Custom Element: `<zoad-quickmenu>`
- FR-015 충족
- 파일: `src/components/quickmenu/quickmenu.js`

**Dependencies:** STORY-003

**Sprint:** Sprint 1

---

#### STORY-018: 퀵메뉴 버튼 액션 (입력폼, 전화, URL)
**Epic:** EPIC-004 | **Priority:** Must Have | **Points:** 2

**User Story:**
사용자로서, 퀵메뉴 버튼을 클릭하여 입력폼 팝업, 전화걸기, URL 이동 등의 행동을 할 수 있습니다.

**Acceptance Criteria:**
- [ ] 입력폼 팝업 버튼: 클릭 시 입력폼 모달 표시
- [ ] 전화걸기 버튼: 모바일 tel: 링크, PC 전화번호 표시/복사
- [ ] URL 이동 버튼: 지정된 URL로 이동 (새 창/현재 창 선택)
- [ ] Config로 각 버튼 액션 타입 및 파라미터 설정

**Technical Notes:**
- FR-016 충족
- 전화: `<a href="tel:010-1234-5678">`

**Dependencies:** STORY-017, STORY-016

**Sprint:** Sprint 2

---

#### STORY-019: 모바일 하단 내비게이터
**Epic:** EPIC-004 | **Priority:** Must Have | **Points:** 3

**User Story:**
모바일 사용자로서, 화면 하단에 고정된 내비게이터를 통해 입력폼과 전화걸기를 쉽게 할 수 있습니다.

**Acceptance Criteria:**
- [ ] 최대 3개 버튼 지원
- [ ] 위치: 모바일 화면 최하단 (fixed, bottom: 0)
- [ ] 필수 버튼: 입력폼 팝업, 전화걸기
- [ ] Config로 버튼 개수, 문구, 아이콘, 색상, 액션 설정
- [ ] PC 화면에서는 숨김

**Technical Notes:**
- Custom Element: `<zoad-mobile-nav>`
- FR-017 충족
- 파일: `src/components/mobile-nav/mobile-nav.js`

**Dependencies:** STORY-003

**Sprint:** Sprint 1

---

#### STORY-020: 모바일 내비게이터 버튼 액션
**Epic:** EPIC-004 | **Priority:** Must Have | **Points:** 2

**User Story:**
모바일 사용자로서, 내비게이터 버튼을 통해 퀵메뉴와 동일한 액션을 수행할 수 있습니다.

**Acceptance Criteria:**
- [ ] 입력폼 팝업, 전화걸기, URL 이동 액션 지원
- [ ] 전화걸기는 모바일에서 tel: 링크로 직접 전화 앱 실행
- [ ] Config로 각 버튼 액션 설정

**Technical Notes:**
- FR-018 충족
- STORY-018과 액션 로직 공유 가능

**Dependencies:** STORY-019, STORY-016

**Sprint:** Sprint 2

---

### EPIC-005: Config 시스템 (12 포인트)

#### STORY-001: Config 스키마 정의 및 파싱 시스템
**Epic:** EPIC-005 | **Priority:** Must Have | **Points:** 3

**User Story:**
개발자로서, 모든 컴포넌트가 읽을 수 있는 중앙 집중식 Config 구조를 정의하여 일관된 설정 관리를 하고 싶습니다.

**Acceptance Criteria:**
- [ ] Window.CONFIG 전역 객체 구조 정의
- [ ] 5개 컴포넌트 블럭 (header, footer, form, quickMenu, mobileNav)
- [ ] Config 검증 함수 구현 (필수 필드 체크)
- [ ] Config 오류 시 명확한 콘솔 메시지
- [ ] 기본값 fallback 로직

**Technical Notes:**
- JavaScript 객체로 정의 (JSON 호환)
- 각 블럭은 선택적 (없으면 해당 컴포넌트 비활성화)
- 파일: `src/core/config-parser.js`

**Dependencies:** 없음 (최우선 구현)

**Sprint:** Sprint 0 ✓

---

#### STORY-002: Shadow DOM 스타일 격리 시스템
**Epic:** EPIC-005 | **Priority:** Must Have | **Points:** 2

**User Story:**
개발자로서, 아임웹 기본 스타일과 충돌 없이 컴포넌트를 렌더링하여 예측 가능한 디자인을 보장하고 싶습니다.

**Acceptance Criteria:**
- [ ] 모든 웹 컴포넌트 Shadow DOM 사용
- [ ] 컴포넌트 내부 스타일이 외부에 영향받지 않음
- [ ] 외부 스타일이 컴포넌트에 영향 주지 않음
- [ ] Chrome, Firefox, Safari, Edge에서 검증

**Technical Notes:**
- `attachShadow({ mode: 'open' })`
- CSS-in-JS 또는 `<style>` 태그 삽입
- 파일: `src/core/base-component.js`

**Dependencies:** STORY-001

**Sprint:** Sprint 1

---

#### STORY-003: 베이스 웹 컴포넌트 클래스
**Epic:** EPIC-005 | **Priority:** Must Have | **Points:** 5

**User Story:**
개발자로서, 모든 컴포넌트가 상속받을 수 있는 베이스 클래스를 만들어 코드 중복을 줄이고 싶습니다.

**Acceptance Criteria:**
- [ ] BaseComponent 클래스 구현
- [ ] Config 로드 로직 공통화
- [ ] Shadow DOM 초기화 로직
- [ ] 컴포넌트별 커스텀 로직 hook 제공 (render, attachEvents)

**Technical Notes:**
- ES2020+ Custom Elements 사용
- `class BaseComponent extends HTMLElement`
- 파일: `src/core/base-component.js`

**Dependencies:** STORY-001, STORY-002

**Sprint:** Sprint 0 ✓

---

#### STORY-029: Config 예시 및 문서
**Epic:** EPIC-005 | **Priority:** Must Have | **Points:** 2

**User Story:**
오너로서, Config 예시와 한글 가이드를 보고 직접 수정할 수 있습니다.

**Acceptance Criteria:**
- [ ] main.html Config 템플릿 작성
- [ ] 모든 Config 항목에 한글 주석
- [ ] 실제 사용 예시 2-3개 제공
- [ ] Config 오류 가이드 문서
- [ ] 오너 교육 가이드 (README.md)

**Technical Notes:**
- NFR-008 충족
- 파일: `docs/config-guide.md`

**Dependencies:** STORY-001

**Sprint:** Sprint 3

---

### EPIC-006: 이벤트 추적 (5 포인트)

#### STORY-021: GTM/GA4 전환 이벤트 추적
**Epic:** EPIC-006 | **Priority:** Must Have | **Points:** 3

**User Story:**
마케터로서, 입력폼 제출과 전화걸기를 전환 이벤트로 추적하여 마케팅 성과를 측정하고 싶습니다.

**Acceptance Criteria:**
- [ ] 입력폼 제출 시 GTM/GA4 이벤트 송출 (이벤트명: form_submit)
- [ ] 전화걸기 클릭 시 이벤트 송출 (이벤트명: call_click)
- [ ] 향상된 전환 추적: 이름, 전화번호 해시화 전송
- [ ] dataLayer.push() 사용
- [ ] 이벤트 이름 config로 커스터마이징 가능

**Technical Notes:**
- FR-022 충족
- GTM dataLayer 예시:
  ```javascript
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'form_submit',
    user_data: { phone_hash: sha256(phone) }
  });
  ```

**Dependencies:** STORY-015, STORY-018, STORY-020

**Sprint:** Sprint 2

---

#### STORY-022: 비전환 이벤트 추적
**Epic:** EPIC-006 | **Priority:** Should Have | **Points:** 2

**User Story:**
마케터로서, 사용자 행동(메뉴 클릭, 스크롤 깊이)을 추적하여 사용자 여정을 분석하고 싶습니다.

**Acceptance Criteria:**
- [ ] 퀵메뉴/모바일 내비게이터 각 버튼 클릭 이벤트
- [ ] 헤더 메뉴 각 항목 클릭 이벤트
- [ ] 스크롤 깊이 추적 (25%, 50%, 75%, 100%)
- [ ] 각 이벤트에 컴포넌트/버튼 정보 포함

**Technical Notes:**
- FR-023 충족
- Intersection Observer API for scroll depth

**Dependencies:** STORY-004, STORY-017, STORY-019

**Sprint:** Sprint 3

---

### EPIC-007: 반응형 디자인 (6 포인트)

#### STORY-023: PC/모바일 반응형 전환
**Epic:** EPIC-007 | **Priority:** Must Have | **Points:** 3

**User Story:**
사용자로서, PC와 모바일 화면에서 최적화된 레이아웃을 보며 편리하게 페이지를 이용할 수 있습니다.

**Acceptance Criteria:**
- [ ] 기본 브레이크포인트: 768px (config로 조정 가능)
- [ ] 768px 초과: PC 레이아웃 (헤더 풀메뉴, 퀵메뉴, 내비게이터 숨김)
- [ ] 768px 이하: 모바일 레이아웃 (헤더 햄버거, 퀵메뉴 숨김, 내비게이터 표시)
- [ ] 부드러운 전환 애니메이션

**Technical Notes:**
- FR-025 충족
- 모든 컴포넌트에 적용
- CSS Media Query

**Dependencies:** 모든 컴포넌트 스토리

**Sprint:** Sprint 2

---

#### STORY-024: 크로스 브라우저 호환성 검증
**Epic:** EPIC-007 | **Priority:** Must Have | **Points:** 3

**User Story:**
사용자로서, 어떤 브라우저를 사용하든 동일한 경험을 얻을 수 있습니다.

**Acceptance Criteria:**
- [ ] Chrome (최신 2개 버전) 테스트
- [ ] Firefox (최신 2개 버전) 테스트
- [ ] Safari (최신 2개 버전) 테스트
- [ ] Edge (최신 2개 버전) 테스트
- [ ] 모바일: iOS Safari, Chrome Mobile 테스트

**Technical Notes:**
- FR-026 충족
- BrowserStack 또는 실제 기기 테스트

**Dependencies:** 모든 컴포넌트 스토리

**Sprint:** Sprint 3

---

### EPIC-008: 성능, 보안, 안정성 (15 포인트)

#### STORY-028: 개발 환경 및 빌드 설정
**Epic:** EPIC-008 | **Priority:** Must Have | **Points:** 3

**User Story:**
개발자로서, 개발 환경과 빌드 프로세스를 설정하여 효율적으로 개발하고 배포하고 싶습니다.

**Acceptance Criteria:**
- [ ] Vite 프로젝트 초기화
- [ ] 개발 서버 설정 (hot reload)
- [ ] 빌드 스크립트 설정 (ES2020+ 번들링)
- [ ] Cloudflare Pages 배포 설정
- [ ] .gitignore 설정 (.env, node_modules)

**Technical Notes:**
- 아키텍처 구현
- `npm create vite@latest` 또는 수동 설정

**Dependencies:** 없음 (최우선 구현)

**Sprint:** Sprint 0 ✓

---

#### STORY-011: 전화번호 실시간 하이픈 삽입
*(위 EPIC-003에 이미 정의됨)*

**Sprint:** Sprint 1

---

#### STORY-025: 로딩 최적화 및 로딩 화면
**Epic:** EPIC-008 | **Priority:** Must Have | **Points:** 3

**User Story:**
사용자로서, 페이지 로딩 중 로딩 화면을 보며 3초 이내에 모든 컴포넌트가 로드되기를 기대합니다.

**Acceptance Criteria:**
- [ ] 모든 컴포넌트 초기 로딩 완료: 3초 이내
- [ ] 로딩 화면 표시 (스피너, config로 설정)
- [ ] 컴포넌트 개별 로딩 시간: 각 500ms 이내
- [ ] Lighthouse Performance 점수: 90 이상

**Technical Notes:**
- NFR-001 충족
- Vite 빌드 최적화 (코드 분할, 압축)

**Dependencies:** 모든 컴포넌트 스토리

**Sprint:** Sprint 3

---

#### STORY-026: Graceful Degradation (폴백 시스템)
**Epic:** EPIC-008 | **Priority:** Must Have | **Points:** 5

**User Story:**
사용자로서, Cloudflare Pages 장애 시에도 핵심 기능(리드 등록, 전화)을 사용할 수 있습니다.

**Acceptance Criteria:**
- [ ] 입력폼 로딩 실패 시: 간단한 HTML form 폴백 (아임웹 내장)
- [ ] 헤더 로딩 실패 시: 로고 + 전화번호만 표시
- [ ] 퀵메뉴/내비게이터 로딩 실패 시: 숨김 처리
- [ ] 컴포넌트별 타임아웃: 3초
- [ ] 로딩 실패 시 콘솔 로그 기록

**Technical Notes:**
- NFR-006 충족
- `setTimeout` + fallback HTML

**Dependencies:** 모든 컴포넌트 스토리

**Sprint:** Sprint 3

---

#### STORY-027: HTTPS 강제 및 데이터 암호화
**Epic:** EPIC-008 | **Priority:** Must Have | **Points:** 2

**User Story:**
리드로서, 내 개인정보가 안전하게 암호화되어 전송됨을 신뢰할 수 있습니다.

**Acceptance Criteria:**
- [ ] HTTPS 강제 적용 (HTTP → HTTPS 리다이렉트)
- [ ] SSL/TLS 인증서 적용 (Cloudflare 제공)
- [ ] Airtable API 호출 HTTPS 사용
- [ ] Mixed Content 오류 없음

**Technical Notes:**
- NFR-003 충족
- Cloudflare Pages 자동 HTTPS

**Dependencies:** STORY-014, STORY-015

**Sprint:** Sprint 2

---

## 스프린트 할당

### Sprint 0 - MVP LAUNCH (2026-01-01, 오늘)

**목표:** 핵심 리드 수집 기능 구현 - 사용자가 입력폼으로 리드를 등록하고 Airtable에 저장

**Duration:** 1일 (20시간)
**Capacity:** 19 포인트
**Committed:** 19 포인트 (100% 활용)

**스토리:**
1. **STORY-028**: 개발 환경 및 빌드 설정 (3pt) - Must Have
2. **STORY-001**: Config 스키마 정의 및 파싱 (3pt) - Must Have
3. **STORY-003**: 베이스 웹 컴포넌트 클래스 (5pt) - Must Have
4. **STORY-010**: 입력폼 필수 필드 (3pt) - Must Have
5. **STORY-014**: Cloudflare Worker 프록시 (5pt) - Must Have
6. **STORY-015**: 입력폼 제출 및 성공 메시지 (3pt) - Must Have

**총 포인트:** 19 / 19 (100%)

**리스크:**
- 주니어 개발자가 Cloudflare Worker를 처음 사용할 경우 시간 초과 가능
- **완화:** Claude Code와 함께 공식 문서 참조, 단순화된 구현

**의존성:**
- 외부: Cloudflare Pages, Cloudflare Workers, Airtable 계정

---

### Sprint 1 - 사용자 경험 완성 (2026-01-02, 내일)

**목표:** 헤더, 푸터, 퀵메뉴, 모바일 내비게이터 추가하여 완전한 랜딩페이지 UX 제공

**Duration:** 1일
**Capacity:** 22 포인트
**Committed:** 22 포인트 (100% 활용)

**스토리:**
1. **STORY-002**: Shadow DOM 스타일 격리 (2pt) - Must Have
2. **STORY-011**: 전화번호 하이픈 삽입 (2pt) - Must Have
3. **STORY-013**: 법적 동의 체크박스 (2pt) - Must Have
4. **STORY-016**: 팝업/섹션 모드 (3pt) - Must Have
5. **STORY-004**: PC 헤더 기본 구조 (5pt) - Must Have
6. **STORY-008**: 푸터 2단 레이아웃 (3pt) - Must Have
7. **STORY-017**: PC 퀵메뉴 (3pt) - Must Have
8. **STORY-019**: 모바일 내비게이터 (3pt) - Must Have

**총 포인트:** 22 / 22 (100%)

**리스크:**
- 여러 컴포넌트를 동시에 개발하여 통합 복잡도 증가
- **완화:** 컴포넌트별 독립 개발, Shadow DOM 격리로 충돌 방지

---

### Sprint 2 - 기능 확장 및 마케팅 연동 (2026-01-03, 2일차)

**목표:** 동적 필드, 이벤트 추적, 반응형 디자인 완성하여 실전 배포 준비

**Duration:** 1일
**Capacity:** 25 포인트
**Committed:** 25 포인트 (100% 활용)

**스토리:**
1. **STORY-005**: 관심고객등록 특수 메뉴 (3pt) - Must Have
2. **STORY-006**: 모바일 햄버거 메뉴 (5pt) - Must Have
3. **STORY-009**: 푸터 법적 링크 (1pt) - Must Have
4. **STORY-012**: 선택 필드 동적 구성 (5pt) - Must Have
5. **STORY-018**: 퀵메뉴 버튼 액션 (2pt) - Must Have
6. **STORY-020**: 내비게이터 버튼 액션 (2pt) - Must Have
7. **STORY-021**: GTM/GA4 전환 이벤트 (3pt) - Must Have
8. **STORY-023**: 반응형 전환 (3pt) - Must Have
9. **STORY-027**: HTTPS 암호화 (2pt) - Must Have

**총 포인트:** 25 / 25 (100%)

**리스크:**
- GTM/GA4 이벤트 추적이 복잡할 수 있음
- **완화:** 공식 GTM 문서 참조, 단순화된 이벤트 구조

---

### Sprint 3 - 최적화 및 문서화 (2026-01-04, 3일차)

**목표:** 성능 최적화, 크로스 브라우저 호환성, 폴백 시스템, 문서화 완료

**Duration:** 1일
**Capacity:** 20 포인트
**Committed:** 20 포인트 (100% 활용)

**스토리:**
1. **STORY-007**: 파비콘 (1pt) - Should Have
2. **STORY-022**: 비전환 이벤트 추적 (2pt) - Should Have
3. **STORY-024**: 크로스 브라우저 호환성 (3pt) - Must Have
4. **STORY-025**: 로딩 최적화 (3pt) - Must Have
5. **STORY-026**: Graceful Degradation (5pt) - Must Have
6. **STORY-029**: Config 문서 (2pt) - Must Have

**총 포인트:** 20 / 20 (100%)

**리스크:**
- Graceful Degradation 구현이 복잡할 수 있음
- **완화:** 핵심 기능(입력폼)만 폴백 구현, 나머지는 숨김 처리

---

## Epic 추적성 매핑

| Epic ID | Epic 이름 | Sprint 0 | Sprint 1 | Sprint 2 | Sprint 3 | 총 포인트 |
|---------|-----------|----------|----------|----------|----------|-----------|
| EPIC-001 | 헤더 컴포넌트 | - | S-004 (5pt) | S-005 (3pt)<br>S-006 (5pt) | S-007 (1pt) | 14pt |
| EPIC-002 | 푸터 컴포넌트 | - | S-008 (3pt) | S-009 (1pt) | - | 4pt |
| EPIC-003 | 입력폼 및 리드 | S-010 (3pt)<br>S-014 (5pt)<br>S-015 (3pt) | S-011 (2pt)<br>S-013 (2pt)<br>S-016 (3pt) | S-012 (5pt) | - | 23pt |
| EPIC-004 | 퀵메뉴/내비게이터 | - | S-017 (3pt)<br>S-019 (3pt) | S-018 (2pt)<br>S-020 (2pt) | - | 10pt |
| EPIC-005 | Config 시스템 | S-001 (3pt)<br>S-003 (5pt) | S-002 (2pt) | - | S-029 (2pt) | 12pt |
| EPIC-006 | 이벤트 추적 | - | - | S-021 (3pt) | S-022 (2pt) | 5pt |
| EPIC-007 | 반응형 디자인 | - | - | S-023 (3pt) | S-024 (3pt) | 6pt |
| EPIC-008 | 성능/보안/안정성 | S-028 (3pt) | - | S-027 (2pt) | S-025 (3pt)<br>S-026 (5pt) | 13pt |
| **총합** | **8 Epics** | **19pt** | **22pt** | **25pt** | **20pt** | **86pt** |

---

## 요구사항 충족 매핑

### Functional Requirements (26개)

| FR ID | FR 이름 | Story | Sprint | 상태 |
|-------|---------|-------|--------|------|
| FR-001 | PC 헤더 메뉴 | STORY-004 | Sprint 1 | Planned |
| FR-002 | 관심고객등록 메뉴 | STORY-005 | Sprint 2 | Planned |
| FR-003 | 헤더 페이지 타입별 동작 | STORY-005 | Sprint 2 | Planned |
| FR-004 | 모바일 햄버거 메뉴 | STORY-006 | Sprint 2 | Planned |
| FR-005 | 파비콘 설정 | STORY-007 | Sprint 3 | Planned |
| FR-006 | 푸터 2단 레이아웃 | STORY-008 | Sprint 1 | Planned |
| FR-007 | 법적 정보 링크 | STORY-009 | Sprint 2 | Planned |
| FR-008 | 푸터 반응형 | STORY-008 | Sprint 1 | Planned |
| FR-009 | 필수 필드 | STORY-010 | **Sprint 0** | **MVP** ✓ |
| FR-010 | 선택 필드 동적 구성 | STORY-012 | Sprint 2 | Planned |
| FR-011 | 전화번호 하이픈 | STORY-011 | Sprint 1 | Planned |
| FR-012 | 법적 동의 체크박스 | STORY-013 | Sprint 1 | Planned |
| FR-013 | 입력폼 제출/성공 메시지 | STORY-015 | **Sprint 0** | **MVP** ✓ |
| FR-014 | 팝업/섹션 모드 | STORY-016 | Sprint 1 | Planned |
| FR-015 | PC 퀵메뉴 | STORY-017 | Sprint 1 | Planned |
| FR-016 | 퀵메뉴 버튼 액션 | STORY-018 | Sprint 2 | Planned |
| FR-017 | 모바일 내비게이터 | STORY-019 | Sprint 1 | Planned |
| FR-018 | 내비게이터 버튼 액션 | STORY-020 | Sprint 2 | Planned |
| FR-019 | Config 구조 | STORY-001 | **Sprint 0** | **MVP** ✓ |
| FR-020 | Config 기반 렌더링 | STORY-003 | **Sprint 0** | **MVP** ✓ |
| FR-021 | Shadow DOM 격리 | STORY-002 | Sprint 1 | Planned |
| FR-022 | 전환 이벤트 추적 | STORY-021 | Sprint 2 | Planned |
| FR-023 | 비전환 이벤트 추적 | STORY-022 | Sprint 3 | Planned |
| FR-024 | Airtable 리드 전송 | STORY-014 | **Sprint 0** | **MVP** ✓ |
| FR-025 | 반응형 전환 | STORY-023 | Sprint 2 | Planned |
| FR-026 | 크로스 브라우저 호환성 | STORY-024 | Sprint 3 | Planned |

**Sprint 0 MVP로 달성하는 FR: 5개**
- FR-009: 필수 필드 (이름, 전화번호)
- FR-013: 입력폼 제출 및 성공 메시지
- FR-019: Config 구조
- FR-020: Config 기반 렌더링
- FR-024: Airtable 리드 전송

**→ 핵심 비즈니스 가치 즉시 검증 가능!**

---

### Non-Functional Requirements (10개)

| NFR ID | NFR 이름 | Story | Sprint | 상태 |
|--------|----------|-------|--------|------|
| NFR-001 | 초기 로딩 시간 | STORY-025 | Sprint 3 | Planned |
| NFR-002 | 런타임 성능 | STORY-025 | Sprint 3 | Planned |
| NFR-003 | 데이터 전송 암호화 | STORY-027 | Sprint 2 | Planned |
| NFR-004 | API 키 보안 | STORY-014 | **Sprint 0** | **MVP** ✓ |
| NFR-005 | 개인정보 처리 규정 | STORY-013 | Sprint 1 | Planned |
| NFR-006 | Graceful Degradation | STORY-026 | Sprint 3 | Planned |
| NFR-007 | 입력폼 오류 처리 | STORY-015 | **Sprint 0** | **MVP** ✓ |
| NFR-008 | 비개발자 친화성 | STORY-029 | Sprint 3 | Planned |
| NFR-009 | 코드 품질/문서화 | STORY-029 | Sprint 3 | Planned |
| NFR-010 | 아임웹 호환성 | All Components | Sprint 0-3 | Ongoing |

**Sprint 0 MVP로 달성하는 NFR: 2개**
- NFR-004: API 키 보안 (Cloudflare Worker 사용)
- NFR-007: 입력폼 제출 오류 처리

---

## 리스크 및 완화 전략

### 높은 우선순위 리스크

#### 1. Cloudflare Worker 미경험 (확률: 높음, 영향: 높음)
**완화:**
- Sprint 0 초반에 간단한 Worker 예제부터 시작
- Claude Code와 함께 공식 문서 참조
- 최소 기능으로 구현 (복잡한 검증은 나중에)

#### 2. 주니어 개발자 생산성 예측 불확실 (확률: 중간, 영향: 높음)
**완화:**
- 매 스프린트 후 실제 생산성 측정 및 조정
- Claude Code 조력으로 생산성 2배 향상 가정
- 버퍼 스토리 없이 100% 활용 (위험하지만 MVP 우선)

#### 3. Airtable API 통합 문제 (확률: 낮음, 영향: 높음)
**완화:**
- Sprint 0 초반에 Airtable API 테스트
- 간단한 레코드 생성부터 검증
- API 문서 철저히 참조

---

### 중간 우선순위 리스크

#### 4. Shadow DOM 브라우저 호환성 (확률: 낮음, 영향: 중간)
**완화:**
- 아키텍처 문서에서 이미 검증됨 (Chrome, Firefox, Safari, Edge)
- Sprint 1에서 즉시 테스트

#### 5. 스프린트 간 통합 복잡도 (확률: 중간, 영향: 중간)
**완화:**
- 컴포넌트별 독립성 유지 (Shadow DOM)
- Config 기반 설계로 통합 단순화

---

## 의존성 관리

### 외부 의존성

1. **Cloudflare Pages** (Critical)
   - Sprint 0부터 필요
   - 무료 플랜 (충분)
   - 리스크: 서비스 장애 → NFR-006 (Graceful Degradation)으로 완화

2. **Cloudflare Workers** (Critical)
   - Sprint 0부터 필요
   - 무료 플랜 (100,000 req/day)
   - 리스크: 설정 미경험 → 문서 참조 및 간단한 구현

3. **Airtable** (Critical)
   - Sprint 0부터 필요
   - Team 플랜 (50 req/s)
   - 리스크: API 변경 → 공식 SDK 사용

4. **GTM/GA4** (Medium)
   - Sprint 2부터 필요
   - 무료
   - 리스크: 거의 없음

5. **아임웹** (Critical)
   - 모든 스프린트
   - 프로 플랜
   - 리스크: 플랫폼 의존성 → 아키텍처 검증됨

---

### 스토리 간 의존성

**Critical Path (Sprint 0):**
```
STORY-028 (개발환경)
    ↓
STORY-001 (Config)
    ↓
STORY-003 (베이스 컴포넌트) ← STORY-002 (Shadow DOM)
    ↓
STORY-010 (입력폼) ← STORY-014 (Worker)
    ↓
STORY-015 (제출)
```

**Sprint 1-3:**
- 대부분 병렬 작업 가능 (컴포넌트 독립성)
- STORY-016 (팝업 모드)는 STORY-017, STORY-019 이후 통합

---

## Definition of Done

스토리가 완료되었다고 간주되려면:

**코드:**
- [ ] 코드 작성 및 커밋
- [ ] Acceptance Criteria 모두 충족
- [ ] 로컬 테스트 통과

**품질:**
- [ ] 주요 브라우저에서 동작 확인 (Chrome, Firefox)
- [ ] 모바일 시뮬레이션 테스트 (Chrome DevTools)
- [ ] 콘솔 오류 없음

**문서:**
- [ ] 주요 함수에 JSDoc 주석 (Sprint 3부터 엄격 적용)
- [ ] Config 관련 스토리는 한글 주석 필수

**배포:**
- [ ] Cloudflare Pages에 배포 (Sprint 0부터)
- [ ] 실제 아임웹 환경에서 테스트 (Sprint 1부터)

**Sprint 0 완료 조건:**
- [ ] 사용자가 입력폼에 이름과 전화번호를 입력할 수 있음
- [ ] 제출 버튼 클릭 시 Airtable에 데이터 저장됨
- [ ] 성공 메시지 팝업 표시됨
- [ ] Cloudflare Pages 배포 완료

---

## 다음 단계

### 즉시 시작 (Sprint 0, 오늘)

**우선순위 1: 개발 환경 구축**
```bash
# 1. Vite 프로젝트 초기화
npm create vite@latest 100zoad-components -- --template vanilla

# 2. Cloudflare Pages 배포 설정
# Cloudflare Dashboard에서 프로젝트 생성

# 3. Cloudflare Worker 생성
# workers/airtable-proxy.js 작성
```

**우선순위 2: Config 시스템**
- `src/core/config-parser.js` 작성
- Window.CONFIG 구조 정의
- 검증 로직 구현

**우선순위 3: 입력폼 MVP**
- `src/core/base-component.js` 작성
- `src/components/form/form.js` 작성
- Airtable 연동 테스트

**예상 타임라인 (오늘):**
- 0-4시간: STORY-028, STORY-001 (개발환경 + Config)
- 4-12시간: STORY-003, STORY-014 (베이스 컴포넌트 + Worker)
- 12-20시간: STORY-010, STORY-015 (입력폼 + 제출)

**Sprint 0 완료 후:**
- `/dev-story STORY-001` 실행하여 첫 스토리 구현 시작
- 또는 `/sprint-status` 실행하여 진행 상황 확인

---

### Sprint 1 준비 (내일)

**목표 검증:**
- Sprint 0 MVP가 작동하는가?
- Airtable에 리드가 저장되는가?
- 실제 생산성은 예측과 일치하는가?

**조정:**
- 생산성이 낮으면 Sprint 1-3 재조정
- 생산성이 높으면 추가 스토리 고려

---

## 부록 A: 스토리 포인트 보정 가이드

### 주니어 + Claude Code 환경에서의 포인트 의미

| 포인트 | 시간 | 설명 | 예시 |
|--------|------|------|------|
| 1 | 2시간 | 매우 간단 | 파비콘 설정, 링크 추가 |
| 2 | 4시간 | 간단 | 전화번호 하이픈, 체크박스 |
| 3 | 6시간 | 중간 | Config 파싱, 푸터 레이아웃 |
| 5 | 10시간 | 복잡 | 베이스 컴포넌트, Worker, 헤더 |
| 8 | 16시간 | 매우 복잡 (분해 필요) | 사용 안 함 |

**실제 소요 시간 추적:**
- 각 스토리 완료 시 실제 시간 기록
- Sprint 1 시작 전 포인트 보정
- Velocity 계산: (완료 포인트 / 실제 시간) × 20시간

---

## 부록 B: 스프린트 체크리스트

### Sprint 0 체크리스트

**Phase 1: 환경 구축 (0-4시간)**
- [ ] Vite 프로젝트 생성
- [ ] Git 저장소 초기화
- [ ] Cloudflare Pages 프로젝트 생성
- [ ] Cloudflare Workers 설정
- [ ] Config 스키마 정의

**Phase 2: 핵심 구현 (4-16시간)**
- [ ] BaseComponent 클래스 작성
- [ ] Airtable Worker 작성 및 테스트
- [ ] 입력폼 컴포넌트 작성
- [ ] 제출 로직 구현

**Phase 3: 통합 테스트 (16-20시간)**
- [ ] 로컬 환경에서 E2E 테스트
- [ ] Cloudflare Pages 배포
- [ ] 아임웹 코드위젯에 임베드
- [ ] 실제 리드 등록 테스트

**완료 조건:**
- [ ] 사용자가 이름, 전화번호 입력 가능
- [ ] Airtable에 데이터 저장 확인
- [ ] 성공 메시지 표시

---

**이 스프린트 계획은 BMAD Method v6 - Phase 4 (Sprint Planning)를 사용하여 작성되었습니다.**

*진행 상황 확인: `/sprint-status`
다음 스토리 시작: `/dev-story STORY-028`*
