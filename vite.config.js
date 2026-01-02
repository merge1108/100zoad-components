import { defineConfig } from 'vite';
import path from 'path';

/**
 * Vite Configuration for 100zoad Components
 *
 * 아키텍처 요구사항:
 * - ES2020+ 번들링
 * - 컴포넌트별 독립 빌드
 * - Cloudflare Pages 배포 최적화
 */

export default defineConfig({
  // 개발 서버 설정
  server: {
    port: 3000,
    open: true,
    host: true, // 네트워크 접근 허용
  },

  // 빌드 설정
  build: {
    // Cloudflare Pages dist 폴더 사용
    outDir: 'dist',

    // ES2020+ 타겟 (아키텍처 명세)
    target: 'es2020',

    // 소스맵 생성 (프로덕션에서는 false로 변경 권장)
    sourcemap: import.meta.env?.DEV || false,

    // 압축 설정 (esbuild 사용 - 더 빠름)
    minify: 'esbuild',

    // 번들 크기 경고 임계값 (500KB)
    chunkSizeWarningLimit: 500,

    // CSS 코드 분할
    cssCodeSplit: true,

    // 최적화 옵션
    reportCompressedSize: true, // gzip 압축 후 크기 리포트

    // Rollup 옵션
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        // STORY-025: 컴포넌트별 청크 분리 (병렬 로딩 최적화)
        manualChunks: (id) => {
          // 컴포넌트별 청크 분할
          if (id.includes('/components/header/')) {
            return 'header';
          }
          if (id.includes('/components/footer/')) {
            return 'footer';
          }
          if (id.includes('/components/form/')) {
            return 'form';
          }
          if (id.includes('/components/quickmenu/')) {
            return 'quickmenu';
          }
          if (id.includes('/components/mobile-nav/')) {
            return 'mobile-nav';
          }
          if (id.includes('/components/loader/')) {
            return 'loader';
          }

          // Core 라이브러리 별도 청크 (캐싱 최적화)
          if (id.includes('/core/')) {
            return 'core';
          }

          // Utils 유틸리티 별도 청크
          if (id.includes('/utils/')) {
            return 'utils';
          }

          // node_modules는 vendor 청크로
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },

        // 파일명 패턴 (해시 추가로 캐시 무효화)
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },

    // esbuild 최적화 옵션
    esbuildOptions: {
      // 불필요한 console.log 제거 (프로덕션)
      drop: import.meta.env?.PROD ? ['console', 'debugger'] : [],

      // Tree shaking 최적화
      treeShaking: true,
    },
  },

  // 경로 별칭
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@core': path.resolve(__dirname, './src/core'),
    },
  },

  // 플러그인 (필요시 추가)
  plugins: [],
});
