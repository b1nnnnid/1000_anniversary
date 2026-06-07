# 우리의 1000일 💗

남자친구와의 1000일을 기념하는 파스텔 픽셀아트 웹앱.
온보딩 → 캐릭터가 **분기 있는 길(스테이지)**을 따라 걸으며 추억을 모으고,
화면 구석 아이콘으로 미니게임(퀴즈·소원권 룰렛)에 들어갑니다. 모바일 우선 디자인.

## 기술 스택
- **Next.js 14** (App Router) + **TypeScript**
- **React + Canvas** : 세로 스크롤 추억탐방 맵 (캐릭터 이동·카메라 추적)
- **Prisma + SQLite** : 진행상황·소원권 저장
- **갈무리(Galmuri)** 픽셀 폰트 / Tailwind

## 처음 실행하기
```bash
# (이전에 설치가 꼬였다면 먼저) node_modules, package-lock.json 삭제
npm install
npx prisma db push      # SQLite DB 생성
npm run dev             # http://localhost:3000
```
> DB 없이도 앱은 켜져요(진행상황 저장만 안 됨).

## 화면 구성
- `/`      온보딩(시작) 화면 → "여행 시작하기"
- `/map`   메인: 세로 스테이지 트레일 추억탐방 + 구석 게임 아이콘
- `/games/quiz`      커플 퀴즈
- `/games/roulette`  소원권 룰렛 + 쿠폰 이미지 저장

## 폴더 구조
```
app/
  page.tsx              온보딩 화면
  map/page.tsx          메인 맵 화면 (HUD + 게임독 + 트레일맵)
  games/quiz | roulette 미니게임
  api/progress | coupons  저장 API
components/
  TrailMap.tsx          ★ 캐릭터 이동·카메라·스테이지 (핵심)
  GameDock.tsx          구석 게임 아이콘 메뉴
  MemoryModal.tsx       추억 팝업
  Celebration.tsx       1000일 도착 폭죽 연출
lib/
  gameData.ts           ★ 추억 스테이지 / 퀴즈 / 소원권 내용
  trail.ts              스테이지를 잇는 길·나무 생성 + 충돌
  pixelArt.ts           픽셀아트 그리기
prisma/schema.prisma    DB 스키마
public/photos/          ★ 커플 사진 (sample 교체)
```

## 내용 바꾸기
- **추억 스테이지**: `lib/gameData.ts`의 `STAGES` 배열 (순서 order, 위치 col/row, 사진, 글).
  같은 `order`에 노드를 2개 두면 길이 두 갈래로 갈라졌다 합쳐집니다(분기).
- **사진**: `public/photos/`에 넣고 `photo` 경로 맞추기.
- **퀴즈 / 소원권**: 같은 파일의 `QUIZ` / `WISHES`.
- **도착지**: `GOAL`. 모든 추억을 모으면 열리고 폭죽이 터집니다.

## 조작
방향키 / WASD / 화면 하단 방향패드. 캐릭터가 스테이지 노드에 서면 추억이 열려요.

## 다음 단계 후보
카드 뒤집기·추억 수집 미니게임, 소원권 보관함, 배포(Vercel · SQLite→Postgres).

> 참고: `components/ExploreMap.tsx`, `lib/mapLayout.ts`는 구버전 잔재라 비워뒀어요. 지워도 됩니다.
