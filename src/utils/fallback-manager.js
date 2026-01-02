/**
 * Fallback Manager - 100zoad Web Components
 *
 * Graceful Degradation 시스템
 * - 컴포넌트 로딩 실패 시 폴백 HTML 제공
 * - 핵심 기능 유지 (리드 수집, 전화)
 * - 로딩 실패 로그 기록
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-02
 * @story STORY-026
 */

/**
 * 폴백 로그 기록
 * NFR-006: 로딩 실패 시 콘솔 로그 기록
 *
 * @param {string} componentName - 컴포넌트 이름
 * @param {Error} error - 오류 객체
 * @param {number} [loadTime] - 로딩 시도 시간 (ms)
 */
export function logFallback(componentName, error, loadTime = null) {
  const timestamp = new Date().toISOString();
  const message = `❌ [Fallback] [${componentName}] 로딩 실패 - 폴백 활성화`;

  console.group(message);
  console.log('시간:', timestamp);
  console.log('오류:', error.message);
  if (loadTime) {
    console.log('로딩 시도 시간:', `${loadTime.toFixed(2)}ms`);
  }
  console.log('폴백 전략:', getFallbackStrategy(componentName));
  console.groupEnd();

  // 전역 폴백 로그 저장 (디버깅용)
  if (!window.__ZOAD_FALLBACK_LOG__) {
    window.__ZOAD_FALLBACK_LOG__ = [];
  }

  window.__ZOAD_FALLBACK_LOG__.push({
    timestamp,
    componentName,
    error: error.message,
    loadTime,
    strategy: getFallbackStrategy(componentName)
  });
}

/**
 * 컴포넌트별 폴백 전략 가져오기
 *
 * @param {string} componentName - 컴포넌트 이름
 * @returns {string} 폴백 전략 설명
 */
export function getFallbackStrategy(componentName) {
  const strategies = {
    header: '로고 + 전화번호만 표시',
    form: '간단한 HTML form 표시 (핵심 기능 유지)',
    footer: '간단한 텍스트만 표시',
    quickmenu: '숨김 처리 (비필수 컴포넌트)',
    'mobile-nav': '숨김 처리 (비필수 컴포넌트)'
  };

  return strategies[componentName] || '기본 폴백 (숨김 또는 오류 메시지)';
}

/**
 * Header 컴포넌트 폴백 HTML
 * AC2: 헤더 로딩 실패 시 로고 + 전화번호만 표시
 *
 * @param {Object} config - Window.CONFIG 객체
 * @returns {string} 폴백 HTML
 */
export function getHeaderFallback(config = {}) {
  const logoUrl = config?.header?.logo?.url || '';
  const logoAlt = config?.header?.logo?.alt || '로고';
  const phone = config?.form?.fields?.phone?.placeholder || config?.footer?.line1?.phone || '1588-0000';
  const siteName = config?.meta?.siteName || '현장명';

  return `
    <style>
      :host {
        display: block;
        position: sticky;
        top: 0;
        z-index: 1000;
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .fallback-header {
        max-width: 1200px;
        margin: 0 auto;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .fallback-logo {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .fallback-logo img {
        height: 40px;
        width: auto;
      }
      .fallback-logo span {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      .fallback-phone {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: bold;
        font-size: 16px;
      }
      .fallback-phone:hover {
        background-color: #0056b3;
      }
      @media (max-width: 768px) {
        .fallback-header {
          padding: 10px 15px;
        }
        .fallback-logo span {
          font-size: 14px;
        }
        .fallback-phone {
          padding: 8px 15px;
          font-size: 14px;
        }
      }
    </style>
    <div class="fallback-header">
      <div class="fallback-logo">
        ${logoUrl ? `<img src="${logoUrl}" alt="${logoAlt}">` : ''}
        <span>${siteName}</span>
      </div>
      <a href="tel:${phone.replace(/-/g, '')}" class="fallback-phone">
        <span>📞</span>
        <span>${phone}</span>
      </a>
    </div>
  `;
}

/**
 * Form 컴포넌트 폴백 HTML
 * AC1: 입력폼 로딩 실패 시 간단한 HTML form 폴백 (아임웹 내장)
 *
 * @param {Object} config - Window.CONFIG 객체
 * @returns {string} 폴백 HTML
 */
