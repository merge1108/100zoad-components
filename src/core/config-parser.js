/**
 * Config Parser - 100zoad Web Components
 *
 * Window.CONFIG 전역 객체를 파싱하고 검증하는 중앙 집중식 설정 시스템
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-01
 */

/**
 * @typedef {Object} HeaderConfig
 * @property {Object} logo - 로고 설정
 * @property {string} logo.url - 로고 이미지 URL (512x512px PNG 권장)
 * @property {string} logo.alt - 로고 대체 텍스트
 * @property {string} pageType - 페이지 타입 ("onepage" | "multipage")
 * @property {Array<{text: string, target: string}>} menu - 메뉴 항목 (최대 6개)
 * @property {Object} [specialMenu] - 관심고객등록 특수 메뉴 (선택)
 * @property {string} specialMenu.text - 메뉴 텍스트
 * @property {string} specialMenu.animation - 애니메이션 타입 ("pulse" | "glow" | "bounce")
 * @property {string} specialMenu.target - 타겟 섹션 ID 또는 URL
 * @property {Object} mobile - 모바일 설정
 * @property {number} mobile.breakpoint - 모바일 브레이크포인트 (기본: 768px)
 * @property {string} mobile.hamburgerPosition - 햄버거 메뉴 위치 ("left" | "right")
 * @property {Object} styles - 스타일 설정
 * @property {string} styles.bgColor - 배경색
 * @property {string} styles.textColor - 텍스트 색
 * @property {string} styles.hoverColor - 호버 색
 */

/**
 * @typedef {Object} FooterConfig
 * @property {Object} line1 - 1단 정보 (현장 정보)
 * @property {string} line1.siteName - 현장명
 * @property {string} line1.phone - 상담사 전화번호
 * @property {Object} line2 - 2단 정보 (대행사 정보)
 * @property {string} line2.company - 대행사 회사명
 * @property {string} line2.ceo - 대표자명
 * @property {string} line2.phone - 대행사 전화번호
 * @property {string} line2.businessNumber - 사업자번호
 * @property {Object} legal - 법적 정보
 * @property {string} legal.termsUrl - 이용약관 URL
 * @property {string} legal.privacyUrl - 개인정보처리방침 URL
 * @property {string} legal.openIn - 링크 열기 방식 ("popup" | "newTab")
 * @property {Object} styles - 스타일 설정
 * @property {string} styles.bgColor - 배경색
 * @property {string} styles.textColor - 텍스트 색
 */

/**
 * @typedef {Object} FormField
 * @property {string} type - 필드 타입 ("text" | "phone" | "dropdown" | "datetime")
 * @property {string} name - 필드 이름 (Airtable 컬럼명)
 * @property {string} label - 필드 라벨
 * @property {boolean} required - 필수 여부
 * @property {Array<string>} [options] - 드롭다운 옵션 (type="dropdown"일 때)
 * @property {string} [placeholder] - 플레이스홀더
 */

/**
 * @typedef {Object} FormConfig
 * @property {string} displayMode - 표시 모드 ("popup" | "section" | "both")
 * @property {Object} fields - 입력 필드 설정
 * @property {Object} fields.name - 이름 필드
 * @property {string} fields.name.label - 라벨
 * @property {string} fields.name.placeholder - 플레이스홀더
 * @property {boolean} fields.name.required - 필수 여부
 * @property {Object} fields.phone - 전화번호 필드
 * @property {string} fields.phone.label - 라벨
 * @property {string} fields.phone.placeholder - 플레이스홀더
 * @property {boolean} fields.phone.required - 필수 여부
 * @property {Array<FormField>} fields.additional - 추가 선택 필드
 * @property {Object} legal - 법적 동의
 * @property {string} legal.termsText - 이용약관 전문
 * @property {string} legal.privacyText - 개인정보처리방침 전문
 * @property {Object} messages - 메시지 설정
 * @property {string} messages.success - 성공 메시지
 * @property {string} messages.error - 오류 메시지
 * @property {Object} airtable - Airtable 연동 설정
 * @property {string} airtable.workerUrl - Cloudflare Worker URL
 * @property {Object} styles - 스타일 설정
 */

