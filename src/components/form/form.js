/**
 * Form Component - 100zoad Web Components
 *
 * 리드 수집을 위한 입력폼 컴포넌트
 * - 필수 필드: 이름, 전화번호
 * - 선택 필드: Config에서 동적으로 추가 가능
 * - Cloudflare Worker를 통해 Airtable에 데이터 전송
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-01
 */

import { BaseComponent } from '../../core/base-component.js';
import { trackFormSubmit } from '../../utils/analytics.js';

/**
 * Form 웹 컴포넌트
 * 리드 정보를 수집하고 Airtable에 전송합니다.
 *
 * @extends BaseComponent
 */
class FormComponent extends BaseComponent {
  /**
   * 생성자
   */
  constructor() {
    super('form', {
      useShadowDOM: true,
      shadowMode: 'open'
    });

    /**
     * 폼 제출 상태
     * @type {'idle'|'submitting'|'success'|'error'}
     */
    this.submitState = 'idle';

    /**
     * 폼 데이터
     * @type {Object}
     */
    this.formData = {
      name: '',
      phone: ''
    };
  }

  /**
   * 렌더링
   * 입력폼 HTML을 생성합니다.
   *
   * @returns {string} HTML 문자열
   */
  render() {
    // displayMode 설정 가져오기 ("section", "popup", "both")
    this.displayMode = this.getConfigValue('displayMode', 'section');

    // Config에서 필드 설정 가져오기
    const nameConfig = this.getConfigValue('fields.name', {
      label: '이름',
      placeholder: '홍길동',
      required: true
    });

    const phoneConfig = this.getConfigValue('fields.phone', {
      label: '전화번호',
      placeholder: '010-0000-0000',
      required: true
    });

    // 텍스트 설정
    const formTitle = this.getConfigValue('title', '관심고객 등록');
    const formDescription = this.getConfigValue('description', '간단한 정보를 입력해주시면 상담 전화를 드리겠습니다.');
    const submitButtonText = this.getConfigValue('submitButtonText', '신청하기');
    const successMessage = this.getConfigValue('messages.success', '✓ 신청이 완료되었습니다!');
    const errorMessage = this.getConfigValue('messages.error', '제출 중 오류가 발생했습니다. 다시 시도해주세요.');

    // 기본 스타일 설정
    const bgColor = this.getConfigValue('styles.bgColor', '#ffffff');
    const textColor = this.getConfigValue('styles.textColor', '#333333');
    const primaryColor = this.getConfigValue('styles.primaryColor', '#007bff');
    const borderColor = this.getConfigValue('styles.borderColor', '#dddddd');
    const errorColor = this.getConfigValue('styles.errorColor', '#dc3545');

    // 추가 스타일 설정
    const inputBgColor = this.getConfigValue('styles.inputBgColor', '#ffffff');
    const inputDisabledBgColor = this.getConfigValue('styles.inputDisabledBgColor', '#f5f5f5');
    const buttonTextColor = this.getConfigValue('styles.buttonTextColor', '#ffffff');
    const buttonHoverColor = this.getConfigValue('styles.buttonHoverColor', '#0056b3');
    const buttonDisabledColor = this.getConfigValue('styles.buttonDisabledColor', '#cccccc');
    const descriptionColor = this.getConfigValue('styles.descriptionColor', '#666666');

    // 성공/오류 알림 스타일
    const successBgColor = this.getConfigValue('styles.successBgColor', '#d4edda');
    const successTextColor = this.getConfigValue('styles.successTextColor', '#155724');
    const successBorderColor = this.getConfigValue('styles.successBorderColor', '#c3e6cb');
    const errorAlertBgColor = this.getConfigValue('styles.errorAlertBgColor', '#f8d7da');
    const errorAlertTextColor = this.getConfigValue('styles.errorAlertTextColor', '#721c24');
    const errorAlertBorderColor = this.getConfigValue('styles.errorAlertBorderColor', '#f5c6cb');

    // 팝업 모드 설정
    const isPopup = this.displayMode === 'popup' || this.displayMode === 'both';
    const isSection = this.displayMode === 'section' || this.displayMode === 'both';

    return `
      <style>
        :host {
          display: block;
          font-family: 'Paperlogy', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        /* 팝업 오버레이 (popup 또는 both 모드) */
        .form-popup-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 99999;
          align-items: center;
          justify-content: center;
        }

        .form-popup-overlay.show {
          display: flex;
        }

        .form-popup-wrapper {
          position: relative;
          max-width: 550px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          background-color: ${bgColor};
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .form-popup-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 32px;
          font-weight: 300;
          color: ${textColor};
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
          z-index: 1;
        }

        .form-popup-close:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        /* 섹션 컨테이너 (section 또는 both 모드) */
        .form-section-container {
          display: ${isSection && this.displayMode !== 'popup' ? 'block' : 'none'};
        }

        .form-container {
          background-color: ${bgColor};
          color: ${textColor};
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 0 auto;
        }

        .form-container.popup-mode {
          box-shadow: none;
          max-width: none;
        }

        .form-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 24px 0;
          color: ${textColor};
          text-align: center;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: ${textColor};
        }

        .form-label.required::after {
          content: '*';
          color: ${errorColor};
          margin-left: 4px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border: 2px solid ${borderColor};
          border-radius: 8px;
          background-color: ${inputBgColor};
          color: ${textColor};
          transition: all 0.2s;
          outline: none;
        }

        .form-input:focus {
          border-color: ${primaryColor};
          box-shadow: 0 0 0 3px ${primaryColor}1a;
        }

        .form-input:disabled {
          background-color: ${inputDisabledBgColor};
          cursor: not-allowed;
        }

        .form-input.error {
          border-color: ${errorColor};
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 3px ${errorColor}1a;
        }

        /* Select (Dropdown) 스타일 */
        .form-select {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border: 2px solid ${borderColor};
          border-radius: 8px;
          background-color: ${inputBgColor};
          color: ${textColor};
          transition: all 0.2s;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23333' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 12px;
          padding-right: 40px;
        }

        .form-select:focus {
          border-color: ${primaryColor};
          box-shadow: 0 0 0 3px ${primaryColor}1a;
        }

        .form-select:disabled {
          background-color: ${inputDisabledBgColor};
          cursor: not-allowed;
        }

        .form-select.error {
          border-color: ${errorColor};
        }

        .form-select.error:focus {
          box-shadow: 0 0 0 3px ${errorColor}1a;
        }

        /* Datetime 필드 스타일 */
        .datetime-group .datetime-inputs {
          display: flex;
          gap: 12px;
        }

        .datetime-group .datetime-date {
          flex: 1.5;
        }

        .datetime-group .datetime-time {
          flex: 1;
        }

        @media (max-width: 768px) {
          .datetime-group .datetime-inputs {
            flex-direction: column;
            gap: 8px;
          }

          .datetime-group .datetime-date,
          .datetime-group .datetime-time {
            width: 100%;
            flex: none;
          }
        }

        .error-message {
          display: none;
          font-size: 13px;
          color: ${errorColor};
          margin-top: 6px;
        }

        .error-message.show {
          display: block;
        }

        .submit-button {
          width: 100%;
          padding: 14px 24px;
          font-size: 16px;
          font-weight: 600;
          color: ${buttonTextColor};
          background-color: ${primaryColor};
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 24px;
        }

        .submit-button:hover:not(:disabled) {
          background-color: ${buttonHoverColor};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${primaryColor}4d;
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          background-color: ${buttonDisabledColor};
          cursor: not-allowed;
          transform: none;
        }

        .submit-button.loading {
          position: relative;
          color: transparent;
        }

        .submit-button.loading::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          top: 50%;
          left: 50%;
          margin-left: -10px;
          margin-top: -10px;
          border: 3px solid ${buttonTextColor};
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-description {
          font-size: 14px;
          color: ${descriptionColor};
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .success-message {
          display: none;
          padding: 16px;
          background-color: ${successBgColor};
          color: ${successTextColor};
          border: 1px solid ${successBorderColor};
          border-radius: 8px;
          margin-top: 16px;
          text-align: center;
          font-weight: 500;
        }

        .success-message.show {
          display: block;
        }

        .error-alert {
          display: none;
          padding: 16px;
          background-color: ${errorAlertBgColor};
          color: ${errorAlertTextColor};
          border: 1px solid ${errorAlertBorderColor};
          border-radius: 8px;
          margin-top: 16px;
          text-align: center;
          font-weight: 500;
        }

        .error-alert.show {
          display: block;
        }

        /* 법적 동의 체크박스 */
        .legal-consent {
          margin: 24px 0;
          padding: 16px;
          background-color: ${this.getConfigValue('styles.legalBgColor', '#f9f9f9')};
          border: 1px solid ${borderColor};
          border-radius: 8px;
        }

        .checkbox-group {
          margin-bottom: 12px;
        }

        .checkbox-group:last-of-type {
          margin-bottom: 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          cursor: pointer;
          font-size: 14px;
          line-height: 1.5;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-right: 8px;
          margin-top: 2px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .checkbox-text {
          color: ${textColor};
        }

        .legal-link {
          color: ${primaryColor};
          text-decoration: underline;
          font-weight: 600;
        }

        .legal-link:hover {
          color: ${buttonHoverColor};
        }

        /* 법적 정보 팝업 모달 */
        .legal-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
        }

        .legal-modal.show {
          display: block;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: ${bgColor};
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid ${borderColor};
        }

        .modal-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: ${textColor};
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 28px;
          font-weight: 300;
          color: ${textColor};
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .modal-close:hover {
          background-color: ${this.getConfigValue('styles.modalCloseBgColor', '#f0f0f0')};
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          font-size: 14px;
          line-height: 1.8;
          color: ${textColor};
        }

        .modal-body p {
          margin: 0 0 12px 0;
        }

        .modal-body h4 {
          margin: 20px 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }

        /* 반응형 */
        @media (max-width: 768px) {
          .form-container {
            padding: 24px 20px;
          }

          .form-title {
            font-size: 20px;
          }

          .modal-content {
            width: 95%;
            max-height: 85vh;
          }

          .modal-header {
            padding: 16px 20px;
          }

          .modal-title {
            font-size: 18px;
          }

          .modal-body {
            padding: 20px;
          }

          .form-popup-wrapper {
            width: 95%;
            max-height: 95vh;
          }
        }
      </style>

      ${this.getFormHTML(formTitle, formDescription, nameConfig, phoneConfig, submitButtonText, successMessage, errorMessage, isPopup, isSection)}
    `;
  }

