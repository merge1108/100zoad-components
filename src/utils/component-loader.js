/**
 * Component Loader Utility - 100zoad Web Components
 *
 * 컴포넌트 병렬 로딩 및 성능 측정 유틸리티
 * - Promise.all을 사용한 병렬 로딩
 * - 개별 컴포넌트 로딩 시간 측정
 * - 로딩 진행 상태 추적
 * - 타임아웃 처리
 * - Graceful Degradation (폴백 시스템)
 *
 * @author merge
 * @version 1.1.0
 * @created 2026-01-02
 * @updated 2026-01-02 (STORY-026: Graceful Degradation)
 * @story STORY-025, STORY-026
 */

import { activateFallback } from './fallback-manager.js';

/**
 * 컴포넌트 로딩 결과
 * @typedef {Object} LoadResult
 * @property {string} name - 컴포넌트 이름
 * @property {boolean} success - 로딩 성공 여부
 * @property {number} loadTime - 로딩 시간 (ms)
 * @property {Error} [error] - 오류 (실패 시)
 */

/**
 * 컴포넌트 정의
 * @typedef {Object} ComponentDefinition
 * @property {string} name - 컴포넌트 이름
 * @property {Function} loader - import() 함수
 * @property {number} [timeout=3000] - 타임아웃 (ms)
 * @property {boolean} [required=true] - 필수 컴포넌트 여부
 */

/**
 * 단일 컴포넌트 로딩 (타임아웃 포함)
 *
 * @param {ComponentDefinition} component - 컴포넌트 정의
 * @param {Function} [onProgress] - 진행 상태 콜백
 * @returns {Promise<LoadResult>} 로딩 결과
 *
 * @example
 * const result = await loadComponent({
 *   name: 'header',
 *   loader: () => import('./components/header/header.js'),
 *   timeout: 3000
 * });
 */
export async function loadComponent(component, onProgress = null) {
  const startTime = performance.now();
  const timeout = component.timeout || 3000;

  console.log(`📦 [${component.name}] 로딩 시작...`);

  try {
    // Promise.race를 사용한 타임아웃 처리
    const result = await Promise.race([
      component.loader(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('로딩 타임아웃')), timeout)
      )
    ]);

    const loadTime = performance.now() - startTime;

    console.log(`✅ [${component.name}] 로딩 완료 (${loadTime.toFixed(2)}ms)`);

    if (onProgress) {
      onProgress(component.name, true, loadTime);
    }

    return {
      name: component.name,
      success: true,
      loadTime
    };
  } catch (error) {
    const loadTime = performance.now() - startTime;

    console.error(`❌ [${component.name}] 로딩 실패:`, error.message);

    // STORY-026: Graceful Degradation - 폴백 활성화
    try {
      activateFallback(component.name, error, loadTime);
    } catch (fallbackError) {
      console.error(`❌ [${component.name}] 폴백 활성화 실패:`, fallbackError);
    }

    if (onProgress) {
      onProgress(component.name, false, loadTime);
    }

    return {
      name: component.name,
      success: false,
      loadTime,
      error
    };
  }
}

/**
 * 여러 컴포넌트 병렬 로딩
 *
 * @param {ComponentDefinition[]} components - 컴포넌트 배열
 * @param {Object} options - 옵션
 * @param {Function} [options.onProgress] - 진행 상태 콜백
 * @param {Function} [options.onComplete] - 완료 콜백
 * @param {boolean} [options.failFast=false] - 하나라도 실패 시 전체 중단
 * @returns {Promise<LoadResult[]>} 로딩 결과 배열
 *
 * @example
 * const results = await loadComponentsParallel([
 *   { name: 'header', loader: () => import('./header.js') },
 *   { name: 'footer', loader: () => import('./footer.js') }
 * ], {
 *   onProgress: (name, success, time) => {
 *     console.log(`${name}: ${success ? '성공' : '실패'} (${time}ms)`);
 *   }
 * });
 */
export async function loadComponentsParallel(components, options = {}) {
  const {
    onProgress = null,
    onComplete = null,
    failFast = false
  } = options;

  const totalStart = performance.now();
  const totalCount = components.length;
  let loadedCount = 0;

  console.log(`🚀 ${totalCount}개 컴포넌트 병렬 로딩 시작...`);

  // 진행 상태 추적 래퍼
  const progressWrapper = (name, success, time) => {
    loadedCount++;

    if (onProgress) {
      onProgress(loadedCount, totalCount, name, success, time);
    }

    console.log(`📊 진행: ${loadedCount}/${totalCount} (${Math.round(loadedCount / totalCount * 100)}%)`);
  };

  // 컴포넌트 로딩 프로미스 배열
  const promises = components.map(component =>
    loadComponent(component, progressWrapper)
  );

  let results;

  if (failFast) {
    // Promise.all: 하나라도 실패하면 전체 실패
    results = await Promise.all(promises);
  } else {
    // Promise.allSettled: 모든 결과 반환 (성공/실패 무관)
    const settled = await Promise.allSettled(promises);
    results = settled.map(result =>
      result.status === 'fulfilled' ? result.value : result.reason
    );
  }

  const totalTime = performance.now() - totalStart;
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  console.log(`\n✅ 병렬 로딩 완료!`);
  console.log(`   - 총 시간: ${totalTime.toFixed(2)}ms (${(totalTime / 1000).toFixed(2)}s)`);
  console.log(`   - 성공: ${successCount}/${totalCount}`);
  console.log(`   - 실패: ${failureCount}/${totalCount}`);

  // NFR-001 검증: 3초 이내 로딩
  if (totalTime > 3000) {
    console.warn(`⚠️ NFR-001 위반: 로딩 시간이 3초를 초과했습니다! (${(totalTime / 1000).toFixed(2)}s)`);
  } else {
    console.log(`✅ NFR-001 충족: 로딩 시간 3초 이내 (${(totalTime / 1000).toFixed(2)}s)`);
  }

  if (onComplete) {
    onComplete(results, totalTime);
  }

  return results;
}

