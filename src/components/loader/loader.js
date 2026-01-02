/**
 * LoaderComponent - 100zoad Web Components
 *
 * 페이지 로딩 중 로딩 인디케이터를 표시하는 컴포넌트
 * - Config로 스피너 스타일 설정
 * - 컴포넌트 로딩 진행 상태 표시
 * - 3초 타임아웃 후 자동 숨김
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-02
 * @story STORY-025
 */

import { BaseComponent } from '../../core/base-component.js';

/**
 * LoaderComponent 클래스
 * 페이지 초기 로딩 중 스피너와 진행 상태를 표시합니다.
 *
 * @extends BaseComponent
 *
 * @example
 * <zoad-loader></zoad-loader>
 */
export class LoaderComponent extends BaseComponent {
  constructor() {
    super('loader');

    /**
     * 로딩 완료된 컴포넌트 수
     * @type {number}
     */
    this.loadedCount = 0;

    /**
     * 전체 컴포넌트 수
     * @type {number}
     */
    this.totalCount = 0;

    /**
     * 로딩 시작 시간
     * @type {number}
     */
    this.startTime = Date.now();

    /**
     * 로더 표시 여부
     * @type {boolean}
     */
    this.isVisible = true;
  }

  /**
   * 컴포넌트 렌더링
   * @returns {string} HTML 문자열
   */
  render() {
    const config = this.componentConfig || {};
    const spinnerType = config.spinnerType || 'circle'; // 'circle' | 'bars' | 'dots'
    const bgColor = config.bgColor || 'rgba(255, 255, 255, 0.95)';
    const primaryColor = config.primaryColor || '#007bff';
    const textColor = config.textColor || '#333333';
    const showProgress = config.showProgress !== false; // 기본 true

    return `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: ${bgColor};
          z-index: 99999;
          transition: opacity 0.3s ease-out;
        }

        :host(.hidden) {
          opacity: 0;
          pointer-events: none;
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
        }

        .spinner {
          margin-bottom: 20px;
        }

        /* Circle Spinner */
        .spinner-circle {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(0, 123, 255, 0.2);
          border-top-color: ${primaryColor};
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Bars Spinner */
        .spinner-bars {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          height: 60px;
        }

        .spinner-bars .bar {
          width: 8px;
          background-color: ${primaryColor};
          animation: grow 1.2s ease-in-out infinite;
        }

        .spinner-bars .bar:nth-child(1) { animation-delay: 0s; }
        .spinner-bars .bar:nth-child(2) { animation-delay: 0.15s; }
        .spinner-bars .bar:nth-child(3) { animation-delay: 0.3s; }
        .spinner-bars .bar:nth-child(4) { animation-delay: 0.45s; }
        .spinner-bars .bar:nth-child(5) { animation-delay: 0.6s; }

        /* Dots Spinner */
        .spinner-dots {
          display: flex;
          gap: 12px;
        }

        .spinner-dots .dot {
          width: 16px;
          height: 16px;
          background-color: ${primaryColor};
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite;
        }

        .spinner-dots .dot:nth-child(1) { animation-delay: 0s; }
        .spinner-dots .dot:nth-child(2) { animation-delay: 0.2s; }
        .spinner-dots .dot:nth-child(3) { animation-delay: 0.4s; }

        /* Progress Text */
        .progress-text {
          color: ${textColor};
          font-size: 16px;
          font-weight: 500;
          margin-top: 16px;
          text-align: center;
        }

        .progress-percentage {
          font-size: 14px;
          color: ${primaryColor};
          margin-top: 8px;
        }

        .loading-time {
          font-size: 12px;
          color: #999999;
          margin-top: 8px;
        }

        /* Animations */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes grow {
          0%, 100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      </style>

      <div class="loader-container">
        <div class="spinner">
          ${this.renderSpinner(spinnerType)}
        </div>
        ${showProgress ? `
          <div class="progress-text">
            <div>컴포넌트 로딩 중...</div>
            <div class="progress-percentage" id="progress">0%</div>
            <div class="loading-time" id="time">0.0s</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * 스피너 렌더링
   * @param {string} type - 스피너 타입
   * @returns {string} HTML 문자열
   */
  renderSpinner(type) {
    switch (type) {
      case 'bars':
        return `
          <div class="spinner-bars">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
        `;

      case 'dots':
        return `
          <div class="spinner-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        `;

      case 'circle':
      default:
        return '<div class="spinner-circle"></div>';
    }
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEvents() {
    // 로딩 시간 업데이트 (100ms마다)
    this.timeInterval = setInterval(() => {
      if (!this.isVisible) {
        clearInterval(this.timeInterval);
        return;
      }

      const elapsed = (Date.now() - this.startTime) / 1000;
      const timeEl = this.$('#time');
      if (timeEl) {
        timeEl.textContent = `${elapsed.toFixed(1)}s`;

        // 3초 경고
        if (elapsed >= 2.5 && elapsed < 3) {
          timeEl.style.color = '#ff9800'; // 오렌지색
        } else if (elapsed >= 3) {
          timeEl.style.color = '#dc3545'; // 빨간색
        }
      }
    }, 100);
  }

  /**
   * 진행 상태 업데이트
   * @param {number} loaded - 로딩 완료된 컴포넌트 수
   * @param {number} total - 전체 컴포넌트 수
   */
  updateProgress(loaded, total) {
    this.loadedCount = loaded;
    this.totalCount = total;

    const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;
    const progressEl = this.$('#progress');

    if (progressEl) {
      progressEl.textContent = `${percentage}% (${loaded}/${total})`;
    }

    // 모든 컴포넌트 로딩 완료 시
    if (loaded >= total && total > 0) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      console.log(`✅ 모든 컴포넌트 로딩 완료! (${elapsed.toFixed(2)}s)`);

      // 300ms 후 페이드아웃
      setTimeout(() => this.hide(), 300);
    }
  }

  /**
   * 로더 숨기기
   */
  hide() {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.classList.add('hidden');

    // 정리
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }

    // 애니메이션 완료 후 DOM에서 제거
    setTimeout(() => {
      if (this.parentElement) {
        this.parentElement.removeChild(this);
      }
    }, 300);

    const elapsed = (Date.now() - this.startTime) / 1000;
    console.log(`🚀 [loader] 로딩 완료 및 숨김 (총 ${elapsed.toFixed(2)}s)`);
  }

  /**
   * 강제 숨기기 (타임아웃용)
   * @param {number} timeout - 타임아웃 (ms)
   */
  hideAfterTimeout(timeout = 3000) {
    setTimeout(() => {
      if (this.isVisible) {
        console.warn(`⏱️ [loader] 타임아웃! ${timeout}ms 경과`);
        this.hide();
      }
    }, timeout);
  }

  /**
   * 컴포넌트 연결 해제 시
   */
  disconnectedCallback() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    super.disconnectedCallback();
  }
}

// 커스텀 엘리먼트 등록
customElements.define('zoad-loader', LoaderComponent);
