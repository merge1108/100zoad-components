/**
 * Header Component - 100zoad Web Components
 *
 * PC 화면용 헤더 컴포넌트
 * - 로고 이미지 표시
 * - 최대 6개 메뉴 항목
 * - 스크롤 시 상단 고정 (position: fixed)
 * - Config로 색상, 폰트, 레이아웃 조정
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-01
 */

import { BaseComponent } from '../../core/base-component.js';

/**
 * Header 웹 컴포넌트
 * PC 화면에서 로고와 메뉴를 표시합니다.
 *
 * @extends BaseComponent
 */
class HeaderComponent extends BaseComponent {
  /**
   * 생성자
   */
  constructor() {
    super('header', {
      useShadowDOM: true,
      shadowMode: 'open'
    });

    /**
     * 스크롤 상태
     * @type {boolean}
     */
    this.isScrolled = false;
  }

  /**
   * 렌더링
   * 헤더 HTML을 생성합니다.
   *
   * @returns {string} HTML 문자열
   */
  render() {
    // Config에서 설정 가져오기
    const logo = this.getConfigValue('logo', {
      url: '',
      alt: '로고'
    });

    const pageType = this.getConfigValue('pageType', 'onepage');
    const menu = this.getConfigValue('menu', []);

    // 스타일 설정
    const bgColor = this.getConfigValue('styles.bgColor', '#ffffff');
    const textColor = this.getConfigValue('styles.textColor', '#333333');
    const hoverColor = this.getConfigValue('styles.hoverColor', '#007bff');
    const borderColor = this.getConfigValue('styles.borderColor', '#e5e5e5');

    // 로고 스타일
    const logoHeight = this.getConfigValue('styles.logoHeight', '40px');
    const logoWidth = this.getConfigValue('styles.logoWidth', 'auto');

    // 헤더 높이 및 패딩
    const headerHeight = this.getConfigValue('styles.headerHeight', '70px');
    const headerPadding = this.getConfigValue('styles.headerPadding', '0 20px');

    // 메뉴 스타일
    const menuFontSize = this.getConfigValue('styles.menuFontSize', '16px');
    const menuFontWeight = this.getConfigValue('styles.menuFontWeight', '500');
    const menuSpacing = this.getConfigValue('styles.menuSpacing', '30px');

    // 스크롤 시 그림자 효과
    const scrolledShadow = this.getConfigValue('styles.scrolledShadow', '0 2px 8px rgba(0, 0, 0, 0.1)');

    // 최대 6개 메뉴 항목만 표시
    const displayMenu = menu.slice(0, 6);

    return `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        /* 헤더 컨테이너 */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: ${headerHeight};
          background-color: ${bgColor};
          color: ${textColor};
          z-index: 1000;
          transition: box-shadow 0.3s ease;
          border-bottom: 1px solid ${borderColor};
        }

        .header.scrolled {
          box-shadow: ${scrolledShadow};
        }

        /* 헤더 내부 컨테이너 */
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          padding: ${headerPadding};
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* 로고 */
        .logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .logo img {
          height: ${logoHeight};
          width: ${logoWidth};
          object-fit: contain;
          cursor: pointer;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: ${textColor};
          cursor: pointer;
          text-decoration: none;
        }

        /* 메뉴 */
        .menu {
          display: flex;
          align-items: center;
          gap: ${menuSpacing};
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .menu-item {
          margin: 0;
          padding: 0;
        }

        .menu-link {
          color: ${textColor};
          text-decoration: none;
          font-size: ${menuFontSize};
          font-weight: ${menuFontWeight};
          transition: color 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
        }

        .menu-link:hover {
          color: ${hoverColor};
        }

        /* 스페이서 (헤더가 fixed일 때 컨텐츠가 가려지지 않도록) */
        .header-spacer {
          height: ${headerHeight};
        }

        /* PC 화면에서만 표시 (모바일은 햄버거 메뉴 사용) */
        @media (max-width: 768px) {
          .header {
            display: none;
          }
          .header-spacer {
            display: none;
          }
        }
      </style>

      <!-- 헤더 스페이서 (fixed 헤더로 인해 가려지는 컨텐츠 방지) -->
      <div class="header-spacer"></div>

      <!-- 헤더 -->
      <header class="header" id="header">
        <div class="header-inner">
          <!-- 로고 -->
          <div class="logo" id="logo">
            ${this.renderLogo(logo)}
          </div>

          <!-- 메뉴 -->
          <nav class="menu-nav" id="menu-nav">
            <ul class="menu" id="menu">
              ${this.renderMenuItems(displayMenu, pageType)}
            </ul>
          </nav>
        </div>
      </header>
    `;
  }

