# HTTPS 설정 가이드 - 100zoad Web Components

**작성일:** 2026-01-02
**작성자:** merge
**관련 스토리:** STORY-027 (HTTPS 강제 및 데이터 암호화)
**NFR:** NFR-003 (데이터 전송 암호화)

---

## 개요

100zoad 웹 컴포넌트 시스템은 모든 데이터 전송을 HTTPS로 암호화하여 리드 개인정보를 보호합니다. 이 문서는 Cloudflare Pages 및 Workers의 HTTPS 설정을 안내합니다.

---

## Cloudflare Pages HTTPS 설정

### 1. 자동 HTTPS 지원

Cloudflare Pages는 **모든 프로젝트에 자동으로 HTTPS를 제공**합니다.

- **무료 SSL/TLS 인증서**: Let's Encrypt를 통해 자동 발급
- **자동 갱신**: 인증서 만료 전 자동 갱신
- **TLS 버전**: TLS 1.2 및 TLS 1.3 지원
- **HTTP → HTTPS 리다이렉트**: 기본 활성화

### 2. Cloudflare Dashboard 설정 확인

1. **Cloudflare Dashboard 접속**: https://dash.cloudflare.com/
2. **Pages 프로젝트 선택**: `100zoad-components` 프로젝트
3. **Settings → SSL/TLS 탭 이동**
4. **SSL/TLS 설정 확인**:
   - **Always Use HTTPS**: `ON` (권장)
   - **Automatic HTTPS Rewrites**: `ON` (권장)
   - **Opportunistic Encryption**: `ON` (권장)

### 3. HTTP → HTTPS 리다이렉트 강화

Cloudflare Pages는 기본적으로 HTTP → HTTPS 리다이렉트를 제공하지만, 클라이언트 사이드에서도 추가로 강제합니다.

**파일:** `src/main.js` (lines 8-19)

```javascript
// HTTPS 강제 리다이렉트 (프로덕션 환경에서만)
if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isDevelopment = import.meta.env?.DEV || false;

  if (!isLocalhost && !isDevelopment) {
    console.warn('⚠️ HTTP 감지: HTTPS로 리다이렉트합니다...');
    window.location.href = window.location.href.replace('http://', 'https://');
  }
}
```

**동작:**
- 프로덕션 환경에서 HTTP로 접속 시 자동으로 HTTPS로 리다이렉트
- Localhost 및 개발 환경은 예외 처리

---

## Cloudflare Workers HTTPS 설정

### 1. Workers HTTPS 기본 지원

Cloudflare Workers는 **기본적으로 HTTPS만 지원**합니다. HTTP 요청은 자동으로 거부됩니다.

### 2. Worker 보안 헤더 구현

**파일:** `workers/airtable-proxy.js` (lines 47-63)

```javascript
function getSecurityHeaders() {
  return {
    // HTTPS 강제: 브라우저가 1년간 HTTPS만 사용하도록 강제
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    // XSS 보호
    'X-Content-Type-Options': 'nosniff',
    // 클릭재킹 방지
    'X-Frame-Options': 'DENY',
    // Referrer 정책
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
}
```

**주요 헤더:**

1. **`Strict-Transport-Security` (HSTS)**
   - 브라우저가 1년간 HTTPS만 사용하도록 강제
   - `includeSubDomains`: 모든 서브도메인에 적용
   - `preload`: HSTS preload 리스트 등록 가능 (Chrome, Firefox 등)

2. **`X-Content-Type-Options`**
   - MIME 스니핑 방지 (XSS 공격 차단)

3. **`X-Frame-Options`**
   - 클릭재킹 공격 방지 (iframe 삽입 차단)

4. **`Referrer-Policy`**
   - HTTPS → HTTP 전환 시 Referrer 정보 보호

### 3. 프로덕션 환경 HTTPS 검증

**파일:** `workers/airtable-proxy.js` (lines 198-210)

```javascript
// HTTPS 강제 확인 (프로덕션 환경)
if (env.ENVIRONMENT === 'production' && url.protocol !== 'https:') {
  return new Response(JSON.stringify({
    success: false,
    error: 'HTTPS 연결만 허용됩니다.'
  }), {
    status: 403,
    headers: {
      'Content-Type': 'application/json',
      ...getSecurityHeaders()
    }
  });
}
```

