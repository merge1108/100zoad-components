/**
 * Shadow DOM 스타일 격리 테스트 컴포넌트
 *
 * STORY-002: Shadow DOM 스타일 격리 시스템 검증용
 *
 * 이 컴포넌트는 다음을 검증합니다:
 * 1. 외부 스타일이 Shadow DOM 내부에 영향을 주지 않는지
 * 2. Shadow DOM 내부 스타일이 외부에 영향을 주지 않는지
 * 3. 크로스 브라우저 호환성 (Chrome, Firefox, Safari, Edge)
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-01
 */

import BaseComponent from '../../core/base-component.js';

/**
 * Shadow DOM 테스트 컴포넌트
 *
 * 사용법:
 * <zoad-shadow-test></zoad-shadow-test>
 */
class ShadowDOMTestComponent extends BaseComponent {
  constructor() {
    super('shadowTest', {
      useShadowDOM: true,
      shadowMode: 'open'
    });
  }

  /**
   * 컴포넌트 렌더링
   * Shadow DOM 내부에 표시될 HTML과 스타일을 반환합니다.
   */
  render() {
    return `
      <style>
        /* Shadow DOM 내부 스타일 */
        :host {
          display: block;
          margin: 20px 0;
          font-family: Arial, sans-serif;
        }

        .container {
          border: 3px solid #007bff;
          border-radius: 8px;
          padding: 20px;
          background-color: #f8f9fa;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 15px;
        }

        .test-section {
          margin: 15px 0;
          padding: 15px;
          background-color: white;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }

        .test-heading {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        /* 외부와 동일한 클래스명이지만 Shadow DOM 내부에서만 적용됨 */
        .external-style {
          color: green;
          font-weight: bold;
          padding: 5px;
          background-color: #d4edda;
        }

        /* Shadow DOM 내부 전용 스타일 */
        .internal-only {
          color: blue;
          font-style: italic;
          padding: 5px;
          background-color: #d1ecf1;
        }

        /* 버튼 스타일 */
        .test-button {
          margin: 5px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .test-button.primary {
          background-color: #007bff;
          color: white;
        }

        .test-button.primary:hover {
          background-color: #0056b3;
        }

        .test-button.secondary {
          background-color: #6c757d;
          color: white;
        }

        .test-button.secondary:hover {
          background-color: #545b62;
        }

        /* 결과 표시 */
        .result {
          margin-top: 10px;
          padding: 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .result.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .result.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .result.info {
          background-color: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        /* 코드 블록 */
        code {
          background-color: #e9ecef;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
        }

        /* 리스트 스타일 */
        ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        li {
          margin: 5px 0;
          line-height: 1.6;
        }
      </style>

      <div class="container">
        <div class="title">🔒 Shadow DOM 스타일 격리 테스트</div>

        <!-- 테스트 1: 외부 스타일 격리 -->
        <div class="test-section">
          <div class="test-heading">테스트 1: 외부 스타일이 내부에 영향을 주지 않는가?</div>
          <p>아래 텍스트는 <code>.external-style</code> 클래스를 사용합니다.</p>
          <p class="external-style">
            ✅ 이 텍스트는 <strong>녹색 배경</strong>이어야 합니다 (Shadow DOM 내부 스타일 적용됨)
          </p>
          <p>외부에 같은 클래스명으로 빨간색 스타일이 있어도 영향을 받지 않습니다.</p>
        </div>

        <!-- 테스트 2: 내부 스타일 격리 -->
        <div class="test-section">
          <div class="test-heading">테스트 2: 내부 스타일이 외부에 영향을 주지 않는가?</div>
          <p>아래 텍스트는 <code>.internal-only</code> 클래스를 사용합니다.</p>
          <p class="internal-only">
            ✅ 이 텍스트는 <strong>파란색 이탤릭</strong>이어야 합니다 (Shadow DOM 내부 전용)
          </p>
          <p>이 스타일은 Shadow DOM 외부의 동일한 클래스명에 영향을 주지 않습니다.</p>
        </div>

        <!-- 테스트 3: 이벤트 및 상호작용 -->
        <div class="test-section">
          <div class="test-heading">테스트 3: Shadow DOM 이벤트 처리</div>
          <button class="test-button primary" id="test-btn-1">클릭 테스트 1</button>
          <button class="test-button secondary" id="test-btn-2">클릭 테스트 2</button>
          <div id="test-result" class="result info">
            버튼을 클릭하여 이벤트가 정상적으로 작동하는지 확인하세요.
          </div>
        </div>

        <!-- 테스트 4: 브라우저 호환성 정보 -->
        <div class="test-section">
          <div class="test-heading">테스트 4: 브라우저 호환성 확인</div>
          <div id="browser-info" class="result info">
            브라우저 정보를 로드하는 중...
          </div>
        </div>

        <!-- Acceptance Criteria 체크리스트 -->
        <div class="test-section">
          <div class="test-heading">📋 Acceptance Criteria 검증</div>
          <ul>
            <li><strong>모든 웹 컴포넌트 Shadow DOM 사용:</strong> <code>this.shadowRoot</code> 존재 확인</li>
            <li><strong>컴포넌트 내부 스타일이 외부에 영향받지 않음:</strong> 위 테스트 1 확인</li>
            <li><strong>외부 스타일이 컴포넌트에 영향 주지 않음:</strong> 위 테스트 2 확인</li>
            <li><strong>Chrome, Firefox, Safari, Edge에서 검증:</strong> 아래 브라우저 정보 확인</li>
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEvents() {
    const btn1 = this.$('#test-btn-1');
    const btn2 = this.$('#test-btn-2');
    const resultDiv = this.$('#test-result');

    if (btn1) {
      btn1.addEventListener('click', () => {
        resultDiv.className = 'result success';
        resultDiv.textContent = '✅ 버튼 1 클릭됨! Shadow DOM 이벤트가 정상적으로 작동합니다.';
      });
    }

    if (btn2) {
      btn2.addEventListener('click', () => {
        resultDiv.className = 'result success';
        resultDiv.textContent = '✅ 버튼 2 클릭됨! Shadow DOM 이벤트 위임이 정상적으로 작동합니다.';
      });
    }

    // 브라우저 정보 표시
    this.displayBrowserInfo();
  }

  /**
   * 브라우저 정보 표시
   */
  displayBrowserInfo() {
    const browserInfoDiv = this.$('#browser-info');

    if (!browserInfoDiv) return;

    const userAgent = navigator.userAgent;
    const browserInfo = this.detectBrowser(userAgent);

    // Shadow DOM 지원 확인
    const shadowDOMSupported = !!this.shadowRoot;
    const attachShadowSupported = !!HTMLElement.prototype.attachShadow;

    let html = `
      <strong>브라우저:</strong> ${browserInfo.name} ${browserInfo.version}<br>
      <strong>운영체제:</strong> ${browserInfo.os}<br>
      <strong>Shadow DOM 지원:</strong> ${shadowDOMSupported ? '✅ 지원됨' : '❌ 지원 안됨'}<br>
      <strong>attachShadow API:</strong> ${attachShadowSupported ? '✅ 사용 가능' : '❌ 사용 불가'}<br>
    `;

    // 브라우저별 상태
    if (browserInfo.isSupported) {
      browserInfoDiv.className = 'result success';
      html += '<br><strong>✅ 이 브라우저는 Shadow DOM을 완전히 지원합니다.</strong>';
    } else {
      browserInfoDiv.className = 'result error';
      html += '<br><strong>⚠️ 이 브라우저는 Shadow DOM 지원이 제한적일 수 있습니다.</strong>';
    }

    browserInfoDiv.innerHTML = html;
  }

  /**
   * 브라우저 감지
   * @param {string} userAgent - User Agent 문자열
   * @returns {Object} 브라우저 정보
   */
  detectBrowser(userAgent) {
    let name = 'Unknown';
    let version = 'Unknown';
    let os = 'Unknown';
    let isSupported = false;

    // Chrome
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
      name = 'Chrome';
      version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
      isSupported = parseInt(version) >= 53; // Chrome 53+
    }
    // Edge (Chromium)
    else if (userAgent.indexOf('Edg') > -1) {
      name = 'Edge';
      version = userAgent.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
      isSupported = parseInt(version) >= 79; // Edge 79+
    }
    // Firefox
    else if (userAgent.indexOf('Firefox') > -1) {
      name = 'Firefox';
      version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
      isSupported = parseInt(version) >= 63; // Firefox 63+
    }
    // Safari
    else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      name = 'Safari';
      version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
      isSupported = parseInt(version) >= 10; // Safari 10+
    }

    // OS 감지
    if (userAgent.indexOf('Windows') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac OS') > -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

    return { name, version, os, isSupported };
  }
}

// 커스텀 엘리먼트 등록
if (!customElements.get('zoad-shadow-test')) {
  customElements.define('zoad-shadow-test', ShadowDOMTestComponent);
  console.log('✅ zoad-shadow-test 컴포넌트 등록 완료');
}

export default ShadowDOMTestComponent;
