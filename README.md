# 🍅 360 POMODORO

> **"시간을 바라보지 말고, 집중에 몰입하세요."**  
> 🔗 **배포 링크:** https://three60-pomodoro.onrender.com

<br>

## 📌 프로젝트 소개

**360 POMODORO**는 기존 뽀모도로 타이머가 주는 특유의 “시간 압박감”을 해소하기 위해 제작된 **3D 인터랙티브 집중 타이머**입니다.

일반적인 타이머는 끊임없이 줄어드는 숫자가 시야에 밟혀 오히려 집중에 방해가 되곤 합니다.  
본 프로젝트는 **"시간이 보기 싫다면, 타이머를 돌려버리자"**는 역발상 인터랙션에서 시작되었습니다.

사용자는 화면 속 3D 타이머를 직접 휙 돌려 뒷면이 보이게 설정함으로써 시각적 부담을 차단하고, 오롯이 현재의 작업 자체에 딥 다이브(Deep Dive)할 수 있습니다.

<br>

---

## ✨ 주요 기능

### 🎮 3D 인터랙션 (3D Interaction)
* **360° 자유 회전:** 마우스 드래그와 터치 스와이프를 통한 전방위 오브젝트 탐색
* **관성(Inertia) 물리:** 손을 떼었을 때 얼음판 위를 미끄러지듯 매끄럽게 회전하는 감각적인 관성 로직 매핑

### ⏱️ 뽀모도로 시스템 (Pomodoro System)
* **직관적인 카운트다운:** 사용자가 설정한 시간에 맞춰 실시간으로 작동하는 타이머
* **시각적 인디케이터:** 남은 시간에 비례해 타이머 내부의 빨간색 영역이 시계 방향으로 자연스럽게 감소하는 직관적인 UI

### 🎬 시네마틱 연출 (Cinematic Motion)
* **드롭 인트로:** 앱 진입 시 하늘에서 3D 시계가 툭 떨어지며 몰입감을 주는 드롭 애니메이션
* **공중 부유(Floating IDLE):** 조작이 없는 대기 상태에서는 시계가 3D 공간 속에 둥실둥실 떠 있는 듯한 쫀득한 바운스 물리 연산 적용

### 🎨 UI / 디자인 (Design System)
* **미니멀 레이아웃:** 3D 오브젝트 자체에 집중할 수 있도록 주변 요소를 배제한 미니멀리즘 인터페이스
* **고대비 모노톤:** 몰입을 깨지 않는 정갈한 무채색 톤앤매너 구성

<br>

---

## 🛠️ 사용 기술 (Tech Stack)

| 분류 | 기술 스택 |
| :--- | :--- |
| **Frontend** | React, Vite |
| **3D Graphics** | Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei` |
| **Animation & Physics** | `useFrame` Loop, Spring Physics, Damping Motion |

<br>

---

## 📂 프로젝트 구조 (Project Structure)

```txt
src/
 ├─ components/
 │   ├─ Clock3D.jsx      # 마우스/터치 관성 물리 및 환경별 조작계 제어 메인 컴포넌트
 │   ├─ Scene.jsx        # 3D 조명 및 캔버스 환경 설정
 │   ├─ TimerBody.jsx    # 타이머 외형 메쉬
 │   ├─ TimerFace.jsx    # 실시간 시간 게이지 및 렌더링 페이스
 │   └─ TimerKnob.jsx    # 상단 아날로그 노브 메쉬
 │
 ├─ styles/
 │   └─ global.css
 │
 ├─ App.jsx
 └─ main.jsx
