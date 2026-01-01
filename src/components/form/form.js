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

    // 스타일 설정
    const bgColor = this.getConfigValue('styles.bgColor', '#ffffff');
    const textColor = this.getConfigValue('styles.textColor', '#333333');
    const primaryColor = this.getConfigValue('styles.primaryColor', '#007bff');
    const borderColor = this.getConfigValue('styles.borderColor', '#dddddd');
    const errorColor = this.getConfigValue('styles.errorColor', '#dc3545');

    return `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        }

        * {
          box-sizing: border-box;
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
          background-color: #ffffff;
          color: ${textColor};
          transition: all 0.2s;
          outline: none;
        }

        .form-input:focus {
          border-color: ${primaryColor};
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .form-input.error {
          border-color: ${errorColor};
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
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
          color: #ffffff;
          background-color: ${primaryColor};
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 24px;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          background-color: #cccccc;
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
          border: 3px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-description {
          font-size: 14px;
          color: #666666;
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .success-message {
          display: none;
          padding: 16px;
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
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
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          margin-top: 16px;
          text-align: center;
          font-weight: 500;
        }

        .error-alert.show {
          display: block;
        }

        /* 반응형 */
        @media (max-width: 768px) {
          .form-container {
            padding: 24px 20px;
          }

          .form-title {
            font-size: 20px;
          }
        }
      </style>

      <div class="form-container">
        <h2 class="form-title">관심고객 등록</h2>

        <p class="form-description">
          간단한 정보를 입력해주시면 상담 전화를 드리겠습니다.
        </p>

        <form id="lead-form">
          <!-- 이름 필드 -->
          <div class="form-group">
            <label for="name" class="form-label${nameConfig.required ? ' required' : ''}">
              ${nameConfig.label}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-input"
              placeholder="${nameConfig.placeholder}"
              ${nameConfig.required ? 'required' : ''}
              autocomplete="name"
            />
            <div class="error-message" id="name-error">
              ${nameConfig.label}을(를) 입력해주세요.
            </div>
          </div>

          <!-- 전화번호 필드 -->
          <div class="form-group">
            <label for="phone" class="form-label${phoneConfig.required ? ' required' : ''}">
              ${phoneConfig.label}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              class="form-input"
              placeholder="${phoneConfig.placeholder}"
              ${phoneConfig.required ? 'required' : ''}
              autocomplete="tel"
            />
            <div class="error-message" id="phone-error">
              올바른 전화번호를 입력해주세요.
            </div>
          </div>

          <!-- 제출 버튼 -->
          <button type="submit" class="submit-button" id="submit-button">
            신청하기
          </button>

          <!-- 성공 메시지 -->
          <div class="success-message" id="success-message">
            ✓ 신청이 완료되었습니다!
          </div>

          <!-- 오류 메시지 -->
          <div class="error-alert" id="error-alert">
            제출 중 오류가 발생했습니다. 다시 시도해주세요.
          </div>
        </form>
      </div>
    `;
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEvents() {
    const form = this.$('#lead-form');
    if (!form) {
      console.error('[FormComponent] 폼을 찾을 수 없습니다.');
      return;
    }

    // 폼 제출 이벤트
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // 입력 필드 실시간 검증 (오류 메시지 제거)
    const nameInput = this.$('#name');
    const phoneInput = this.$('#phone');

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        this.clearFieldError('name');
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        this.formatPhoneRealtime(e);
        this.clearFieldError('phone');
      });
    }

    this.debug('이벤트 리스너 연결 완료');
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
   */
  async handleSubmit() {
    this.debug('폼 제출 시작');

    // 1. 검증
    if (!this.validateForm()) {
      this.debug('폼 검증 실패');
      return;
    }

    // 2. 폼 데이터 수집
    this.collectFormData();

    // 3. UI 상태 업데이트 (제출 중)
    this.setSubmitState('submitting');

    // 4. Cloudflare Worker에 데이터 전송
    this.debug('폼 데이터:', this.formData);

    try {
      const workerUrl = this.getConfigValue('airtable.workerUrl');

      if (!workerUrl) {
        throw new Error('Worker URL이 설정되지 않았습니다.');
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
        this.setSubmitState('success');
        this.resetForm();
      } else {
        // 실패
        this.debug('제출 실패:', result);
        this.setSubmitState('error');
      }
    } catch (error) {
      // 네트워크 오류 등
      console.error('[FormComponent] 제출 오류:', error);
      this.debug('제출 오류:', error.message);
      this.setSubmitState('error');
    }
  }

  /**
   * 폼 검증
   * 필수 필드가 모두 입력되었는지 확인합니다.
   *
   * @returns {boolean} 검증 통과 여부
   */
  validateForm() {
    let isValid = true;

    const nameInput = this.$('#name');
    const phoneInput = this.$('#phone');

    const nameConfig = this.getConfigValue('fields.name', { required: true });
    const phoneConfig = this.getConfigValue('fields.phone', { required: true });

    // 이름 검증
    if (nameConfig.required && nameInput) {
      const nameValue = nameInput.value.trim();
      if (!nameValue) {
        this.showFieldError('name', `${nameConfig.label || '이름'}을(를) 입력해주세요.`);
        isValid = false;
      }
    }

    // 전화번호 검증
    if (phoneConfig.required && phoneInput) {
      const phoneValue = phoneInput.value.trim();

      if (!phoneValue) {
        this.showFieldError('phone', `${phoneConfig.label || '전화번호'}을(를) 입력해주세요.`);
        isValid = false;
      } else if (!this.validatePhoneFormat(phoneValue)) {
        this.showFieldError('phone', '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
        isValid = false;
      }
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
   */
  collectFormData() {
    const nameInput = this.$('#name');
    const phoneInput = this.$('#phone');

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
   */
  setSubmitState(state) {
    this.submitState = state;

    const submitButton = this.$('#submit-button');
    const successMessage = this.$('#success-message');
    const errorAlert = this.$('#error-alert');

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
   */
  resetForm() {
    const form = this.$('#lead-form');
    if (form) {
      form.reset();
    }

    this.formData = {
      name: '',
      phone: ''
    };

    this.clearFieldError('name');
    this.clearFieldError('phone');

    this.debug('폼 초기화 완료');
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
          color: #007bff;
          margin: 15px 0;
        }
        .fallback-tel a {
          color: inherit;
          text-decoration: none;
        }
      </style>
      <div class="fallback-container">
        <div class="fallback-title">⚠️ 입력폼을 불러올 수 없습니다</div>
        <p>전화로 상담 신청해주세요</p>
        <div class="fallback-tel">
          <a href="tel:1588-0000">☎ 1588-0000</a>
        </div>
        <p style="font-size: 12px; color: #666;">
          오류: ${this.error}
        </p>
      </div>
    `;
  }
}

// Custom Element 등록
customElements.define('zoad-form', FormComponent);

console.log('✅ FormComponent 등록 완료: <zoad-form>');

export default FormComponent;
