/**
 * BaseComponent - 100zoad Web Components
 *
 * 모든 웹 컴포넌트가 상속받는 베이스 클래스
 * - Config 로드 로직 공통화
 * - Shadow DOM 초기화 로직
 * - 컴포넌트별 커스텀 로직 hook 제공
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-01
 */

import { parseConfig, isComponentEnabled } from './config-parser.js';
import {
  smoothScrollTo,
  getScrollPosition,
  initPolyfills,
  showCompatibilityWarning
} from '../utils/browser-compatibility.js';

/**
 * 베이스 웹 컴포넌트 클래스
 * 모든 100zoad 웹 컴포넌트는 이 클래스를 상속받아 구현합니다.
 *
 * @extends HTMLElement
 *
 * @example
 * class HeaderComponent extends BaseComponent {
 *   constructor() {
 *     super('header'); // 컴포넌트 이름 전달
 *   }
 *
 *   render() {
 *     return `<div>Header Content</div>`;
 *   }
 *
 *   attachEvents() {
 *     // 이벤트 리스너 추가
 *   }
 * }
 *
 * customElements.define('zoad-header', HeaderComponent);
 */
export class BaseComponent extends HTMLElement {
  /**
   * BaseComponent 생성자
   *
   * @param {string} componentName - 컴포넌트 이름 (config 객체의 키와 동일해야 함)
   * @param {Object} [options={}] - 추가 옵션
   * @param {boolean} [options.useShadowDOM=true] - Shadow DOM 사용 여부
   * @param {string} [options.shadowMode='open'] - Shadow DOM 모드 ('open' | 'closed')
   */
  constructor(componentName, options = {}) {
    super();

    /**
     * 컴포넌트 이름
     * @type {string}
     */
    this.componentName = componentName;

    /**
     * 컴포넌트 옵션
     * @type {Object}
     */
    this.options = {
      useShadowDOM: true,
      shadowMode: 'open',
      ...options
    };

    /**
     * 전역 Config 객체
     * @type {Object|null}
     */
    this.config = null;

    /**
     * 컴포넌트 Config 객체 (Window.CONFIG[componentName])
     * @type {Object|null}
     */
    this.componentConfig = null;

    /**
     * 컴포넌트 로딩 상태
     * @type {'loading'|'ready'|'error'}
     */
    this.state = 'loading';

    /**
     * 오류 메시지
     * @type {string|null}
     */
    this.error = null;
  }

