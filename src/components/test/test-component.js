/**
 * Test Component - BaseComponent 테스트용
 *
 * BaseComponent가 제대로 작동하는지 검증하기 위한 간단한 테스트 컴포넌트
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-01
 */

import { BaseComponent } from '../../core/base-component.js';

/**
 * 테스트 웹 컴포넌트
 * BaseComponent의 모든 기능을 테스트합니다.
 *
 * @extends BaseComponent
 */
class TestComponent extends BaseComponent {
  /**
   * 생성자
   */
  constructor() {
    super('test', {
      useShadowDOM: true,
      shadowMode: 'open'
    });

    this.clickCount = 0;
  }

  /**
   * 렌더링
   * Shadow DOM에 삽입될 HTML을 반환합니다.
   *
   * @returns {string} HTML 문자열
   */
  render() {
    const title = this.getConfigValue('title', '테스트 컴포넌트');
    const bgColor = this.getConfigValue('styles.bgColor', '#e3f2fd');
    const textColor = this.getConfigValue('styles.textColor', '#1976d2');
    const borderColor = this.getConfigValue('styles.borderColor', '#2196f3');

    return `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .container {
          background-color: ${bgColor};
          color: ${textColor};
          padding: 20px;
          border-radius: 8px;
          border: 2px solid ${borderColor};
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        h2 {
          margin-top: 0;
          font-size: 24px;
        }

        .info {
          margin: 15px 0;
          padding: 10px;
          background: white;
          border-radius: 4px;
          border-left: 4px solid ${borderColor};
        }

        .info-item {
          margin: 5px 0;
          font-size: 14px;
        }

        .info-label {
          font-weight: bold;
          color: ${textColor};
        }

        .button {
          background: ${borderColor};
          color: white;
          border: none;
          padding: 10px 20px;
          margin: 5px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .button:active {
          transform: translateY(0);
        }

        .counter {
          font-size: 18px;
          font-weight: bold;
          margin: 10px 0;
          padding: 10px;
          background: white;
          border-radius: 4px;
          text-align: center;
        }

        .success {
          color: #4caf50;
        }

        .debug-section {
          margin-top: 15px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
        }

        .debug-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
      </style>

      <div class="container">
        <h2>✅ ${title}</h2>

        <div class="info">
          <div class="info-item">
            <span class="info-label">컴포넌트명:</span> ${this.componentName}
          </div>
          <div class="info-item">
            <span class="info-label">상태:</span> <span class="success">${this.state}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Shadow DOM:</span> ${this.options.useShadowDOM ? '활성화' : '비활성화'}
          </div>
          <div class="info-item">
            <span class="info-label">Config 로드:</span> ${this.componentConfig ? '성공' : '실패'}
          </div>
        </div>

        <div class="counter">
          클릭 횟수: <span id="click-count">0</span>
        </div>

        <div>
          <button class="button" id="test-btn">클릭 테스트</button>
          <button class="button" id="log-config-btn">Config 로그 출력</button>
          <button class="button" id="inject-style-btn">동적 스타일 추가</button>
        </div>

        <div class="debug-section">
          <div class="debug-title">🔍 디버그 정보:</div>
          <div id="debug-output">이벤트 리스너가 정상적으로 연결되었습니다.</div>
        </div>
      </div>
    `;
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEvents() {
    // 클릭 테스트 버튼
    const testBtn = this.$('#test-btn');
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        this.handleClick();
      });
    }

    // Config 로그 버튼
    const logConfigBtn = this.$('#log-config-btn');
    if (logConfigBtn) {
      logConfigBtn.addEventListener('click', () => {
        this.logConfig();
      });
    }

    // 동적 스타일 추가 버튼
    const injectStyleBtn = this.$('#inject-style-btn');
    if (injectStyleBtn) {
      injectStyleBtn.addEventListener('click', () => {
        this.testInjectStyle();
      });
    }

    this.debug('이벤트 리스너 연결 완료');
  }

  /**
   * 클릭 핸들러
   */
  handleClick() {
    this.clickCount++;
    const countElement = this.$('#click-count');
    if (countElement) {
      countElement.textContent = this.clickCount;
    }

    const debugOutput = this.$('#debug-output');
    if (debugOutput) {
      debugOutput.textContent = `✅ 버튼 클릭 ${this.clickCount}회 - 이벤트가 정상적으로 작동합니다!`;
    }

    console.log(`[TestComponent] 클릭 횟수: ${this.clickCount}`);
  }

  /**
   * Config 로그 출력
   */
  logConfig() {
    console.log('=== TestComponent Config ===');
    console.log('전역 Config:', this.config);
    console.log('컴포넌트 Config:', this.componentConfig);
    console.log('활성화 여부:', this.isEnabled());

    const debugOutput = this.$('#debug-output');
    if (debugOutput) {
      debugOutput.innerHTML = `
        ✅ Config가 콘솔에 출력되었습니다.<br>
        활성화: ${this.isEnabled() ? 'YES' : 'NO'}<br>
        디버그 모드: ${this.isDebugMode() ? 'ON' : 'OFF'}
      `;
    }
  }

  /**
   * 동적 스타일 추가 테스트
   */
  testInjectStyle() {
    this.injectStyle(`
      .container {
        animation: pulse 0.5s ease-in-out;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
    `);

    const debugOutput = this.$('#debug-output');
    if (debugOutput) {
      debugOutput.textContent = '✅ 동적 스타일이 추가되었습니다. (펄스 애니메이션)';
    }

    console.log('[TestComponent] 동적 스타일 추가 완료');
  }

  /**
   * Fallback HTML (오류 발생 시)
   *
   * @returns {string} Fallback HTML
   */
  renderFallback() {
    return `
      <style>
        :host {
          display: block;
          padding: 20px;
          background-color: #fff3cd;
          border: 2px solid #ffc107;
          border-radius: 8px;
          color: #856404;
        }
      </style>
      <div>
        <h3>⚠️ 테스트 컴포넌트 로딩 실패</h3>
        <p>오류: ${this.error}</p>
        <p>Fallback이 정상적으로 작동하고 있습니다.</p>
      </div>
    `;
  }
}

// Custom Element 등록
customElements.define('zoad-test', TestComponent);

console.log('✅ TestComponent 등록 완료: <zoad-test>');

export default TestComponent;