export function getFormFallback(config = {}) {
  const siteName = config?.meta?.siteName || '현장명';
  const nameLabel = config?.form?.fields?.name?.label || '이름';
  const phoneLabel = config?.form?.fields?.phone?.label || '전화번호';
  const successMessage = config?.form?.messages?.success || '신청이 완료되었습니다.';

  return `
    <style>
      :host {
        display: block;
        max-width: 500px;
        margin: 0 auto;
      }
      .fallback-form {
        background-color: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .fallback-form h3 {
        margin-top: 0;
        margin-bottom: 20px;
        color: #333;
        font-size: 24px;
        text-align: center;
      }
      .fallback-form-group {
        margin-bottom: 15px;
      }
      .fallback-form-group label {
        display: block;
        margin-bottom: 5px;
        color: #333;
        font-weight: bold;
        font-size: 14px;
      }
      .fallback-form-group input {
        width: 100%;
        padding: 12px;
        border: 1px solid #dddddd;
        border-radius: 4px;
        font-size: 16px;
        box-sizing: border-box;
      }
      .fallback-form-group input:focus {
        outline: none;
        border-color: #007bff;
      }
      .fallback-submit-btn {
        width: 100%;
        padding: 15px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
      }
      .fallback-submit-btn:hover {
        background-color: #0056b3;
      }
      .fallback-submit-btn:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
      .fallback-warning {
        background-color: #fff3cd;
        border: 1px solid #ffc107;
        color: #856404;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 15px;
        font-size: 14px;
        text-align: center;
      }
      .fallback-success {
        background-color: #d4edda;
        border: 1px solid #28a745;
        color: #155724;
        padding: 15px;
        border-radius: 4px;
        text-align: center;
        font-size: 16px;
        display: none;
      }
      .fallback-success.show {
        display: block;
      }
    </style>
    <div class="fallback-form">
      <div class="fallback-warning">
        ⚠️ 일부 기능을 불러올 수 없습니다. 기본 양식을 사용합니다.
      </div>

      <h3>관심고객 등록 - ${siteName}</h3>

      <div class="fallback-success" id="fallback-success">
        ✓ ${successMessage}
      </div>

      <form id="fallback-form">
        <div class="fallback-form-group">
          <label for="fallback-name">${nameLabel} *</label>
          <input
            type="text"
            id="fallback-name"
            name="name"
            required
            placeholder="홍길동"
          >
        </div>

        <div class="fallback-form-group">
          <label for="fallback-phone">${phoneLabel} *</label>
          <input
            type="tel"
            id="fallback-phone"
            name="phone"
            required
            placeholder="010-0000-0000"
            pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
          >
        </div>

        <button type="submit" class="fallback-submit-btn" id="fallback-submit">
          신청하기
        </button>
      </form>
    </div>

    <script>
      // Fallback 폼 제출 로직
      (function() {
        const form = document.getElementById('fallback-form');
        const submitBtn = document.getElementById('fallback-submit');
        const successMsg = document.getElementById('fallback-success');
        const nameInput = document.getElementById('fallback-name');
        const phoneInput = document.getElementById('fallback-phone');

        // 전화번호 자동 하이픈 삽입
        phoneInput.addEventListener('input', function(e) {
          let value = e.target.value.replace(/[^0-9]/g, '');

          if (value.length > 3 && value.length <= 7) {
            value = value.slice(0, 3) + '-' + value.slice(3);
          } else if (value.length > 7) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
          }

          e.target.value = value;
        });

        form.addEventListener('submit', async function(e) {
          e.preventDefault();

          const name = nameInput.value.trim();
          const phone = phoneInput.value.trim();

          if (!name || !phone) {
            alert('이름과 전화번호를 모두 입력해주세요.');
            return;
          }

          // 제출 버튼 비활성화
          submitBtn.disabled = true;
          submitBtn.textContent = '제출 중...';

          try {
            // Airtable Worker로 전송 시도
            const workerUrl = window.CONFIG?.form?.airtable?.workerUrl;

            if (workerUrl) {
              const response = await fetch(workerUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  이름: name,
                  전화번호: phone,
                  현장명: '${siteName}',
                  페이지URL: window.location.href,
                  유입경로: 'fallback-form'
                })
              });

              if (!response.ok) {
                throw new Error('제출 실패');
              }
            } else {
              // Worker URL 없으면 콘솔에만 로그
              console.log('📝 [Fallback Form] 제출 데이터:', { name, phone });
            }

            // 성공 메시지 표시
            form.style.display = 'none';
            successMsg.classList.add('show');

            // 3초 후 폼 초기화
            setTimeout(() => {
              form.reset();
              form.style.display = 'block';
              successMsg.classList.remove('show');
              submitBtn.disabled = false;
              submitBtn.textContent = '신청하기';
            }, 3000);

          } catch (error) {
            console.error('폼 제출 오류:', error);
            alert('제출 중 오류가 발생했습니다. 전화로 문의해주세요.');

            submitBtn.disabled = false;
            submitBtn.textContent = '신청하기';
          }
        });
      })();
    </script>
  `;
}

/**
 * Footer 컴포넌트 폴백 HTML
 *
 * @param {Object} config - Window.CONFIG 객체
 * @returns {string} 폴백 HTML
 */
