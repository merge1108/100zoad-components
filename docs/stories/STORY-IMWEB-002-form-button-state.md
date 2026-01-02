# STORY-IMWEB-002: Form 버튼 초기 상태 수정

**Status**: Pending
**Priority**: High
**Sprint**: Sprint 2
**Story Points**: 2

---

## 📋 User Story

**As a** 사이트 방문자
**I want** 폼 제출 버튼이 정상적인 파란색으로 표시되고 클릭 가능하기를
**So that** 관심고객 등록을 할 수 있다

---

## 🎯 Acceptance Criteria

- [ ] **AC1**: 페이지 로드 시 버튼이 두산 블루(#003DA5)로 표시됨
- [ ] **AC2**: 버튼이 활성화 상태(enabled)로 표시됨
- [ ] **AC3**: 버튼 호버 시 어두운 블루(#002380)로 변경됨
- [ ] **AC4**: 제출 중일 때만 로딩 상태(회색, disabled)가 적용됨
- [ ] **AC5**: 여러 폼이 있어도 각각 독립적으로 작동함

---

## 🔍 Problem Analysis

### Current Issue
- 신청하기 버튼이 항상 회색(#cccccc)으로 표시됨
- 버튼이 disabled 상태로 렌더링됨
- 클릭이 불가능함

### Root Cause
1. CSS에서 `:disabled` 스타일이 기본 상태에 적용됨
2. JavaScript에서 `submitButton.disabled = true`가 초기화 시 실행되거나
3. 아임웹의 기본 CSS가 버튼 스타일을 override함

### Possible Causes
```css
/* 문제 1: CSS 우선순위 */
.zoad-form-submit-button {
  background-color: #003DA5; /* 적용 안됨 */
}

/* 아임웹 기본 CSS가 더 구체적일 수 있음 */
button[type="submit"] {
  background-color: #cccccc !important;
}

/* 문제 2: JavaScript 초기화 오류 */
submitButton.disabled = true; // 어딘가에서 실행됨
```

---

## 💡 Solution

### Approach 1: CSS !important 강화
```css
.${uniqueId} .zoad-form-submit-button {
  background-color: ${config.styles.primaryColor} !important;
  cursor: pointer !important;
}

.${uniqueId} .zoad-form-submit-button:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
}
```

### Approach 2: JavaScript 초기 상태 명시
```javascript
// Form 초기화 후 즉시 실행
submitButton.disabled = false;
submitButton.classList.remove('loading');
submitButton.style.backgroundColor = config.styles.primaryColor;
```

### Recommended: Approach 1 + 2 조합

---

## 🛠️ Implementation Tasks

1. **Form.html CSS 수정**
   - [ ] `.zoad-form-submit-button`에 `!important` 추가
   - [ ] background-color, color, cursor 모두 강제 적용
   - [ ] `:hover`, `:disabled` 상태별 스타일 명확히 분리

2. **Form.html JavaScript 수정**
   - [ ] 초기화 후 `disabled = false` 명시
   - [ ] `loading` 클래스 제거 확인
   - [ ] 버튼 색상 강제 설정

3. **검증**
   - [ ] 페이지 로드 시 버튼 색상 확인
   - [ ] 호버 효과 확인
   - [ ] 제출 시 로딩 상태 확인
   - [ ] 제출 완료 후 원래 상태로 복귀 확인

---

## 📝 Test Plan

### Test Case 1: 초기 상태
- **Given**: 페이지 로드
- **When**: 폼이 렌더링됨
- **Then**: 버튼이 파란색(#003DA5)이고 클릭 가능

### Test Case 2: 호버
- **Given**: 버튼이 정상 상태
- **When**: 마우스 호버
- **Then**: 색상이 #002380으로 변경

### Test Case 3: 제출 중
- **Given**: 폼 제출
- **When**: 서버 응답 대기 중
- **Then**: 버튼이 회색, 로딩 아이콘 표시

### Test Case 4: 제출 완료
- **Given**: 서버 응답 받음
- **When**: 성공/실패 메시지 표시
- **Then**: 버튼이 다시 파란색으로 복귀

### Test Case 5: 여러 폼
- **Given**: 2개 이상의 폼 배치
- **When**: 각각 독립적으로 작동
- **Then**: 한 폼 제출이 다른 폼에 영향 없음

---

## 🔗 Related

- **Epic**: 아임웹 배포 최적화
- **Related to**: STORY-IMWEB-003 (Form 성공 메시지)
- **Depends on**: None
- **Blocks**: None

---

## 📅 Timeline

- **Created**: 2026-01-02
- **Started**: TBD
- **Completed**: TBD