  /**
   * 로고 렌더링
   *
   * @param {Object} logo - 로고 설정
   * @returns {string} HTML 문자열
   */
  renderLogo(logo) {
    if (logo.url) {
      return `
        <img
          src="${logo.url}"
          alt="${logo.alt || '로고'}"
          class="logo-img"
          id="logo-img"
        />
      `;
    } else {
      // 로고 이미지가 없으면 텍스트 로고 표시
      const siteName = this.config?.meta?.siteName || '100zoad';
      return `
        <a href="#" class="logo-text" id="logo-text">
          ${siteName}
        </a>
      `;
    }
  }

  /**
   * 메뉴 항목 렌더링
   *
   * @param {Array} menu - 메뉴 항목 배열
   * @param {string} pageType - 페이지 타입 ('onepage' | 'multipage')
   * @returns {string} HTML 문자열
   */
  renderMenuItems(menu, pageType) {
    if (!menu || menu.length === 0) {
      return '<li class="menu-item">메뉴 없음</li>';
    }

    return menu.map((item, index) => {
      const text = item.text || `메뉴${index + 1}`;
      const target = item.target || '#';

      return `
        <li class="menu-item">
          <a
            href="${target}"
            class="menu-link"
            data-target="${target}"
            data-page-type="${pageType}"
          >
            ${text}
          </a>
        </li>
      `;
    }).join('');
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEvents() {
    // 스크롤 이벤트 (헤더 그림자 효과)
    window.addEventListener('scroll', this.handleScroll.bind(this));

    // 메뉴 클릭 이벤트
    const menuLinks = this.$$('.menu-link');
    menuLinks.forEach(link => {
      link.addEventListener('click', this.handleMenuClick.bind(this));
    });

    // 로고 클릭 이벤트 (페이지 최상단으로 스크롤)
    const logo = this.$('#logo');
    if (logo) {
      logo.addEventListener('click', this.handleLogoClick.bind(this));
    }

    this.debug('이벤트 리스너 연결 완료');
  }

  /**
   * 스크롤 이벤트 핸들러
   * 스크롤 위치에 따라 헤더 스타일 변경
   */
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = this.$('#header');

    if (!header) return;

    // 스크롤 위치가 50px 이상이면 scrolled 클래스 추가
    if (scrollTop > 50) {
      if (!this.isScrolled) {
        header.classList.add('scrolled');
        this.isScrolled = true;
        this.debug('헤더 scrolled 상태');
      }
    } else {
      if (this.isScrolled) {
        header.classList.remove('scrolled');
        this.isScrolled = false;
        this.debug('헤더 normal 상태');
      }
    }
  }

