# 100zoad Config 설정 가이드

**버전:** 1.0.0
**최종 수정일:** 2026-01-02
**대상:** 코드 지식이 없는 오너 및 마케터

---

## 📋 목차

1. [Config란 무엇인가요?](#config란-무엇인가요)
2. [Config 기본 구조](#config-기본-구조)
3. [단계별 설정 가이드](#단계별-설정-가이드)
4. [오류 해결 가이드](#오류-해결-가이드)
5. [자주 묻는 질문 (FAQ)](#자주-묻는-질문-faq)
6. [체크리스트](#체크리스트)

---

## Config란 무엇인가요?

**Config(설정 파일)**는 100zoad 웹 컴포넌트의 동작을 제어하는 설정 모음입니다.

### 🎯 Config로 할 수 있는 것

- ✅ 로고 이미지 변경
- ✅ 메뉴 항목 추가/삭제
- ✅ 색상 변경 (배경색, 텍스트 색 등)
- ✅ 전화번호, 회사명 등 정보 수정
- ✅ 입력폼 필드 추가/삭제
- ✅ 버튼 문구 변경

### ⚠️ 주의사항

1. **따옴표 (' 또는 ")를 지우지 마세요**
   - ❌ 나쁜 예: `siteName: 강남 아파트`
   - ✅ 좋은 예: `siteName: '강남 아파트'`

2. **쉼표(,)를 함부로 추가/삭제하지 마세요**
   - ❌ 나쁜 예: `siteName: '강남 아파트'` (마지막에 쉼표 없음, 하지만 뒤에 항목이 있는 경우)
   - ✅ 좋은 예: `siteName: '강남 아파트',` (뒤에 항목이 있으면 쉼표 필요)

3. **중괄호 { }와 대괄호 [ ]를 임의로 변경하지 마세요**

4. **수정 전에 항상 백업하세요**
   - Ctrl+A → Ctrl+C로 전체 복사
   - 메모장에 붙여넣기
   - 파일로 저장 (예: `backup_2026-01-02.txt`)

---

## Config 기본 구조

```javascript
window.CONFIG = {
  meta: { ... },        // 1. 기본 정보
  header: { ... },      // 2. 헤더 설정 (선택)
  footer: { ... },      // 3. 푸터 설정 (선택)
  form: { ... },        // 4. 입력폼 설정 (필수)
  quickMenu: { ... },   // 5. PC 퀵메뉴 (선택)
  mobileNav: { ... },   // 6. 모바일 내비게이터 (선택)
  responsive: { ... },  // 7. 반응형 설정
  analytics: { ... },   // 8. 분석 도구 (선택)
  fallback: { ... }     // 9. Graceful Degradation
};
```

### 필수 vs 선택

| 항목 | 필수 여부 | 설명 |
|------|-----------|------|
| `meta` | ✅ 필수 | 현장명 등 기본 정보 |
| `header` | ⭕ 선택 | 헤더를 사용하지 않으면 삭제 가능 |
| `footer` | ⭕ 선택 | 푸터를 사용하지 않으면 삭제 가능 |
| `form` | ✅ 필수 | 입력폼은 반드시 필요 |
| `quickMenu` | ⭕ 선택 | PC 퀵메뉴를 사용하지 않으면 삭제 가능 |
| `mobileNav` | ⭕ 선택 | 모바일 내비게이터를 사용하지 않으면 삭제 가능 |
| `responsive` | ✅ 권장 | 반응형 설정 (기본값 사용 가능) |
| `analytics` | ⭕ 선택 | GTM/GA4 사용 시 설정 |
| `fallback` | ✅ 권장 | Graceful Degradation (권장) |

---

## 단계별 설정 가이드

### Step 1: 기본 정보 설정

```javascript
meta: {
  siteName: '강남 센트럴 파크',  // 현장명 (필수)
  version: '1.0.0',              // 수정 불필요
  lastUpdated: '2026-01-01'      // 오늘 날짜로 변경
}
```

**수정 방법:**
1. `siteName`의 값을 현장명으로 변경
2. `lastUpdated`를 오늘 날짜로 변경 (YYYY-MM-DD 형식)

---

### Step 2: 헤더 설정 (선택)

#### 2-1. 로고 변경

```javascript
header: {
  logo: {
    url: 'https://example.com/logo.png',  // 로고 이미지 URL
    alt: '강남 센트럴 파크'                // 대체 텍스트
  },
  ...
}
```

**수정 방법:**
1. 로고 이미지를 아임웹 게시판에 업로드
2. 업로드된 이미지 URL을 복사
3. `url`에 붙여넣기
4. `alt`를 현장명으로 변경

**로고 이미지 권장 사항:**
- 크기: 512x512px
- 형식: PNG (투명 배경 권장)
- 용량: 100KB 이하

---

#### 2-2. 메뉴 항목 변경

```javascript
header: {
  ...
  menu: [
    { text: '단지정보', target: '#section1' },  // 항목 1
    { text: '입지환경', target: '#section2' },  // 항목 2
    { text: '세대정보', target: '#section3' }   // 항목 3
    // 최대 6개까지 추가 가능
  ],
  ...
}
```

**메뉴 추가 방법:**
1. 마지막 항목 뒤에 쉼표(,) 추가
2. 새 줄에 `{ text: '메뉴명', target: '#섹션ID' },` 추가

**예시:**
```javascript
menu: [
  { text: '단지정보', target: '#about' },
  { text: '입지환경', target: '#location' },
  { text: '세대정보', target: '#plan' },
  { text: '커뮤니티', target: '#community' },  // 추가된 항목
  { text: '분양안내', target: '#info' }
]
```

**메뉴 삭제 방법:**
1. 삭제할 줄 전체를 지우기
2. 이전 줄 끝에 쉼표(,)가 있는지 확인

---

#### 2-3. 색상 변경

```javascript
header: {
  ...
  styles: {
    bgColor: '#ffffff',      // 배경색
    textColor: '#333333',    // 텍스트 색
    hoverColor: '#007bff'    // 마우스 올렸을 때 색
  }
}
```

**색상 코드 찾기:**
1. Google에서 "color picker" 검색
2. 원하는 색 선택
3. HEX 코드 복사 (예: `#ff5733`)
4. Config에 붙여넣기

**주요 색상 예시:**
- 흰색: `#ffffff`
- 검정: `#000000`
- 파랑: `#007bff`
- 빨강: `#dc3545`
- 초록: `#28a745`
- 회색: `#6c757d`

---

### Step 3: 입력폼 설정 (필수)

#### 3-1. 추가 필드 설정

```javascript
form: {
  ...
  fields: {
    name: { ... },     // 이름 (필수)
    phone: { ... },    // 전화번호 (필수)
    additional: [
      {
        type: 'dropdown',
        name: 'area',
        label: '관심평형',
        options: ['59㎡', '84㎡', '114㎡'],
        required: true
      }
    ]
  }
}
```

**필드 타입:**
- `text`: 텍스트 입력
- `dropdown`: 드롭다운 선택
- `datetime`: 날짜+시간 선택

**필드 추가 예시:**
```javascript
additional: [
  {
    type: 'text',
    name: 'address',
    label: '주소',
    placeholder: '서울시 강남구...',
    required: false
  },
  {
    type: 'dropdown',
    name: 'area',
    label: '관심평형',
    options: ['59㎡', '84㎡', '114㎡'],
    required: true
  },
  {
    type: 'datetime',
    name: 'visitDate',
    label: '방문 희망 일시',
    required: false
  }
]
```

---

#### 3-2. 메시지 변경

```javascript
form: {
  ...
  messages: {
    success: '✓ 신청이 완료되었습니다!',
    error: '제출 중 오류가 발생했습니다.'
  }
}
```

**수정 방법:**
- `success`: 제출 성공 시 표시되는 메시지
- `error`: 오류 발생 시 표시되는 메시지
- 줄바꿈을 넣으려면 `\n` 사용

**예시:**
```javascript
messages: {
  success: '✓ 신청이 완료되었습니다!\n빠른 시일 내에 연락드리겠습니다.',
  error: '⚠️ 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'
}
```

---

### Step 4: 퀵메뉴 설정 (선택)

```javascript
quickMenu: {
  enabled: true,  // 활성화 (true) 또는 비활성화 (false)
  ...
  buttons: [
    {
      text: '입력폼',       // 버튼 텍스트
      icon: '📝',         // 아이콘 (emoji)
      action: 'openForm',  // 액션
      color: '#007bff'     // 버튼 색
    },
    {
      text: '전화걸기',
      icon: '📞',
      action: 'call',
      phone: '1588-0000',  // 전화번호
      color: '#28a745'
    }
  ]
}
```

**액션 종류:**
- `openForm`: 입력폼 팝업 열기
- `call`: 전화걸기
- `link`: URL 이동

**버튼 추가 예시:**
```javascript
buttons: [
  {
    text: '입력폼',
    icon: '📝',
    action: 'openForm',
    color: '#007bff'
  },
  {
    text: '전화걸기',
    icon: '📞',
    action: 'call',
    phone: '1588-0000',
    color: '#28a745'
  },
  {
    text: '카카오톡',
    icon: '💬',
    action: 'link',
    url: 'https://pf.kakao.com/_yourID',
    target: '_blank',
    color: '#fee500'
  }
]
```

---

## 오류 해결 가이드

### 📍 오류 확인 방법

1. **브라우저 개발자 도구 열기**
   - Windows/Linux: `F12` 또는 `Ctrl+Shift+I`
   - Mac: `Cmd+Option+I`

2. **Console 탭 클릭**
   - 빨간색 오류 메시지 확인

---

### ❌ 자주 발생하는 오류

#### 오류 1: Config 객체가 정의되지 않았습니다

**오류 메시지:**
```
❌ Config 검증 실패:
  1. [Window.CONFIG] Window.CONFIG 객체가 정의되지 않았습니다.
```

**원인:**
- `window.CONFIG = { ... }` 전체가 삭제됨
- `<script>` 태그가 누락됨

**해결 방법:**
1. `main.html` 파일의 Config 부분 전체를 복사
2. 백업 파일에서 복원
3. 예시 파일(`examples/`)에서 복사

---

#### 오류 2: meta.siteName이 필수입니다

**오류 메시지:**
```
❌ Config 검증 실패:
  1. [meta.siteName] meta.siteName이 필수입니다. 현장명을 입력해주세요.
```

**원인:**
- `meta.siteName` 값이 비어 있음
- `meta` 블록이 삭제됨

**해결 방법:**
```javascript
meta: {
  siteName: '강남 센트럴 파크',  // 현장명 입력
  version: '1.0.0',
  lastUpdated: '2026-01-01'
}
```

---

#### 오류 3: header.logo.url이 필수입니다

**오류 메시지:**
```
❌ Config 검증 실패:
  1. [header.logo.url] header.logo.url이 필수입니다. 로고 이미지 URL을 설정해주세요.
```

**원인:**
- `header.logo.url` 값이 비어 있음

**해결 방법:**
```javascript
header: {
  logo: {
    url: 'https://example.com/logo.png',  // 실제 로고 URL로 변경
    alt: '현장명'
  },
  ...
}
```

---

#### 오류 4: HTTPS 보안 경고

**오류 메시지:**
```
⚠️ HTTPS 보안: header.logo.url은 HTTPS URL을 사용해야 합니다.
```

**원인:**
- HTTP URL 사용 (예: `http://example.com/logo.png`)

**해결 방법:**
- HTTPS URL로 변경 (예: `https://example.com/logo.png`)
- 아임웹 게시판에 업로드하면 자동으로 HTTPS URL 생성

---

#### 오류 5: 따옴표 누락

**오류 메시지:**
```
Uncaught SyntaxError: Unexpected identifier
```

**원인:**
- 문자열 값에 따옴표가 없음

**잘못된 예:**
```javascript
siteName: 강남 아파트  // ❌ 따옴표 없음
```

**올바른 예:**
```javascript
siteName: '강남 아파트'  // ✅ 작은따옴표
// 또는
siteName: "강남 아파트"  // ✅ 큰따옴표
```

---

#### 오류 6: 쉼표 누락 또는 추가

**오류 메시지:**
```
Uncaught SyntaxError: Unexpected token
```

**원인:**
- 항목 사이에 쉼표가 없음
- 마지막 항목 뒤에 불필요한 쉼표

**잘못된 예:**
```javascript
meta: {
  siteName: '강남 아파트'  // ❌ 쉼표 없음
  version: '1.0.0'
}

menu: [
  { text: '단지정보', target: '#about' },
  { text: '입지환경', target: '#location' },  // ❌ 마지막에 쉼표
]
```

**올바른 예:**
```javascript
meta: {
  siteName: '강남 아파트',  // ✅ 쉼표 있음
  version: '1.0.0'          // ✅ 마지막은 쉼표 없어도 됨
}

menu: [
  { text: '단지정보', target: '#about' },
  { text: '입지환경', target: '#location' }  // ✅ 마지막 쉼표 없음
]
```

---

## 자주 묻는 질문 (FAQ)

### Q1. 헤더를 사용하지 않으려면 어떻게 하나요?

**답변:**
`header: { ... }` 블록 전체를 삭제하거나 주석 처리하세요.

```javascript
window.CONFIG = {
  meta: { ... },
  // header: { ... },  // 주석 처리
  footer: { ... },
  form: { ... }
};
```

---

### Q2. 입력폼 필드 순서를 바꾸려면?

**답변:**
`additional` 배열 안에서 항목 순서를 바꾸면 됩니다.

```javascript
// 변경 전
additional: [
  { type: 'text', name: 'address', ... },
  { type: 'dropdown', name: 'area', ... }
]

// 변경 후 (순서 바뀜)
additional: [
  { type: 'dropdown', name: 'area', ... },
  { type: 'text', name: 'address', ... }
]
```

---

### Q3. 전화번호를 여러 개 표시하려면?

**답변:**
퀵메뉴와 모바일 내비게이터에 버튼을 추가하세요.

```javascript
quickMenu: {
  enabled: true,
  buttons: [
    {
      text: '대표번호',
      icon: '📞',
      action: 'call',
      phone: '1588-0000',
      color: '#28a745'
    },
    {
      text: '긴급문의',
      icon: '☎️',
      action: 'call',
      phone: '010-1234-5678',
      color: '#dc3545'
    }
  ]
}
```

---

### Q4. 컴포넌트가 표시되지 않습니다.

**가능한 원인:**
1. Config 오류 → 개발자 도구 Console 확인
2. 인터넷 연결 문제 → 네트워크 확인
3. Cloudflare Pages 장애 → 잠시 후 재시도
4. 컴포넌트 태그 누락 → `<zoad-header>` 등이 있는지 확인

---

### Q5. 색상을 그라데이션으로 할 수 있나요?

**답변:**
아쉽게도 Config에서는 단색만 지원됩니다. 그라데이션은 CSS 직접 수정이 필요합니다.

---

## 체크리스트

설정 완료 후 아래 항목을 확인하세요.

### ✅ 필수 항목

- [ ] `meta.siteName`에 현장명 입력
- [ ] `form.airtable.workerUrl`에 실제 Cloudflare Worker URL 입력
- [ ] `form.legal.termsText`에 실제 이용약관 입력
- [ ] `form.legal.privacyText`에 실제 개인정보처리방침 입력

### ✅ 헤더 사용 시

- [ ] `header.logo.url`에 로고 이미지 URL 입력
- [ ] `header.pageType`이 "onepage" 또는 "multipage"로 설정됨
- [ ] `header.menu` 항목이 6개 이하
- [ ] 모든 URL이 HTTPS로 시작

### ✅ 푸터 사용 시

- [ ] `footer.line1.siteName`과 `footer.line1.phone` 입력
- [ ] `footer.line2.company`, `ceo`, `phone`, `businessNumber` 입력
- [ ] `footer.legal.termsUrl`과 `privacyUrl` 입력 (HTTPS)

### ✅ 퀵메뉴/모바일 내비게이터 사용 시

- [ ] 버튼이 최대 개수 이하 (퀵메뉴: 4개, 모바일: 3개)
- [ ] `action: 'call'`인 버튼에 `phone` 값 입력
- [ ] `action: 'link'`인 버튼에 `url` 값 입력

### ✅ 테스트

- [ ] 브라우저 개발자 도구(F12)에서 Console 오류 없음
- [ ] 모든 컴포넌트가 정상 표시됨
- [ ] 입력폼 제출 테스트 성공
- [ ] 퀵메뉴/모바일 내비게이터 버튼 동작 확인
- [ ] 모바일 화면에서도 정상 작동

---

## 📞 지원

오류가 계속 발생하거나 도움이 필요하면 문의하세요.

**문의 방법:**
- 이메일: merge@100zoad.local
- 개발자 도구 Console 스크린샷 첨부
- Config 파일 전체 공유 (민감 정보는 *** 처리)

---

**문서 버전:** 1.0.0
**최종 수정일:** 2026-01-02
**작성자:** merge
