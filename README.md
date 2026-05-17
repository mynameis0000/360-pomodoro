# 360 POMODORO 🍅 

> 시간을 바라보지 말고, 집중에 몰입하세요.

<br>

## 📌 프로젝트 소개

**360 POMODORO**는
기존 뽀모도로 타이머의 “시간 압박감”을 줄이기 위해 제작된
3D 인터랙티브 집중 타이머입니다.

일반적인 타이머는
남은 시간이 계속 눈에 들어와 집중을 방해합니다.

이 프로젝트는 반대로:

```txt
타이머를 돌려버린다
```

는 아이디어에서 시작되었습니다.

사용자는 3D 타이머를 직접 회전시키며,
시간이 흐르는 시각적 부담을 줄이고
작업 자체에 집중할 수 있습니다.

<br>

---

# ✨ 주요 기능

## 🎮 3D 인터랙션

* 360° 회전 가능
* 드래그 기반 조작
* 관성(Inertia) 회전
* 부드러운 카메라 연출

<br>

## ⏱️ 뽀모도로 시스템

* 사용자 시간 직접 입력
* 실시간 카운트다운
* 남은 시간에 따라 빨간 영역 감소
* 시계 방향 진행 UI

<br>

## 🎬 시네마틱 연출

* 하늘에서 떨어지는 인트로
* 바운스 후 부유(Floating)
* 무게감 있는 움직임
* 제품 광고 스타일 motion

<br>

## 🎨 UI / 디자인

* 미니멀한 레이아웃
* 고대비 무채색 톤
* Glassmorphism 버튼
* 미래적인 제품 쇼케이스 스타일

<br>

---

# 🛠️ 사용 기술

## Frontend

* React
* Vite

## 3D

* Three.js
* React Three Fiber
* @react-three/drei

## Animation

* useFrame
* Spring Physics
* Damping Motion

<br>

---

# 📂 프로젝트 구조

```txt
src/
 ├─ components/
 │   ├─ Clock3D.jsx
 │   ├─ Scene.jsx
 │   ├─ TimerBody.jsx
 │   ├─ TimerFace.jsx
 │   └─ TimerKnob.jsx
 │
 ├─ styles/
 │   └─ global.css
 │
 ├─ App.jsx
 └─ main.jsx
```

<br>

---

# 🚀 실행 방법

## 1. 프로젝트 클론

```bash
git clone <repository-url>
```

<br>

## 2. 폴더 이동

```bash
cd 360-pomodoro
```

<br>

## 3. 패키지 설치

```bash
npm install
```

<br>

## 4. 실행

```bash
npm run dev
```

<br>

---

# 🎯 디자인 철학

이 프로젝트는 단순한 생산성 앱이 아니라,

```txt
“집중을 위한 오브젝트”
```

를 목표로 합니다.

핵심 키워드:

* Slow Motion
* Negative Space
* Cinematic Interaction
* Product Showcase
* Focus Experience

<br>

---

# 🌌 Motion Language

프로젝트의 움직임은 다음 감성에서 영감을 받았습니다.

* Apple
* Nothing
* Teenage Engineering
* SF 인터페이스
* 미래적 제품 광고

<br>

움직임 원칙:

* 과하지 않은 애니메이션
* 천천히 감속하는 관성
* 아주 미세한 Floating
* 묵직한 질량감

<br>

---

# 🔮 앞으로의 계획

* 노브 회전 기반 시간 설정
* 사운드 디자인 추가
* 모바일 인터랙션 최적화
* Bloom / Glow Shader
* 집중 모드 전환 연출
* WebGPU 기반 렌더링 실험

<br>