export function getFooterFallback(config = {}) {
  const siteName = config?.meta?.siteName || '현장명';
  const phone = config?.footer?.line1?.phone || '1588-0000';
  const company = config?.footer?.line2?.company || '100zoad';

  return `
    <style>
      :host {
        display: block;
        background-color: #f8f9fa;
        color: #666666;
        font-size: 14px;
      }
      .fallback-footer {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
      }
    </style>
    <div class="fallback-footer">
      <p><strong>${siteName}</strong> | 상담문의: ${phone}</p>
      <p>${company}</p>
    </div>
  `;
}

/**
 * QuickMenu 컴포넌트 폴백 (숨김)
 * AC3: 퀵메뉴 로딩 실패 시 숨김 처리
 *
 * @returns {string} 폴백 HTML (빈 문자열)
 */
export function getQuickMenuFallback() {
  return `
    <style>
      :host {
        display: none !important;
      }
    </style>
    <!-- QuickMenu 폴백: 숨김 처리 (비필수 컴포넌트) -->
  `;
}

/**
 * MobileNav 컴포넌트 폴백 (숨김)
 * AC3: 모바일 내비게이터 로딩 실패 시 숨김 처리
 *
 * @returns {string} 폴백 HTML (빈 문자열)
 */
export function getMobileNavFallback() {
  return `
    <style>
      :host {
        display: none !important;
      }
    </style>
    <!-- MobileNav 폴백: 숨김 처리 (비필수 컴포넌트) -->
  `;
}

/**
 * 컴포넌트별 폴백 HTML 가져오기
 *
 * @param {string} componentName - 컴포넌트 이름
 * @param {Object} config - Window.CONFIG 객체
 * @returns {string} 폴백 HTML
 */
export function getFallbackHTML(componentName, config = {}) {
  switch (componentName) {
    case 'header':
      return getHeaderFallback(config);
    case 'form':
      return getFormFallback(config);
    case 'footer':
      return getFooterFallback(config);
    case 'quickmenu':
      return getQuickMenuFallback();
    case 'mobile-nav':
      return getMobileNavFallback();
    default:
      return `
        <style>
          :host {
            display: none !important;
          }
        </style>
        <!-- ${componentName} 폴백: 숨김 처리 -->
      `;
  }
}

/**
 * 폴백 활성화
 * 컴포넌트 로딩 실패 시 폴백 HTML을 표시합니다.
 *
 * @param {string} componentName - 컴포넌트 이름
 * @param {Error} error - 오류 객체
 * @param {number} [loadTime] - 로딩 시도 시간 (ms)
 */
export function activateFallback(componentName, error, loadTime = null) {
  // 1. 로그 기록
  logFallback(componentName, error, loadTime);

  // 2. 폴백 HTML 가져오기
  const config = window.CONFIG || {};
  const fallbackHTML = getFallbackHTML(componentName, config);

  // 3. 컴포넌트 엘리먼트 찾기
  const tagName = `zoad-${componentName}`;
  const elements = document.querySelectorAll(tagName);

  if (elements.length === 0) {
    console.warn(`⚠️ [Fallback] <${tagName}> 엘리먼트를 찾을 수 없습니다.`);
    return;
  }

  // 4. 모든 인스턴스에 폴백 적용
  elements.forEach(element => {
    // Shadow DOM이 있으면 Shadow DOM에, 없으면 Light DOM에 삽입
    const target = element.shadowRoot || element;
    target.innerHTML = fallbackHTML;

    console.log(`✅ [Fallback] <${tagName}> 폴백 활성화 완료`);
  });
}

/**
 * 모든 폴백 로그 가져오기
 *
 * @returns {Array} 폴백 로그 배열
 */
export function getFallbackLogs() {
  return window.__ZOAD_FALLBACK_LOG__ || [];
}

/**
 * 폴백 로그 리포트 출력
 */
export function printFallbackReport() {
  const logs = getFallbackLogs();

  if (logs.length === 0) {
    console.log('✅ 모든 컴포넌트가 정상적으로 로드되었습니다. (폴백 없음)');
    return;
  }

  console.log('\n⚠️ ==== Fallback 리포트 ====');
  console.log(`총 ${logs.length}개 컴포넌트가 폴백 모드로 실행 중:\n`);

  console.table(logs.map(log => ({
    시간: log.timestamp,
    컴포넌트: log.componentName,
    오류: log.error,
    '로딩 시간': log.loadTime ? `${log.loadTime.toFixed(2)}ms` : 'N/A',
    폴백전략: log.strategy
  })));

  console.log('\n=============================\n');
}

// 기본 export
export default {
  logFallback,
  getFallbackStrategy,
  getHeaderFallback,
  getFormFallback,
  getFooterFallback,
  getQuickMenuFallback,
  getMobileNavFallback,
  getFallbackHTML,
  activateFallback,
  getFallbackLogs,
  printFallbackReport
};
