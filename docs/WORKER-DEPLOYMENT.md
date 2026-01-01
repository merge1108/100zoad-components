# Cloudflare Worker 배포 가이드

**작성일:** 2026-01-01
**스토리:** STORY-014 - Cloudflare Worker - Airtable API 프록시
**목적:** Airtable API 키를 안전하게 보호하면서 입력폼 데이터를 전송하는 서버리스 함수 배포

---

## 목차

1. [사전 준비](#사전-준비)
2. [Airtable 설정](#airtable-설정)
3. [Cloudflare 계정 설정](#cloudflare-계정-설정)
4. [Worker 배포](#worker-배포)
5. [환경변수 설정](#환경변수-설정)
6. [테스트](#테스트)
7. [문제 해결](#문제-해결)

---

## 사전 준비

### 1. Node.js 및 npm 설치

Worker 배포를 위해서는 Wrangler CLI가 필요합니다. Wrangler는 Node.js 환경에서 실행됩니다.

```bash
# Node.js 버전 확인 (16.13.0 이상 권장)
node --version

# npm 버전 확인
npm --version
```

### 2. Wrangler CLI 설치

```bash
# 전역 설치
npm install -g wrangler

# 설치 확인
wrangler --version
```

---

## Airtable 설정

### 1. Airtable 계정 생성

- [https://airtable.com/signup](https://airtable.com/signup)에서 계정 생성
- Team 플랜 권장 (월 1,000 리드 처리에 충분)

### 2. Base 생성

1. Airtable에 로그인
2. 새 Base 생성 (또는 기존 Base 사용)
3. Table 이름: **Leads** (권장)

### 3. Table 필드 구성

**MVP 설계:** CRM 기능을 배제하고 리드 전달에만 집중합니다. 추가 입력 필드는 `Inquiry_Container`에 JSON 형태로 저장하여 유연성을 확보합니다.

다음 필드를 Table에 추가하세요:

| 필드명 | 타입 | 필수 | 설정 방법 |
|--------|------|------|----------|
| `Lead_ID` | Formula | ✓ | 수식: `"lead-"&RECORD_ID()` 입력 |
| `Lead_Name` | Single Line Text | ✓ | 기본 필드 |
| `Lead_Phone_Number` | Phone Number | ✓ | 기본 필드 |
| `Site_Name` | Single Line Text | ✓ | 기본 필드 (현장명, config에서 전달) |
| `Submit_Date_and_Time` | Date & Time | ✓ | "Include time" 옵션 활성화, 24시간 형식 |
| `Inquiry_Container` | Long Text | - | 기본 필드 (추가 입력 데이터 JSON 저장) |
| `Lead_Source` | Single Line Text | - | 기본 필드 (유입 경로) |
| `Lead_Status` | Single Select | ✓ | 옵션: "신규접수", "상담사 전송 완료", "상담사 전송 실패" |

**필드 설명:**

1. **Lead_ID (수식 필드):**
   - Airtable에서 "Formula" 타입 선택
   - 수식 입력: `"lead-"&RECORD_ID()`
   - 결과 예: `lead-recXXXXXX`

2. **Inquiry_Container (선택 사항):**
   - 이름/전화번호를 제외한 모든 추가 필드를 JSON으로 저장
   - 예시: `{"주소": "서울시 강남구", "방문희망시간": "오전"}`
   - 현장별 맞춤 필드 추가 시 유용

3. **Lead_Status:**
   - MVP에서는 "신규접수"만 사용
   - 향후 Make.com 등 외부 자동화 연동 시 확장 가능

### 4. Airtable API Key 발급

1. [https://airtable.com/create/tokens](https://airtable.com/create/tokens) 접속
2. "Create new token" 클릭
3. Token 이름: `100zoad-worker`
4. Scopes 선택:
   - `data.records:read`
   - `data.records:write`
5. 해당 Base 선택
6. Token 생성 후 **안전한 곳에 복사** (다시 볼 수 없음!)

### 5. Base ID 및 Table ID 확인

1. Airtable Base 열기
2. 브라우저 URL 확인:
   ```
   https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYYY/...
   ```
3. `appXXXXXXXXXXXXXX` → Base ID
4. Table 이름 직접 사용 (예: `Leads`)

---

## Cloudflare 계정 설정

### 1. Cloudflare 계정 생성

- [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)에서 계정 생성
- 무료 플랜으로 충분 (100,000 요청/일)

### 2. Wrangler CLI 로그인

```bash
wrangler login
```

- 브라우저가 자동으로 열리고 Cloudflare 계정 인증
- 성공 시 "Successfully logged in" 메시지 표시

---

## Worker 배포

### 1. 프로젝트 디렉토리로 이동

```bash
cd C:\Users\merge\OneDrive\Documents\100zoad
```

### 2. Wrangler 설정 확인

`wrangler.toml` 파일이 올바르게 설정되었는지 확인:

```toml
name = "100zoad-airtable-proxy"
main = "workers/airtable-proxy.js"
compatibility_date = "2024-01-01"
```

### 3. Worker 배포

```bash
wrangler deploy
```

출력 예시:
```
✨ Built successfully, built project size is 5.2 KiB.
✨ Successfully published your script to
 https://100zoad-airtable-proxy.your-subdomain.workers.dev
```

**배포 URL을 복사하여 메모장에 저장하세요!**

---

## 환경변수 설정

Worker 배포 후 환경변수를 Cloudflare Secrets로 설정해야 합니다.

### 방법 1: Wrangler CLI 사용 (권장)

```bash
# Airtable API Key 설정
wrangler secret put AIRTABLE_API_KEY
# 프롬프트에서 API Key 입력 (복사-붙여넣기)

# Airtable Base ID 설정
wrangler secret put AIRTABLE_BASE_ID
# 프롬프트에서 Base ID 입력 (예: appXXXXXXXXXXXXXX)

# Airtable Table 이름 설정
wrangler secret put AIRTABLE_TABLE_NAME
# 프롬프트에서 Table 이름 입력 (예: Leads)

# 허용된 Origins 설정
wrangler secret put ALLOWED_ORIGINS
# 프롬프트에서 Origins 입력 (예: https://site1.imweb.me,https://site2.imweb.me)
```

### 방법 2: Cloudflare Dashboard 사용

1. [https://dash.cloudflare.com/](https://dash.cloudflare.com/) 접속
2. "Workers & Pages" 메뉴 클릭
3. `100zoad-airtable-proxy` Worker 선택
4. "Settings" → "Variables" 메뉴
5. "Add variable" 클릭하여 다음 환경변수 추가:
   - `AIRTABLE_API_KEY` (Encrypt 체크!)
   - `AIRTABLE_BASE_ID` (Encrypt 체크!)
   - `AIRTABLE_TABLE_NAME`
   - `ALLOWED_ORIGINS`

### 환경변수 값 예시

```
AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Leads
ALLOWED_ORIGINS=https://site1.imweb.me,https://site2.imweb.me
```

---

## 테스트

### 1. cURL로 테스트

**기본 테스트 (필수 필드만):**

```bash
curl -X POST https://100zoad-airtable-proxy.your-subdomain.workers.dev/submit \
  -H "Content-Type: application/json" \
  -H "Origin: https://site1.imweb.me" \
  -d '{
    "이름": "홍길동",
    "전화번호": "010-1234-5678",
    "siteName": "테스트현장",
    "leadSource": "test"
  }'
```

**추가 필드 포함 테스트:**

```bash
curl -X POST https://100zoad-airtable-proxy.your-subdomain.workers.dev/submit \
  -H "Content-Type: application/json" \
  -H "Origin: https://site1.imweb.me" \
  -d '{
    "이름": "홍길동",
    "전화번호": "010-1234-5678",
    "siteName": "강남 센트럴 파크",
    "leadSource": "google-ads",
    "주소": "서울시 강남구",
    "방문희망시간": "오전",
    "관심평형": "84㎡"
  }'
```

예상 응답:
```json
{
  "success": true,
  "recordId": "recXXXXXXXXXXXXXX",
  "message": "신청이 완료되었습니다."
}
```

### 2. Airtable에서 확인

1. Airtable Base 열기
2. Leads Table 확인
3. "홍길동" 레코드가 추가되었는지 확인
4. **Inquiry_Container 필드 확인:**
   ```json
   {
     "주소": "서울시 강남구",
     "방문희망시간": "오전",
     "관심평형": "84㎡"
   }
   ```

### 3. Window.CONFIG에 Worker URL 추가

`index.html` 또는 `main.html`에서 다음과 같이 설정:

```javascript
Window.CONFIG = {
  // ... 다른 설정 ...
  form: {
    // ... 다른 설정 ...
    airtable: {
      workerUrl: 'https://100zoad-airtable-proxy.your-subdomain.workers.dev/submit'
    }
  }
};
```

---

## 문제 해결

### 문제 1: 403 Forbidden 오류

**원인:** Airtable API Key 권한 부족

**해결:**
1. Airtable Token 재발급
2. Scopes 확인: `data.records:read`, `data.records:write`
3. Base 선택 확인

### 문제 2: CORS 오류

**원인:** `ALLOWED_ORIGINS` 설정 문제

**해결:**
1. `ALLOWED_ORIGINS`에 아임웹 도메인이 정확히 입력되었는지 확인
2. 프로토콜(https://) 포함 여부 확인
3. 여러 도메인은 쉼표로 구분 (공백 없이)

예시:
```
ALLOWED_ORIGINS=https://site1.imweb.me,https://site2.imweb.me
```

### 문제 3: 429 Too Many Requests

**원인:** Rate Limiting (1분에 3회 초과)

**해결:**
- 1분 후 다시 시도
- Worker 코드에서 Rate Limit 값 조정 가능 (`maxRequests` 변수)

### 문제 4: 500 Internal Server Error

**원인:** 환경변수 미설정 또는 Airtable API 오류

**해결:**
1. Wrangler Logs 확인:
   ```bash
   wrangler tail
   ```
2. 환경변수 다시 확인:
   ```bash
   wrangler secret list
   ```
3. Airtable API 상태 확인: [https://status.airtable.com/](https://status.airtable.com/)

### 문제 5: 400 Bad Request

**원인:** 입력 데이터 검증 실패

**해결:**
1. 필수 필드 확인: 이름, 전화번호, 현장명
2. 전화번호 형식 확인: `010-1234-5678` 형식
3. JSON 형식 확인

---

## 배포 후 체크리스트

- [ ] Worker 배포 완료 (배포 URL 복사)
- [ ] 환경변수 설정 완료 (AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME, ALLOWED_ORIGINS)
- [ ] cURL 테스트 성공
- [ ] Airtable에 테스트 레코드 생성 확인
- [ ] Window.CONFIG에 Worker URL 추가
- [ ] 실제 아임웹 환경에서 입력폼 제출 테스트
- [ ] CORS 오류 없음 확인
- [ ] Rate Limiting 테스트 (1분에 3회 제출)

---

## 참고 자료

- [Cloudflare Workers 공식 문서](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 문서](https://developers.cloudflare.com/workers/wrangler/)
- [Airtable API 문서](https://airtable.com/developers/web/api/introduction)
- [CORS 가이드](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**문의:** merge (개발자)
**최종 수정일:** 2026-01-01
