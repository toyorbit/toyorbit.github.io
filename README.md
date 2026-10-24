# ToyOrbit

호기심이 도는 작은 실험실 · Welcome home.

보라색 우주선 해치에서 시작하는 개인 홈페이지입니다.

## 구성

- 입구: 해치 열기 애니메이션과 바로 입장
- 실험실: 프로젝트와 작은 실험
- 보물 선반: 자료와 도구
- 작업 노트: 배우고 만든 기록

## 실행

`index.html`을 브라우저로 열면 됩니다. 설치나 빌드가 필요하지 않습니다.

## GitHub Pages

저장소 이름은 `toyorbit.github.io`를 사용합니다.
Settings → Pages에서 `Deploy from a branch`, `main`, `/ (root)`를 선택합니다.

게시 주소: https://toyorbit.github.io/

## 수정

화면과 스타일, 동작은 `index.html`에서 관리합니다.
공개 소스에 개인 이메일, 실명, 인증정보를 넣지 않습니다.

## 행성 제작소

`planet/`에서 색상 4종, 크기, 고리, 이름을 선택하고 1200 × 1200 PNG로 저장할 수 있습니다. 랜덤 행성 생성도 지원합니다. 입력값은 서버로 전송하지 않습니다.

- `planet/index.html`: 조종석과 미리보기
- `planet/planet.css`: 반응형 화면
- `planet/planet.js`: Canvas 렌더링과 PNG 저장
