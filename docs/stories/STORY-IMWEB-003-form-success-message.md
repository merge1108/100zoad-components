# STORY-IMWEB-003: Form 성공 메시지 초기 상태 수정

**Status**: Pending
**Priority**: High
**Sprint**: Sprint 2
**Story Points**: 2

---

## 📋 User Story

**As a** 사이트 방문자
**I want** 폼 제출 성공 메시지가 제출 성공 시에만 표시되기를
**So that** 혼란스럽지 않게 폼을 작성할 수 있다

---

## 🎯 Acceptance Criteria

- [ ] **AC1**: 페이지 로드 시 성공 메시지가 숨겨져 있음
- [ ] **AC2**: 폼 제출 성공 시에만 녹색 박스로 "✓ 신청이 완료되었습니다!" 표시
- [ ] **AC3**: 3초 후 자동으로 사라짐
- [ ] **AC4**: 오류 메시지도 동일하게 초기에는 숨겨져 있음
- [ ] **AC5**: 여러 폼이 있어도 각각 독립적으로 작동함

---

## 🔍 Problem Analysis

### Current Issue
- "✓ 신청이 완료되었습니다!" 초록 박스가 페이지 로드 시부터 항상 표시됨
- 숨김 처리가 안됨

### Root Cause
1. CSS에서 `display: none`이 제대로 적용되지 않음
2. JavaScript에서 초기에 `.show` 클래스가 추가되어 있거나
3. 아임웹의 기본 CSS가 `display` 속성을 override함

### Possible Causes
```css
/* 문제 1: CSS 우선순위 */
.zoad-form-success-message {
  display: none; /* 적용 안됨 */
}

/* 아임웹 기본 CSS */
.zoad-form-success-message {
  display: block !important; /* 이게 우선됨 */
}

/* 문제 2: show 클래스가 기본으로 있음 */
<div class="zoad-form-success-message show">
```

---

## 💡 Solution

### Approach 1: CSS !important + 더 구체적인 선택자
```css
.${uniqueId} .zoad-form-success-message {
  display: none !important;
}

.${uniqueId} .zoad-form-success-message.show {
  display: block !important;
}
```

### Approach 2: JavaScript 초기화 강화
```javascript
// Form 렌더링 후 즉시 실행
successMessage.classList.remove('show');
successMessage.style.display = 'none';
errorAlert.classList.remove('show');
errorAlert.style.display = 'none';
```

### Recommended: Approach 1 + 2 조합

---

## 🛠️ Implementation Tasks

### 아임웹 배포 파일 업데이트

**대상 파일:**
- `imweb/doosanweve_kimjunsu/form.html` - 폼 성공 메시지 초기 상태 수정

**작업 내용:**

1. **form.html CSS 수정**
   - [ ] `.zoad-form-success-message`에 `display: none !important`
   - [ ] `.zoad-form-success-message.show`에 `display: block !important`
   - [ ] `.zoad-form-error-alert` 동일하게 적용

2. **form.html JavaScript 수정**
   - [ ] 초기화 직후 `.show` 클래스 제거
   - [ ] `display: none` 강제 설정
   - [ ] 제출 성공 시에만 `.show` 추가

3. **검증**
   - [ ] 페이지 로드 시 메시지 숨겨짐
   - [ ] 제출 성공 시 메시지 표시
   - [ ] 3초 후 자동 사라짐
   - [ ] 오류 시 오류 메시지만 표시

---

## 📝 Test Plan

### Test Case 1: 초기 상태
- **Given**: 페이지 로드
- **When**: 폼이 렌더링됨
- **Then**: 성공/오류 메시지 모두 숨겨짐

### Test Case 2: 제출 성공
- **Given**: 폼 정상 입력
- **When**: 제출 버튼 클릭 → 서버 응답 성공
- **Then**: 녹색 "✓ 신청이 완료되었습니다!" 표시

### Test Case 3: 자동 사라짐
- **Given**: 성공 메시지 표시 중
- **When**: 3초 경과
- **Then**: 메시지 자동으로 사라짐

### Test Case 4: 제출 실패
- **Given**: 서버 오류
- **When**: 제출 실패
- **Then**: 빨간색 오류 메시지 표시, 5초 후 사라짐

### Test Case 5: 여러 폼
- **Given**: 2개 폼 배치
- **When**: 첫 번째 폼만 제출
- **Then**: 첫 번째 폼만 성공 메시지 표시

---

## 🔗 Related

- **Epic**: 아임웹 배포 최적화
- **Related to**: STORY-IMWEB-002 (Form 버튼 상태)
- **Depends on**: None
- **Blocks**: None

---

## 📅 Timeline

- **Created**: 2026-01-02
- **Started**: TBD
- **Completed**: TBD
