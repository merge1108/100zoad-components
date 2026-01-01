/**
 * Cloudflare Worker - Airtable API 프록시
 *
 * 입력폼 데이터를 안전하게 Airtable로 전송하는 서버리스 함수
 * - API 키 보안 (환경변수에 저장)
 * - CORS 헤더 설정
 * - 입력 검증
 * - Rate Limiting (IP 기반)
 * - Origin 검증
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-01
 *
 * 환경변수:
 * - AIRTABLE_API_KEY: Airtable Personal Access Token
 * - AIRTABLE_BASE_ID: Airtable Base ID (예: appXXXXXXXXXXXXXX)
 * - AIRTABLE_TABLE_NAME: Airtable Table 이름 (예: Leads)
 * - ALLOWED_ORIGINS: 허용된 Origin (쉼표로 구분, 예: https://site1.imweb.me,https://site2.imweb.me)
 */

// Rate Limiting용 간단한 인메모리 스토어
// 주의: Workers는 요청간 상태를 공유하지 않으므로, 실제 운영 환경에서는 Durable Objects 또는 KV 사용 권장
const rateLimitStore = new Map();

/**
 * CORS 헤더 생성
 * @param {string} origin - 요청 Origin
 * @param {string} allowedOrigins - 허용된 Origins (환경변수)
 * @returns {Object} CORS 헤더 객체
 */
function getCorsHeaders(origin, allowedOrigins) {
  const allowedList = allowedOrigins ? allowedOrigins.split(',').map(o => o.trim()) : [];

  // 허용된 Origin인지 확인
  const isAllowed = allowedList.includes(origin) || allowedList.includes('*');

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedList[0] || '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400', // 24시간
  };
}

/**
 * Rate Limiting 체크
 * IP 주소 기반으로 1분에 최대 3회 요청 허용
 *
 * @param {string} ip - 요청 IP 주소
 * @returns {boolean} 허용 여부
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1분
  const maxRequests = 3;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }

  const timestamps = rateLimitStore.get(ip);

  // 1분 이전 타임스탬프 제거
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limit 초과
  }

  validTimestamps.push(now);
  rateLimitStore.set(ip, validTimestamps);

  return true;
}

/**
 * 입력 데이터 검증
 * @param {Object} data - 검증할 데이터
 * @returns {{valid: boolean, errors: Array<string>}}
 */
function validateInput(data) {
  const errors = [];

  // 필수 필드: 이름
  if (!data['이름'] || typeof data['이름'] !== 'string' || data['이름'].trim() === '') {
    errors.push('이름은 필수 입력 항목입니다.');
  }

  // 필수 필드: 전화번호
  if (!data['전화번호'] || typeof data['전화번호'] !== 'string') {
    errors.push('전화번호는 필수 입력 항목입니다.');
  } else {
    // 전화번호 형식 검증 (010-1234-5678 형식)
    const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
    if (!phoneRegex.test(data['전화번호'])) {
      errors.push('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
    }
  }

  // 필수 필드: 현장명 (siteName은 config에서 전달됨)
  if (!data['siteName'] || typeof data['siteName'] !== 'string' || data['siteName'].trim() === '') {
    errors.push('현장명(siteName)은 필수 입력 항목입니다.');
  }

  // 선택 필드는 검증하지 않음 (있어도 되고 없어도 됨)

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Airtable API로 레코드 생성
 * @param {Object} data - 저장할 데이터
 * @param {Object} env - 환경변수
 * @returns {Promise<Object>} Airtable 응답
 */
async function createAirtableRecord(data, env) {
  const url = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_NAME}`;

  // 추가 필드들을 Inquiry_Container에 JSON으로 저장
  // 이름, 전화번호를 제외한 모든 추가 입력 필드
  const inquiryData = {};
  const excludeFields = ['이름', '전화번호', 'siteName', 'pageUrl', 'leadSource'];

  for (const key in data) {
    if (!excludeFields.includes(key) && data[key] !== undefined && data[key] !== null && data[key] !== '') {
      inquiryData[key] = data[key];
    }
  }

  // Inquiry_Container는 추가 데이터가 있을 때만 JSON 문자열로 변환
  const inquiryContainer = Object.keys(inquiryData).length > 0
    ? JSON.stringify(inquiryData, null, 2)
    : '';

  // Airtable 레코드 포맷 (새로운 필드 구조)
  const record = {
    fields: {
      'Lead_Name': data['이름'],
      'Lead_Phone_Number': data['전화번호'],
      'Site_Name': data['siteName'],
      'Submit_Date_and_Time': new Date().toISOString(),
      'Lead_Source': data['leadSource'] || data['유입경로'] || 'direct',
      'Lead_Status': '신규 접수',
      // Inquiry_Container는 추가 필드가 있을 때만 포함
      ...(inquiryContainer && { 'Inquiry_Container': inquiryContainer })
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(record)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable API 오류: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * 메인 Worker 핸들러
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

    // CORS Preflight 요청 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(origin, env.ALLOWED_ORIGINS)
      });
    }

    // /submit 엔드포인트만 허용
    if (url.pathname !== '/submit') {
      return new Response(JSON.stringify({
        success: false,
        error: '잘못된 엔드포인트입니다. /submit을 사용하세요.'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin, env.ALLOWED_ORIGINS)
        }
      });
    }

    // POST 메서드만 허용
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        error: 'POST 요청만 지원합니다.'
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin, env.ALLOWED_ORIGINS)
        }
      });
    }

    try {
      // Rate Limiting 체크
      if (!checkRateLimit(clientIP)) {
        return new Response(JSON.stringify({
          success: false,
          error: '요청이 너무 많습니다. 1분 후 다시 시도해주세요.'
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            ...getCorsHeaders(origin, env.ALLOWED_ORIGINS)
          }
        });
      }

      // 요청 본문 파싱
      let data;
      try {
        data = await request.json();
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: '잘못된 JSON 형식입니다.'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(origin, env.ALLOWED_ORIGINS)
          }
        });
      }

      // 입력 검증
      const validation = validateInput(data);
      if (!validation.valid) {
        return new Response(JSON.stringify({
          success: false,
          error: '입력 검증 실패',
          errors: validation.errors
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(origin, env.ALLOWED_ORIGINS)
          }
        });
      }

      // 환경변수 확인
      if (!env.AIRTABLE_API_KEY || !env.AIRTABLE_BASE_ID || !env.AIRTABLE_TABLE_NAME) {
        console.error('환경변수가 설정되지 않았습니다.');
        return new Response(JSON.stringify({
          success: false,
          error: '서버 설정 오류입니다. 관리자에게 문의하세요.'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(origin, env.ALLOWED_ORIGINS)
          }
        });
      }

      // Airtable에 레코드 생성
      const airtableResponse = await createAirtableRecord(data, env);

      // 성공 응답
      return new Response(JSON.stringify({
        success: true,
        recordId: airtableResponse.id,
        message: '신청이 완료되었습니다.'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin, env.ALLOWED_ORIGINS)
        }
      });

    } catch (error) {
      console.error('Worker 오류:', error);

      return new Response(JSON.stringify({
        success: false,
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        details: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin, env.ALLOWED_ORIGINS)
        }
      });
    }
  }
};
