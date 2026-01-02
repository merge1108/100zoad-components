# Sprint 4: 아임웹 배포 최적화

**생성일**: 2026-01-02
**상태**: In Progress
**스프린트 기간**: 2026-01-03
**용량**: 12 Story Points
**목표**: 아임웹 환경에서 폰트, 버튼, 메시지, 헤더 렌더링 이슈 해결

---

## 📊 스프린트 개요

### 스프린트 목표
100zoad 컴포넌트들이 아임웹 환경에서 정상적으로 작동하도록 CSS 우선순위, JavaScript 초기화, 렌더링 이슈를 해결합니다.

### 핵심 문제
1. **폰트 로딩 실패** - Pretendard 폰트가 아임웹 기본 폰트에 override됨
2. **버튼 초기 상태** - 제출 버튼이 회색(disabled)으로 표시됨
3. **메시지 표시 오류** - 성공 메시지가 페이지 로드 시부터 표시됨
4. **헤더 렌더링 실패** - 헤더가 투명하고 메뉴가 보이지 않음

### 스프린트 통계
- **총 스토리**: 4개
- **총 포인트**: 12 points
- **진행률**: 0/12 (0%)
- **Epic**: EPIC-IMWEB (아임웹 배포 최적화)

---

## 📋 스토리 목록

### 🔴 Critical Priority

