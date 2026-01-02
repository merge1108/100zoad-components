/**
 * MobileNavigatorComponent - 100zoad Web Components
 *
 * 모바일 화면 하단에 고정되는 내비게이터 컴포넌트
 * - 최대 3개 버튼 지원
 * - 입력폼 팝업, 전화걸기, URL 이동 액션
 * - 화면 최하단 고정 위치 유지
 * - PC에서는 숨김
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-02
 */

import BaseComponent from '../../core/base-component.js';
import { trackCallClick, trackButtonClick } from '../../utils/analytics.js';

/**
 * 모바일 내비게이터 웹 컴포넌트
 *
 * @extends BaseComponent
 *
 * @example
 * <zoad-mobile-nav></zoad-mobile-nav>
 *
 * // Config 예시
 * window.MOBILENAV_CONFIG = {
 *   enabled: true,
 *   buttons: [
 *     {
 *       text: '상담신청',
 *       icon: '📝',
 *       action: 'openForm',
 *       color: '#007bff'
 *     },
 *     {
 *       text: '전화',
 *       icon: '📞',
 *       action: 'call',
 *       phone: '010-1234-5678',
 *       color: '#28a745'
 *     },
 *     {
 *       text: '위치',
 *       icon: '📍',
 *       action: 'link',
 *       url: 'https://naver.me/example',
 *       target: '_blank',
 *       color: '#17a2b8'
 *     }
 *   ]
 * };
 */
export class MobileNavigatorComponent extends BaseComponent {
  /**
   * MobileNavigatorComponent 생성자
   */
  constructor() {
    super('mobileNav');
  }

  /**
   * 컴포넌트 렌더링
   * Shadow DOM에 삽입될 HTML 문자열을 반환합니다.
   *
   * @returns {string} 렌더링할 HTML 문자열
   */
  render() {
    const buttons = this.getConfigValue('buttons', []);

    // 최대 3개 버튼만 표시
    const visibleButtons = buttons.slice(0, 3);

    if (visibleButtons.length === 0) {
      console.warn('⚠️ [mobileNav] 버튼이 설정되지 않았습니다.');
      return this.renderEmpty();
    }

    return `
      ${this.renderStyles()}
      <div class="mobile-nav-container">
        ${visibleButtons.map((button, index) => this.renderButton(button, index)).join('')}
      </div>
    `;
  }

  /**
   * 빈 상태 렌더링
   * @returns {string} HTML 문자열
   * @private
   */
  renderEmpty() {
    return `
      <style>
        :host {
          display: none;
        }
      </style>
    `;
  }

  /**
   * 스타일 렌더링
   * @returns {string} CSS 문자열
   * @private
   */
  renderStyles() {
    return `
      <style>
        :host {
          display: none; /* 기본값: 숨김 (PC) */
          position: fixed;
          bottom: 0 !important;
          left: 0;
          right: 0;
          z-index: 9999;
          margin: 0 !important;
          padding: 0 !important;
        }

        .mobile-nav-container {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          background-color: #ffffff;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          padding: 8px 0;
          padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px)); /* iOS safe area 대응 */
          border-top: 1px solid #e0e0e0;
          margin: 0 !important;
        }

        .mobile-nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          min-width: 70px;
          flex: 1;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          color: inherit;
          border-radius: 8px;
        }

        .mobile-nav-button:active {
          transform: scale(0.95);
          background-color: rgba(0, 0, 0, 0.05);
        }

        .button-icon {
          font-size: 28px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .button-text {
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
          word-break: keep-all;
          white-space: nowrap;
        }

        /* 모바일에서만 표시 */
        @media (max-width: 768px) {
          :host {
            display: block !important;
          }
        }

        /* 인쇄 시 숨김 */
        @media print {
          :host {
            display: none !important;
          }
        }
      </style>
    `;
  }