  /**
   * 폼 HTML 생성
   * displayMode에 따라 섹션 모드와/또는 팝업 모드로 렌더링
   *
   * @param {string} formTitle - 폼 제목
   * @param {string} formDescription - 폼 설명
   * @param {Object} nameConfig - 이름 필드 설정
   * @param {Object} phoneConfig - 전화번호 필드 설정
   * @param {string} submitButtonText - 제출 버튼 텍스트
   * @param {string} successMessage - 성공 메시지
   * @param {string} errorMessage - 오류 메시지
   * @param {boolean} isPopup - 팝업 모드 여부
   * @param {boolean} isSection - 섹션 모드 여부
   * @returns {string} HTML 문자열
   */
  getFormHTML(formTitle, formDescription, nameConfig, phoneConfig, submitButtonText, successMessage, errorMessage, isPopup, isSection) {
    let html = '';

    // 섹션 모드 렌더링
    if (isSection) {
      const sectionContent = this.getFormContent(formTitle, formDescription, nameConfig, phoneConfig, submitButtonText, successMessage, errorMessage, 'section');
      html += `
        <div class="form-section-container">
          <div class="form-container">
            ${sectionContent}
          </div>
        </div>
      `;
    }

    // 팝업 모드 렌더링
    if (isPopup) {
      const popupContent = this.getFormContent(formTitle, formDescription, nameConfig, phoneConfig, submitButtonText, successMessage, errorMessage, 'popup');
      html += `
        <div class="form-popup-overlay" id="form-popup-overlay">
          <div class="form-popup-wrapper">
            <button class="form-popup-close" id="form-popup-close" aria-label="닫기">✕</button>
            <div class="form-container popup-mode">
              ${popupContent}
            </div>
          </div>
        </div>
      `;
    }

    return html;
  }

