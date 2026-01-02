# Sprint: 아임웹 배포 버그 수정

**Sprint Goal**: 아임웹 환경에서 Header, Footer, Form 컴포넌트가 정상적으로 작동하도록 수정

**Start Date**: 2026-01-02
**End Date**: TBD
**Total Story Points**: 12

---

## 📊 Sprint Overview

### Epic
**아임웹 배포 최적화**

### Background
두산위브더제니스 센트럴천안 프로젝트의 Header, Footer, Form 컴포넌트를 아임웹에 배포한 결과, 다음 문제들이 발견됨:

1. Pretendard 폰트가 적용되지 않음 (Apple SD Gothic으로 표시)
2. Form 버튼이 항상 회색으로 표시되고 비활성화됨
3. Form 성공 메시지가 페이지 로드 시부터 항상 표시됨
4. Header가 투명하게 표시됨
5. Header의 메뉴와 버튼이 보이지 않음

### Root Cause
아임웹의 기본 CSS가 컴포넌트 CSS보다 높은 우선순위를 가지고 있어 스타일이 override됨

---

## 📋 Stories

| Story ID | Title | Priority | Points | Status |
|----------|-------|----------|--------|--------|
| STORY-IMWEB-001 | Pretendard 폰트 강제 적용 | High | 3 | Pending |
| STORY-IMWEB-002 | Form 버튼 초기 상태 수정 | High | 2 | Pending |
| STORY-IMWEB-003 | Form 성공 메시지 초기 상태 수정 | High | 2 | Pending |
| STORY-IMWEB-004 | Header 배경색 및 메뉴 렌더링 수정 | Critical | 5 | Pending |

**Total**: 12 Story Points

---

## 🎯 Sprint Goals

### Primary Goals
1. ✅ Header가 흰색 배경으로 표시되고 모든 메뉴가 보임
2. ✅ Form 버튼이 정상적으로 작동함 (파란색, 클릭 가능)
3. ✅ Form 메시지가 적절한 타이밍에만 표시됨
4. ✅ 모든 텍스트가 Pretendard 폰트로 표시됨

### Secondary Goals
- 여러 Form을 배치해도 독립적으로 작동
- 모바일/PC 모두 정상 작동
- 브라우저 호환성 확보

---

## 🔧 Technical Approach

### Strategy 1: CSS 우선순위 강화
```css
/* !important 사용 */
.zoad-header {
  background-color: #ffffff !important;
  opacity: 1 !important;
  visibility: visible !important;
}
```

### Strategy 2: 더 구체적인 선택자
```css
/* ID + Class 조합 */
#zoad-header-container .zoad-header {
  ...
}
```

### Strategy 3: JavaScript 강제 적용
```javascript
// 렌더링 후 스타일 강제 설정
setTimeout(() => {
  element.style.backgroundColor = '#ffffff';
}, 100);
```

### Strategy 4: 폰트 로딩 방식 변경
```html
<!-- @import 대신 link 태그 사용 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
```

---

## 📝 Acceptance Criteria (Sprint Level)

Sprint 완료 기준:

- [ ] **Criterion 1**: Header
  - [ ] 흰색 배경으로 표시
  - [ ] 로고 표시
  - [ ] 5개 메뉴 모두 표시 (PC)
  - [ ] "관심고객등록" 버튼이 두산 블루로 표시
  - [ ] 모바일 햄버거 메뉴 작동

- [ ] **Criterion 2**: Footer
  - [ ] 모든 정보 표시
  - [ ] 전화번호 클릭 시 전화 걸기
  - [ ] Pretendard 폰트 적용

- [ ] **Criterion 3**: Form
  - [ ] 신청하기 버튼이 파란색으로 표시
  - [ ] 버튼 클릭 가능
  - [ ] 초기에 성공/오류 메시지 숨겨짐
  - [ ] 제출 성공 시 성공 메시지 표시
  - [ ] 여러 폼 독립적으로 작동
  - [ ] Pretendard 폰트 적용

- [ ] **Criterion 4**: 폰트
  - [ ] 모든 컴포넌트가 Pretendard 폰트 사용
  - [ ] font-weight 300, 500, 700만 사용

---

