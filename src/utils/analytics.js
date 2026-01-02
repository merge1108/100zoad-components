/**
 * Analytics Utilities - 100zoad Web Components
 *
 * GTM/GA4 이벤트 추적을 위한 유틸리티 함수 모음
 * - dataLayer push
 * - SHA-256 해시 (향상된 전환 추적용)
 * - 전환 이벤트 (form_submit, call_click)
 *
 * @author merge
 * @version 1.0.0
 * @created 2026-01-02
 */

/**
 * SHA-256 해시 함수
 * 이름, 전화번호 등을 해시화하여 향상된 전환 추적에 사용합니다.
 *
 * @param {string} message - 해시화할 문자열
 * @returns {Promise<string>} SHA-256 해시 (16진수 문자열)
 *
 * @example
 * const phoneHash = await sha256Hash('821012345678');
 * // => 'a1b2c3d4...'
 */
export async function sha256Hash(message) {
  if (!message) {
    console.warn('[Analytics] sha256Hash: 빈 문자열은 해시화할 수 없습니다.');
    return '';
  }

  try {
    // 문자열을 소문자로 변환하고 공백 제거
    const normalized = message.toLowerCase().trim();

    // TextEncoder를 사용하여 문자열을 Uint8Array로 변환
    const msgBuffer = new TextEncoder().encode(normalized);

    // SubtleCrypto API를 사용하여 SHA-256 해시 생성
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // ArrayBuffer를 16진수 문자열로 변환
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  } catch (error) {
    console.error('[Analytics] SHA-256 해시 생성 오류:', error);
    return '';
  }
}

/**
 * 전화번호를 국제 형식으로 변환
 * 010-1234-5678 → 821012345678
 *
 * @param {string} phone - 원본 전화번호
 * @returns {string} 국제 형식 전화번호 (숫자만)
 *
 * @example
 * const international = normalizePhoneForHash('010-1234-5678');
 * // => '821012345678'
 */
export function normalizePhoneForHash(phone) {
  if (!phone) return '';

  // 숫자만 추출
  const numbers = phone.replace(/[^0-9]/g, '');

  // 010으로 시작하는 경우 82로 변경
  if (numbers.startsWith('010')) {
    return '82' + numbers.substring(1);
  }

  // 0으로 시작하는 경우 82로 변경 (지역번호)
  if (numbers.startsWith('0')) {
    return '82' + numbers.substring(1);
  }

  // 그 외는 그대로 반환
  return numbers;
}

/**
 * GTM/GA4 dataLayer에 이벤트 송출
 * window.dataLayer가 없으면 자동으로 초기화합니다.
 *
 * @param {Object} eventData - 이벤트 데이터
 * @param {string} eventData.event - 이벤트명 (필수)
 *
 * @example
 * pushToDataLayer({
 *   event: 'form_submit',
 *   event_category: 'conversion',
 *   user_data: { phone_hash: '...' }
 * });
 */
export function pushToDataLayer(eventData) {
  // dataLayer 초기화
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  } else {
    console.warn('[Analytics] window 객체가 없습니다. (서버 환경?)');
    return;
  }

  // 이벤트명 필수 체크
  if (!eventData || !eventData.event) {
    console.error('[Analytics] pushToDataLayer: event 속성이 필수입니다.', eventData);
    return;
  }

  // dataLayer에 push
  window.dataLayer.push(eventData);

  console.log('[Analytics] GTM 이벤트 송출:', eventData);
}

/**
 * 입력폼 제출 이벤트 추적
 * form_submit 이벤트를 dataLayer에 송출하고, 향상된 전환 추적을 위해 전화번호를 해시화합니다.
 *
 * @param {Object} formData - 폼 데이터
 * @param {string} formData.이름 - 이름
 * @param {string} formData.전화번호 - 전화번호 (010-1234-5678 형식)
 * @param {Object} [config={}] - Config 설정
 *
 * @example
 * await trackFormSubmit({
 *   '이름': '홍길동',
 *   '전화번호': '010-1234-5678'
 * }, config);
 */