  /**
   * 웹 컴포넌트가 DOM에 연결될 때 호출됩니다.
   * 이 메서드는 자동으로 실행되며, 오버라이드하지 마세요.
   *
   * @private
   */
  connectedCallback() {
    try {
      // 0. 브라우저 호환성 체크 및 폴리필 로드 (최초 1회만)
      if (!window.__ZOAD_POLYFILLS_LOADED__) {
        initPolyfills();
        showCompatibilityWarning();
        window.__ZOAD_POLYFILLS_LOADED__ = true;
      }

      // 1. Config 로드
      this.loadConfig();

      // 2. 컴포넌트가 활성화되었는지 확인
      if (!this.isEnabled()) {
        console.log(`⏭️ [${this.componentName}] 컴포넌트가 비활성화되어 있습니다.`);
        this.state = 'ready';
        return;
      }

      // 3. Shadow DOM 초기화
      if (this.options.useShadowDOM) {
        this.initShadowDOM();
      }

      // 4. 컴포넌트 렌더링 (자식 클래스에서 구현)
      const html = this.render();
      this.renderContent(html);

      // 5. 이벤트 리스너 연결 (자식 클래스에서 구현)
      this.attachEvents();

      // 6. 상태 업데이트
      this.state = 'ready';

      console.log(`✅ [${this.componentName}] 컴포넌트 로드 완료`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 웹 컴포넌트가 DOM에서 제거될 때 호출됩니다.
   * 이벤트 리스너를 정리하려면 이 메서드를 오버라이드하세요.
   *
   * @protected
   */
  disconnectedCallback() {
    console.log(`🔌 [${this.componentName}] 컴포넌트 연결 해제`);
    // 자식 클래스에서 이벤트 리스너 정리 등을 수행할 수 있습니다.
  }

  /**
   * Config 로드
   * 위젯 모드와 통합 모드를 모두 지원합니다.
   *
   * 위젯 모드 (아임웹 코드위젯):
   *   - window.FORM_CONFIG, window.HEADER_CONFIG 등 개별 Config 사용
   *   - window.ZOAD_WIDGET_MODE로 위젯 유형 확인
   *
   * 통합 모드 (개발/테스트):
   *   - window.CONFIG에서 모든 컴포넌트 Config 로드
   *
   * @throws {Error} Config 파싱 실패 시
   * @private
   */
  loadConfig() {
    try {
      // 위젯 모드 확인: window.{COMPONENT}_CONFIG 형태의 개별 Config
      const widgetConfigName = `${this.componentName.toUpperCase()}_CONFIG`;
      const widgetConfig = window[widgetConfigName];

      if (widgetConfig) {
        // 위젯 모드: 개별 Config 사용
        console.log(`📦 [${this.componentName}] 위젯 모드 - ${widgetConfigName} 로드`);

        // 위젯 Config를 componentConfig로 직접 사용
        this.componentConfig = widgetConfig;

        // meta 정보가 있으면 전역 config로 설정
        this.config = {
          meta: widgetConfig.meta || { siteName: '100zoad' },
          debug: widgetConfig.meta?.debug || widgetConfig.debug || false,
          [this.componentName]: widgetConfig
        };
      } else {
        // 통합 모드: window.CONFIG 사용
        this.config = parseConfig();

        // 컴포넌트별 Config 추출
        this.componentConfig = this.config[this.componentName] || null;

        if (!this.componentConfig) {
          console.warn(`⚠️ [${this.componentName}] Config가 정의되지 않았습니다.`);
        }
      }
    } catch (error) {
      throw new Error(`Config 로드 실패: ${error.message}`);
    }
  }

  /**
   * 컴포넌트가 활성화되었는지 확인
   *
   * @returns {boolean} 활성화 여부
   * @protected
   */
  isEnabled() {
    return isComponentEnabled(this.config, this.componentName);
  }

  /**
   * Shadow DOM 초기화
   * 컴포넌트를 완전히 격리하여 아임웹 스타일과 충돌하지 않도록 합니다.
   *
   * @private
   */
  initShadowDOM() {
    // attachShadow()는 this.shadowRoot를 자동으로 설정합니다
    if (!this.shadowRoot) {
      this.attachShadow({
        mode: this.options.shadowMode
      });

      console.log(`🔒 [${this.componentName}] Shadow DOM 초기화 완료 (mode: ${this.options.shadowMode})`);
    }
  }

  /**
   * 컨텐츠 렌더링
   * render() 메서드에서 반환된 HTML을 Shadow DOM 또는 Light DOM에 삽입합니다.
   *
   * @param {string} html - 렌더링할 HTML 문자열
   * @private
   */
  renderContent(html) {
    const target = this.options.useShadowDOM ? this.shadowRoot : this;

    if (!target) {
      throw new Error('렌더링 대상을 찾을 수 없습니다.');
    }

    target.innerHTML = html;
  }

  /**
   * 컴포넌트 렌더링 (자식 클래스에서 구현 필수)
   * Shadow DOM에 삽입될 HTML 문자열을 반환합니다.
   *
   * @returns {string} 렌더링할 HTML 문자열
   * @abstract
   *
   * @example
   * render() {
   *   return `
   *     <style>
   *       :host {
   *         display: block;
   *       }
   *       .container {
   *         background-color: ${this.componentConfig.styles.bgColor};
   *       }
   *     </style>
   *     <div class="container">
   *       <h1>${this.componentConfig.title}</h1>
   *     </div>
   *   `;
   * }
   */
  render() {
    console.warn(`⚠️ [${this.componentName}] render() 메서드가 구현되지 않았습니다.`);
    return `
      <style>
        :host {
          display: block;
          padding: 20px;
          background-color: #f0f0f0;
          border: 2px dashed #ccc;
          text-align: center;
        }
      </style>
      <div>
        <p>⚠️ ${this.componentName} 컴포넌트: render() 메서드를 구현해주세요.</p>
      </div>
    `;
  }

  /**
   * 이벤트 리스너 연결 (자식 클래스에서 구현 선택)
   * 버튼 클릭, 폼 제출 등의 이벤트 리스너를 추가합니다.
   *
   * @protected
   *
   * @example
   * attachEvents() {
   *   const button = this.shadowRoot.querySelector('.submit-btn');
   *   button.addEventListener('click', (e) => {
   *     this.handleSubmit(e);
   *   });
   * }
   */
  attachEvents() {
    // 자식 클래스에서 오버라이드 가능
  }

  /**
   * 에러 핸들링
   * 컴포넌트 로딩 중 발생한 오류를 처리합니다.
   *
   * @param {Error} error - 발생한 오류
   * @private
   */
  handleError(error) {
    this.state = 'error';
    this.error = error.message;

    console.error(`❌ [${this.componentName}] 오류 발생:`, error);

    // Fallback 표시
    const fallbackHTML = this.renderFallback();
    if (fallbackHTML) {
      const target = this.options.useShadowDOM && this.shadowRoot ? this.shadowRoot : this;
      target.innerHTML = fallbackHTML;
    }
  }

  /**
   * Fallback HTML 렌더링
   * 컴포넌트 로딩 실패 시 표시할 대체 HTML을 반환합니다.
   *
   * @returns {string|null} Fallback HTML 또는 null
   * @protected
   *
   * @example
   * renderFallback() {
   *   return `
   *     <style>
   *       .fallback {
   *         padding: 10px;
   *         background-color: #fff3cd;
   *         border: 1px solid #ffc107;
   *       }
   *     </style>
   *     <div class="fallback">
   *       <p>컴포넌트를 불러올 수 없습니다. 페이지를 새로고침해주세요.</p>
   *     </div>
   *   `;
   * }
   */
  renderFallback() {
    // 기본 Fallback (자식 클래스에서 오버라이드 가능)
    return `
      <style>
        :host {
          display: block;
          padding: 10px;
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          color: #856404;
        }
      </style>
      <div>
        <p>⚠️ [${this.componentName}] 컴포넌트를 불러올 수 없습니다.</p>
        <p>오류: ${this.error}</p>
      </div>
    `;
  }

  /**
   * 헬퍼 메서드: querySelector (Shadow DOM 또는 Light DOM에서 검색)
   *
   * @param {string} selector - CSS 선택자
   * @returns {Element|null} 찾은 요소 또는 null
   * @protected
   */
  $(selector) {
    const target = this.options.useShadowDOM && this.shadowRoot ? this.shadowRoot : this;
    return target.querySelector(selector);
  }

  /**
   * 헬퍼 메서드: querySelectorAll (Shadow DOM 또는 Light DOM에서 검색)
   *
   * @param {string} selector - CSS 선택자
   * @returns {NodeList} 찾은 요소들
   * @protected
   */
  $$(selector) {
    const target = this.options.useShadowDOM && this.shadowRoot ? this.shadowRoot : this;
    return target.querySelectorAll(selector);
  }

  /**
   * 헬퍼 메서드: 스타일 주입
   * Shadow DOM에 동적으로 스타일을 추가합니다.
   *
   * @param {string} css - 추가할 CSS 문자열
   * @protected
   *
   * @example
   * this.injectStyle(`
   *   .dynamic-class {
   *     color: red;
   *   }
   * `);
   */
  injectStyle(css) {
    const target = this.options.useShadowDOM && this.shadowRoot ? this.shadowRoot : this;
    const style = document.createElement('style');
    style.textContent = css;
    target.appendChild(style);
  }

  /**
   * 헬퍼 메서드: Config 값 가져오기 (안전)
   * 중첩된 객체 경로에서 안전하게 값을 가져옵니다.
   *
   * @param {string} path - 객체 경로 (예: 'styles.bgColor')
   * @param {*} defaultValue - 기본값
   * @returns {*} Config 값 또는 기본값
   * @protected
   *
   * @example
   * const bgColor = this.getConfigValue('styles.bgColor', '#ffffff');
   */
  getConfigValue(path, defaultValue = null) {
    if (!this.componentConfig) {
      return defaultValue;
    }

    const keys = path.split('.');
    let value = this.componentConfig;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value !== undefined ? value : defaultValue;
  }

  /**
   * 디버그 모드 활성화 여부 확인
   * Window.CONFIG.debug === true일 때 true 반환
   *
   * @returns {boolean} 디버그 모드 여부
   * @protected
   */
  isDebugMode() {
    return this.config?.debug === true;
  }

  /**
   * 디버그 로그 출력
   * 디버그 모드일 때만 로그를 출력합니다.
   *
   * @param {...*} args - 로그 인자
   * @protected
   */
  debug(...args) {
    if (this.isDebugMode()) {
      console.log(`[DEBUG][${this.componentName}]`, ...args);
    }
  }

  /**
   * 헬퍼 메서드: 크로스 브라우저 호환 부드러운 스크롤
   *
   * @param {number} top - 스크롤할 위치
   * @param {string} behavior - 스크롤 동작 ('smooth' | 'auto')
   * @protected
   */
  smoothScrollTo(top, behavior = 'smooth') {
    smoothScrollTo(top, behavior);
  }

  /**
   * 헬퍼 메서드: 크로스 브라우저 호환 스크롤 위치 가져오기
   *
   * @returns {number} 현재 스크롤 위치
   * @protected
   */
  getScrollPosition() {
    return getScrollPosition();
  }
}

/**
 * 컴포넌트 타임아웃 래퍼
 * Graceful Degradation을 위해 컴포넌트 로딩에 타임아웃을 적용합니다.
 *
 * @param {Function} callback - 실행할 함수
 * @param {number} [timeout=3000] - 타임아웃 (ms)
 * @param {Function} [fallback] - 타임아웃 시 실행할 fallback 함수
 * @returns {Promise} Promise 객체
 *
 * @example
 * withTimeout(
 *   () => import('./components/header/header.js'),
 *   3000,
 *   () => console.log('Header 로딩 실패, fallback 실행')
 * );
 */
export function withTimeout(callback, timeout = 3000, fallback = null) {
  return Promise.race([
    callback(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('컴포넌트 로딩 타임아웃')), timeout)
    )
  ]).catch(error => {
    console.error('컴포넌트 로딩 실패:', error);
    if (fallback) {
      fallback(error);
    }
    throw error;
  });
}

// 기본 export
export default BaseComponent;
