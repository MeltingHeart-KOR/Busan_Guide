# 🚇 부산 지하철 가이드 (BUSAN GUIDE)

<div align="center">

부산의 대중교통을 쉽게 이해할 수 있는 인터랙티브 웹 가이드

</div>

---

## 📋 프로젝트 개요

BUSAN GUIDE는 부산 지하철 노선도와 주요 역 정보를 시각적으로 제공하는 비상업적 교육용 포트폴리오 프로젝트입니다. 부산 도시철도 공사나 공식 관광 기관과는 관련이 없습니다.

### ✨ 주요 기능

- 🗺️ **인터랙티브 지하철 노선도**: 부산 지하철 전 노선을 시각적으로 탐색
- 🎯 **주요 역 정보**: 인기 역의 상세 정보와 주변 관광지 안내
- 🎨 **모던한 UI/UX**: 직관적인 사용자 인터페이스와 부드러운 애니메이션
- 📱 **반응형 디자인**: 모든 디바이스에서 최적의 사용 경험 제공

---

## 🛠️ 기술 스택

### 프론트엔드
- **React 19** - 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안전한 JavaScript 개발
- **Vite** - 빠른 개발 서버 및 빌드 도구

### 스타일링
- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **Google Fonts** - Instrument Serif, Shippori Mincho, M PLUS Rounded 1c

### 애니메이션
- **Motion (Framer Motion)** - 선언적 애니메이션 라이브러리
- **GSAP** - 고성능 애니메이션 플랫폼

### 개발 도구
- **Oxlint** - 빠른 JavaScript/TypeScript 린터
- **ESLint** - 코드 품질 검사

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 리포지토리 클론
git clone <repository-url>
cd Busan_Guide

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview
```

---

## 📁 프로젝트 구조

```
Busan_Guide/
├── public/              # 정적 리소스
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── Nav.tsx      # 네비게이션
│   │   ├── Hero.tsx     # 메인 히어로 섹션
│   │   ├── Intro.tsx    # 소개 섹션
│   │   ├── PickUpSection.tsx  # 추천 역 섹션
│   │   ├── MetroMapSection.tsx # 지하철 노선도 섹션
│   │   └── Footer.tsx   # 푸터
│   ├── App.tsx          # 메인 앱 컴포넌트
│   ├── main.tsx         # 엔트리 포인트
│   └── index.css        # 전역 스타일
├── index.html           # HTML 템플릿
├── package.json         # 프로젝트 설정
├── tsconfig.json        # TypeScript 설정
├── vite.config.ts       # Vite 설정
└── tailwind.config.js   # Tailwind CSS 설정
```

---

## 🎨 컴포넌트 아키텍처

- **Nav**: 사이트 네비게이션 및 메뉴
- **Hero**: 메인 비주얼 섹션
- **Intro**: 프로젝트 소개 및 개요
- **PickUpSection**: 추천 역 및 관광지 정보
- **MetroMapSection**: 인터랙티브 지하철 노선도
- **Footer**: 사이트 푸터 및 연락처 정보
- **PlusGrid**: 배경 그리드 효과

---

## 📄 라이선스 및 저작권

### 사진/이미지
- 대부분의 사진은 [Unsplash](https://unsplash.com)에서 제공받았으며 [Unsplash License](https://unsplash.com/license)에 따라 상업적/비상업적 사용이 허용됩니다.
- 온천장역 사진(`public/pages/oncheonjang.jpg`)은 Abasaa가 Wikimedia Commons에 공개한 [Hurshimchung 01.JPG](https://commons.wikimedia.org/wiki/File:Hurshimchung_01.JPG)로 퍼블릭 도메인(PD-self)에 속합니다.

### 폰트
- Instrument Serif, Shippori Mincho, M PLUS Rounded 1c는 Google Fonts를 통해 제공되며 [SIL Open Font License](https://scripts.sil.org/OFL)에 따라 라이선스됩니다.

### 코드
- 이 프로젝트는 교육 목적으로 제작되었습니다.

---

## 🔧 개발 참고사항

### Oxlint 설정 확장

프로덕션 애플리케이션 개발 시 타입 인식 린트 규칙을 활성화하려면 `oxlint-tsgolint`를 설치하고 `.oxlintrc.json`을 수정하세요:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

자세한 규칙 목록은 [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules)를 참조하세요.

### React Compiler

이 템플릿에서는 React Compiler가 개발 및 빌드 성능에 미치는 영향으로 인해 활성화되지 않았습니다. 추가 방법은 [React Compiler 설치 문서](https://react.dev/learn/react-compiler/installation)를 참조하세요.

---

## 🤝 기여

이 프로젝트는 교육용 포트폴리오로 제작되었습니다. 버그 리포트나 기능 제안은 환영합니다.

---

## 📞 연락처

프로젝트에 대한 문의사항은 이슈를 통해 남겨주세요.

---

<div align="center">

Made with ❤️ for Busan travelers

</div>