/**
 * @typedef {Object} QuickMenuButton
 * @property {string} text - 버튼 텍스트
 * @property {string} icon - 아이콘 (emoji 또는 URL)
 * @property {string} action - 액션 타입 ("openForm" | "call" | "link")
 * @property {string} [phone] - 전화번호 (action="call"일 때)
 * @property {string} [url] - URL (action="link"일 때)
 * @property {string} [target] - 링크 타겟 ("_blank" | "_self")
 * @property {string} color - 버튼 색상
 */

/**
 * @typedef {Object} QuickMenuConfig
 * @property {boolean} enabled - 활성화 여부
 * @property {Object} position - 위치 설정
 * @property {string} position.right - 우측 여백 (예: "30px")
 * @property {string} position.top - 상단 여백 (예: "50%")
 * @property {Array<QuickMenuButton>} buttons - 버튼 목록 (최대 4개)
 */

/**
 * @typedef {Object} MobileNavButton
 * @property {string} text - 버튼 텍스트
 * @property {string} icon - 아이콘
 * @property {string} action - 액션 타입 ("openForm" | "call" | "link")
 * @property {string} [phone] - 전화번호
 * @property {string} [url] - URL
 * @property {string} color - 버튼 색상
 */

/**
 * @typedef {Object} MobileNavConfig
 * @property {boolean} enabled - 활성화 여부
 * @property {Array<MobileNavButton>} buttons - 버튼 목록 (최대 3개)
 */

/**
 * @typedef {Object} WindowConfig
 * @property {Object} meta - 메타 정보
 * @property {string} meta.siteName - 사이트명
 * @property {string} meta.version - Config 버전
 * @property {string} meta.lastUpdated - 최종 수정일
 * @property {HeaderConfig} [header] - 헤더 설정 (선택)
 * @property {FooterConfig} [footer] - 푸터 설정 (선택)
 * @property {FormConfig} [form] - 입력폼 설정 (선택)
 * @property {QuickMenuConfig} [quickMenu] - 퀵메뉴 설정 (선택)
 * @property {MobileNavConfig} [mobileNav] - 모바일 내비게이터 설정 (선택)
 * @property {Object} responsive - 반응형 설정
 * @property {number} responsive.breakpoint - 브레이크포인트 (기본: 768px)
 * @property {Object} analytics - 분석 설정
 * @property {string} analytics.gtmId - Google Tag Manager ID
 * @property {Object} fallback - Graceful Degradation 설정
 * @property {boolean} fallback.enabled - 폴백 활성화
 * @property {number} fallback.timeout - 타임아웃 (ms, 기본: 3000)
 */

/**
 * 기본 Config 값
 * 각 컴포넌트가 설정되지 않았을 때 사용되는 기본값
 *
 * @type {Partial<WindowConfig>}
 */
const DEFAULTS = {
  meta: {
    siteName: '100zoad Components',
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  },
  responsive: {
    breakpoint: 768
  },
  analytics: {
    gtmId: '',
    events: {
      form_submit: 'form_submit',
      call_click: 'call_click'
    }
  },
  fallback: {
    enabled: true,
    timeout: 3000
  }
};

/**
 * Config 검증 오류 클래스
 */
class ConfigValidationError extends Error {
  /**
   * @param {string} message - 오류 메시지
   * @param {string} field - 문제가 발생한 필드 경로
   */
  constructor(message, field) {
    super(message);
    this.name = 'ConfigValidationError';
    this.field = field;
  }
}

/**
 * URL이 HTTPS인지 확인하는 헬퍼 함수
 * Mixed Content 방지를 위한 검증
 *
 * @param {string} url - 검증할 URL
 * @returns {boolean} HTTPS 또는 상대 경로이면 true
 */
function isSecureUrl(url) {
  if (!url) return true; // 빈 URL은 허용 (옵션 필드일 수 있음)

  // 상대 경로는 허용 (/, ./, ../, #)
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('#')) {
    return true;
  }

  // 프로토콜이 없으면 상대 경로로 간주
  if (!url.includes('://') && !url.startsWith('//')) {
    return true;
  }

  // HTTP는 허용하지 않음 (Mixed Content)
  if (url.toLowerCase().startsWith('http://')) {
    return false;
  }

  return true; // HTTPS, data:, blob: 등은 허용
}

/**
 * Config 검증 함수
 * Window.CONFIG 객체가 유효한지 검증
 *
 * @param {WindowConfig} config - 검증할 Config 객체
 * @returns {{valid: boolean, errors: Array<{field: string, message: string}>}}
 *
 * @example
 * const result = validateConfig(Window.CONFIG);
 * if (!result.valid) {
 *   console.error('Config 오류:', result.errors);
 * }
 */
