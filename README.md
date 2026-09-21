# 개발자를 숨겼다!!

브라우저에서 바로 실행되는 캐주얼 추리 게임 MVP입니다.

## 기능
- 사무실 이미지 기반 탐색
- 7명의 NPC 클릭/대화
- 단서 수집
- 의심 캐릭터 표시
- 3분 제한시간
- 개발자 지목
- 정답/오답/게임오버
- 모바일 반응형 UI

## 로컬 실행
이 프로젝트는 빌드 과정이 필요 없는 정적 웹사이트입니다.

가장 간단한 방법:
1. 이 폴더를 VS Code로 엽니다.
2. `index.html`을 Live Server로 실행합니다.

또는 Python이 있다면:
```bash
python -m http.server 8000
```
그 후 `http://localhost:8000` 접속.

## GitHub에 올리기

```bash
git init
git add .
git commit -m "Initial game prototype"
git branch -M main
git remote add origin https://github.com/YOUR_ID/find-the-developer.git
git push -u origin main
```

## GitHub Pages 배포

GitHub 저장소에서:

Settings → Pages → Build and deployment

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

Save 후 잠시 기다리면 GitHub Pages URL이 생성됩니다.

## 주의
현재 게임은 외부 서버/DB 없이 동작하는 프론트엔드 MVP입니다.
점수 저장, 랭킹, 여러 스테이지, 사용자 로그인 등을 추가하려면 백엔드 또는 Firebase/Supabase 같은 서비스를 붙이면 됩니다.
