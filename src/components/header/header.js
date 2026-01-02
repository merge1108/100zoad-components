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
import { trackMenuClick } from '../../utils/analytics.js';

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

    /**
     * 모바일 메뉴 열림 상태
     * @type {boolean}
     */
    this.isMobileMenuOpen = false;
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

    // 특수 메뉴 설정 (STORY-005)
    const specialMenu = this.getConfigValue('specialMenu', null);

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
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          height: ${headerHeight} !important;
          background-color: ${bgColor} !important;
          color: ${textColor} !important;
          z-index: 9999 !important;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
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
          height: 100% !important;
          padding: ${headerPadding};
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* 로고 */
        .logo {
          display: flex !important;
          align-items: center !important;
          flex-shrink: 0;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .logo img {
          height: ${logoHeight} !important;
          width: ${logoWidth} !important;
          object-fit: contain;
          cursor: pointer;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
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
          display: flex !important;
          align-items: center !important;
          gap: ${menuSpacing};
          list-style: none;
          margin: 0;
          padding: 0;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .menu-item {
          margin: 0;
          padding: 0;
          display: list-item !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .menu-link {
          color: ${textColor} !important;
          text-decoration: none;
          font-size: ${menuFontSize};
          font-weight: ${menuFontWeight};
          transition: color 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
          display: inline-block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .menu-link:hover {
          color: ${hoverColor};
        }

        /* PC 메뉴 네비게이션 */
        .menu-nav {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* 특수 메뉴 (STORY-005) */
        .menu-link.special-menu {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: #ffffff !important;
          padding: 10px 20px !important;
          border-radius: 25px !important;
          font-weight: 600 !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: inline-block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .menu-link.special-menu:hover {
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        /* 애니메이션: pulse */
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .special-menu.animation-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        /* 애니메이션: glow */
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(118, 75, 162, 0.6);
          }
        }

        .special-menu.animation-glow {
          animation: glow 2s ease-in-out infinite;
        }

        /* 애니메이션: shake */
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .special-menu.animation-shake {
          animation: shake 3s ease-in-out infinite;
        }

        /* 스페이서 (헤더가 fixed일 때 컨텐츠가 가려지지 않도록) */
        .header-spacer {
          height: ${headerHeight};
        }

        /* 햄버거 메뉴 버튼 (모바일 전용) */
        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 30px;
          height: 24px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 10;
        }

        .hamburger-btn span {
          width: 100%;
          height: 3px;
          background-color: ${textColor};
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        /* 햄버거 활성화 시 X자 애니메이션 */
        .hamburger-btn.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .hamburger-btn.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-btn.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        /* 모바일 사이드 메뉴 */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 80%;
          max-width: 320px;
          height: 100vh;
          background-color: ${bgColor};
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 1001;
          transition: right 0.3s ease;
          overflow-y: auto;
        }

        .mobile-menu.open {
          right: 0;
        }

        /* 모바일 메뉴 헤더 */
        .mobile-menu-header {
          padding: 20px;
          border-bottom: 1px solid ${borderColor};
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-menu-logo {
          display: flex;
          align-items: center;
        }

        .mobile-menu-logo img {
          height: 35px;
          width: auto;
          object-fit: contain;
        }

        .mobile-menu-logo-text {
          font-size: 18px;
          font-weight: 700;
          color: ${textColor};
        }

        /* 닫기 버튼 */
        .mobile-menu-close {
          background: transparent;
          border: none;
          font-size: 28px;
          color: ${textColor};
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 모바일 메뉴 리스트 */
        .mobile-menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mobile-menu-item {
          border-bottom: 1px solid ${borderColor};
        }

        .mobile-menu-link {
          display: block;
          padding: 18px 20px;
          color: ${textColor};
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .mobile-menu-link:active {
          background-color: rgba(0, 123, 255, 0.05);
        }

        /* 모바일 특수 메뉴 */
        .mobile-menu-link.special-menu {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff !important;
          font-weight: 600;
          margin: 10px;
          border-radius: 8px;
          text-align: center;
        }

        /* 오버레이 (배경 어둡게) */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .mobile-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* 모바일 반응형 */
        @media (max-width: 768px) {
          /* PC 메뉴 숨김 */
          .menu-nav {
            display: none;
          }

          /* 햄버거 버튼 표시 */
          .hamburger-btn {
            display: flex;
          }

          /* 헤더 높이 조정 */
          .header {
            height: 60px;
          }

          .header-spacer {
            height: 60px;
          }

          .header-inner {
            padding: 0 16px;
          }

          .logo img {
            height: 32px;
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

          <!-- PC 메뉴 -->
          <nav class="menu-nav" id="menu-nav">
            <ul class="menu" id="menu">
              ${this.renderMenuItems(displayMenu, pageType)}
              ${specialMenu ? this.renderSpecialMenu(specialMenu, pageType) : ''}
            </ul>
          </nav>

          <!-- 모바일 햄버거 버튼 -->
          <button class="hamburger-btn" id="hamburger-btn" aria-label="메뉴 열기">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <!-- 모바일 오버레이 -->
      <div class="mobile-overlay" id="mobile-overlay"></div>

      <!-- 모바일 사이드 메뉴 -->
      <div class="mobile-menu" id="mobile-menu">
        <!-- 모바일 메뉴 헤더 -->
        <div class="mobile-menu-header">
          <div class="mobile-menu-logo">
            ${this.renderMobileLogo(logo)}
          </div>
          <button class="mobile-menu-close" id="mobile-menu-close" aria-label="메뉴 닫기">
            ×
          </button>
        </div>

        <!-- 모바일 메뉴 리스트 -->
        <ul class="mobile-menu-list" id="mobile-menu-list">
          ${this.renderMobileMenuItems(displayMenu, pageType)}
          ${specialMenu ? this.renderMobileSpecialMenu(specialMenu, pageType) : ''}
        </ul>
      </div>
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
   * 특수 메뉴 렌더링 (STORY-005)
   * 맨 오른쪽에 표시되는 "관심고객등록" 메뉴
   *
   * @param {Object} specialMenu - 특수 메뉴 설정
   * @param {string} pageType - 페이지 타입
   * @returns {string} HTML 문자열
   */
  renderSpecialMenu(specialMenu, pageType) {
    if (!specialMenu || !specialMenu.text) {
      return '';
    }

    const text = specialMenu.text || '관심고객등록';
    const target = specialMenu.target || '#form-section';
    const animation = specialMenu.animation || 'pulse'; // pulse, shake, glow

    // 애니메이션 클래스 생성
    const animationClass = animation ? `animation-${animation}` : '';

    return `
      <li class="menu-item">
        <a
          href="${target}"
          class="menu-link special-menu ${animationClass}"
          data-target="${target}"
          data-page-type="${pageType}"
          data-special="true"
        >
          ${text}
        </a>
      </li>
    `;
  }

  /**
   * 모바일 로고 렌더링
   *
   * @param {Object} logo - 로고 설정
   * @returns {string} HTML 문자열
   */
  renderMobileLogo(logo) {
    if (logo.url) {
      return `
        <img
          src="${logo.url}"
          alt="${logo.alt || '로고'}"
          class="mobile-menu-logo-img"
        />
      `;
    } else {
      const siteName = this.config?.meta?.siteName || '100zoad';
      return `
        <span class="mobile-menu-logo-text">
          ${siteName}
        </span>
      `;
    }
  }

  /**
   * 모바일 메뉴 항목 렌더링
   *
   * @param {Array} menu - 메뉴 항목 배열
   * @param {string} pageType - 페이지 타입 ('onepage' | 'multipage')
   * @returns {string} HTML 문자열
   */
  renderMobileMenuItems(menu, pageType) {
    if (!menu || menu.length === 0) {
      return '<li class="mobile-menu-item"><span class="mobile-menu-link">메뉴 없음</span></li>';
    }

    return menu.map((item, index) => {
      const text = item.text || `메뉴${index + 1}`;
      const target = item.target || '#';

      return `
        <li class="mobile-menu-item">
          <a
            href="${target}"
            class="mobile-menu-link"
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
   * 모바일 특수 메뉴 렌더링
   *
   * @param {Object} specialMenu - 특수 메뉴 설정
   * @param {string} pageType - 페이지 타입
   * @returns {string} HTML 문자열
   */
  renderMobileSpecialMenu(specialMenu, pageType) {
    if (!specialMenu || !specialMenu.text) {
      return '';
    }

    const text = specialMenu.text || '관심고객등록';
    const target = specialMenu.target || '#form-section';

    return `
      <li class="mobile-menu-item">
        <a
          href="${target}"
          class="mobile-menu-link special-menu"
          data-target="${target}"
          data-page-type="${pageType}"
          data-special="true"
        >
          ${text}
        </a>
      </li>
    `;
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEvents() {
    // STORY-IMWEB-004: 렌더링 후 스타일 강제 적용
    this.forceHeaderStyles();

    // 스크롤 이벤트 (헤더 그림자 효과)
    window.addEventListener('scroll', this.handleScroll.bind(this));

    // PC 메뉴 클릭 이벤트
    const menuLinks = this.$$('.menu-link');
    menuLinks.forEach(link => {
      link.addEventListener('click', this.handleMenuClick.bind(this));
    });

    // 로고 클릭 이벤트 (페이지 최상단으로 스크롤)
    const logo = this.$('#logo');
    if (logo) {
      logo.addEventListener('click', this.handleLogoClick.bind(this));
    }

    // 햄버거 버튼 클릭 이벤트
    const hamburgerBtn = this.$('#hamburger-btn');
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
    }

    // 모바일 메뉴 닫기 버튼 클릭 이벤트
    const mobileMenuClose = this.$('#mobile-menu-close');
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', this.closeMobileMenu.bind(this));
    }

    // 모바일 오버레이 클릭 이벤트 (배경 클릭 시 메뉴 닫기)
    const mobileOverlay = this.$('#mobile-overlay');
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', this.closeMobileMenu.bind(this));
    }

    // 모바일 메뉴 항목 클릭 이벤트
    const mobileMenuLinks = this.$$('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', this.handleMobileMenuClick.bind(this));
    });

    this.debug('이벤트 리스너 연결 완료');

    // STORY-007: 파비콘 자동 설정
    this.setFavicon();
  }

  /**
   * 헤더 스타일 강제 적용 (STORY-IMWEB-004)
   * 아임웹 환경에서 CSS 우선순위 문제를 해결하기 위해
   * JavaScript로 스타일을 강제로 적용합니다.
   *
   * @see STORY-IMWEB-004
   */
  forceHeaderStyles() {
    try {
      // Config에서 스타일 값 가져오기
      const bgColor = this.getConfigValue('styles.bgColor', '#ffffff');
      const textColor = this.getConfigValue('styles.textColor', '#333333');

      // 약간의 딜레이 후 스타일 강제 적용 (아임웹 CSS 로드 후)
      setTimeout(() => {
        const header = this.$('#header');
        const menuNav = this.$('#menu-nav');
        const menu = this.$('#menu');
        const menuLinks = this.$$('.menu-link');
        const logo = this.$('#logo');

        // 헤더 스타일 강제 적용
        if (header) {
          header.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
            z-index: 9999 !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
          `;
          this.debug('✅ 헤더 스타일 강제 적용 완료');
        }

        // 메뉴 네비게이션 표시
        if (menuNav) {
          menuNav.style.cssText = `
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
          `;
          this.debug('✅ 메뉴 네비게이션 표시 완료');
        }

        // 메뉴 리스트 표시
        if (menu) {
          menu.style.cssText = `
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
          `;
          this.debug('✅ 메뉴 리스트 표시 완료');
        }

        // 각 메뉴 링크 표시
        menuLinks.forEach((link, index) => {
          link.style.cssText = `
            display: inline-block !important;
            opacity: 1 !important;
            visibility: visible !important;
            color: ${textColor} !important;
          `;
          this.debug(`✅ 메뉴 링크 ${index + 1} 표시 완료`);
        });

        // 로고 표시
        if (logo) {
          logo.style.cssText = `
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
          `;
          this.debug('✅ 로고 표시 완료');
        }

        console.log('[STORY-IMWEB-004] 헤더 스타일 강제 적용 완료');
      }, 100); // 100ms 딜레이
    } catch (error) {
      console.error('[STORY-IMWEB-004] 헤더 스타일 강제 적용 실패:', error);
    }
  }

  /**
   * 파비콘 자동 설정 (STORY-007)
   * Config의 로고 URL을 브라우저 탭 파비콘으로 설정합니다.
   *
   * Acceptance Criteria:
   * - [ ] Config의 로고 URL을 파비콘으로 자동 설정
   * - [ ] 512x512px PNG 지원
   * - [ ] 브라우저 탭에 파비콘 표시
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#rel
   */
  setFavicon() {
    try {
      // Config에서 로고 URL 가져오기
      const logoUrl = this.getConfigValue('logo.url', '');

      if (!logoUrl) {
        this.debug('파비콘 설정 건너뜀: 로고 URL이 없습니다.');
        return;
      }

      // 기존 favicon link 태그 찾기
      let faviconLink = document.querySelector('link[rel="icon"]');

      if (!faviconLink) {
        // 없으면 새로 생성
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.type = 'image/png'; // PNG 형식 명시
        document.head.appendChild(faviconLink);
        this.debug('파비콘 link 태그 생성');
      }

      // 파비콘 URL 설정
      faviconLink.href = logoUrl;

      // 512x512px PNG 지원을 위한 추가 link 태그 (Apple Touch Icon)
      // iOS 및 Android 홈 화면에 추가 시 사용
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');

      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.sizes = '512x512'; // 크기 명시
        document.head.appendChild(appleTouchIcon);
      }

      appleTouchIcon.href = logoUrl;

      this.debug(`✅ 파비콘 설정 완료: ${logoUrl}`);
      console.log(`[HeaderComponent] 파비콘 설정: ${logoUrl}`);
    } catch (error) {
      console.error(`[HeaderComponent] 파비콘 설정 실패:`, error);
    }
  }

  /**
   * 스크롤 이벤트 핸들러
   * 스크롤 위치에 따라 헤더 스타일 변경
   */
  handleScroll() {
    // 크로스 브라우저 호환 스크롤 위치 가져오기
    const scrollTop = this.getScrollPosition();
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
    const menuText = link.textContent.trim();

    this.debug(`메뉴 클릭: ${menuText}, target: ${target}, pageType: ${pageType}`);

    // GTM/GA4 이벤트 추적 (STORY-022)
    trackMenuClick(menuText, target, 'header', this.config);

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
    const currentScrollPos = this.getScrollPosition();
    const targetPosition = section.getBoundingClientRect().top + currentScrollPos - headerHeight;

    // 크로스 브라우저 호환 부드러운 스크롤
    this.smoothScrollTo(targetPosition, 'smooth');

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

    // 크로스 브라우저 호환 부드러운 스크롤
    this.smoothScrollTo(0, 'smooth');

    this.debug('로고 클릭: 페이지 최상단으로 스크롤');
  }

  /**
   * 모바일 메뉴 토글 (열기/닫기)
   * 햄버거 버튼 클릭 시 호출
   *
   * @param {Event} event - 클릭 이벤트
   */
  toggleMobileMenu(event) {
    event.preventDefault();

    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * 모바일 메뉴 열기
   */
  openMobileMenu() {
    const mobileMenu = this.$('#mobile-menu');
    const mobileOverlay = this.$('#mobile-overlay');
    const hamburgerBtn = this.$('#hamburger-btn');

    if (mobileMenu) {
      mobileMenu.classList.add('open');
    }

    if (mobileOverlay) {
      mobileOverlay.classList.add('active');
    }

    if (hamburgerBtn) {
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-label', '메뉴 닫기');
    }

    // 바디 스크롤 방지 (모바일 메뉴 열릴 때)
    document.body.style.overflow = 'hidden';

    this.isMobileMenuOpen = true;
    this.debug('모바일 메뉴 열림');
  }

  /**
   * 모바일 메뉴 닫기
   */
  closeMobileMenu() {
    const mobileMenu = this.$('#mobile-menu');
    const mobileOverlay = this.$('#mobile-overlay');
    const hamburgerBtn = this.$('#hamburger-btn');

    if (mobileMenu) {
      mobileMenu.classList.remove('open');
    }

    if (mobileOverlay) {
      mobileOverlay.classList.remove('active');
    }

    if (hamburgerBtn) {
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-label', '메뉴 열기');
    }

    // 바디 스크롤 복원
    document.body.style.overflow = '';

    this.isMobileMenuOpen = false;
    this.debug('모바일 메뉴 닫힘');
  }

  /**
   * 모바일 메뉴 항목 클릭 이벤트 핸들러
   * 메뉴 클릭 시 해당 섹션으로 이동하고 메뉴 자동 닫기
   *
   * @param {Event} event - 클릭 이벤트
   */
  handleMobileMenuClick(event) {
    const link = event.currentTarget;
    const target = link.getAttribute('data-target');
    const pageType = link.getAttribute('data-page-type');
    const menuText = link.textContent.trim();

    this.debug(`모바일 메뉴 클릭: ${menuText}, target: ${target}, pageType: ${pageType}`);

    // GTM/GA4 이벤트 추적 (STORY-022)
    trackMenuClick(menuText, target, 'mobile-header', this.config);

    // 원페이지 모드: 섹션으로 스크롤 이동
    if (pageType === 'onepage' && target && target.startsWith('#')) {
      event.preventDefault();

      // 메뉴 먼저 닫기
      this.closeMobileMenu();

      // 약간의 딜레이 후 스크롤 (애니메이션이 부드럽게 보이도록)
      setTimeout(() => {
        const sectionId = target.substring(1);
        const section = document.getElementById(sectionId) || document.querySelector(target);

        if (section) {
          this.scrollToSection(section);
        } else {
          console.warn(`[HeaderComponent] 섹션을 찾을 수 없습니다: ${target}`);
        }
      }, 300); // 메뉴 닫힘 애니메이션 시간
    }
    // 멀티페이지 모드: 기본 링크 동작 (페이지 이동)
    else {
      // 메뉴 닫기
      this.closeMobileMenu();
      // 브라우저 기본 동작 (페이지 이동)
      this.debug(`멀티페이지 모드: ${target}로 이동`);
    }
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