export function validateConfig(config) {
  const errors = [];

  // Config 객체가 존재하는지 확인
  if (!config || typeof config !== 'object') {
    errors.push({
      field: 'Window.CONFIG',
      message: 'Window.CONFIG 객체가 정의되지 않았습니다. main.html에서 Window.CONFIG를 설정해주세요.'
    });
    return { valid: false, errors };
  }

  // 메타 정보 필수 필드 검증
  if (!config.meta) {
    errors.push({
      field: 'meta',
      message: 'meta 객체가 필수입니다. meta.siteName을 설정해주세요.'
    });
  } else {
    if (!config.meta.siteName) {
      errors.push({
        field: 'meta.siteName',
        message: 'meta.siteName이 필수입니다. 현장명을 입력해주세요.'
      });
    }
  }

  // Header 검증 (선택 사항이지만, 존재하면 검증)
  if (config.header) {
    if (!config.header.logo || !config.header.logo.url) {
      errors.push({
        field: 'header.logo.url',
        message: 'header.logo.url이 필수입니다. 로고 이미지 URL을 설정해주세요.'
      });
    } else if (!isSecureUrl(config.header.logo.url)) {
      errors.push({
        field: 'header.logo.url',
        message: '⚠️ HTTPS 보안: header.logo.url은 HTTPS URL을 사용해야 합니다. HTTP는 Mixed Content 오류를 발생시킵니다.'
      });
    }

    if (!config.header.pageType || !['onepage', 'multipage'].includes(config.header.pageType)) {
      errors.push({
        field: 'header.pageType',
        message: 'header.pageType은 "onepage" 또는 "multipage"여야 합니다.'
      });
    }
    if (config.header.menu && config.header.menu.length > 6) {
      errors.push({
        field: 'header.menu',
        message: 'header.menu는 최대 6개까지 설정할 수 있습니다.'
      });
    }
  }

  // Footer 검증
  if (config.footer) {
    if (!config.footer.line1 || !config.footer.line1.siteName) {
      errors.push({
        field: 'footer.line1.siteName',
        message: 'footer.line1.siteName이 필수입니다.'
      });
    }
    if (!config.footer.line2 || !config.footer.line2.company) {
      errors.push({
        field: 'footer.line2.company',
        message: 'footer.line2.company (대행사 회사명)이 필수입니다.'
      });
    }

    // 법적 정보 URL HTTPS 검증
    if (config.footer.legal) {
      if (config.footer.legal.termsUrl && !isSecureUrl(config.footer.legal.termsUrl)) {
        errors.push({
          field: 'footer.legal.termsUrl',
          message: '⚠️ HTTPS 보안: footer.legal.termsUrl은 HTTPS URL을 사용해야 합니다.'
        });
      }
      if (config.footer.legal.privacyUrl && !isSecureUrl(config.footer.legal.privacyUrl)) {
        errors.push({
          field: 'footer.legal.privacyUrl',
          message: '⚠️ HTTPS 보안: footer.legal.privacyUrl은 HTTPS URL을 사용해야 합니다.'
        });
      }
    }
  }

  // Form 검증
  if (config.form) {
    if (!config.form.fields) {
      errors.push({
        field: 'form.fields',
        message: 'form.fields 객체가 필수입니다.'
      });
    } else {
      // 필수 필드 검증
      if (!config.form.fields.name || !config.form.fields.name.label) {
        errors.push({
          field: 'form.fields.name.label',
          message: 'form.fields.name.label이 필수입니다.'
        });
      }
      if (!config.form.fields.phone || !config.form.fields.phone.label) {
        errors.push({
          field: 'form.fields.phone.label',
          message: 'form.fields.phone.label이 필수입니다.'
        });
      }
    }

    if (!config.form.airtable || !config.form.airtable.workerUrl) {
      errors.push({
        field: 'form.airtable.workerUrl',
        message: 'form.airtable.workerUrl (Cloudflare Worker URL)이 필수입니다.'
      });
    } else if (!isSecureUrl(config.form.airtable.workerUrl)) {
      errors.push({
        field: 'form.airtable.workerUrl',
        message: '⚠️ HTTPS 보안: form.airtable.workerUrl은 HTTPS URL을 사용해야 합니다. Cloudflare Workers는 자동으로 HTTPS를 지원합니다.'
      });
    }

    if (!config.form.legal || !config.form.legal.termsText || !config.form.legal.privacyText) {
      errors.push({
        field: 'form.legal',
        message: 'form.legal.termsText와 form.legal.privacyText가 필수입니다.'
      });
    }
  }

  // QuickMenu 검증
  if (config.quickMenu && config.quickMenu.enabled) {
    if (!config.quickMenu.buttons || config.quickMenu.buttons.length === 0) {
      errors.push({
        field: 'quickMenu.buttons',
        message: 'quickMenu가 활성화되어 있으면 최소 1개의 버튼이 필요합니다.'
      });
    } else if (config.quickMenu.buttons.length > 4) {
      errors.push({
        field: 'quickMenu.buttons',
        message: 'quickMenu.buttons는 최대 4개까지 설정할 수 있습니다.'
      });
    }
  }

  // MobileNav 검증
  if (config.mobileNav && config.mobileNav.enabled) {
    if (!config.mobileNav.buttons || config.mobileNav.buttons.length === 0) {
      errors.push({
        field: 'mobileNav.buttons',
        message: 'mobileNav가 활성화되어 있으면 최소 1개의 버튼이 필요합니다.'
      });
    } else if (config.mobileNav.buttons.length > 3) {
      errors.push({
        field: 'mobileNav.buttons',
        message: 'mobileNav.buttons는 최대 3개까지 설정할 수 있습니다.'
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 깊은 병합 (Deep Merge) 유틸리티 함수
 * 기본값과 사용자 설정을 병합
 *
 * @param {Object} target - 대상 객체
 * @param {Object} source - 소스 객체
 * @returns {Object} 병합된 객체
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
}

/**
 * Config 파싱 함수
 * Window.CONFIG 또는 Window.ZOAD_CONFIG를 파싱하고 기본값으로 fallback
 *
 * @returns {WindowConfig} 파싱된 Config 객체
 * @throws {ConfigValidationError} Config가 유효하지 않을 때
 *
 * @example
 * try {
 *   const config = parseConfig();
 *   console.log('Config 로드 성공:', config);
 * } catch (error) {
 *   console.error('Config 오류:', error.message);
 * }
 */
export function parseConfig() {
  // Window.CONFIG가 존재하는지 확인
  if (typeof window === 'undefined') {
    throw new ConfigValidationError(
      '브라우저 환경이 아닙니다. Window 객체를 찾을 수 없습니다.',
      'window'
    );
  }

  // Window.CONFIG 또는 Window.ZOAD_CONFIG 읽기 (ZOAD_CONFIG 우선)
  const userConfig = window.ZOAD_CONFIG || window.CONFIG || {};

  if (window.ZOAD_CONFIG) {
    console.log('📦 [config-parser] ZOAD_CONFIG 사용');
  } else if (window.CONFIG) {
    console.log('📦 [config-parser] CONFIG 사용');
  } else {
    console.warn('⚠️ [config-parser] CONFIG가 정의되지 않음, 기본값 사용');
  }

  // 기본값과 병합
  const mergedConfig = deepMerge(DEFAULTS, userConfig);

  // 검증
  const validation = validateConfig(mergedConfig);

  if (!validation.valid) {
    // 오류 메시지 출력
    console.error('❌ Config 검증 실패:');
    validation.errors.forEach((error, index) => {
      console.error(`  ${index + 1}. [${error.field}] ${error.message}`);
    });

    // 첫 번째 오류를 throw
    const firstError = validation.errors[0];
    throw new ConfigValidationError(
      `Config 검증 실패: ${firstError.message}`,
      firstError.field
    );
  }

  // 성공 메시지
  console.log('✅ Config 파싱 성공');
  console.log('📋 사이트명:', mergedConfig.meta.siteName);
  console.log('🔧 활성화된 컴포넌트:', [
    mergedConfig.header ? 'Header' : null,
    mergedConfig.footer ? 'Footer' : null,
    mergedConfig.form ? 'Form' : null,
    mergedConfig.quickMenu?.enabled ? 'QuickMenu' : null,
    mergedConfig.mobileNav?.enabled ? 'MobileNav' : null
  ].filter(Boolean).join(', '));

  return mergedConfig;
}

/**
 * Config가 특정 컴포넌트를 활성화했는지 확인
 *
 * @param {WindowConfig} config - Config 객체
 * @param {string} component - 컴포넌트 이름 ('header' | 'footer' | 'form' | 'quickMenu' | 'mobileNav')
 * @returns {boolean} 활성화 여부
 *
 * @example
 * if (isComponentEnabled(config, 'header')) {
 *   // Header 컴포넌트 로드
 * }
 */
export function isComponentEnabled(config, component) {
  // 컴포넌트 이름을 camelCase로 변환 (quickmenu -> quickMenu)
  const componentKey = component === 'quickmenu' ? 'quickMenu'
                     : component === 'mobilenav' ? 'mobileNav'
                     : component;

  // 위젯 모드를 위해 원본 키(소문자)도 확인
  const componentData = config[componentKey] || config[component];

  switch (componentKey) {
    case 'header':
    case 'footer':
    case 'form':
      return !!componentData;
    case 'quickMenu':
    case 'mobileNav':
      return !!(componentData && componentData.enabled);
    default:
      return false;
  }
}

/**
 * Config 예시 템플릿 생성 함수
 * 개발자가 참고할 수 있는 예시 Config를 생성
 *
 * @returns {WindowConfig} 예시 Config 객체
 */
export function getExampleConfig() {
  return {
    meta: {
      siteName: '강남 센트럴 파크',
      version: '1.0.0',
      lastUpdated: '2026-01-01'
    },
    header: {
      logo: {
        url: 'https://example.com/logo.png',
        alt: '강남 센트럴 파크'
      },
      pageType: 'onepage',
      menu: [
        { text: '단지정보', target: '#section1' },
        { text: '입지환경', target: '#section2' },
        { text: '세대정보', target: '#section3' }
      ],
      specialMenu: {
        text: '관심고객등록',
        animation: 'pulse',
        target: '#form-section'
      },
      mobile: {
        breakpoint: 768,
        hamburgerPosition: 'right'
      },
      styles: {
        bgColor: '#ffffff',
        textColor: '#333333',
        hoverColor: '#007bff'
      }
    },
    footer: {
      line1: {
        siteName: '강남 센트럴 파크',
        phone: '1588-0000'
      },
      line2: {
        company: '100zoad 마케팅',
        ceo: '홍길동',
        phone: '02-1234-5678',
        businessNumber: '123-45-67890'
      },
      legal: {
        termsUrl: 'https://example.com/terms',
        privacyUrl: 'https://example.com/privacy',
        openIn: 'popup'
      },
      styles: {
        bgColor: '#f8f9fa',
        textColor: '#666666'
      }
    },
    form: {
      displayMode: 'both',
      fields: {
        name: {
          label: '이름',
          placeholder: '홍길동',
          required: true
        },
        phone: {
          label: '전화번호',
          placeholder: '010-0000-0000',
          required: true
        },
        additional: [
          {
            type: 'dropdown',
            name: 'visitTime',
            label: '방문 희망 시간',
            options: ['오전', '오후', '저녁'],
            required: true
          }
        ]
      },
      legal: {
        termsText: '이용약관 전문...',
        privacyText: '개인정보처리방침 전문...'
      },
      messages: {
        success: '신청이 완료되었습니다.',
        error: '제출 중 오류가 발생했습니다.'
      },
      airtable: {
        workerUrl: 'https://lead-submit.your-project.workers.dev/submit'
      }
    },
    quickMenu: {
      enabled: true,
      position: {
        right: '30px',
        top: '50%'
      },
      buttons: [
        {
          text: '입력폼',
          icon: '📝',
          action: 'openForm',
          color: '#007bff'
        },
        {
          text: '전화걸기',
          icon: '📞',
          action: 'call',
          phone: '1588-0000',
          color: '#28a745'
        }
      ]
    },
    mobileNav: {
      enabled: true,
      buttons: [
        {
          text: '상담신청',
          icon: '📝',
          action: 'openForm',
          color: '#007bff'
        },
        {
          text: '전화',
          icon: '📞',
          action: 'call',
          phone: '1588-0000',
          color: '#28a745'
        }
      ]
    },
    responsive: {
      breakpoint: 768
    },
    analytics: {
      gtmId: 'GTM-XXXXXXX',
      events: {
        form_submit: 'form_submit',
        call_click: 'call_click'
      }
    },
    fallback: {
      enabled: true,
      timeout: 3000
    }
  };
}

// 기본 export
export default {
  parseConfig,
  validateConfig,
  isComponentEnabled,
  getExampleConfig,
  DEFAULTS
};