  /**
   * 폼 내용 생성 (공통)
   * 섹션/팝업 모드에서 공통으로 사용되는 폼 내용
   *
   * @param {string} formTitle - 폼 제목
   * @param {string} formDescription - 폼 설명
   * @param {Object} nameConfig - 이름 필드 설정
   * @param {Object} phoneConfig - 전화번호 필드 설정
   * @param {string} submitButtonText - 제출 버튼 텍스트
   * @param {string} successMessage - 성공 메시지
   * @param {string} errorMessage - 오류 메시지
   * @param {string} idPrefix - ID prefix ('section' 또는 'popup')
   * @returns {string} HTML 문자열
   */
  getFormContent(formTitle, formDescription, nameConfig, phoneConfig, submitButtonText, successMessage, errorMessage, idPrefix = 'section') {
    // ID prefix 추가 (both 모드에서 섹션/팝업 구분용)
    const pfx = idPrefix ? `${idPrefix}-` : '';

    return `
      <h2 class="form-title">${formTitle}</h2>

      <p class="form-description">
        ${formDescription}
      </p>

      <form id="${pfx}lead-form">
        <!-- 이름 필드 -->
        <div class="form-group">
          <label for="${pfx}name" class="form-label${nameConfig.required ? ' required' : ''}">
            ${nameConfig.label}
          </label>
          <input
            type="text"
            id="${pfx}name"
            name="name"
            class="form-input"
            placeholder="${nameConfig.placeholder}"
            ${nameConfig.required ? 'required' : ''}
            autocomplete="name"
          />
          <div class="error-message" id="${pfx}name-error">
            ${nameConfig.label}을(를) 입력해주세요.
          </div>
        </div>

        <!-- 전화번호 필드 -->
        <div class="form-group">
          <label for="${pfx}phone" class="form-label${phoneConfig.required ? ' required' : ''}">
            ${phoneConfig.label}
          </label>
          <input
            type="tel"
            id="${pfx}phone"
            name="phone"
            class="form-input"
            placeholder="${phoneConfig.placeholder}"
            ${phoneConfig.required ? 'required' : ''}
            autocomplete="tel"
          />
          <div class="error-message" id="${pfx}phone-error">
            올바른 전화번호를 입력해주세요.
          </div>
        </div>

        <!-- 추가 선택 필드 (동적 구성) -->
        ${this.renderAdditionalFields(idPrefix)}

        <!-- 법적 동의 체크박스 -->
        <div class="form-group legal-consent">
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" id="${pfx}terms-agree" name="terms-agree" required />
              <span class="checkbox-text">
                <a href="#" class="legal-link" id="${pfx}terms-link">[필수] 이용약관</a>에 동의합니다.
              </span>
            </label>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" id="${pfx}privacy-agree" name="privacy-agree" required />
              <span class="checkbox-text">
                <a href="#" class="legal-link" id="${pfx}privacy-link">[필수] 개인정보처리방침</a>에 동의합니다.
              </span>
            </label>
          </div>
          <div class="error-message" id="${pfx}legal-error">
            필수 동의 항목을 모두 체크해주세요.
          </div>
        </div>

        <!-- 제출 버튼 -->
        <button type="submit" class="submit-button" id="${pfx}submit-button">
          ${submitButtonText}
        </button>

        <!-- 성공 메시지 -->
        <div class="success-message" id="${pfx}success-message">
          ${successMessage}
        </div>

        <!-- 오류 메시지 -->
        <div class="error-alert" id="${pfx}error-alert">
          ${errorMessage}
        </div>
      </form>

      <!-- 법적 정보 팝업 모달 -->
      <div class="legal-modal" id="${pfx}legal-modal">
        <div class="modal-overlay" id="${pfx}modal-overlay"></div>
        <div class="modal-content" id="${pfx}modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="${pfx}modal-title">이용약관</h3>
            <button class="modal-close" id="${pfx}modal-close" aria-label="닫기">✕</button>
          </div>
          <div class="modal-body" id="${pfx}modal-body">
            <!-- 내용이 동적으로 삽입됨 -->
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEvents() {
    // displayMode에 따라 연결할 prefix 결정
    const prefixes = [];
    if (this.displayMode === 'section') {
      prefixes.push('section');
    } else if (this.displayMode === 'popup') {
      prefixes.push('popup');
    } else if (this.displayMode === 'both') {
      prefixes.push('section', 'popup');
    }

    // 각 prefix에 대해 이벤트 연결
    prefixes.forEach(prefix => {
      this.attachEventsForPrefix(prefix);
    });

    // 팝업 닫기 버튼 클릭 이벤트 (팝업 모드)
    const popupClose = this.$('#form-popup-close');
    const popupOverlay = this.$('#form-popup-overlay');

    if (popupClose) {
      popupClose.addEventListener('click', () => {
        this.closePopup();
      });
    }

    if (popupOverlay) {
      popupOverlay.addEventListener('click', (e) => {
        // 오버레이를 직접 클릭한 경우에만 닫기 (wrapper 내부 클릭은 무시)
        if (e.target === popupOverlay) {
          this.closePopup();
        }
      });
    }

    this.debug('이벤트 리스너 연결 완료');
  }

  /**
   * 특정 prefix의 폼에 이벤트 리스너 연결
   * @param {string} prefix - 'section' 또는 'popup'
   */
  attachEventsForPrefix(prefix) {
    const pfx = prefix ? `${prefix}-` : '';

    const form = this.$(`#${pfx}lead-form`);
    if (!form) {
      console.error(`[FormComponent] ${prefix} 폼을 찾을 수 없습니다.`);
      return;
    }

    // 폼 제출 이벤트
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(prefix);
    });

    // 입력 필드 실시간 검증 (오류 메시지 제거)
    const nameInput = this.$(`#${pfx}name`);
    const phoneInput = this.$(`#${pfx}phone`);

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        this.clearFieldError(`${pfx}name`);
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        this.formatPhoneRealtime(e);
        this.clearFieldError(`${pfx}phone`);
      });
    }

    // 법적 동의 체크박스 변경 시 오류 메시지 제거
    const termsCheckbox = this.$(`#${pfx}terms-agree`);
    const privacyCheckbox = this.$(`#${pfx}privacy-agree`);

    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', () => {
        this.clearFieldError(`${pfx}legal`);
      });
    }

    if (privacyCheckbox) {
      privacyCheckbox.addEventListener('change', () => {
        this.clearFieldError(`${pfx}legal`);
      });
    }

    // 법적 정보 "보기" 링크 클릭 이벤트
    const termsLink = this.$(`#${pfx}terms-link`);
    const privacyLink = this.$(`#${pfx}privacy-link`);

    if (termsLink) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLegalModal('terms', prefix);
      });
    }

    if (privacyLink) {
      privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLegalModal('privacy', prefix);
      });
    }

    // 모달 닫기 버튼 클릭 이벤트
    const modalClose = this.$(`#${pfx}modal-close`);
    const modalOverlay = this.$(`#${pfx}modal-overlay`);

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        this.closeLegalModal(prefix);
      });
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', () => {
        this.closeLegalModal(prefix);
      });
    }

    // 추가 선택 필드 이벤트 리스너 연결
    const additionalFields = this.getConfigValue('fields.additional', []);
    if (additionalFields && additionalFields.length > 0) {
      additionalFields.forEach((field, index) => {
        const fieldId = `${pfx}additional-${field.name || index}`;

        if (field.type === 'text' || field.type === 'dropdown') {
          const input = this.$(`#${fieldId}`);
          if (input) {
            input.addEventListener('input', () => {
              this.clearFieldError(fieldId);
            });
          }
        } else if (field.type === 'datetime') {
          const dateInput = this.$(`#${fieldId}-date`);
          const timeInput = this.$(`#${fieldId}-time`);

          if (dateInput) {
            dateInput.addEventListener('input', () => {
              this.clearFieldError(fieldId);
            });
          }

          if (timeInput) {
            timeInput.addEventListener('input', () => {
              this.clearFieldError(fieldId);
            });
          }
        }
      });
    }

    this.debug(`${prefix} 폼 이벤트 리스너 연결 완료`);
  }

  /**
   * 전화번호 실시간 포맷팅 (입력 중)
   * 사용자가 전화번호를 입력할 때 자동으로 하이픈을 삽입합니다.
   * 숫자만 허용하고, 010-1234-5678 형식으로 포맷팅합니다.
   *
   * @param {Event} event - input 이벤트
   */
  formatPhoneRealtime(event) {
    const input = event.target;
    if (!input) return;

    // 현재 커서 위치 저장
    let cursorPosition = input.selectionStart;

    // 입력된 값에서 숫자만 추출
    const numbers = input.value.replace(/[^0-9]/g, '');

    // 이전 값의 길이 (하이픈 포함)
    const prevLength = input.value.length;

    // 숫자를 형식에 맞게 변환
    let formatted = '';

    if (numbers.length === 0) {
      formatted = '';
    } else if (numbers.length <= 3) {
      // 010
      formatted = numbers;
    } else if (numbers.length <= 7) {
      // 010-1234
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      // 010-1234-5678
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    } else {
      // 11자리 초과는 잘라냄
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }

    // 포맷팅된 값 설정
    input.value = formatted;

    // 커서 위치 조정
    // 하이픈이 추가되었으면 커서도 한 칸 이동
    const newLength = formatted.length;
    if (newLength > prevLength) {
      cursorPosition += (newLength - prevLength);
    }

    // 커서 위치 복원
    input.setSelectionRange(cursorPosition, cursorPosition);

    this.debug('전화번호 포맷팅:', formatted);
  }

  /**
   * 폼 제출 핸들러
   * @param {string} prefix - 'section' 또는 'popup'
   */
  async handleSubmit(prefix = 'section') {
    this.debug(`${prefix} 폼 제출 시작`);

    // 1. 검증
    if (!this.validateForm(prefix)) {
      this.debug(`${prefix} 폼 검증 실패`);
      return;
    }

    // 2. 폼 데이터 수집
    this.collectFormData(prefix);

    // 3. UI 상태 업데이트 (제출 중)
    this.setSubmitState('submitting', prefix);

    // 4. Cloudflare Worker에 데이터 전송
    this.debug('폼 데이터:', this.formData);

    try {
      const workerUrl = this.getConfigValue('airtable.workerUrl');

      if (!workerUrl) {
        throw new Error('Worker URL이 설정되지 않았습니다.');
      }

      // HTTPS 검증 (NFR-003: 데이터 전송 암호화)
      if (!workerUrl.startsWith('https://') && !workerUrl.startsWith('/')) {
        console.error('⚠️ HTTPS 보안 오류: Worker URL은 HTTPS를 사용해야 합니다.');
        console.error('현재 URL:', workerUrl);
        throw new Error('보안 오류: HTTPS 연결만 허용됩니다. Worker URL을 확인해주세요.');
      }

      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 성공
        this.debug('제출 성공:', result);

        // GTM/GA4 전환 이벤트 추적 (STORY-021)
        await trackFormSubmit(this.formData, this.config);

        this.setSubmitState('success', prefix);
        this.resetForm(prefix);
      } else {
        // 실패
        this.debug('제출 실패:', result);
        this.setSubmitState('error', prefix);
      }
    } catch (error) {
      // 네트워크 오류 등
      console.error('[FormComponent] 제출 오류:', error);
      this.debug('제출 오류:', error.message);
      this.setSubmitState('error', prefix);
    }
  }

  /**
   * 법적 정보 모달 열기
   *
   * @param {'terms'|'privacy'} type - 표시할 내용 타입
   * @param {string} prefix - 'section' 또는 'popup'
   */
  openLegalModal(type, prefix = 'section') {
    const pfx = prefix ? `${prefix}-` : '';
    const modal = this.$(`#${pfx}legal-modal`);
    const modalTitle = this.$(`#${pfx}modal-title`);
    const modalBody = this.$(`#${pfx}modal-body`);

    if (!modal || !modalTitle || !modalBody) {
      console.error('[FormComponent] 모달 요소를 찾을 수 없습니다.');
      return;
    }

    // 모달 제목과 내용 설정
    if (type === 'terms') {
      const termsTitle = this.getConfigValue('legal.termsTitle', '이용약관');
      const termsText = this.getConfigValue('legal.termsText', this.getDefaultTermsText());

      modalTitle.textContent = termsTitle;
      modalBody.innerHTML = this.formatLegalText(termsText);
    } else if (type === 'privacy') {
      const privacyTitle = this.getConfigValue('legal.privacyTitle', '개인정보처리방침');
      const privacyText = this.getConfigValue('legal.privacyText', this.getDefaultPrivacyText());

      modalTitle.textContent = privacyTitle;
      modalBody.innerHTML = this.formatLegalText(privacyText);
    }

    // 모달 표시
    modal.classList.add('show');

    this.debug(`법적 정보 모달 열기: ${type}`);
  }

  /**
   * 법적 정보 모달 닫기
   * @param {string} prefix - 'section' 또는 'popup'
   */
  closeLegalModal(prefix = 'section') {
    const pfx = prefix ? `${prefix}-` : '';
    const modal = this.$(`#${pfx}legal-modal`);

    if (modal) {
      modal.classList.remove('show');
      this.debug(`${prefix} 법적 정보 모달 닫기`);
    }
  }

  /**
   * 법적 정보 텍스트 포맷팅
   * 줄바꿈을 <p> 태그로 변환합니다.
   *
   * @param {string} text - 원본 텍스트
   * @returns {string} 포맷된 HTML
   */
  formatLegalText(text) {
    if (!text) {
      return '<p>내용이 없습니다.</p>';
    }

    // 줄바꿈을 기준으로 분리하고 빈 줄 제거
    const paragraphs = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // 각 줄을 <p> 태그로 감싸기
    return paragraphs
      .map(line => `<p>${line}</p>`)
      .join('');
  }

  /**
   * 기본 이용약관 텍스트
   * Config에 설정되지 않았을 경우 사용됩니다.
   *
   * @returns {string} 기본 이용약관 텍스트
   */
  getDefaultTermsText() {
    return `
제1조 (목적)
본 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
"서비스"란 회사가 제공하는 상담 신청 및 정보 제공 서비스를 의미합니다.
"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 고객을 의미합니다.

제3조 (약관의 효력)
본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.

제4조 (서비스의 제공)
회사는 이용자에게 상담 서비스를 제공하며, 서비스 내용은 회사의 사정에 따라 변경될 수 있습니다.

제5조 (개인정보의 보호)
회사는 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다.
    `.trim();
  }

  /**
   * 기본 개인정보처리방침 텍스트
   * Config에 설정되지 않았을 경우 사용됩니다.
   *
   * @returns {string} 기본 개인정보처리방침 텍스트
   */
  getDefaultPrivacyText() {
    return `
1. 개인정보의 수집 및 이용 목적
회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
- 상담 신청 및 서비스 제공
- 고객 문의 및 불만 처리

2. 수집하는 개인정보의 항목
회사는 상담 신청을 위해 아래와 같은 개인정보를 수집하고 있습니다.
- 필수항목: 이름, 전화번호
- 선택항목: 기타 입력 필드 (현장별 상이)

3. 개인정보의 보유 및 이용기간
회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 일정기간 동안 개인정보를 보관합니다.

4. 개인정보의 파기절차 및 방법
회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다.

5. 이용자의 권리
이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.
    `.trim();
  }

  /**
   * 추가 선택 필드 렌더링
   * Config의 fields.additional 배열을 읽어서 동적으로 필드 생성
   *
   * @param {string} idPrefix - ID prefix ('section' 또는 'popup')
   * @returns {string} 추가 필드 HTML
   */
  renderAdditionalFields(idPrefix) {
    // Config에서 추가 필드 배열 가져오기
    const additionalFields = this.getConfigValue('fields.additional', []);

    if (!additionalFields || additionalFields.length === 0) {
      this.debug('추가 선택 필드가 없습니다.');
      return '';
    }

    this.debug(`추가 선택 필드 ${additionalFields.length}개 렌더링`);

    // 각 필드를 타입에 따라 렌더링
    const fieldsHTML = additionalFields.map((field, index) => {
      switch (field.type) {
        case 'text':
          return this.renderTextField(field, idPrefix, index);
        case 'dropdown':
          return this.renderDropdownField(field, idPrefix, index);
        case 'datetime':
          return this.renderDatetimeField(field, idPrefix, index);
        default:
          console.warn(`[FormComponent] 지원하지 않는 필드 타입: ${field.type}`);
          return '';
      }
    }).join('\n');

    return fieldsHTML;
  }

  /**
   * 텍스트 필드 렌더링
   *
   * @param {Object} field - 필드 설정
   * @param {string} idPrefix - ID prefix
   * @param {number} index - 필드 인덱스
   * @returns {string} 텍스트 필드 HTML
   */
  renderTextField(field, idPrefix, index) {
    const pfx = idPrefix ? `${idPrefix}-` : '';
    const fieldId = `${pfx}additional-${field.name || index}`;
    const label = field.label || '입력';
    const placeholder = field.placeholder || '';
    const required = field.required || false;

    return `
      <div class="form-group">
        <label for="${fieldId}" class="form-label${required ? ' required' : ''}">
          ${label}
        </label>
        <input
          type="text"
          id="${fieldId}"
          name="${field.name}"
          class="form-input"
          placeholder="${placeholder}"
          ${required ? 'required' : ''}
          data-field-type="text"
          data-field-label="${label}"
        />
        <div class="error-message" id="${fieldId}-error">
          ${label}을(를) 입력해주세요.
        </div>
      </div>
    `;
  }

  /**
   * 드롭다운 필드 렌더링
   *
   * @param {Object} field - 필드 설정
   * @param {string} idPrefix - ID prefix
   * @param {number} index - 필드 인덱스
   * @returns {string} 드롭다운 필드 HTML
   */
  renderDropdownField(field, idPrefix, index) {
    const pfx = idPrefix ? `${idPrefix}-` : '';
    const fieldId = `${pfx}additional-${field.name || index}`;
    const label = field.label || '선택';
    const required = field.required || false;
    const options = field.options || [];

    // 옵션 HTML 생성
    const optionsHTML = options.map(option => {
      return `<option value="${option}">${option}</option>`;
    }).join('\n');

    return `
      <div class="form-group">
        <label for="${fieldId}" class="form-label${required ? ' required' : ''}">
          ${label}
        </label>
        <select
          id="${fieldId}"
          name="${field.name}"
          class="form-select"
          ${required ? 'required' : ''}
          data-field-type="dropdown"
          data-field-label="${label}"
        >
          <option value="">선택해주세요</option>
          ${optionsHTML}
        </select>
        <div class="error-message" id="${fieldId}-error">
          ${label}을(를) 선택해주세요.
        </div>
      </div>
    `;
  }

  /**
   * 날짜+시간 세트 필드 렌더링
   *
   * @param {Object} field - 필드 설정
   * @param {string} idPrefix - ID prefix
   * @param {number} index - 필드 인덱스
   * @returns {string} 날짜+시간 필드 HTML
   */
  renderDatetimeField(field, idPrefix, index) {
    const pfx = idPrefix ? `${idPrefix}-` : '';
    const fieldId = `${pfx}additional-${field.name || index}`;
    const label = field.label || '날짜 및 시간';
    const required = field.required || false;

    return `
      <div class="form-group datetime-group">
        <label class="form-label${required ? ' required' : ''}">
          ${label}
        </label>
        <div class="datetime-inputs">
          <input
            type="date"
            id="${fieldId}-date"
            name="${field.name}-date"
            class="form-input datetime-date"
            ${required ? 'required' : ''}
            data-field-type="datetime"
            data-field-label="${label}"
            data-datetime-part="date"
          />
          <input
            type="time"
            id="${fieldId}-time"
            name="${field.name}-time"
            class="form-input datetime-time"
            ${required ? 'required' : ''}
            data-field-type="datetime"
            data-field-label="${label}"
            data-datetime-part="time"
          />
        </div>
        <div class="error-message" id="${fieldId}-error">
          ${label}을(를) 입력해주세요.
        </div>
      </div>
    `;
  }

  /**
   * 폼 검증
   * 필수 필드가 모두 입력되었는지 확인합니다.
   *
   * @param {string} prefix - 'section' 또는 'popup'
   * @returns {boolean} 검증 통과 여부
   */
  validateForm(prefix = 'section') {
    let isValid = true;

    const pfx = prefix ? `${prefix}-` : '';
    const nameInput = this.$(`#${pfx}name`);
    const phoneInput = this.$(`#${pfx}phone`);
    const termsCheckbox = this.$(`#${pfx}terms-agree`);
    const privacyCheckbox = this.$(`#${pfx}privacy-agree`);

    const nameConfig = this.getConfigValue('fields.name', { required: true });
    const phoneConfig = this.getConfigValue('fields.phone', { required: true });

    // 이름 검증
    if (nameConfig.required && nameInput) {
      const nameValue = nameInput.value.trim();
      if (!nameValue) {
        this.showFieldError(`${pfx}name`, `${nameConfig.label || '이름'}을(를) 입력해주세요.`);
        isValid = false;
      }
    }

    // 전화번호 검증
    if (phoneConfig.required && phoneInput) {
      const phoneValue = phoneInput.value.trim();

      if (!phoneValue) {
        this.showFieldError(`${pfx}phone`, `${phoneConfig.label || '전화번호'}을(를) 입력해주세요.`);
        isValid = false;
      } else if (!this.validatePhoneFormat(phoneValue)) {
        this.showFieldError(`${pfx}phone`, '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
        isValid = false;
      }
    }

    // 법적 동의 체크박스 검증
    if (termsCheckbox && privacyCheckbox) {
      const termsChecked = termsCheckbox.checked;
      const privacyChecked = privacyCheckbox.checked;

      if (!termsChecked || !privacyChecked) {
        this.showFieldError(`${pfx}legal`, '필수 동의 항목을 모두 체크해주세요.');
        isValid = false;
      }
    }

    // 추가 선택 필드 검증
    const additionalFields = this.getConfigValue('fields.additional', []);
    if (additionalFields && additionalFields.length > 0) {
      additionalFields.forEach((field, index) => {
        // 필수 필드가 아니면 검증 스킵
        if (!field.required) {
          return;
        }

        const fieldId = `${pfx}additional-${field.name || index}`;

        if (field.type === 'text') {
          // 텍스트 필드 검증
          const input = this.$(`#${fieldId}`);
          if (input) {
            const value = input.value.trim();
            if (!value) {
              this.showFieldError(fieldId, `${field.label}을(를) 입력해주세요.`);
              isValid = false;
            }
          }
        } else if (field.type === 'dropdown') {
          // 드롭다운 검증
          const select = this.$(`#${fieldId}`);
          if (select) {
            const value = select.value;
            if (!value) {
              this.showFieldError(fieldId, `${field.label}을(를) 선택해주세요.`);
              isValid = false;
            }
          }
        } else if (field.type === 'datetime') {
          // 날짜+시간 검증
          const dateInput = this.$(`#${fieldId}-date`);
          const timeInput = this.$(`#${fieldId}-time`);

          if (dateInput && timeInput) {
            const dateValue = dateInput.value.trim();
            const timeValue = timeInput.value.trim();

            if (!dateValue || !timeValue) {
              this.showFieldError(fieldId, `${field.label}을(를) 입력해주세요.`);
              isValid = false;
            }
          }
        }
      });
    }

    return isValid;
  }

  /**
   * 전화번호 형식 검증
   * 올바른 한국 전화번호 형식인지 확인합니다.
   *
   * @param {string} phone - 전화번호
   * @returns {boolean} 유효 여부
   */
  validatePhoneFormat(phone) {
    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, '');

    // 핸드폰: 010으로 시작하는 11자리
    if (numbers.length === 11 && numbers.startsWith('010')) {
      return true;
    }

    // 지역번호: 02로 시작하는 9-10자리
    if (numbers.length >= 9 && numbers.length <= 10 && numbers.startsWith('02')) {
      return true;
    }

    // 지역번호: 031, 032 등으로 시작하는 10-11자리
    if (numbers.length >= 10 && numbers.length <= 11 && /^0(3[1-6]|4[1-4]|5[1-5]|6[1-4])/.test(numbers)) {
      return true;
    }

    // 1588, 1577 등 대표번호: 8자리
    if (numbers.length === 8 && /^15(77|88|99|44|66)/.test(numbers)) {
      return true;
    }

    return false;
  }

  /**
   * 필드 오류 표시
   *
   * @param {string} fieldName - 필드 이름
   * @param {string} errorMessage - 오류 메시지
   */
  showFieldError(fieldName, errorMessage) {
    const input = this.$(`#${fieldName}`);
    const errorElement = this.$(`#${fieldName}-error`);

    if (input) {
      input.classList.add('error');
    }

    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
    }
  }

  /**
   * 필드 오류 제거
   *
   * @param {string} fieldName - 필드 이름
   */
  clearFieldError(fieldName) {
    const input = this.$(`#${fieldName}`);
    const errorElement = this.$(`#${fieldName}-error`);

    if (input) {
      input.classList.remove('error');
    }

    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }

  /**
   * 폼 데이터 수집
   * @param {string} prefix - 'section' 또는 'popup'
   */
  collectFormData(prefix = 'section') {
    const pfx = prefix ? `${prefix}-` : '';
    const nameInput = this.$(`#${pfx}name`);
    const phoneInput = this.$(`#${pfx}phone`);

    // 전화번호 포맷팅 (하이픈 자동 삽입)
    let phoneValue = phoneInput ? phoneInput.value.trim() : '';
    phoneValue = this.formatPhoneNumber(phoneValue);

    // 기본 필드
    this.formData = {
      '이름': nameInput ? nameInput.value.trim() : '',
      '전화번호': phoneValue,
      // siteName은 config.meta.siteName에서 자동으로 가져옴
      'siteName': this.config?.meta?.siteName || '알 수 없음',
      // 유입 경로 (향후 UTM 파라미터에서 추출 가능)
      'leadSource': this.getLeadSource()
    };

    // 추가 선택 필드 수집 (Inquiry_Container에 JSON 형태로 저장)
    const additionalFields = this.getConfigValue('fields.additional', []);
    const inquiryContainer = {};

    if (additionalFields && additionalFields.length > 0) {
      additionalFields.forEach((field, index) => {
        const fieldId = `${pfx}additional-${field.name || index}`;
        const fieldName = field.label || field.name || `필드${index + 1}`;

        if (field.type === 'text') {
          // 텍스트 필드
          const input = this.$(`#${fieldId}`);
          if (input) {
            const value = input.value.trim();
            if (value) {
              inquiryContainer[fieldName] = value;
            }
          }
        } else if (field.type === 'dropdown') {
          // 드롭다운 필드
          const select = this.$(`#${fieldId}`);
          if (select) {
            const value = select.value;
            if (value) {
              inquiryContainer[fieldName] = value;
            }
          }
        } else if (field.type === 'datetime') {
          // 날짜+시간 필드 (세트로 결합)
          const dateInput = this.$(`#${fieldId}-date`);
          const timeInput = this.$(`#${fieldId}-time`);

          if (dateInput && timeInput) {
            const dateValue = dateInput.value.trim();
            const timeValue = timeInput.value.trim();

            if (dateValue || timeValue) {
              // "2026-01-15 14:30" 형식으로 결합
              const combinedValue = `${dateValue} ${timeValue}`.trim();
              inquiryContainer[fieldName] = combinedValue;
            }
          }
        }
      });
    }

    // Inquiry_Container가 비어있지 않으면 formData에 추가
    if (Object.keys(inquiryContainer).length > 0) {
      this.formData['Inquiry_Container'] = JSON.stringify(inquiryContainer);
      this.debug('Inquiry_Container:', inquiryContainer);
    }

    this.debug('수집된 폼 데이터:', this.formData);
  }

  /**
   * 전화번호 포맷팅 (하이픈 자동 삽입)
   * 01012345678 → 010-1234-5678
   *
   * @param {string} phone - 원본 전화번호
   * @returns {string} 포맷된 전화번호
   */
  formatPhoneNumber(phone) {
    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, '');

    // 010으로 시작하는 11자리 번호
    if (numbers.length === 11 && numbers.startsWith('010')) {
      return `${numbers.substr(0, 3)}-${numbers.substr(3, 4)}-${numbers.substr(7, 4)}`;
    }

    // 그 외의 경우 원본 반환
    return phone;
  }

  /**
   * 유입 경로 감지
   * UTM 파라미터 또는 Referrer를 기반으로 유입 경로를 감지합니다.
   *
   * @returns {string} 유입 경로
   */
  getLeadSource() {
    // URL 파라미터에서 UTM 소스 추출
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');

    if (utmSource) {
      return `${utmSource}${utmMedium ? `-${utmMedium}` : ''}${utmCampaign ? `-${utmCampaign}` : ''}`;
    }

    // Referrer 확인
    const referrer = document.referrer;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        const hostname = referrerUrl.hostname;

        if (hostname.includes('google')) return 'google';
        if (hostname.includes('naver')) return 'naver';
        if (hostname.includes('daum')) return 'daum';
        if (hostname.includes('facebook')) return 'facebook';
        if (hostname.includes('instagram')) return 'instagram';
        if (hostname.includes('youtube')) return 'youtube';

        return `referral-${hostname}`;
      } catch (e) {
        // URL 파싱 실패
      }
    }

    // 기본값
    return 'direct';
  }

  /**
   * 제출 상태 변경
   *
   * @param {'idle'|'submitting'|'success'|'error'} state - 새로운 상태
   * @param {string} prefix - 'section' 또는 'popup'
   */
  setSubmitState(state, prefix = 'section') {
    this.submitState = state;

    const pfx = prefix ? `${prefix}-` : '';
    const submitButton = this.$(`#${pfx}submit-button`);
    const successMessage = this.$(`#${pfx}success-message`);
    const errorAlert = this.$(`#${pfx}error-alert`);

    if (!submitButton) return;

    // 모든 상태 초기화
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
    successMessage?.classList.remove('show');
    errorAlert?.classList.remove('show');

    switch (state) {
      case 'submitting':
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        this.debug('상태: 제출 중...');
        break;

      case 'success':
        successMessage?.classList.add('show');
        this.debug('상태: 제출 성공');
        // 3초 후 성공 메시지 숨기기
        setTimeout(() => {
          successMessage?.classList.remove('show');
          this.submitState = 'idle';
        }, 3000);
        break;

      case 'error':
        errorAlert?.classList.add('show');
        this.debug('상태: 제출 실패');
        // 5초 후 오류 메시지 숨기기
        setTimeout(() => {
          errorAlert?.classList.remove('show');
          this.submitState = 'idle';
        }, 5000);
        break;

      case 'idle':
      default:
        this.debug('상태: 대기');
        break;
    }
  }

  /**
   * 폼 초기화
   * @param {string} prefix - 'section' 또는 'popup'
   */
  resetForm(prefix = 'section') {
    const pfx = prefix ? `${prefix}-` : '';
    const form = this.$(`#${pfx}lead-form`);
    if (form) {
      form.reset();
    }

    this.formData = {
      name: '',
      phone: ''
    };

    this.clearFieldError(`${pfx}name`);
    this.clearFieldError(`${pfx}phone`);

    this.debug(`${prefix} 폼 초기화 완료`);
  }

  /**
   * 팝업 열기
   * 팝업 모드일 때 입력폼을 모달로 표시합니다.
   *
   * @public
   */
  openPopup() {
    if (this.displayMode !== 'popup' && this.displayMode !== 'both') {
      console.warn('[FormComponent] 팝업 모드가 아닙니다. displayMode:', this.displayMode);
      return;
    }

    const popupOverlay = this.$('#form-popup-overlay');

    if (popupOverlay) {
      popupOverlay.classList.add('show');
      this.debug('팝업 열기');

      // body 스크롤 방지 (선택사항)
      // document.body.style.overflow = 'hidden';
    } else {
      console.error('[FormComponent] 팝업 오버레이를 찾을 수 없습니다.');
    }
  }

  /**
   * 팝업 닫기
   * 팝업 모달을 숨깁니다.
   *
   * @public
   */
  closePopup() {
    const popupOverlay = this.$('#form-popup-overlay');

    if (popupOverlay) {
      popupOverlay.classList.remove('show');
      this.debug('팝업 닫기');

      // body 스크롤 복원 (선택사항)
      // document.body.style.overflow = '';
    }
  }

  /**
   * Fallback HTML (오류 발생 시)
   *
   * @returns {string} Fallback HTML
   */
  renderFallback() {
    // Config에서 폴백 설정 가져오기
    const fallbackPhone = this.getConfigValue('fallback.phone',
      this.getConfigValue('contactPhone', '1588-0000')
    );
    const fallbackTitle = this.getConfigValue('fallback.title', '⚠️ 입력폼을 불러올 수 없습니다');
    const fallbackDescription = this.getConfigValue('fallback.description', '전화로 상담 신청해주세요');

    // 폴백 스타일 설정
    const fallbackBgColor = this.getConfigValue('fallback.styles.bgColor', '#fff3cd');
    const fallbackBorderColor = this.getConfigValue('fallback.styles.borderColor', '#ffc107');
    const fallbackTextColor = this.getConfigValue('fallback.styles.textColor', '#856404');
    const fallbackLinkColor = this.getConfigValue('fallback.styles.linkColor', '#007bff');

    // 전화번호를 tel: 링크 형식으로 변환 (하이픈 제거)
    const telLink = fallbackPhone.replace(/[^0-9]/g, '');

    return `
      <style>
        :host {
          display: block;
          padding: 20px;
          background-color: ${fallbackBgColor};
          border: 2px solid ${fallbackBorderColor};
          border-radius: 8px;
          color: ${fallbackTextColor};
        }
        .fallback-container {
          text-align: center;
        }
        .fallback-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .fallback-tel {
          font-size: 24px;
          font-weight: bold;
          color: ${fallbackLinkColor};
          margin: 15px 0;
        }
        .fallback-tel a {
          color: inherit;
          text-decoration: none;
        }
      </style>
      <div class="fallback-container">
        <div class="fallback-title">${fallbackTitle}</div>
        <p>${fallbackDescription}</p>
        <div class="fallback-tel">
          <a href="tel:${telLink}">☎ ${fallbackPhone}</a>
        </div>
        <p style="font-size: 12px; color: ${fallbackTextColor};">
          오류: ${this.error}
        </p>
      </div>
    `;
  }
}

