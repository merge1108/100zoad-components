/**
 * Scroll Depth Tracker - 100zoad Web Components
 *
 * 페이지 스크롤 깊이를 추적하여 GTM/GA4로 이벤트를 전송합니다.
 * Intersection Observer API를 사용하여 25%, 50%, 75%, 100% 도달 시 이벤트 발생
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-02
 * @story STORY-022
 */

import { trackScrollDepth } from './analytics.js';

/**
 * ScrollDepthTracker 클래스
 * 페이지 스크롤 깊이를 모니터링하고 특정 깊이 도달 시 이벤트를 발생시킵니다.
 *
 * @example
 * const tracker = new ScrollDepthTracker({
 *   thresholds: [25, 50, 75, 100],
 *   onDepthReached: (percentage) => console.log(`${percentage}% 도달!`)
 * });
 * tracker.init();
 */
export class ScrollDepthTracker {
  /**
   * ScrollDepthTracker 생성자
   *
   * @param {Object} options - 옵션
   * @param {number[]} [options.thresholds=[25, 50, 75, 100]] - 추적할 스크롤 깊이 퍼센트
   * @param {Function} [options.onDepthReached] - 특정 깊이 도달 시 콜백 함수
   * @param {Object} [options.config={}] - Config 객체 (analytics 설정용)
   */
  constructor(options = {}) {
    /**
     * 추적할 스크롤 깊이 임계값들
     * @type {number[]}
     */
    this.thresholds = options.thresholds || [25, 50, 75, 100];

    /**
     * 이미 추적된 깊이들
     * @type {Set<number>}
     */
    this.trackedDepths = new Set();

    /**
     * 깊이 도달 시 콜백 함수
     * @type {Function|null}
     */
    this.onDepthReached = options.onDepthReached || null;

    /**
     * Config 객체
     * @type {Object}
     */
    this.config = options.config || {};

    /**
     * Intersection Observer 인스턴스
     * @type {IntersectionObserver|null}
     */
    this.observer = null;

    /**
     * 마커 요소들
     * @type {HTMLElement[]}
     */
    this.markers = [];

    /**
     * 초기화 여부
     * @type {boolean}
     */
    this.initialized = false;

    console.log('[ScrollDepthTracker] 초기화 준비 완료:', {
      thresholds: this.thresholds
    });
  }

  /**
   * 스크롤 추적 초기화
   * 페이지에 보이지 않는 마커 요소들을 생성하고 Intersection Observer를 설정합니다.
   */
  init() {
    if (this.initialized) {
      console.warn('[ScrollDepthTracker] 이미 초기화되었습니다.');
      return;
    }

    try {
      // Intersection Observer 지원 확인
      if (!('IntersectionObserver' in window)) {
        console.warn('[ScrollDepthTracker] Intersection Observer를 지원하지 않는 브라우저입니다.');
        return;
      }

      // 마커 요소 생성
      this.createMarkers();

      // Intersection Observer 설정
      this.setupObserver();

      this.initialized = true;
      console.log('✅ [ScrollDepthTracker] 스크롤 깊이 추적 활성화');
    } catch (error) {
      console.error('[ScrollDepthTracker] 초기화 오류:', error);
    }
  }

  /**
   * 마커 요소들 생성
   * 각 임계값(25%, 50%, 75%, 100%)에 해당하는 위치에 보이지 않는 div 요소를 추가합니다.
   * @private
   */
  createMarkers() {
    // 기존 마커 제거
    this.removeMarkers();

    this.thresholds.forEach(threshold => {
      const marker = document.createElement('div');
      marker.id = `scroll-depth-marker-${threshold}`;
      marker.dataset.threshold = threshold.toString();

      // 스타일: 보이지 않음, 포지션 고정
      marker.style.cssText = `
        position: absolute;
        top: ${threshold}%;
        left: 0;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        z-index: -1;
      `;

      // body에 추가
      document.body.appendChild(marker);
      this.markers.push(marker);

      console.log(`[ScrollDepthTracker] 마커 생성: ${threshold}% (ID: ${marker.id})`);
    });
  }