## 🧪 Testing Plan

### Manual Testing
1. 아임웹에 배포
2. PC 브라우저 테스트 (Chrome, Safari, Edge)
3. 모바일 브라우저 테스트 (iOS Safari, Android Chrome)
4. DevTools로 CSS Computed 값 확인
5. 브라우저 콘솔에서 JavaScript 오류 확인

### Test Scenarios
1. **초기 로드 테스트**: 모든 요소가 정상 표시되는지 확인
2. **인터랙션 테스트**: 버튼, 메뉴, 폼 제출 등
3. **반응형 테스트**: PC/모바일 레이아웃
4. **여러 폼 테스트**: 2개 이상 폼 배치
5. **스크롤 테스트**: 헤더 고정 및 배경색 유지

---

## 📂 Files to Modify

```
C:\Users\merge\OneDrive\Documents\100zoad\dist\imweb_doosanweve_cheonan_kimjunsu\
├── Header.html  → CSS 강화, JavaScript 디버깅, 폰트 로딩 수정
├── Footer.html  → 폰트 로딩 수정, CSS 강화
└── Form.html    → CSS 강화, 초기 상태 수정, 폰트 로딩 수정
```

---

## 🚀 Implementation Order

### Priority 1 (Critical)
1. **STORY-IMWEB-004**: Header 배경색 및 메뉴 렌더링 (5 points)
   - 사용자가 사이트를 탐색할 수 없는 critical 이슈

### Priority 2 (High)
2. **STORY-IMWEB-002**: Form 버튼 초기 상태 (2 points)
   - 폼 제출이 불가능한 high 이슈
3. **STORY-IMWEB-003**: Form 성공 메시지 초기 상태 (2 points)
   - UX 혼란을 야기하는 high 이슈

### Priority 3 (High)
4. **STORY-IMWEB-001**: Pretendard 폰트 강제 적용 (3 points)
   - 브랜드 일관성 문제

---

## 📈 Success Metrics

### Definition of Done
- [ ] 모든 Acceptance Criteria 충족
- [ ] 실제 아임웹 환경에서 테스트 완료
- [ ] 브라우저 콘솔에 에러 없음
- [ ] 모바일/PC 모두 정상 작동
- [ ] 사용자 테스트 통과

### Key Metrics
- **Critical Issues**: 1개 (Header 렌더링)
- **High Issues**: 3개 (폰트, Form 버튼, Form 메시지)
- **Total Story Points**: 12

---

## ⚠️ Risks & Mitigation

### Risk 1: 아임웹 CSS 우선순위
- **Risk**: `!important`를 사용해도 아임웹 CSS가 우선될 수 있음
- **Mitigation**: JavaScript로 인라인 스타일 강제 적용

### Risk 2: 폰트 로딩 실패
- **Risk**: CDN에서 폰트를 로드하지 못할 수 있음
- **Mitigation**: fallback 폰트 지정, 로컬 폰트 파일 사용 고려

### Risk 3: 여러 폼 충돌
- **Risk**: uniqueId 생성이 실패하거나 충돌할 수 있음
- **Mitigation**: 타임스탬프 + 랜덤 문자열 조합으로 고유성 보장

---

## 📞 Support

### Questions?
- GitHub Issues
- Email: support@100zoad.com

### Resources
- [Pretendard 폰트 공식 문서](https://github.com/orioncactus/pretendard)
- [아임웹 코드위젯 가이드](https://imweb.me/faq)

---

## 📅 Timeline

- **2026-01-02**: Sprint 시작, 4개 스토리 생성
- **TBD**: STORY-IMWEB-004 완료 (Critical)
- **TBD**: STORY-IMWEB-002, 003 완료 (High)
- **TBD**: STORY-IMWEB-001 완료 (High)
- **TBD**: Sprint 종료, 배포 완료

---

## 🎉 Expected Outcome

Sprint 완료 후:
- ✅ Header가 정상적으로 표시되고 네비게이션 가능
- ✅ Form이 정상적으로 작동하고 리드 수집 가능
- ✅ 모든 컴포넌트가 Pretendard 폰트로 표시
- ✅ 두산위브더제니스 센트럴천안 프로젝트 아임웹 배포 완료