export async function trackFormSubmit(formData, config = {}) {
  try {
    // Config에서 이벤트명 가져오기 (커스터마이징 가능)
    const eventName = config?.analytics?.events?.formSubmit || 'form_submit';

    // 전화번호 해시화
    let phoneHash = '';
    if (formData['전화번호']) {
      const internationalPhone = normalizePhoneForHash(formData['전화번호']);
      phoneHash = await sha256Hash(internationalPhone);
    }

    // GTM/GA4 이벤트 데이터 구성
    const eventData = {
      event: eventName,
      event_category: 'conversion',
      event_label: 'lead_form_submission',
      // 향상된 전환 추적 데이터
      enhanced_conversion_data: {
        phone_number_sha256: phoneHash
      },
      // 추가 정보 (옵션)
      form_type: 'lead_form',
      site_name: formData.siteName || config?.meta?.siteName || 'unknown'
    };

    // dataLayer에 송출
    pushToDataLayer(eventData);

    console.log('[Analytics] 입력폼 제출 추적 완료:', eventData);
  } catch (error) {
    console.error('[Analytics] trackFormSubmit 오류:', error);
  }
}

/**
 * 전화걸기 클릭 이벤트 추적
 * call_click 이벤트를 dataLayer에 송출합니다.
 *
 * @param {string} phone - 클릭한 전화번호
 * @param {string} component - 클릭한 컴포넌트 ('quickmenu' | 'mobileNav' | 'header')
 * @param {Object} [config={}] - Config 설정
 *
 * @example
 * trackCallClick('010-1234-5678', 'quickmenu', config);
 */
export function trackCallClick(phone, component = 'unknown', config = {}) {
  try {
    // Config에서 이벤트명 가져오기 (커스터마이징 가능)
    const eventName = config?.analytics?.events?.callClick || 'call_click';

    // GTM/GA4 이벤트 데이터 구성
    const eventData = {
      event: eventName,
      event_category: 'conversion',
      event_label: 'phone_call_click',
      phone_number: phone,
      component: component
    };

    // dataLayer에 송출
    pushToDataLayer(eventData);

    console.log('[Analytics] 전화걸기 클릭 추적 완료:', eventData);
  } catch (error) {
    console.error('[Analytics] trackCallClick 오류:', error);
  }
}

/**
 * 비전환 이벤트 추적 (일반 버튼 클릭, 메뉴 클릭 등)
 * 사용자 행동 분석을 위한 이벤트 추적
 *
 * @param {string} eventName - 이벤트명
 * @param {Object} eventData - 추가 이벤트 데이터
 *
 * @example
 * trackEvent('menu_click', {
 *   menu_item: '분양정보',
 *   component: 'header'
 * });
 */
export function trackEvent(eventName, eventData = {}) {
  try {
    const fullEventData = {
      event: eventName,
      event_category: eventData.event_category || 'engagement',
      ...eventData
    };

    pushToDataLayer(fullEventData);

    console.log('[Analytics] 이벤트 추적:', fullEventData);
  } catch (error) {
    console.error('[Analytics] trackEvent 오류:', error);
  }
}

/**
 * 메뉴 클릭 이벤트 추적 (STORY-022)
 * 헤더 메뉴 항목 클릭을 추적합니다.
 *
 * @param {string} menuItem - 메뉴 항목 텍스트
 * @param {string} target - 타겟 URL 또는 섹션 ID
 * @param {string} component - 컴포넌트 이름 ('header' | 'mobile-header')
 * @param {Object} [config={}] - Config 설정
 *
 * @example
 * trackMenuClick('분양정보', '#section-info', 'header', config);
 */
export function trackMenuClick(menuItem, target, component = 'header', config = {}) {
  try {
    // Config에서 이벤트명 가져오기 (커스터마이징 가능)
    const eventName = config?.analytics?.events?.menuClick || 'menu_click';

    // GTM/GA4 이벤트 데이터 구성
    const eventData = {
      event: eventName,
      event_category: 'engagement',
      event_label: 'menu_navigation',
      menu_item: menuItem,
      menu_target: target,
      component: component
    };

    // dataLayer에 송출
    pushToDataLayer(eventData);

    console.log('[Analytics] 메뉴 클릭 추적 완료:', eventData);
  } catch (error) {
    console.error('[Analytics] trackMenuClick 오류:', error);
  }
}