  /**
   * 개별 버튼 렌더링
   * @param {Object} button - 버튼 설정
   * @param {number} index - 버튼 인덱스
   * @returns {string} HTML 문자열
   * @private
   */
  renderButton(button, index) {
    const {
      text = '버튼',
      icon = '📌',
      action = 'openForm',
      color = '#333333',
      phone = '',
      url = '',
      target = '_blank'
    } = button;

    // 버튼 텍스트 색상 설정
    const style = `color: ${color};`;

    // 버튼 타입별 추가 속성
    const dataAttrs = `
      data-action="${action}"
      data-phone="${phone}"
      data-url="${url}"
      data-target="${target}"
      data-index="${index}"
    `;

    return `
      <button class="mobile-nav-button" style="${style}" ${dataAttrs}>
        <span class="button-icon">${icon}</span>
        <span class="button-text">${text}</span>
      </button>
    `;
  }

  /**
   * 이벤트 리스너 연결
   * 버튼 클릭 이벤트를 처리합니다.
   */
  attachEvents() {
    const buttons = this.$$('.mobile-nav-button');

    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleButtonClick(e);
      });
    });

    this.debug('이벤트 리스너 연결 완료');
  }

  /**
   * 버튼 클릭 핸들러
   * @param {Event} e - 클릭 이벤트
   * @private
   */
  handleButtonClick(e) {
    const button = e.currentTarget;
    const action = button.dataset.action;
    const phone = button.dataset.phone;
    const url = button.dataset.url;
    const target = button.dataset.target;
    const index = button.dataset.index;
    const buttonText = button.querySelector('.button-text')?.textContent || '버튼';

    this.debug('버튼 클릭:', { action, phone, url, target, index, buttonText });

    // GTM/GA4 이벤트 추적 (STORY-022)
    trackButtonClick(buttonText, action, 'mobileNav', parseInt(index, 10), this.config);

    // 액션 타입별 처리
    switch (action) {
      case 'openForm':
        this.handleOpenForm();
        break;

      case 'call':
        this.handleCall(phone);
        break;

      case 'link':
        this.handleLink(url, target);
        break;

      default:
        console.warn(`⚠️ [mobileNav] 알 수 없는 액션: ${action}`);
    }
  }

  /**
   * 입력폼 팝업 열기
   * @private
   */
  handleOpenForm() {
    this.debug('입력폼 팝업 열기');

    // zoad-form 컴포넌트 찾기
    const formComponent = document.querySelector('zoad-form');

    if (formComponent && typeof formComponent.openPopup === 'function') {
      formComponent.openPopup();
    } else {
      console.warn('⚠️ [mobileNav] zoad-form 컴포넌트를 찾을 수 없거나 openPopup() 메서드가 없습니다.');

      // Fallback: 입력폼 섹션으로 스크롤
      const formSection = document.querySelector('#form-section');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /**
   * 전화걸기
   * @param {string} phone - 전화번호
   * @private
   */
  handleCall(phone) {
    if (!phone) {
      console.warn('⚠️ [mobileNav] 전화번호가 설정되지 않았습니다.');
      return;
    }

    this.debug('전화걸기:', phone);

    // GTM/GA4 전환 이벤트 추적 (STORY-021)
    trackCallClick(phone, 'mobileNav', this.config);

    // 모바일: tel: 링크로 직접 전화 앱 실행
    window.location.href = `tel:${phone}`;
  }

  /**
   * URL 이동
   * @param {string} url - 이동할 URL
   * @param {string} target - 열기 방식 (_blank, _self 등)
   * @private
   */
  handleLink(url, target = '_blank') {
    if (!url) {
      console.warn('⚠️ [mobileNav] URL이 설정되지 않았습니다.');
      return;
    }

    this.debug('URL 이동:', url, target);

    if (target === '_blank') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  }

  /**
   * Fallback HTML 렌더링
   * @returns {string|null} Fallback HTML
   */
  renderFallback() {
    // 모바일 내비게이터는 필수 컴포넌트가 아니므로 오류 시 숨김 처리
    return `
      <style>
        :host {
          display: none;
        }
      </style>
    `;
  }
}

// 컴포넌트 등록
if (!customElements.get('zoad-mobile-nav')) {
  customElements.define('zoad-mobile-nav', MobileNavigatorComponent);
  console.log('✅ zoad-mobile-nav 컴포넌트 등록 완료');
}

export default MobileNavigatorComponent;
