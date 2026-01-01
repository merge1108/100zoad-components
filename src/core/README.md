# 100zoad Core Module

100zoad 웹 컴포넌트 시스템의 핵심 모듈입니다.

## 📦 포함된 모듈

### 1. config-parser.js

Window.CONFIG 전역 객체를 파싱하고 검증하는 중앙 집중식 설정 시스템

**주요 기능:**
- Config 스키마 정의 (TypeScript 타입 정의 포함)
- Config 검증 (`validateConfig()`)
- Config 파싱 및 기본값 병합 (`parseConfig()`)
- 컴포넌트 활성화 확인 (`isComponentEnabled()`)
- 예시 Config 생성 (`getExampleConfig()`)

**사용 예시:**
```javascript
import { parseConfig, isComponentEnabled } from './core/config-parser.js';

const config = parseConfig();
if (isComponentEnabled(config, 'header')) {
  // Header 컴포넌트 로드
}
```

### 2. base-component.js

모든 웹 컴포넌트가 상속받는 베이스 클래스

**주요 기능:**
- Config 로드 로직 공통화
- Shadow DOM 초기화 로직
- 컴포넌트별 커스텀 hook 제공 (`render()`, `attachEvents()`)
- 에러 핸들링 및 Graceful Degradation
- 헬퍼 메서드 제공 (`$()`, `$$()`, `injectStyle()`, `getConfigValue()`)

**사용 예시:**
```javascript
import { BaseComponent } from '../../core/base-component.js';

class HeaderComponent extends BaseComponent {
  constructor() {
    super('header'); // 컴포넌트 이름 전달
  }

  render() {
    return `
      <style>
        :host {
          display: block;
        }
      </style>
      <div>Header Content</div>
    `;
  }

  attachEvents() {
    const button = this.$('.menu-btn');
    button.addEventListener('click', () => {
      // 이벤트 처리
    });
  }
}

customElements.define('zoad-header', HeaderComponent);
```

## 🚀 STORY-001: Config 스키마 정의 및 파싱 시스템

**완료일:** 2026-01-01
**Status:** ✅ 완료

**구현 내용:**
- Window.CONFIG 스키마 정의 (JSDoc 타입 포함)
- Config 검증 로직
- 기본값 fallback 시스템
- 컴포넌트별 활성화 확인 로직

## 🧪 STORY-003: 베이스 웹 컴포넌트 클래스

**완료일:** 2026-01-01
**Status:** ✅ 완료

**구현 내용:**
- BaseComponent 클래스 구현
- Config 로드 로직 공통화
- Shadow DOM 초기화 로직
- 커스텀 hook 메서드 제공 (`render()`, `attachEvents()`)
- 에러 핸들링 및 fallback 로직
- 완전한 JSDoc 문서화

**수용 기준:**
- ✅ BaseComponent 클래스 구현
- ✅ Config 로드 로직 공통화
- ✅ Shadow DOM 초기화 로직
- ✅ 컴포넌트별 커스텀 로직 hook 제공 (render, attachEvents)

## 📚 문서

각 모듈은 완전한 JSDoc 주석을 포함하고 있습니다. IDE에서 자동 완성 및 타입 힌트를 활용할 수 있습니다.

## 🧪 테스트

테스트 컴포넌트: `src/components/test/test-component.js`

개발 서버에서 `http://localhost:3001` 접속 후 "BaseComponent 테스트" 섹션에서 테스트 가능

---

**Created by:** merge
**Date:** 2026-01-01
**BMAD Method:** Phase 4 - Sprint 0