// Custom Element 등록
customElements.define('zoad-form', FormComponent);

console.log('✅ FormComponent 등록 완료: <zoad-form>');

// 전역 API 제공: 외부에서 팝업을 열 수 있도록 함
// 퀵메뉴, 모바일 내비게이터 등에서 사용
if (typeof window !== 'undefined') {
  /**
   * 입력폼 팝업 열기 (전역 함수)
   * 퀵메뉴, 모바일 내비게이터, 헤더 버튼 등에서 호출 가능
   *
   * @example
   * // HTML에서 직접 호출
   * <button onclick="window.openZoadForm()">상담 신청</button>
   *
   * @example
   * // JavaScript에서 호출
   * window.openZoadForm();
   */
  window.openZoadForm = function() {
    const formComponent = document.querySelector('zoad-form');
    if (formComponent && typeof formComponent.openPopup === 'function') {
      formComponent.openPopup();
      console.log('[Global API] 입력폼 팝업 열기');
    } else {
      console.error('[Global API] <zoad-form> 컴포넌트를 찾을 수 없거나 openPopup 메서드가 없습니다.');
    }
  };

  /**
   * 입력폼 팝업 닫기 (전역 함수)
   * 팝업 외부에서 프로그래밍 방식으로 닫을 때 사용
   *
   * @example
   * window.closeZoadForm();
   */
  window.closeZoadForm = function() {
    const formComponent = document.querySelector('zoad-form');
    if (formComponent && typeof formComponent.closePopup === 'function') {
      formComponent.closePopup();
      console.log('[Global API] 입력폼 팝업 닫기');
    } else {
      console.error('[Global API] <zoad-form> 컴포넌트를 찾을 수 없거나 closePopup 메서드가 없습니다.');
    }
  };

  console.log('✅ 전역 API 등록 완료: window.openZoadForm(), window.closeZoadForm()');
}

export default FormComponent;
