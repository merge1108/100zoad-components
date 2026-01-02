/**
 * Browser Compatibility Utilities
 *
 * 크로스 브라우저 호환성을 위한 유틸리티 함수 및 폴리필
 * - Web Components 지원 여부 확인
 * - Smooth Scroll 폴리필
 * - Browser detection utilities
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-02
 */

/**
 * 브라우저 정보 감지
 *
 * @returns {Object} 브라우저 정보
 */
export function detectBrowser() {
  const ua = navigator.userAgent;
  const browser = {
    name: 'unknown',
    version: 'unknown',
    isChrome: false,
    isFirefox: false,
    isSafari: false,
    isEdge: false,
    isIE: false,
    isMobile: false
  };

  // Chrome
  if (/Chrome/.test(ua) && /Google Inc/.test(navigator.vendor)) {
    browser.name = 'Chrome';
    browser.isChrome = true;
    const match = ua.match(/Chrome\/(\d+)/);
    if (match) browser.version = match[1];
  }
  // Edge (Chromium-based)
  else if (/Edg/.test(ua)) {
    browser.name = 'Edge';
    browser.isEdge = true;
    const match = ua.match(/Edg\/(\d+)/);
    if (match) browser.version = match[1];
  }
  // Firefox
  else if (/Firefox/.test(ua)) {
    browser.name = 'Firefox';
    browser.isFirefox = true;
    const match = ua.match(/Firefox\/(\d+)/);
    if (match) browser.version = match[1];
  }
  // Safari
  else if (/Safari/.test(ua) && /Apple Computer/.test(navigator.vendor)) {
    browser.name = 'Safari';
    browser.isSafari = true;
    const match = ua.match(/Version\/(\d+)/);
    if (match) browser.version = match[1];
  }
  // IE
  else if (/MSIE|Trident/.test(ua)) {
    browser.name = 'IE';
    browser.isIE = true;
    const match = ua.match(/(?:MSIE |rv:)(\d+)/);
    if (match) browser.version = match[1];
  }

  // Mobile detection
  browser.isMobile = /Mobile|Android|iPhone|iPad|iPod/.test(ua);

  return browser;
}

/**
 * Web Components 지원 여부 확인
 *
 * @returns {Object} 지원 정보
 */
export function checkWebComponentsSupport() {
  return {
    customElements: 'customElements' in window,
    shadowDOM: 'attachShadow' in Element.prototype,
    templateElement: 'content' in document.createElement('template')
  };
}

/**
 * Smooth Scroll 지원 여부 확인
 *
 * @returns {boolean} 지원 여부
 */
export function supportsSmoothScroll() {
  return 'scrollBehavior' in document.documentElement.style;
}

/**
 * 크로스 브라우저 호환 scrollTo
 * 부드러운 스크롤을 지원하지 않는 브라우저에서는 폴리필 적용
 *
 * @param {number} top - 스크롤할 위치 (픽셀)
 * @param {string} behavior - 'smooth' 또는 'auto'
 */
export function smoothScrollTo(top, behavior = 'smooth') {
  // Smooth scroll 지원 여부 확인
  if (supportsSmoothScroll()) {
    window.scrollTo({
      top: top,
      behavior: behavior
    });
  } else {
    // 폴리필: 애니메이션으로 부드러운 스크롤 구현
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const distance = top - startPosition;
    const duration = 500; // 0.5초
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - percentage, 3);

      window.scrollTo(0, startPosition + distance * easeOut);

      if (progress < duration) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }
}

/**
 * 크로스 브라우저 호환 스크롤 위치 가져오기
 *
 * @returns {number} 현재 스크롤 위치
 */
export function getScrollPosition() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

/**
 * 크로스 브라우저 호환 이벤트 리스너 추가
 *
 * @param {Element} element - 대상 요소
 * @param {string} event - 이벤트 이름
 * @param {Function} handler - 핸들러 함수
 * @param {boolean|Object} options - 옵션
 */
export function addEventListenerCompat(element, event, handler, options = false) {
  if (element.addEventListener) {
    element.addEventListener(event, handler, options);
  } else if (element.attachEvent) {
    // IE8 이하 (거의 사용되지 않음)
    element.attachEvent('on' + event, handler);
  }
}