**동작:**
- 프로덕션 환경에서 HTTP 요청 시 403 Forbidden 응답
- 개발 환경 (localhost)에서는 허용

### 4. 환경변수 설정

**Wrangler CLI를 사용한 환경변수 설정:**

```bash
# ENVIRONMENT 설정
npx wrangler secret put ENVIRONMENT
# 입력: production

# Airtable API Key 설정 (HTTPS 전송)
npx wrangler secret put AIRTABLE_API_KEY
# 입력: patXXXXXXXXXXXXXXXX
```

---

## Mixed Content 방지

Mixed Content는 HTTPS 페이지에서 HTTP 리소스를 로드할 때 발생하는 보안 경고입니다.

### 1. Config URL 검증

**파일:** `src/core/config-parser.js` (lines 184-209)

```javascript
function isSecureUrl(url) {
  if (!url) return true; // 빈 URL은 허용

  // 상대 경로는 허용
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('#')) {
    return true;
  }

  // 프로토콜이 없으면 상대 경로로 간주
  if (!url.includes('://') && !url.startsWith('//')) {
    return true;
  }

  // HTTP는 허용하지 않음 (Mixed Content)
  if (url.toLowerCase().startsWith('http://')) {
    return false;
  }

  return true; // HTTPS, data:, blob: 등은 허용
}
```

**검증 대상 URL:**
- `header.logo.url` (로고 이미지)
- `footer.legal.termsUrl` (이용약관 URL)
- `footer.legal.privacyUrl` (개인정보처리방침 URL)
- `form.airtable.workerUrl` (Cloudflare Worker URL)

**오류 메시지 예시:**
```
❌ Config 검증 실패:
  1. [header.logo.url] ⚠️ HTTPS 보안: header.logo.url은 HTTPS URL을 사용해야 합니다. HTTP는 Mixed Content 오류를 발생시킵니다.
```

### 2. Form Component Worker URL 검증

**파일:** `src/components/form/form.js` (lines 1013-1018)

```javascript
// HTTPS 검증 (NFR-003: 데이터 전송 암호화)
if (!workerUrl.startsWith('https://') && !workerUrl.startsWith('/')) {
  console.error('⚠️ HTTPS 보안 오류: Worker URL은 HTTPS를 사용해야 합니다.');
  console.error('현재 URL:', workerUrl);
  throw new Error('보안 오류: HTTPS 연결만 허용됩니다. Worker URL을 확인해주세요.');
}
```

**동작:**
- 폼 제출 시 Worker URL이 HTTPS인지 런타임 검증
- HTTP URL 발견 시 제출 차단 및 오류 메시지 표시

---

## Acceptance Criteria 검증

### ✅ AC1: HTTPS 강제 적용 (HTTP → HTTPS 리다이렉트)

**구현:**
- Cloudflare Pages 기본 HTTPS 리다이렉트
- 클라이언트 사이드 리다이렉트 (`src/main.js`)
- Worker 프로덕션 환경 HTTPS 검증 (`workers/airtable-proxy.js`)

**테스트:**
```bash
# HTTP로 접속 시 자동 HTTPS 리다이렉트 확인
curl -I http://100zoad-components.pages.dev
# 예상: Location: https://100zoad-components.pages.dev (301 또는 302)
```

### ✅ AC2: SSL/TLS 인증서 적용 (Cloudflare 제공)

**구현:**
- Cloudflare Pages 자동 SSL/TLS 인증서 발급 및 관리
- Let's Encrypt 인증서 사용

**확인:**
```bash
# SSL 인증서 정보 확인
openssl s_client -connect 100zoad-components.pages.dev:443 -servername 100zoad-components.pages.dev
# 예상: Certificate chain 표시, Cloudflare Inc. 발급
```

또는 브라우저에서:
1. URL 왼쪽 자물쇠 아이콘 클릭
2. "인증서" 또는 "연결 정보" 확인
3. Cloudflare 발급 인증서 확인

### ✅ AC3: Airtable API 호출 HTTPS 사용

**구현:**
- Worker에서 Airtable API 호출 시 HTTPS 사용 (`workers/airtable-proxy.js:121`)

