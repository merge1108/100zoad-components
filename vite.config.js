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

    // 소스맵 생성 (디버깅용)
    sourcemap: true,

    // 압축 설정 (esbuild 사용 - 더 빠름)
    minify: 'esbuild',

    // 번들 크기 경고 임계값 (500KB)
    chunkSizeWarningLimit: 500,

    // Rollup 옵션
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        // 컴포넌트별 청크 분리
        manualChunks: {
          // 향후 컴포넌트가 추가되면 여기에 정의
          // 'header': ['./src/components/header/header.js'],
          // 'footer': ['./src/components/footer/footer.js'],
          // 'form': ['./src/components/form/form.js'],
          // 'quickmenu': ['./src/components/quickmenu/quickmenu.js'],
          // 'mobile-nav': ['./src/components/mobile-nav/mobile-nav.js'],
        },
      },
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