/**
 * 크로스 브라우저 호환 이벤트 리스너 제거
 *
 * @param {Element} element - 대상 요소
 * @param {string} event - 이벤트 이름
 * @param {Function} handler - 핸들러 함수
 * @param {boolean|Object} options - 옵션
 */
export function removeEventListenerCompat(element, event, handler, options = false) {
  if (element.removeEventListener) {
    element.removeEventListener(event, handler, options);
  } else if (element.detachEvent) {
    // IE8 이하
    element.detachEvent('on' + event, handler);
  }
}

/**
 * requestAnimationFrame 폴리필
 * 구형 브라우저에서 애니메이션을 위해 setTimeout 사용
 *
 * @returns {Function} requestAnimationFrame 함수
 */
export function getRequestAnimationFrame() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return setTimeout(callback, 1000 / 60); // 60 FPS
    };
}

/**
 * cancelAnimationFrame 폴리필
 *
 * @returns {Function} cancelAnimationFrame 함수
 */
export function getCancelAnimationFrame() {
  return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    clearTimeout;
}

/**
 * CSS.supports 폴백
 *
 * @param {string} property - CSS 속성
 * @param {string} value - CSS 값
 * @returns {boolean} 지원 여부
 */
export function cssSupports(property, value) {
  if (window.CSS && window.CSS.supports) {
    return CSS.supports(property, value);
  }

  // 폴백: 테스트 요소 생성하여 확인
  const element = document.createElement('div');
  element.style[property] = value;
  return element.style[property] === value;
}

/**
 * Object.assign 폴리필
 * IE 11에서 지원하지 않는 경우 대비
 */
export function polyfillObjectAssign() {
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      const to = Object(target);

      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index];

        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }

      return to;
    };
  }
}

/**
 * Array.from 폴리필
 * IE 11에서 지원하지 않는 경우 대비
 */
export function polyfillArrayFrom() {
  if (!Array.from) {
    Array.from = function (arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    };
  }
}

/**
 * String.prototype.includes 폴리필
 */
export function polyfillStringIncludes() {
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      if (typeof start !== 'number') {
        start = 0;
      }

      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }
}

/**
 * 모든 폴리필 초기화
 * 페이지 로드 시 호출
 */
export function initPolyfills() {
  polyfillObjectAssign();
  polyfillArrayFrom();
  polyfillStringIncludes();

  console.log('✅ Browser compatibility polyfills loaded');
}

/**
 * 브라우저 호환성 리포트 생성
 *
 * @returns {Object} 호환성 정보
 */
export function generateCompatibilityReport() {
  const browser = detectBrowser();
  const webComponents = checkWebComponentsSupport();

  return {
    browser: browser,
    webComponents: webComponents,
    smoothScroll: supportsSmoothScroll(),
    cssGrid: cssSupports('display', 'grid'),
    cssFlexbox: cssSupports('display', 'flex'),
    objectAssign: typeof Object.assign === 'function',
    arrayFrom: typeof Array.from === 'function',
    fetch: typeof fetch === 'function',
    promise: typeof Promise === 'function'
  };
}

/**
 * 브라우저 호환성 경고 표시
 * 지원하지 않는 브라우저에 대한 경고 메시지 표시
 */
export function showCompatibilityWarning() {
  const browser = detectBrowser();
  const support = checkWebComponentsSupport();

  // IE 11 이하는 Web Components 미지원
  if (browser.isIE) {
    console.warn(
      '⚠️ Internet Explorer는 Web Components를 지원하지 않습니다. ' +
      'Chrome, Firefox, Safari, Edge 최신 버전을 사용해주세요.'
    );
    return true;
  }

  // Web Components 지원 확인
  if (!support.customElements || !support.shadowDOM) {
    console.warn(
      '⚠️ 현재 브라우저는 Web Components를 완전히 지원하지 않습니다. ' +
      '최신 브라우저로 업데이트해주세요.'
    );
    return true;
  }

  return false;
}

// 기본 export
export default {
  detectBrowser,
  checkWebComponentsSupport,
  supportsSmoothScroll,
  smoothScrollTo,
  getScrollPosition,
  addEventListenerCompat,
  removeEventListenerCompat,
  getRequestAnimationFrame,
  getCancelAnimationFrame,
  cssSupports,
  initPolyfills,
  generateCompatibilityReport,
  showCompatibilityWarning
};
