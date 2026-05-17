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

<b>
타이머를 돌려버린다
</b>

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

<br>

## 🎨 UI / 디자인

* 미니멀한 레이아웃
* 고대비 무채색 톤

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


# 🔮 앞으로의 계획

* 노브 회전 기반 시간 설정
* 사운드 디자인 추가
* 모바일 인터랙션 최적화
* Bloom / Glow Shader
* 집중 모드 전환 연출
* WebGPU 기반 렌더링 실험

<br>