  /**
   * 메뉴 클릭 이벤트 핸들러
   * 원페이지 모드일 때 스크롤 이동, 멀티페이지 모드일 때 페이지 이동
   *
   * @param {Event} event - 클릭 이벤트
   */
  handleMenuClick(event) {
    const link = event.currentTarget;
    const target = link.getAttribute('data-target');
    const pageType = link.getAttribute('data-page-type');

    this.debug(`메뉴 클릭: ${link.textContent.trim()}, target: ${target}, pageType: ${pageType}`);

    // 원페이지 모드: 섹션으로 스크롤 이동
    if (pageType === 'onepage' && target && target.startsWith('#')) {
      event.preventDefault();

      // 섹션 ID 추출 (#section-id)
      const sectionId = target.substring(1); // '#' 제거

      // Shadow DOM 밖의 요소를 찾기 위해 document 사용
      const section = document.getElementById(sectionId) || document.querySelector(target);

      if (section) {
        this.scrollToSection(section);
      } else {
        console.warn(`[HeaderComponent] 섹션을 찾을 수 없습니다: ${target}`);
      }
    }
    // 멀티페이지 모드: 기본 링크 동작 (페이지 이동)
    else {
      // 브라우저 기본 동작 (페이지 이동)
      this.debug(`멀티페이지 모드: ${target}로 이동`);
    }
  }

  /**
   * 섹션으로 부드럽게 스크롤 이동
   *
   * @param {HTMLElement} section - 이동할 섹션 요소
   */
  scrollToSection(section) {
    if (!section) return;

    // 헤더 높이만큼 오프셋 적용 (헤더가 섹션을 가리지 않도록)
    const headerHeight = this.$('#header')?.offsetHeight || 70;
    const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    this.debug(`섹션으로 스크롤: ${section.id || section.className}`);
  }

  /**
   * 로고 클릭 이벤트 핸들러
   * 페이지 최상단으로 스크롤
   *
   * @param {Event} event - 클릭 이벤트
   */
  handleLogoClick(event) {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.debug('로고 클릭: 페이지 최상단으로 스크롤');
  }

  /**
   * 컴포넌트 연결 해제 시
   * 이벤트 리스너 정리
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    // 스크롤 이벤트 리스너 제거
    window.removeEventListener('scroll', this.handleScroll.bind(this));

    this.debug('컴포넌트 연결 해제 및 이벤트 리스너 정리');
  }

  /**
   * Fallback HTML (오류 발생 시)
   *
   * @returns {string} Fallback HTML
   */
  renderFallback() {
    // Config에서 폴백 설정 가져오기
    const fallbackLogo = this.getConfigValue('fallback.logo',
      this.getConfigValue('logo.url', '')
    );
    const fallbackPhone = this.getConfigValue('fallback.phone',
      this.getConfigValue('contactPhone', '1588-0000')
    );

    const siteName = this.config?.meta?.siteName || '100zoad';

    // 전화번호를 tel: 링크 형식으로 변환 (하이픈 제거)
    const telLink = fallbackPhone.replace(/[^0-9]/g, '');

    return `
      <style>
        :host {
          display: block;
        }
        .fallback-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: #fff3cd;
          border-bottom: 2px solid #ffc107;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }
        .fallback-logo {
          font-size: 18px;
          font-weight: bold;
          color: #856404;
        }
        .fallback-logo img {
          height: 40px;
          width: auto;
        }
        .fallback-contact {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fallback-phone {
          font-size: 16px;
          font-weight: bold;
          color: #007bff;
          text-decoration: none;
        }
        .fallback-spacer {
          height: 60px;
        }
        @media (max-width: 768px) {
          .fallback-header {
            display: none;
          }
          .fallback-spacer {
            display: none;
          }
        }
      </style>
      <div class="fallback-spacer"></div>
      <div class="fallback-header">
        <div class="fallback-logo">
          ${fallbackLogo ? `<img src="${fallbackLogo}" alt="${siteName}" />` : siteName}
        </div>
        <div class="fallback-contact">
          <a href="tel:${telLink}" class="fallback-phone">☎ ${fallbackPhone}</a>
        </div>
      </div>
    `;
  }
}

// Custom Element 등록
customElements.define('zoad-header', HeaderComponent);

console.log('✅ HeaderComponent 등록 완료: <zoad-header>');

export default HeaderComponent;
