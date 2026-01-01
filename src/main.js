/**
 * 100zoad Web Components - Main Entry Point
 *
 * 이 파일은 개발 환경에서만 사용됩니다.
 * 프로덕션에서는 각 컴포넌트가 독립적으로 로드됩니다.
 */

console.log('100zoad Components - Development Mode');
console.log('Environment:', import.meta.env.MODE);

// 개발 환경 확인
if (import.meta.env.DEV) {
  console.log('✓ Vite Dev Server is running');
  console.log('✓ Hot Module Replacement (HMR) is enabled');
}

// 향후 컴포넌트들이 이곳에서 import 됩니다
// import './components/header/header.js';
// import './components/footer/footer.js';
// import './components/form/form.js';
// import './components/quickmenu/quickmenu.js';
// import './components/mobile-nav/mobile-nav.js';
