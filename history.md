# Pomodoro_cld (집중해!) 개발 히스토리

> 프로젝트 이름이 GlassWatch → Pomodoro_cld로 변경되었습니다 (2026-10-05). 아래 과거 기록의 GlassWatch 표기는 당시 이름입니다.

> 이 저장소의 git 로그에는 커밋이 `72f51c4 first commit` 하나뿐입니다. 그 이전 개발 과정은 커밋 메시지로 복원할 수 없어, 파일 수정 시각(mtime)과 소스 코드 내용을 근거로 재구성했습니다. 날짜/시각은 로컬 파일시스템 타임스탬프 기준입니다.

## 개요

**집중해!(GlassWatch)** 는 Electron 기반의 화면 상시 표시형(always-on-top) 미니 집중 타이머입니다. 화면 구석에 작은 세로 막대그래프 형태로 떠 있으면서 남은 시간을 시각적으로 보여주고, 투명도·크기 조절, 프리셋 시간(5/30/50분) 선택, 커스텀 시간 입력, 완료 시 깜빡임 알림 기능을 제공합니다.

## 타임라인

### 2026-08-24 — 프로젝트 초기화 및 첫 빌드
- `package-lock.json` 생성 (23:18) — Electron / electron-builder 의존성 설치.
- 첫 Windows 실행 파일 `GlassWatch.exe` 빌드 (23:20).
- `preload.js` 작성 (23:38) — `contextBridge`로 `glassWatch` API(투명도, 크기, 닫기, 최소화)를 렌더러에 안전하게 노출하는 구조를 확립.

### 2026-08-25 — PDCA/문서 체계 세팅
- `docs/` 디렉터리 및 PDCA 상태 파일(`.pdca-status.json`) 생성 (03:41) — bkit PDCA 워크플로 연동 (level: Dynamic, phase 1).
- 세션 관리 파일(`docs/.bkit-memory.json`) 생성 (12:42 무렵) — 이후 세션마다 카운트 누적.

### 2026-08-26 — 핵심 UI/로직 구현 및 첫 릴리스 빌드
- `index.html`, `renderer.js`, `styles.css` 작성 (00:10) — 타이머 화면, 막대그래프, 프리셋 버튼, 투명도/크기 슬라이더 등 핵심 UI와 동작 로직 완성.
  - `renderer.js`: 타이머 상태 머신(Ready → Focusing → Paused → Done), `setInterval` 기반 카운트다운, 완료 시 10회 깜빡임 애니메이션, 막대 클릭 시 파랑→빨강→노랑 색상 순환.
- `main.js`, `README.md`, `package.json` 갱신 (21:53) — 창 크기(96×280, 리사이즈 불가), 프레임 없는 투명 창, `alwaysOnTop`(screen-saver 레벨) 유지 로직, 작업표시줄 미표시(`skipTaskbar`) 등 데스크톱 앱 동작을 확정. 앱 이름을 "집중해!"(appId: `com.glasswatch.timer`)로 지정.
- `dist-v10` 빌드 산출물 생성 (21:55) — `electron-builder`로 portable/nsis 타깃 패키징 (`win-unpacked` 포함).

### 2026-08-27 — 버전 관리 시작
- `.gitignore` 추가 (`*.exe`, `.env` 제외 설정).
- **`72f51c4 first commit`** — 저장소 최초 커밋. 이 시점까지의 모든 작업(위 항목들)이 하나의 커밋으로 기록됨.

### 2026-08-29 — 최신 세션
- `docs/.bkit-memory.json` 기준 9번째 세션 시작 (01:22) — 현재 작업 시점.

### 2026-10-05 — 이름 변경, 알림음, 프리셋 변경, 모서리 라운딩 수정
- 프로젝트 이름 GlassWatch → Pomodoro_cld (`package.json` name/author/appId/nsis 산출물명, 창 제목, preload API `window.pomodoro`).
- 종료 시 beep 3회 알림음 추가 (Web Audio API). 상단 왼쪽 `♪` 버튼으로 켜기/끄기, `localStorage`에 저장.
- 프리셋 5/30/50분 → 10/45/60분.
- 크기 조절을 CSS `transform` 대신 `webContents.setZoomFactor`로 변경하고 프레임이 창을 꽉 채우도록 수정 → 어떤 크기에서도 하단 둥근 모서리가 잘리지 않음.

## 현재 기능 요약 (커밋 시점 기준)

- **항상 위 표시**: `BrowserWindow`를 `alwaysOnTop`(screen-saver 레벨)로 설정하고, `blur` 이벤트에서도 재적용하여 다른 창에 가리지 않도록 유지.
- **작업표시줄 비표시**: `skipTaskbar: true`로 별도 창처럼 동작.
- **프리셋/커스텀 타이머**: 5·30·50분 버튼 + 1~999분 커스텀 입력(Enter 지원).
- **진행 시각화**: 세로 막대그래프가 남은 시간 비율만큼 위→아래로 줄어듦.
- **색상 토글**: 막대 클릭 시 파랑→빨강→노랑 순환, 상단 타이틀 색상도 연동.
- **투명도/크기 조절**: 슬라이더로 35~100% 불투명도, 75~135% UI 스케일 조절 (IPC로 메인 프로세스에 전달해 실제 창 크기·투명도 변경).
- **완료 알림**: 타이머 종료 시 창이 10회 깜빡인 후 "Done/Restart" 상태로 고정.
- **빌드**: `npm run dist`로 `electron-builder`를 통해 portable/nsis 두 타깃(`dist-v10/`)으로 패키징.

## 참고

- 향후 변경 이력을 정확히 추적하려면 커밋을 세분화해서 남기는 것을 권장합니다 (현재는 전체 이력이 커밋 1개에 압축되어 있음).
