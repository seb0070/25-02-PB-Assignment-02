# 🎬 Netflix-style Movie Demo SPA (React)

GPT를 적극 활용하여 **Netflix와 유사한 UI/UX를 가진 Front-End Demo Single Page Application(SPA)** 을 개발한 프로젝트입니다.  
React + TypeScript 기반으로 구현되었으며, **TMDB API**, **Local Storage**, **CSS Transition & Animation**,  
그리고 **GitHub Pages 정적 배포**까지 포함한 프론트엔드 전체 개발 흐름을 경험하는 것을 목표로 합니다.

  ---

## 🔗 Demo Links

- **GitHub Repository**  
  https://github.com/your-id/pb-assignment-02-react

- **GitHub Pages**  
  https://your-id.github.io/pb-assignment-02-react

  ---

## 🎯 Project Overview

- React 기반 Single Page Application(SPA) 개발
- TMDB API를 활용한 영화 데이터 비동기 처리
- Local Storage를 활용한 사용자 상태 및 위시리스트 관리
- CSS Transition 및 Animation을 활용한 UI/UX 개선
- GPT(ChatGPT)를 활용한 개발 생산성 향상
- GitHub Pages를 통한 정적 웹사이트 배포

  ---

## 🛠 Tech Stack

**Front-End**
- React
- TypeScript
- Vite
- React Router DOM
- Axios

**Styling**
- CSS
- CSS Transition & Animation

**API**
- The Movie Database (TMDB)

**Deployment**
- GitHub Pages
- GitHub Actions

  ---

## ✨ Features
### Authentication
- 로그인 / 회원가입 기능
- 이메일 형식 검증
- 로그인 상태 유지 (Keep Login)
- Local Storage 기반 사용자 정보 저장
- 인증 여부에 따른 라우팅 보호

### Movie Contents
- TMDB API 연동
- 인기 영화 / 현재 상영작 / 검색 / 필터링
- 로딩 상태 표시
- 포스터 Hover 애니메이션

### Wishlist
- 영화 찜 추가 / 삭제 토글
- Local Storage 기반 찜 목록 유지
- Wishlist 페이지에서는 API 호출 없음

### UI / UX
- 페이지 전환 애니메이션
- 로그인 ↔ 회원가입 컴포넌트 전환 효과
- 반응형 웹 디자인

  ---

## 📁 Project Structure

  ```bash
  pb-assignment-02-react/
  ├── public/
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── routes/
  │   ├── utils/
  │   ├── styles/
  │   ├── App.tsx
  │   └── main.tsx
  ├── .env.example
  ├── package.json
  ├── vite.config.ts
  └── README.md
```

---
## 🔐 Environment Variables
VITE_TMDB_API_KEY=your_tmdb_api_key
실제 API Key는 GitHub에 커밋하지 않습니다.

---
## 🚀 Installation & Run
npm install
npm run dev
npm run build
npm run preview

---
## 🌍 Deployment
npm run build
npm run deploy

---
## GitHub Pages 기반 정적 배포
develop 브랜치 사용

---
## 🤖 AI Usage
본 프로젝트는 ChatGPT를 개발 전반에 걸쳐 활용하였습니다.
- 컴포넌트 구조 설계
- 라우팅 구조 설계
- CSS Animation 구현
- Local Storage 설계
- README 문서화 지원

---
## 📱 Responsive Web
모바일 / 태블릿 / 데스크탑 대응
실제 모바일 기기 접속 후 동작 확인 완료

---
## 📌 Notes
본 프로젝트는 학습 및 과제 제출용 데모 사이트입니다.
실제 서비스 목적이 아니며, 상업적 사용을 의도하지 않습니다.

---
## 👨‍💻 Author
Name: YOUR_NAME
Student ID: YOUR_STUDENT_ID
Class: WSD-분반

---
## 📄 License

This project is for educational purposes only.
