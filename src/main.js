/**
 * 100zoad Web Components - Main Entry Point
 *
 * 이 파일은 개발 환경에서만 사용됩니다.
 * 프로덕션에서는 각 컴포넌트가 독립적으로 로드됩니다.
 */

// HTTPS 강제 리다이렉트 (프로덕션 환경에서만)
// NFR-003: 데이터 전송 암호화 (HTTPS 강제)
if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
  // localhost 및 개발 환경 예외 처리
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isDevelopment = import.meta.env?.DEV || false;

  if (!isLocalhost && !isDevelopment) {
    console.warn('⚠️ HTTP 감지: HTTPS로 리다이렉트합니다...');
    window.location.href = window.location.href.replace('http://', 'https://');
  }
}

console.log('100zoad Components - Development Mode');
console.log('Environment:', import.meta.env.MODE);
console.log('Protocol:', window.location?.protocol || 'N/A');

// 개발 환경 확인
if (import.meta.env.DEV) {
  console.log('✓ Vite Dev Server is running');
  console.log('✓ Hot Module Replacement (HMR) is enabled');
}

// 컴포넌트들 import
import './components/header/header.js';
import './components/footer/footer.js';
import './components/form/form.js';
import './components/quickmenu/quickmenu.js';
// import './components/mobile-nav/mobile-nav.js';