```javascript
const url = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_NAME}`;
```

**확인:**
- Worker 로그에서 Airtable API 호출 URL 확인
- HTTPS로만 호출됨

### ✅ AC4: Mixed Content 오류 없음

**구현:**
- Config URL 검증 로직 (`src/core/config-parser.js:isSecureUrl()`)
- Form Worker URL 검증 (`src/components/form/form.js:1013-1018`)

**테스트:**
1. **브라우저 개발자 도구 콘솔 확인**:
   ```
   # Mixed Content 오류가 없어야 함
   # 예상: 콘솔에 "Mixed Content" 관련 경고 없음
   ```

2. **Config 검증 테스트**:
   ```javascript
   // HTTP URL 설정 시 Config 검증 실패 확인
   Window.CONFIG = {
     header: {
       logo: {
         url: 'http://example.com/logo.png' // HTTP (Mixed Content)
       }
     }
   };
   // 예상: Config 검증 오류 발생
   ```

---

## 문제 해결

### 문제 1: Mixed Content 경고가 발생합니다

**증상:**
```
Mixed Content: The page at 'https://example.com' was loaded over HTTPS, but requested an insecure image 'http://example.com/logo.png'. This request has been blocked.
```

**해결:**
1. Config 파일에서 모든 URL을 HTTPS로 변경:
   ```javascript
   Window.CONFIG = {
     header: {
       logo: {
         url: 'https://example.com/logo.png' // ✓ HTTPS
       }
     }
   };
   ```

2. 상대 경로 사용:
   ```javascript
   logo: {
     url: '/images/logo.png' // ✓ 상대 경로
   }
   ```

### 문제 2: Worker HTTPS 오류

**증상:**
```
보안 오류: HTTPS 연결만 허용됩니다. Worker URL을 확인해주세요.
```

**해결:**
1. Config에서 Worker URL을 HTTPS로 변경:
   ```javascript
   form: {
     airtable: {
       workerUrl: 'https://your-worker.workers.dev/submit' // ✓ HTTPS
     }
   }
   ```

### 문제 3: HSTS 헤더 적용 확인

**확인 방법:**
```bash
curl -I https://your-worker.workers.dev/submit
```

**예상 응답:**
```
HTTP/2 204
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
x-frame-options: DENY
referrer-policy: strict-origin-when-cross-origin
```

---

## 배포 체크리스트

### Cloudflare Pages 배포 전

- [ ] Config의 모든 URL이 HTTPS인지 확인
- [ ] Cloudflare Pages 프로젝트 SSL/TLS 설정 확인 (Always Use HTTPS: ON)
- [ ] 브라우저 콘솔에서 Mixed Content 경고 없는지 확인

### Cloudflare Workers 배포 전

- [ ] 환경변수 `ENVIRONMENT=production` 설정
- [ ] Airtable API Key, Base ID, Table Name 환경변수 설정
- [ ] Worker 배포 URL이 HTTPS인지 확인

### 배포 후 검증

- [ ] HTTP → HTTPS 리다이렉트 테스트
- [ ] SSL 인증서 유효성 확인 (브라우저 자물쇠 아이콘)
- [ ] 입력폼 제출 시 HTTPS로 Worker 호출되는지 확인
- [ ] Airtable API 호출이 HTTPS로 이루어지는지 확인
- [ ] 브라우저 개발자 도구에서 Mixed Content 경고 없는지 확인

---

## 추가 보안 강화 (선택 사항)

### 1. HSTS Preload 리스트 등록

Cloudflare Pages 도메인을 HSTS Preload 리스트에 등록하여 첫 방문부터 HTTPS를 강제할 수 있습니다.

**등록 방법:**
1. https://hstspreload.org/ 접속
2. 도메인 입력 (예: 100zoad-components.pages.dev)
3. 제출 (Cloudflare에서 HSTS 헤더가 이미 설정되어 있으므로 승인됨)

### 2. Content Security Policy (CSP) 추가

Worker에서 CSP 헤더를 추가하여 Mixed Content를 더욱 강력하게 차단할 수 있습니다.

```javascript
'Content-Security-Policy': 'upgrade-insecure-requests; default-src https: \'unsafe-inline\' \'unsafe-eval\'; img-src https: data:;'
```

---

## 참고 문서

- [Cloudflare Pages SSL/TLS 문서](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Workers HTTPS](https://developers.cloudflare.com/workers/)
- [MDN Mixed Content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)
- [HSTS Preload](https://hstspreload.org/)

---

**문서 버전:** 1.0.0
**최종 수정:** 2026-01-02
**작성자:** merge
