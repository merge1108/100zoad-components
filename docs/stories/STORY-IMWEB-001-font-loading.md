# STORY-IMWEB-001: Pretendard 폰트 강제 적용

**Status**: Pending
**Priority**: High
**Sprint**: Sprint 2
**Story Points**: 3

---

## 📋 User Story

**As a** 사이트 방문자
**I want** 모든 텍스트가 Pretendard 폰트로 표시되기를
**So that** 일관된 브랜드 경험을 받을 수 있다

---

## 🎯 Acceptance Criteria

- [ ] **AC1**: Header의 모든 텍스트(로고, 메뉴, 버튼)가 Pretendard 폰트로 표시됨
- [ ] **AC2**: Footer의 모든 텍스트가 Pretendard 폰트로 표시됨
- [ ] **AC3**: Form의 모든 텍스트(제목, 라벨, 버튼, 메시지)가 Pretendard 폰트로 표시됨
- [ ] **AC4**: 아임웹의 기본 CSS보다 높은 우선순위로 폰트가 적용됨
- [ ] **AC5**: 폰트 weight가 300, 500, 700만 사용됨

---

## 🔍 Problem Analysis

### Current Issue
- Pretendard CDN import가 작동하지 않음
- 아임웹의 Apple SD Gothic이 override함
- font-family 선언이 충분히 구체적이지 않음

### Root Cause
1. `@import` 방식이 아임웹 환경에서 늦게 로드됨
2. CSS 우선순위가 낮음 (아임웹 기본 CSS > 컴포넌트 CSS)
3. 선택자가 충분히 구체적이지 않음

---

## 💡 Solution

### Approach 1: Inline Font Loading + !important
```css
/* CDN 방식 대신 <link> 태그 사용 */
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">

/* 모든 font-family에 !important 추가 */
* {
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}
```

### Approach 2: 더 구체적인 선택자
```css
/* 모든 요소에 강제 적용 */
#zoad-header *,
#zoad-header *::before,
#zoad-header *::after,
.zoad-form-container *,
.zoad-footer * {
  font-family: "Pretendard", sans-serif !important;
}
```

### Recommended: Approach 1 + 2 조합
- `<link>` 태그로 폰트 먼저 로드
- 구체적인 선택자 + `!important`로 강제 적용

---

## 🛠️ Implementation Tasks

1. **Header.html**
   - [ ] `@import` 제거, `<link>` 태그로 변경
   - [ ] 모든 선택자에 `!important` 추가
   - [ ] font-weight 검증 (300, 500, 700만 사용)

2. **Footer.html**
   - [ ] `@import` 제거, `<link>` 태그로 변경
   - [ ] 모든 선택자에 `!important` 추가
   - [ ] font-weight 검증

3. **Form.html**
   - [ ] `@import` 제거, `<link>` 태그로 변경
   - [ ] 모든 선택자에 `!important` 추가
   - [ ] font-weight 검증

---

## 📝 Test Plan

### Manual Testing
1. 아임웹에 배포
2. Chrome DevTools에서 computed font-family 확인
3. 각 컴포넌트의 모든 텍스트 요소 검사
4. 모바일/PC 모두 테스트

### Expected Result
- 모든 텍스트: `font-family: Pretendard`
- 기본: font-weight 300
- 라벨/링크: font-weight 500
- 제목/버튼: font-weight 700

---

## 🔗 Related

- **Epic**: 아임웹 배포 최적화
- **Depends on**: None
- **Blocks**: None

---

## 📅 Timeline

- **Created**: 2026-01-02
- **Started**: TBD
- **Completed**: TBD
