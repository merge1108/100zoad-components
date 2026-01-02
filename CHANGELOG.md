# Changelog

100zoad Web Components 프로젝트의 모든 주요 변경사항이 이 파일에 기록됩니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따르며,
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 준수합니다.

## [Unreleased]

### Sprint 4 진행 중 (2026-01-02 ~)
- 아임웹 배포 최적화 작업 진행 중
- 진행률: 5/12 포인트 (41.7%)

## [0.4.0] - 2026-01-02

### Added - STORY-IMWEB-004
- **헤더 렌더링 이슈 해결**: 아임웹 환경에서 헤더 배경색 및 메뉴가 보이지 않던 Critical 이슈 해결
  - CSS 우선순위 강화: 모든 헤더/메뉴 스타일에 `!important` 추가
  - `opacity: 1`, `visibility: visible` 명시적 설정
  - `z-index`를 1000에서 9999로 상향
  - JavaScript 강제 스타일 적용: `forceHeaderStyles()` 메서드 추가
  - 100ms 딜레이로 아임웹 CSS 로드 후 스타일 덮어쓰기
  - 5개 Acceptance Criteria 모두 충족

### Added - STORY-022
- **비전환 이벤트 추적**: GTM/GA4를 통한 사용자 행동 추적 강화
  - 메뉴 클릭 이벤트 추적 (PC/모바일 헤더)
  - 퀵메뉴 버튼 클릭 이벤트 추적
  - 모바일 내비게이터 버튼 클릭 이벤트 추적
  - 입력폼 필드 포커스 이벤트 추적
  - 스크롤 깊이 추적 (25%, 50%, 75%, 100%)
  - 페이지 체류 시간 추적 (30초, 60초, 120초, 300초)

### Added - STORY-007
- **파비콘 자동 설정**: Config의 로고 URL을 브라우저 탭 파비콘으로 자동 설정
  - 512x512px PNG 지원
  - Apple Touch Icon 지원 (iOS/Android 홈 화면 추가 시)

### Changed
- README.md 업데이트: Sprint 4 진행 상황 반영
- Sprint 상태 업데이트: 현재 Sprint 4 진행 중 (5/12pt)

## [0.3.0] - 2026-01-01

### Sprint 3 완료 (16/20pt)
- 최적화 및 문서화 완료

### Added - STORY-024
- **크로스 브라우저 호환성 검증**
  - Chrome, Safari, Firefox, Edge 테스트 완료
  - Polyfill 적용 (Intersection Observer, CSS Custom Properties)
  - 모든 주요 브라우저에서 정상 작동 확인

### Added - STORY-025
- **로딩 최적화 및 로딩 화면**
  - 컴포넌트 지연 로딩 구현
  - 로딩 스피너 추가
  - 초기 로딩 시간 1.5초 이내 달성

### Added - STORY-026
- **Graceful Degradation (폴백 시스템)**
  - 컴포넌트 로딩 실패 시 폴백 HTML 표시
  - 입력폼 폴백: 기본 HTML form 제공
  - 헤더 폴백: 로고 + 전화번호만 표시
  - 핵심 기능 (리드 수집, 전화 상담) 항상 작동 보장

### Added - STORY-029
- **Config 예시 및 문서**
  - 3가지 예시 템플릿 제공
  - 한글 주석이 포함된 상세 가이드
  - 오류 해결 FAQ 추가

## [0.2.0] - 2026-01-01

### Sprint 2 완료 (25/25pt)
- 기능 확장 및 마케팅 연동 완료

### Added - STORY-005
- **헤더 '관심고객등록' 특수 메뉴**
  - 그라데이션 배경 버튼
  - Pulse/Glow/Shake 애니메이션 옵션
  - 입력폼 섹션으로 부드러운 스크롤 이동

### Added - STORY-006
- **모바일 햄버거 메뉴**
  - 768px 이하에서 햄버거 아이콘 표시
  - 우측 슬라이드 사이드 메뉴
  - X자 애니메이션
  - 오버레이 클릭 시 메뉴 닫힘
  - 바디 스크롤 방지

### Added - STORY-009
- **푸터 법적 정보 링크**
  - 이용약관, 개인정보처리방침 팝업/새 탭 옵션

### Added - STORY-012
- **선택 필드 동적 구성**
  - Text, Dropdown, Datetime 필드 타입 지원
  - Config로 필드 추가/제거 가능
  - 각 필드별 required 옵션

### Added - STORY-018, STORY-020
- **퀵메뉴 및 모바일 내비게이터 버튼 액션**
  - 입력폼 팝업 열기
  - 전화 걸기 (tel: 링크)
  - URL 이동

### Added - STORY-021
- **GTM/GA4 전환 이벤트 추적**
  - 입력폼 제출 이벤트
  - 전화 클릭 이벤트
  - 향상된 전환 추적 (이름/전화번호 SHA-256 해시화)

### Added - STORY-023
- **PC/모바일 반응형 전환**
  - 768px 기준 breakpoint
  - PC: 헤더 메뉴, 퀵메뉴 표시
  - 모바일: 햄버거 메뉴, 하단 내비게이터 표시

### Added - STORY-027
- **HTTPS 강제 및 데이터 암호화**
  - Cloudflare Pages 자동 SSL/TLS
  - HTTP → HTTPS 리다이렉트
  - 모든 API 통신 HTTPS 전용

## [0.1.0] - 2026-01-01

### Sprint 0-1 완료 (44pt)
- MVP 기능 완성

### Added - Sprint 0 (22pt)
- **STORY-028**: 개발 환경 및 빌드 설정
- **STORY-001**: Config 스키마 정의 및 파싱 시스템
- **STORY-003**: 베이스 웹 컴포넌트 클래스
- **STORY-010**: 입력폼 필수 필드 (이름, 전화번호)
- **STORY-014**: Cloudflare Worker - Airtable API 프록시
- **STORY-015**: 입력폼 제출 및 성공 메시지

### Added - Sprint 1 (22pt)
- **STORY-002**: Shadow DOM 스타일 격리 시스템
- **STORY-011**: 전화번호 실시간 하이픈 삽입
- **STORY-013**: 법적 동의 체크박스
- **STORY-016**: 입력폼 팝업 및 섹션 모드
- **STORY-004**: PC 헤더 메뉴 기본 구조
- **STORY-008**: 푸터 2단 레이아웃
- **STORY-017**: PC 퀵메뉴 고정 버튼
- **STORY-019**: 모바일 하단 내비게이터

### Technical Details
- Vanilla JavaScript (ES2020+) 기반
- Shadow DOM을 통한 완벽한 스타일 격리
- Config-driven 아키텍처
- Cloudflare Pages 호스팅
- Vite 빌드 시스템

---

## 변경 유형 가이드

- **Added**: 새로운 기능
- **Changed**: 기존 기능 변경
- **Deprecated**: 곧 제거될 기능
- **Removed**: 제거된 기능
- **Fixed**: 버그 수정
- **Security**: 보안 관련 수정

---

**이 프로젝트는 BMAD Method v6를 사용하여 개발되었습니다.**
