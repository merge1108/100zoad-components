/**
 * QuickMenuComponent - 100zoad Web Components
 *
 * PC 화면 우측에 고정되는 퀵메뉴 컴포넌트
 * - 최대 4개 버튼 지원
 * - 입력폼 팝업, 전화걸기, URL 이동 액션
 * - 스크롤 시에도 고정 위치 유지
 * - 모바일에서는 숨김
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-01
 */

import BaseComponent from '../../core/base-component.js';

/**
 * 퀵메뉴 웹 컴포넌트
 *
 * @extends BaseComponent
 *
 * @example
 * <zoad-quickmenu></zoad-quickmenu>
 *
 * // Config 예시
 * window.QUICKMENU_CONFIG = {
 *   enabled: true,
 *   position: {
 *     right: '30px',
 *     top: '50%'
 *   },
 *   buttons: [
 *     {
 *       text: '입력폼',
 *       icon: '📝',
 *       action: 'openForm',
 *       color: '#007bff'
 *     },
 *     {
 *       text: '전화걸기',
 *       icon: '📞',
 *       action: 'call',
 *       phone: '010-1234-5678',
 *       color: '#28a745'
 *     }
 *   ]
 * };
 */
export class QuickMenuComponent extends BaseComponent {
  /**
   * QuickMenuComponent 생성자
   */
  constructor() {
    super('quickmenu');
  }

  /**
   * 컴포넌트 렌더링
   * Shadow DOM에 삽입될 HTML 문자열을 반환합니다.
   *
   * @returns {string} 렌더링할 HTML 문자열
   */
  render() {
    const buttons = this.getConfigValue('buttons', []);
    const position = this.getConfigValue('position', { right: '30px', top: '50%' });

    // 최대 4개 버튼만 표시
    const visibleButtons = buttons.slice(0, 4);

    if (visibleButtons.length === 0) {
      console.warn('⚠️ [quickmenu] 버튼이 설정되지 않았습니다.');
      return this.renderEmpty();
    }

    return `
      ${this.renderStyles(position)}
      <div class="quickmenu-container">
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
   * @param {Object} position - 위치 설정
   * @returns {string} CSS 문자열
   * @private
   */
  renderStyles(position) {
    return `
      <style>
        :host {
          display: block;
          position: fixed;
          right: ${position.right || '30px'};
          top: ${position.top || '50%'};
          transform: translateY(-50%);
          z-index: 9998;
        }

        .quickmenu-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quickmenu-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-decoration: none;
          color: inherit;
        }

        .quickmenu-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .quickmenu-button:active {
          transform: scale(0.95);
        }

        .button-icon {
          font-size: 24px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .button-text {
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
          word-break: keep-all;
        }

        /* 모바일에서 숨김 */
        @media (max-width: 768px) {
          :host {
            display: none !important;
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
      color = '#007bff',
      phone = '',
      url = '',
      target = '_blank'
    } = button;

    // 버튼 배경색 설정
    const style = `background-color: ${color}; color: #ffffff;`;

    // 버튼 타입별 추가 속성
    const dataAttrs = `
      data-action="${action}"
      data-phone="${phone}"
      data-url="${url}"
      data-target="${target}"
      data-index="${index}"
    `;

    return `
      <button class="quickmenu-button" style="${style}" ${dataAttrs}>
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
    const buttons = this.$$('.quickmenu-button');

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

    this.debug('버튼 클릭:', { action, phone, url, target, index });

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
        console.warn(`⚠️ [quickmenu] 알 수 없는 액션: ${action}`);
    }

    // GTM/GA4 이벤트 추적 (STORY-021에서 구현 예정)
    this.trackButtonClick(action, index);
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
      console.warn('⚠️ [quickmenu] zoad-form 컴포넌트를 찾을 수 없거나 openPopup() 메서드가 없습니다.');

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
      console.warn('⚠️ [quickmenu] 전화번호가 설정되지 않았습니다.');
      return;
    }

    this.debug('전화걸기:', phone);

    // 모바일: tel: 링크로 직접 전화 앱 실행
    // PC: alert 또는 전화번호 복사
    if (this.isMobile()) {
      window.location.href = `tel:${phone}`;
    } else {
      // PC에서는 전화번호를 alert로 표시하거나 클립보드에 복사
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phone)
          .then(() => {
            alert(`전화번호가 복사되었습니다:\n${phone}`);
          })
          .catch(() => {
            alert(`전화번호:\n${phone}`);
          });
      } else {
        alert(`전화번호:\n${phone}`);
      }
    }
  }

  /**
   * URL 이동
   * @param {string} url - 이동할 URL
   * @param {string} target - 열기 방식 (_blank, _self 등)
   * @private
   */
  handleLink(url, target = '_blank') {
    if (!url) {
      console.warn('⚠️ [quickmenu] URL이 설정되지 않았습니다.');
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
   * 버튼 클릭 추적
   * @param {string} action - 액션 타입
   * @param {number} index - 버튼 인덱스
   * @private
   */
  trackButtonClick(action, index) {
    // GTM/GA4 이벤트 송출 (STORY-021에서 구현 예정)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'quickmenu_click',
        component: 'quickmenu',
        action: action,
        button_index: index
      });
      this.debug('GTM 이벤트 송출:', { action, index });
    }
  }

  /**
   * 모바일 기기 확인
   * @returns {boolean} 모바일 여부
   * @private
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Fallback HTML 렌더링
   * @returns {string|null} Fallback HTML
   */
  renderFallback() {
    // 퀵메뉴는 필수 컴포넌트가 아니므로 오류 시 숨김 처리
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
if (!customElements.get('zoad-quickmenu')) {
  customElements.define('zoad-quickmenu', QuickMenuComponent);
  console.log('✅ zoad-quickmenu 컴포넌트 등록 완료');
}

export default QuickMenuComponent;