/**
 * 버튼 클릭 이벤트 추적 (STORY-022)
 * 퀵메뉴, 모바일 내비게이터 버튼 클릭을 추적합니다.
 *
 * @param {string} buttonText - 버튼 텍스트
 * @param {string} action - 버튼 액션 ('openForm' | 'call' | 'link')
 * @param {string} component - 컴포넌트 이름 ('quickmenu' | 'mobileNav')
 * @param {number} [buttonIndex] - 버튼 인덱스
 * @param {Object} [config={}] - Config 설정
 *
 * @example
 * trackButtonClick('입력폼', 'openForm', 'quickmenu', 0, config);
 */
export function trackButtonClick(buttonText, action, component = 'quickmenu', buttonIndex, config = {}) {
  try {
    // Config에서 이벤트명 가져오기 (커스터마이징 가능)
    const eventName = config?.analytics?.events?.buttonClick || 'button_click';

    // GTM/GA4 이벤트 데이터 구성
    const eventData = {
      event: eventName,
      event_category: 'engagement',
      event_label: 'button_interaction',
      button_text: buttonText,
      button_action: action,
      component: component
    };

    // 버튼 인덱스 추가 (있는 경우)
    if (typeof buttonIndex !== 'undefined') {
      eventData.button_index = buttonIndex;
    }

    // dataLayer에 송출
    pushToDataLayer(eventData);

    console.log('[Analytics] 버튼 클릭 추적 완료:', eventData);
  } catch (error) {
    console.error('[Analytics] trackButtonClick 오류:', error);
  }
}

/**
 * 스크롤 깊이 이벤트 추적 (STORY-022)
 * 페이지 스크롤 깊이를 추적합니다 (25%, 50%, 75%, 100%).
 *
 * @param {number} percentage - 스크롤 깊이 퍼센트 (25, 50, 75, 100)
 * @param {Object} [config={}] - Config 설정
 *
 * @example
 * trackScrollDepth(50, config);
 */
export function trackScrollDepth(percentage, config = {}) {
  try {
    // Config에서 이벤트명 가져오기 (커스터마이징 가능)
    const eventName = config?.analytics?.events?.scrollDepth || 'scroll_depth';

    // GTM/GA4 이벤트 데이터 구성
    const eventData = {
      event: eventName,
      event_category: 'engagement',
      event_label: 'page_scroll',
      scroll_depth_percentage: percentage,
      scroll_depth_threshold: `${percentage}%`
    };

    // dataLayer에 송출
    pushToDataLayer(eventData);

    console.log('[Analytics] 스크롤 깊이 추적 완료:', eventData);
  } catch (error) {
    console.error('[Analytics] trackScrollDepth 오류:', error);
  }
}

/**
 * Config에서 Analytics 설정 가져오기 (헬퍼)
 * @param {Object} config - Config 객체
 * @returns {Object} Analytics 설정
 */
export function getAnalyticsConfig(config) {
  return config?.analytics || {
    enabled: true,
    events: {
      formSubmit: 'form_submit',
      callClick: 'call_click'
    }
  };
}

// 전역으로 노출 (디버깅용)
if (typeof window !== 'undefined') {
  window.ZoadAnalytics = {
    sha256Hash,
    normalizePhoneForHash,
    pushToDataLayer,
    trackFormSubmit,
    trackCallClick,
    trackEvent,
    trackMenuClick,
    trackButtonClick,
    trackScrollDepth
  };

  console.log('✅ Analytics 유틸리티 로드 완료 (STORY-022: 비전환 이벤트 추적 추가)');
}

export default {
  sha256Hash,
  normalizePhoneForHash,
  pushToDataLayer,
  trackFormSubmit,
  trackCallClick,
  trackEvent,
  trackMenuClick,
  trackButtonClick,
  trackScrollDepth,
  getAnalyticsConfig
};
