/**
 * Footer Component - 100zoad Web Components
 *
 * 푸터 컴포넌트
 * - 2단 레이아웃: 현장정보 + 대행사정보
 * - PC: 2단 가로 레이아웃 / 모바일: 세로 스택
 * - Config로 색상, 폰트, 레이아웃 조정
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-01
 */

import { BaseComponent } from '../../core/base-component.js';

/**
 * Footer 웹 컴포넌트
 * 현장 정보와 대행사 정보를 2단 레이아웃으로 표시합니다.
 *
 * @extends BaseComponent
 */
class FooterComponent extends BaseComponent {
  /**
   * 생성자
   */
  constructor() {
    super('footer', {
      useShadowDOM: true,
      shadowMode: 'open'
    });
  }

  /**
   * 렌더링
   * 푸터 HTML을 생성합니다.
   *
   * @returns {string} HTML 문자열
   */
  render() {
    // Config에서 설정 가져오기

    // 1단: 현장정보
    const line1 = this.getConfigValue('line1', {});
    const siteName = line1.siteName || this.config?.meta?.siteName || '현장명';
    const sitePhone = line1.phone || '010-0000-0000';

    // 2단: 대행사정보
    const line2 = this.getConfigValue('line2', {});
    const company = line2.company || '대행사명';
    const ceo = line2.ceo || '대표자';
    const companyPhone = line2.phone || '02-0000-0000';
    const businessNumber = line2.businessNumber || '000-00-00000';

    // 법적 정보 링크
    const legal = this.getConfigValue('legal', {});
    const termsUrl = legal.termsUrl || '';
    const privacyUrl = legal.privacyUrl || '';
    const openIn = legal.openIn || 'newTab'; // "popup" | "newTab"
    const showLegalLinks = termsUrl || privacyUrl;

    // 스타일 설정
    const bgColor = this.getConfigValue('styles.bgColor', '#f8f9fa');
    const textColor = this.getConfigValue('styles.textColor', '#666666');
    const borderColor = this.getConfigValue('styles.borderColor', '#e5e5e5');
    const linkColor = this.getConfigValue('styles.linkColor', '#007bff');

    // 푸터 패딩
    const footerPadding = this.getConfigValue('styles.footerPadding', '40px 20px');

    // 텍스트 스타일
    const fontSize = this.getConfigValue('styles.fontSize', '14px');
    const lineHeight = this.getConfigValue('styles.lineHeight', '1.6');

    // 전화번호를 tel: 링크 형식으로 변환 (하이픈 제거)
    const siteTelLink = sitePhone.replace(/[^0-9]/g, '');
    const companyTelLink = companyPhone.replace(/[^0-9]/g, '');

    return `
      <style>
        :host {
          display: block;
          font-family: 'Paperlogy', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        /* 푸터 컨테이너 */
        .footer {
          background-color: ${bgColor};
          color: ${textColor};
          border-top: 1px solid ${borderColor};
          padding: ${footerPadding};
        }

        /* 푸터 내부 컨테이너 */
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* 푸터 2단 레이아웃 */
        .footer-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* 각 라인 */
        .footer-line {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* 라인 제목 */
        .line-title {
          font-size: ${fontSize};
          font-weight: 600;
          color: ${textColor};
          margin-bottom: 4px;
        }

        /* 라인 내용 */
        .line-content {
          font-size: ${fontSize};
          line-height: ${lineHeight};
          color: ${textColor};
        }

        /* 전화번호 링크 */
        .phone-link {
          color: ${linkColor};
          text-decoration: none;
          font-weight: 500;
        }

        .phone-link:hover {
          text-decoration: underline;
        }

        /* 정보 항목 */
        .info-item {
          display: inline;
        }

        .info-item:not(:last-child)::after {
          content: ' | ';
          margin: 0 8px;
          color: ${borderColor};
        }

        /* PC 화면: 2단 가로 레이아웃 */
        @media (min-width: 769px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }

          .footer-line {
            flex: 1;
          }

          .footer-line:first-child {
            padding-right: 40px;
            border-right: 1px solid ${borderColor};
          }

          .footer-line:last-child {
            padding-left: 40px;
          }
        }

        /* 모바일 화면: 세로 스택 */
        @media (max-width: 768px) {
          .footer {
            padding: 30px 16px 120px 16px; /* 하단 120px: 모바일 내비게이터 가림 방지 */
          }

          .footer-content {
            gap: 20px;
          }

          .footer-line {
            padding-bottom: 20px;
            border-bottom: 1px solid ${borderColor};
          }

          .footer-line:last-child {
            padding-bottom: 0;
            border-bottom: none;
          }

          .line-content {
            font-size: 13px;
          }

          /* 모바일에서는 항목 구분자를 줄바꿈으로 변경 */
          .info-item {
            display: block;
          }

          .info-item:not(:last-child)::after {
            content: '';
            margin: 0;
          }

          .legal-links {
            margin-top: 16px;
            padding-top: 16px;
          }

          .legal-links a {
            font-size: 13px;
          }
        }

        /* 법적 정보 링크 섹션 */
        .legal-links {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid ${borderColor};
          text-align: center;
        }

        .legal-links a {
          color: ${linkColor};
          text-decoration: none;
          font-size: ${fontSize};
          font-weight: 500;
        }

        .legal-links a:hover {
          text-decoration: underline;
        }

        .legal-links a:not(:last-child)::after {
          content: ' | ';
          margin: 0 12px;
          color: ${textColor};
          font-weight: normal;
        }
      </style>

      <!-- 푸터 -->
      <footer class="footer" id="footer">
        <div class="footer-inner">
          <div class="footer-content">
            <!-- 1단: 현장정보 -->
            <div class="footer-line" id="line1">
              <div class="line-title">현장 정보</div>
              <div class="line-content">
                <div class="info-item"><strong>${siteName}</strong></div>
                <div class="info-item">
                  상담: <a href="tel:${siteTelLink}" class="phone-link">${sitePhone}</a>
                </div>
              </div>
            </div>

            <!-- 2단: 대행사정보 -->
            <div class="footer-line" id="line2">
              <div class="line-title">광고 대행사 정보</div>
              <div class="line-content">
                <div class="info-item">${company}</div>
                <div class="info-item">대표: ${ceo}</div>
                <div class="info-item">
                  연락처: <a href="tel:${companyTelLink}" class="phone-link">${companyPhone}</a>
                </div>
                <div class="info-item">사업자번호: ${businessNumber}</div>
              </div>
            </div>
          </div>

          <!-- 법적 정보 링크 -->
          ${showLegalLinks ? `
          <div class="legal-links" id="legal-links">
            ${termsUrl ? `<a href="${termsUrl}" class="legal-link" data-type="terms" data-open-in="${openIn}"${openIn === 'newTab' ? ' target="_blank" rel="noopener noreferrer"' : ''}>이용약관</a>` : ''}
            ${privacyUrl ? `<a href="${privacyUrl}" class="legal-link" data-type="privacy" data-open-in="${openIn}"${openIn === 'newTab' ? ' target="_blank" rel="noopener noreferrer"' : ''}>개인정보처리방침</a>` : ''}
          </div>
          ` : ''}
        </div>
      </footer>
    `;
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEvents() {
    this.debug('푸터 이벤트 리스너 연결 중...');

    // 전화번호 링크 클릭 이벤트 (GTM 추적용, 향후 구현)
    const phoneLinks = this.$$('.phone-link');
    phoneLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        const phone = link.textContent.trim();
        this.debug(`전화번호 클릭: ${phone}`);

        // TODO: STORY-021에서 GTM 이벤트 추적 추가
        // this.trackPhoneClick(phone);
      });
    });

    // 법적 정보 링크 클릭 이벤트
    const legalLinks = this.$$('.legal-link');
    legalLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        const openIn = link.getAttribute('data-open-in');
        const linkType = link.getAttribute('data-type');
        const url = link.getAttribute('href');

        this.debug(`법적 링크 클릭: ${linkType}, openIn: ${openIn}, url: ${url}`);

        // popup 모드인 경우 기본 동작 방지하고 팝업 열기
        if (openIn === 'popup') {
          event.preventDefault();
          this.openPopup(url, linkType);
        }
        // newTab 모드는 기본 동작(새 창)을 허용
        // 하지만 target="_blank"가 없으므로 추가 필요

        // TODO: STORY-021에서 GTM 이벤트 추적 추가
        // this.trackLegalLinkClick(linkType);
      });
    });
  }

  /**
   * 팝업 창 열기
   *
   * @param {string} url - 팝업에서 열 URL
   * @param {string} type - 링크 타입 ('terms' | 'privacy')
   */
  openPopup(url, type) {
    const windowName = type === 'terms' ? 'TermsPopup' : 'PrivacyPopup';
    const windowFeatures = 'width=800,height=600,scrollbars=yes,resizable=yes';

    try {
      const popup = window.open(url, windowName, windowFeatures);

      if (popup) {
        popup.focus();
        this.debug(`팝업 열기 성공: ${type}`);
      } else {
        // 팝업 차단된 경우 새 탭으로 폴백
        this.debug(`팝업 차단됨. 새 탭으로 폴백: ${type}`);
        window.open(url, '_blank');
      }
    } catch (error) {
      this.debug(`팝업 열기 오류: ${error.message}. 새 탭으로 폴백`);
      window.open(url, '_blank');
    }
  }

  /**
   * Fallback HTML (오류 발생 시)
   *
   * @returns {string} Fallback HTML
   */
  renderFallback() {
    const siteName = this.config?.meta?.siteName || '100zoad';
    const sitePhone = this.getConfigValue('line1.phone', '1588-0000');
    const telLink = sitePhone.replace(/[^0-9]/g, '');

    return `
      <style>
        :host {
          display: block;
        }
        .fallback-footer {
          background-color: #fff3cd;
          border-top: 2px solid #ffc107;
          padding: 20px;
          text-align: center;
          color: #856404;
          font-size: 14px;
        }
        .fallback-footer a {
          color: #007bff;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
      <div class="fallback-footer">
        <div><strong>${siteName}</strong></div>
        <div>상담 문의: <a href="tel:${telLink}">${sitePhone}</a></div>
      </div>
    `;
  }
}

// Custom Element 등록
customElements.define('zoad-footer', FooterComponent);

console.log('✅ FooterComponent 등록 완료: <zoad-footer>');

export default FooterComponent;