#### STORY-IMWEB-004: Header 배경색 및 메뉴 렌더링 수정
- **포인트**: 5
- **우선순위**: Critical
- **상태**: Pending
- **문제**: 헤더 투명, PC 메뉴 안보임, 내비게이터 안보임
- **해결방법**: CSS !important + 구체적 선택자, JavaScript 초기화 강화, z-index 조정
- **AC**:
  - [x] 헤더 배경 흰색(#ffffff)
  - [x] PC 5개 메뉴 모두 표시
  - [x] "관심고객등록" 버튼 두산 블루
  - [x] 모바일 햄버거 메뉴 작동
  - [x] 스크롤 시 헤더 고정

---

### 🟡 High Priority

#### STORY-IMWEB-001: Pretendard 폰트 강제 적용
- **포인트**: 3
- **우선순위**: High
- **상태**: Pending
- **문제**: Pretendard CDN 작동 안함, 아임웹 Apple SD Gothic 적용됨
- **해결방법**: `<link>` 태그 사용 + !important + 구체적 선택자
- **AC**:
  - [x] Header 모든 텍스트 Pretendard
  - [x] Footer 모든 텍스트 Pretendard
  - [x] Form 모든 텍스트 Pretendard
  - [x] 아임웹 CSS보다 높은 우선순위
  - [x] font-weight 300, 500, 700만 사용

#### STORY-IMWEB-002: Form 버튼 초기 상태 수정
- **포인트**: 2
- **우선순위**: High
- **상태**: Pending
- **문제**: 버튼이 항상 회색(disabled)으로 표시, 클릭 불가
- **해결방법**: CSS !important 강화 + JavaScript 초기 상태 명시
- **AC**:
  - [x] 페이지 로드 시 버튼 두산 블루(#003DA5)
  - [x] 버튼 활성화(enabled) 상태
  - [x] 호버 시 어두운 블루(#002380)
  - [x] 제출 중에만 로딩 상태(회색, disabled)
  - [x] 여러 폼 독립적 작동

#### STORY-IMWEB-003: Form 성공 메시지 초기 상태 수정
- **포인트**: 2
- **우선순위**: High
- **상태**: Pending
- **문제**: 성공 메시지가 페이지 로드 시부터 표시됨
- **해결방법**: CSS !important + JavaScript 초기화 강화
- **AC**:
  - [x] 페이지 로드 시 메시지 숨김
  - [x] 제출 성공 시에만 녹색 박스 표시
  - [x] 3초 후 자동 사라짐
  - [x] 오류 메시지도 초기 숨김
  - [x] 여러 폼 독립적 작동

---

## 🎯 구현 전략

### 공통 해결 패턴
모든 이슈가 **CSS 우선순위 문제**와 **JavaScript 초기화 문제**로 수렴됩니다.

#### 1. CSS 강화 전략
```css
/* 패턴: 구체적 선택자 + !important */
#container-id .component-class {
  property: value !important;
  opacity: 1 !important;
  visibility: visible !important;
}
```

#### 2. JavaScript 초기화 전략
```javascript
// 패턴: DOMContentLoaded + 명시적 상태 설정
document.addEventListener('DOMContentLoaded', function() {
  const element = document.querySelector('.component');
  if (element) {
    element.style.property = 'value';
    element.disabled = false;
    element.classList.remove('unwanted-class');
  }
});
```

#### 3. 우선순위 작업 순서
1. **STORY-IMWEB-004 (Critical)** - 헤더가 안보이면 사이트 사용 불가
2. **STORY-IMWEB-001 (High)** - 폰트는 브랜드 일관성에 중요
3. **STORY-IMWEB-002 (High)** - 버튼이 안되면 전환 불가
4. **STORY-IMWEB-003 (High)** - UX 혼란 방지

---

## 🛠️ 기술적 접근

### 문제 근본 원인
1. **아임웹 기본 CSS**가 매우 구체적인 선택자와 !important 사용
2. **스크립트 로드 순서** - 아임웹이 먼저 실행되어 초기 상태 설정
3. **DOM 구조 복잡도** - 아임웹의 래퍼 요소들이 스타일 상속 방해

### 해결 방법
```
단계 1: @import → <link> 태그로 변경 (폰트)
단계 2: 모든 CSS에 !important 추가
단계 3: 선택자를 더 구체적으로 (#id .class)
단계 4: JavaScript에서 렌더링 후 강제 스타일 적용
단계 5: 브라우저 DevTools로 Computed Style 검증
```

---

## 📝 테스트 계획

### 테스트 환경
- **로컬**: 개발 서버 (정상 작동 확인)
- **아임웹**: 실제 배포 환경 (이슈 발생)

### 테스트 체크리스트
- [ ] Chrome DevTools - Elements 탭에서 HTML 구조 확인
- [ ] Chrome DevTools - Computed 탭에서 최종 CSS 값 확인
- [ ] Console에서 JavaScript 에러 확인
- [ ] Network 탭에서 리소스 로딩 확인
- [ ] PC/모바일 모두 테스트
- [ ] 여러 페이지에서 테스트 (홈, 서브페이지 등)

### 성공 기준
- ✅ 모든 텍스트가 Pretendard 폰트로 표시
- ✅ 헤더가 흰색 배경으로 표시, 메뉴 모두 보임
- ✅ 버튼이 파란색(#003DA5)으로 표시, 클릭 가능
- ✅ 성공 메시지가 초기에는 숨겨짐, 제출 성공 시에만 표시

---

## 📅 타임라인

| 시간 | 활동 |
|------|------|
| 00:00 - 02:00 | STORY-IMWEB-004 (Header 렌더링) - Critical |
| 02:00 - 03:30 | STORY-IMWEB-001 (폰트 로딩) - High |
| 03:30 - 04:30 | STORY-IMWEB-002 (버튼 상태) - High |
| 04:30 - 05:30 | STORY-IMWEB-003 (메시지 상태) - High |
| 05:30 - 06:00 | 통합 테스트 및 검증 |

---

## 🔗 관련 문서

- **Epic**: EPIC-IMWEB (아임웹 배포 최적화)
- **Sprint Plan**: docs/sprint-plan-100zoad-2026-01-01.md
- **Sprint Status**: docs/sprint-status.yaml
- **Stories**:
  - docs/stories/STORY-IMWEB-001-font-loading.md
  - docs/stories/STORY-IMWEB-002-form-button-state.md
  - docs/stories/STORY-IMWEB-003-form-success-message.md
  - docs/stories/STORY-IMWEB-004-header-rendering.md

---

## 📊 진행 상황 추적

### Sprint Burndown
- **Day 0**: 12 points remaining
- **Day 1**: TBD

### 완료 스토리
- None yet

### 진행 중 스토리
- None yet

### 대기 중 스토리
- STORY-IMWEB-004
- STORY-IMWEB-001
- STORY-IMWEB-002
- STORY-IMWEB-003

---

## 💡 교훈 및 노트

### 아임웹 환경 특성
1. 기본 CSS가 매우 강력함 (!important 많이 사용)
2. 스크립트 실행 순서가 예측 불가
3. DOM 구조가 복잡함 (래퍼가 많음)

### 대응 방법
1. 항상 !important 사용
2. 선택자를 최대한 구체적으로
3. JavaScript로 렌더링 후 강제 스타일 적용
4. DOMContentLoaded 이벤트 활용

---

**마지막 업데이트**: 2026-01-02 23:30:00
**다음 업데이트**: 스토리 완료 시
