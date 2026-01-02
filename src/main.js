/**
 * 100zoad Web Components - Main Entry Point
 *
 * 이 파일은 개발 환경에서만 사용됩니다.
 * 프로덕션에서는 각 컴포넌트가 독립적으로 로드됩니다.
 *
 * STORY-025: 로딩 최적화 및 로딩 화면
 * - 병렬 로딩으로 성능 최적화
 * - 로딩 인디케이터 표시
 * - 로딩 시간 측정 및 리포트
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

// ===== STORY-025: 병렬 로딩 시스템 =====

import { loadComponentsParallel, printLoadingReport } from './utils/component-loader.js';
import './components/loader/loader.js';

// ===== STORY-022: 스크롤 깊이 추적 =====
import { initScrollTracking } from './utils/scroll-tracker.js';

/**
 * 로딩할 컴포넌트 정의
 * @type {import('./utils/component-loader.js').ComponentDefinition[]}
 */
const componentsToLoad = [
  {
    name: 'header',
    loader: () => import('./components/header/header.js'),
    timeout: 3000,
    required: false // 선택적 컴포넌트
  },
  {
    name: 'footer',
    loader: () => import('./components/footer/footer.js'),
    timeout: 3000,
    required: false
  },
  {
    name: 'form',
    loader: () => import('./components/form/form.js'),
    timeout: 3000,
    required: true // 필수 컴포넌트
  },
  {
    name: 'quickmenu',
    loader: () => import('./components/quickmenu/quickmenu.js'),
    timeout: 3000,
    required: false
  },
  {
    name: 'mobile-nav',
    loader: () => import('./components/mobile-nav/mobile-nav.js'),
    timeout: 3000,
    required: false
  }
];

/**
 * 컴포넌트 병렬 로딩 실행
 */
async function initializeComponents() {
  const startTime = performance.now();

  console.log('\n🚀 ==== 100zoad 컴포넌트 초기화 시작 ====\n');

  // 로딩 인디케이터 표시 (Config가 있으면 사용, 없으면 기본값)
  let loaderElement = null;

  // 로더 Config 설정 (window.ZOAD_CONFIG 또는 window.CONFIG 사용)
  if (typeof window !== 'undefined') {
    const globalConfig = window.ZOAD_CONFIG || window.CONFIG;
    window.LOADER_CONFIG = globalConfig?.loader || {
      spinnerType: 'circle', // 'circle' | 'bars' | 'dots'
      bgColor: 'rgba(255, 255, 255, 0.95)',
      primaryColor: '#007bff',
      textColor: '#333333',
      showProgress: true
    };

    // 로더 엘리먼트 추가
    loaderElement = document.createElement('zoad-loader');
    document.body.appendChild(loaderElement);

    // 3초 타임아웃 설정
    loaderElement.hideAfterTimeout(3000);
  }

  try {
    // 병렬 로딩 실행
    const results = await loadComponentsParallel(componentsToLoad, {
      // 진행 상태 업데이트
      onProgress: (loadedCount, totalCount, name, success, time) => {
        console.log(`📦 [${name}] ${success ? '✅' : '❌'} (${time.toFixed(2)}ms)`);

        // 로더 진행 상태 업데이트
        if (loaderElement) {
          loaderElement.updateProgress(loadedCount, totalCount);
        }
      },

      // 완료 콜백
      onComplete: (results, totalTime) => {
        const elapsed = performance.now() - startTime;

        console.log(`\n✅ ==== 초기화 완료 ====`);
        console.log(`   총 소요 시간: ${elapsed.toFixed(2)}ms (${(elapsed / 1000).toFixed(2)}s)`);

        // 성능 리포트 출력
        printLoadingReport(results);

        // 전역 성능 데이터 저장 (디버깅/분석용)
        if (typeof window !== 'undefined') {
          window.__ZOAD_PERFORMANCE__ = {
            results,
            totalTime: elapsed,
            timestamp: new Date().toISOString()
          };
        }

        // STORY-022: 스크롤 깊이 추적 초기화
        // 모든 컴포넌트 로딩 완료 후 스크롤 추적 시작
        if (typeof window !== 'undefined') {
          try {
            const scrollTracker = initScrollTracking(window.ZOAD_CONFIG || window.CONFIG || {});
            console.log('✅ [STORY-022] 스크롤 깊이 추적 활성화:', scrollTracker.getStatus());
          } catch (error) {
            console.error('❌ [STORY-022] 스크롤 추적 초기화 실패:', error);
          }
        }
      }
    });

    // 필수 컴포넌트 체크
    const requiredComponents = componentsToLoad.filter(c => c.required);
    const allRequiredLoaded = requiredComponents.every(c =>
      results.find(r => r.name === c.name && r.success)
    );

    if (!allRequiredLoaded) {
      console.error('❌ 필수 컴포넌트 로딩 실패!');
      throw new Error('필수 컴포넌트 로딩 실패');
    }

    console.log('✅ 모든 필수 컴포넌트 로딩 성공!');

  } catch (error) {
    console.error('❌ 컴포넌트 초기화 중 오류 발생:', error);

    // 로더 강제 숨김
    if (loaderElement) {
      loaderElement.hide();
    }

    throw error;
  }
}

// DOMContentLoaded 이벤트에서 초기화 실행
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponents);
  } else {
    // 이미 로드된 경우 즉시 실행
    initializeComponents();
  }
}

// HMR 지원 (개발 환경)
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('🔥 HMR: 컴포넌트 업데이트됨');
  });
}