  /**
   * Intersection Observer 설정
   * 마커가 뷰포트에 진입하면 이벤트를 발생시킵니다.
   * @private
   */
  setupObserver() {
    // Intersection Observer 옵션
    const options = {
      root: null, // viewport를 root로 사용
      rootMargin: '0px',
      threshold: 0.01 // 마커가 1% 이상 보일 때 트리거
    };

    // Observer 콜백
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const threshold = parseInt(entry.target.dataset.threshold, 10);

          // 아직 추적하지 않은 깊이인 경우
          if (!this.trackedDepths.has(threshold)) {
            this.handleDepthReached(threshold);
          }
        }
      });
    };

    // Intersection Observer 생성
    this.observer = new IntersectionObserver(callback, options);

    // 모든 마커 관찰 시작
    this.markers.forEach(marker => {
      this.observer.observe(marker);
    });

    console.log('[ScrollDepthTracker] Intersection Observer 설정 완료');
  }

  /**
   * 특정 스크롤 깊이 도달 시 처리
   *
   * @param {number} threshold - 도달한 깊이 퍼센트
   * @private
   */
  handleDepthReached(threshold) {
    // 중복 추적 방지
    if (this.trackedDepths.has(threshold)) {
      return;
    }

    // 추적 목록에 추가
    this.trackedDepths.add(threshold);

    console.log(`🎯 [ScrollDepthTracker] 스크롤 깊이 도달: ${threshold}%`);

    // GTM/GA4 이벤트 송출
    trackScrollDepth(threshold, this.config);

    // 콜백 함수 실행 (있는 경우)
    if (typeof this.onDepthReached === 'function') {
      this.onDepthReached(threshold);
    }
  }

  /**
   * 마커 요소들 제거
   * @private
   */
  removeMarkers() {
    this.markers.forEach(marker => {
      if (marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });
    this.markers = [];
  }

  /**
   * 스크롤 추적 종료
   * Observer를 중지하고 마커 요소들을 제거합니다.
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.removeMarkers();
    this.trackedDepths.clear();
    this.initialized = false;

    console.log('[ScrollDepthTracker] 스크롤 추적 종료');
  }

  /**
   * 현재 추적 상태 반환
   *
   * @returns {Object} 추적 상태
   */
  getStatus() {
    return {
      initialized: this.initialized,
      thresholds: this.thresholds,
      trackedDepths: Array.from(this.trackedDepths).sort((a, b) => a - b),
      remainingDepths: this.thresholds.filter(t => !this.trackedDepths.has(t))
    };
  }
}

/**
 * 전역 스크롤 추적기 인스턴스 초기화 함수
 * 한 번만 호출하여 전역 스크롤 추적을 활성화합니다.
 *
 * @param {Object} [config={}] - Config 객체
 * @returns {ScrollDepthTracker} 추적기 인스턴스
 *
 * @example
 * // main.html 또는 loader.js에서 호출
 * import { initScrollTracking } from './utils/scroll-tracker.js';
 * const tracker = initScrollTracking(window.CONFIG);
 */
export function initScrollTracking(config = {}) {
  // 기존 전역 추적기가 있으면 종료
  if (window.ZoadScrollTracker) {
    window.ZoadScrollTracker.destroy();
  }

  // 새 추적기 생성 및 초기화
  const tracker = new ScrollDepthTracker({
    thresholds: [25, 50, 75, 100],
    config: config,
    onDepthReached: (percentage) => {
      console.log(`✅ 스크롤 ${percentage}% 도달`);
    }
  });

  tracker.init();

  // 전역 변수에 저장 (디버깅용)
  window.ZoadScrollTracker = tracker;

  return tracker;
}

export default {
  ScrollDepthTracker,
  initScrollTracking
};
