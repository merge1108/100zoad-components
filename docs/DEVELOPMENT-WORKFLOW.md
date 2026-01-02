# 개발 워크플로우 가이드

100zoad 프로젝트의 표준 개발 워크플로우입니다.

## 📋 스토리 구현 워크플로우

스토리를 구현할 때는 다음 순서를 따릅니다.

### 1. 스토리 시작

```bash
# BMAD 워크플로우 상태 확인
/workflow-status

# 다음 스토리 선택
/dev-story STORY-XXX
```

### 2. 개발 및 테스트

1. **요구사항 분석**
   - 스토리 문서 읽기 (`docs/stories/STORY-XXX.md`)
   - Acceptance Criteria 확인
   - 의존성 확인

2. **코드 구현**
   - 기능 구현
   - 단위 테스트 작성
   - 통합 테스트

3. **로컬 테스트**
   ```bash
   npm run build    # 빌드
   npm run dev      # 개발 서버에서 테스트
   ```

4. **Acceptance Criteria 검증**
   - 각 AC를 하나씩 검증
   - 스토리 문서에 체크 표시

### 3. 문서 업데이트 ⭐ **중요!**

스토리 완료 시 **반드시** 다음 문서들을 업데이트해야 합니다:

#### 3.1. 스토리 문서 (`docs/stories/STORY-XXX.md`)
- [ ] Status를 "Completed"로 변경
- [ ] Completed date 추가
- [ ] Implementation Summary 작성
- [ ] 모든 AC에 체크 표시

#### 3.2. Sprint 상태 (`docs/sprint-status.yaml`)
- [ ] 해당 스토리 status를 "completed"로 변경
- [ ] completed_date 추가
- [ ] completed_points 업데이트

#### 3.3. README.md
- [ ] "최근 완료된 주요 기능" 섹션에 추가
- [ ] "최근 업데이트" 섹션에 날짜별로 추가
- [ ] 진행률 업데이트 (XX/98 포인트)

#### 3.4. CHANGELOG.md
- [ ] [Unreleased] 섹션에 변경사항 추가
- [ ] Added/Changed/Fixed 카테고리 사용
- [ ] 스토리 ID와 간단한 설명 포함

### 4. Git 커밋 및 푸시 ⭐ **필수 루틴!**

**모든 스토리 완료 시 반드시 Git에 푸시합니다.**

```bash
# 1. 변경사항 확인
git status

# 2. 파일 추가
git add src/components/xxx/xxx.js           # 구현 파일
git add docs/sprint-status.yaml             # Sprint 상태
git add docs/stories/STORY-XXX.md           # 스토리 문서
git add README.md                            # README 업데이트
git add CHANGELOG.md                         # 변경 이력

# 3. 커밋 (BMAD 컨벤션)
git commit -m "$(cat <<'EOF'
feat(component): 기능 설명 (STORY-XXX)

주요 변경사항:
- 변경사항 1
- 변경사항 2
- 변경사항 3

Acceptance Criteria (X/X 완료):
✓ AC1: 설명
✓ AC2: 설명
✓ ACX: 설명

Story Points: X
Sprint: X

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"

# 4. 원격 저장소에 푸시 ⭐
git push origin master
```

### 5. 워크플로우 상태 업데이트

```bash
# 워크플로우 상태 확인
/workflow-status

# 다음 스토리로 이동
```

---

## 🔄 표준 Git 루틴

### 커밋 메시지 컨벤션

**형식:**
```
<type>(<scope>): <subject> (STORY-XXX)

<body>

<footer>
```

**Type:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 등

**예시:**
```bash
git commit -m "feat(header): 모바일 햄버거 메뉴 구현 (STORY-006)"
git commit -m "fix(form): 전화번호 하이픈 삽입 버그 수정 (STORY-011)"
git commit -m "docs(sprint): Sprint 4 문서 업데이트"
```

### 푸시 전 체크리스트

스토리 완료 시 **반드시** 다음을 확인:

- [ ] 빌드가 성공하는가? (`npm run build`)
- [ ] 모든 테스트가 통과하는가?
- [ ] 스토리 문서가 업데이트되었는가?
- [ ] Sprint 상태가 업데이트되었는가?
- [ ] README.md가 업데이트되었는가?
- [ ] CHANGELOG.md가 업데이트되었는가?
- [ ] 커밋 메시지가 명확한가?

**모두 체크했다면:**
```bash
git push origin master
```

---

## 📊 스토리 완료 후 체크리스트 템플릿

스토리를 완료할 때마다 이 체크리스트를 사용하세요:

```markdown
## STORY-XXX 완료 체크리스트

### 구현
- [ ] 모든 Acceptance Criteria 충족
- [ ] 빌드 성공 (`npm run build`)
- [ ] 로컬 테스트 완료

### 문서 업데이트
- [ ] `docs/stories/STORY-XXX.md` 완료 처리
- [ ] `docs/sprint-status.yaml` 업데이트
- [ ] `README.md` 업데이트
- [ ] `CHANGELOG.md` 업데이트

### Git
- [ ] 변경사항 커밋
- [ ] 원격 저장소 푸시 완료
- [ ] 워크플로우 상태 확인

### 다음 단계
- [ ] 다음 스토리 선택
```

---

## 🚨 자주 하는 실수

### ❌ 하지 말아야 할 것

1. **스토리 완료 후 푸시하지 않기**
   - 반드시 완료 시마다 푸시!
   - 로컬에만 저장하면 백업 안 됨

2. **문서 업데이트 건너뛰기**
   - README, CHANGELOG 반드시 업데이트
   - 나중에 하려고 하면 잊어버림

3. **Sprint 상태 업데이트 안 함**
   - 진행 상황 추적이 안 됨
   - 팀 커뮤니케이션 문제

4. **여러 스토리를 한 번에 커밋**
   - 스토리마다 개별 커밋
   - 변경 이력 추적 어려움

### ✅ 올바른 방법

1. **스토리 하나 = 커밋 하나 = 푸시 하나**
2. **문서는 즉시 업데이트**
3. **푸시 전 체크리스트 확인**
4. **명확한 커밋 메시지**

---

## 🎯 워크플로우 자동화 (향후 개선)

현재는 수동으로 진행하지만, 향후 다음을 자동화할 수 있습니다:

- [ ] 스토리 완료 시 자동으로 문서 업데이트
- [ ] Git 커밋 메시지 자동 생성
- [ ] 푸시 전 체크리스트 자동 검증
- [ ] CHANGELOG 자동 생성

---

**이 워크플로우를 따르면 프로젝트 진행 상황을 명확히 추적할 수 있습니다!**