/**
 * 컴포넌트 로딩 순차 실행
 * (병렬이 안되는 환경이나 의존성이 있는 경우)
 *
 * @param {ComponentDefinition[]} components - 컴포넌트 배열
 * @param {Function} [onProgress] - 진행 상태 콜백
 * @returns {Promise<LoadResult[]>} 로딩 결과 배열
 *
 * @example
 * const results = await loadComponentsSequential([
 *   { name: 'base', loader: () => import('./base.js') },
 *   { name: 'header', loader: () => import('./header.js') }
 * ]);
 */
export async function loadComponentsSequential(components, onProgress = null) {
  const totalStart = performance.now();
  const results = [];

  console.log(`🔄 ${components.length}개 컴포넌트 순차 로딩 시작...`);

  for (let i = 0; i < components.length; i++) {
    const component = components[i];

    const progressWrapper = (name, success, time) => {
      if (onProgress) {
        onProgress(i + 1, components.length, name, success, time);
      }
    };

    const result = await loadComponent(component, progressWrapper);
    results.push(result);

    // 필수 컴포넌트 실패 시 중단
    if (!result.success && component.required !== false) {
      console.error(`❌ 필수 컴포넌트 [${component.name}] 로딩 실패! 중단합니다.`);
      break;
    }
  }

  const totalTime = performance.now() - totalStart;
  console.log(`✅ 순차 로딩 완료 (${totalTime.toFixed(2)}ms)`);

  return results;
}

/**
 * 로딩 성능 리포트 생성
 *
 * @param {LoadResult[]} results - 로딩 결과 배열
 * @returns {Object} 성능 리포트
 *
 * @example
 * const report = generatePerformanceReport(results);
 * console.table(report.details);
 */
export function generatePerformanceReport(results) {
  const totalTime = results.reduce((sum, r) => sum + r.loadTime, 0);
  const avgTime = totalTime / results.length;
  const maxTime = Math.max(...results.map(r => r.loadTime));
  const minTime = Math.min(...results.map(r => r.loadTime));

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  // 상세 정보
  const details = results.map(r => ({
    컴포넌트: r.name,
    상태: r.success ? '✅ 성공' : '❌ 실패',
    '로딩 시간': `${r.loadTime.toFixed(2)}ms`,
    '500ms 이내': r.loadTime <= 500 ? '✅' : '❌'
  }));

  const report = {
    summary: {
      totalComponents: results.length,
      success: successCount,
      failure: failureCount,
      totalTime: `${totalTime.toFixed(2)}ms`,
      avgTime: `${avgTime.toFixed(2)}ms`,
      maxTime: `${maxTime.toFixed(2)}ms`,
      minTime: `${minTime.toFixed(2)}ms`,
      nfr001Compliant: totalTime <= 3000 // 3초 이내
    },
    details
  };

  return report;
}

/**
 * 로딩 리포트 콘솔 출력
 *
 * @param {LoadResult[]} results - 로딩 결과 배열
 *
 * @example
 * printLoadingReport(results);
 */
export function printLoadingReport(results) {
  const report = generatePerformanceReport(results);

  console.log('\n📊 ==== 로딩 성능 리포트 ====');
  console.log('\n요약:');
  console.table(report.summary);

  console.log('\n상세:');
  console.table(report.details);

  // AC 검증
  console.log('\n✅ Acceptance Criteria 검증:');
  console.log(`   - AC1: 모든 컴포넌트 3초 이내 로딩: ${report.summary.nfr001Compliant ? '✅ 통과' : '❌ 실패'}`);

  const allUnder500 = results.every(r => r.loadTime <= 500);
  console.log(`   - AC2: 컴포넌트 개별 500ms 이내: ${allUnder500 ? '✅ 통과' : '⚠️ 일부 초과'}`);

  console.log('=============================\n');

  // STORY-026: 폴백 리포트 출력
  import('./fallback-manager.js').then(({ printFallbackReport }) => {
    printFallbackReport();
  }).catch(err => {
    console.warn('폴백 리포트 출력 실패:', err);
  });

  return report;
}

// 기본 export
export default {
  loadComponent,
  loadComponentsParallel,
  loadComponentsSequential,
  generatePerformanceReport,
  printLoadingReport
};
