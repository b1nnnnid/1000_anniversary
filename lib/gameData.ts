// ============================================================
//  여기만 고치면 추억 스테이지 / 퀴즈 / 소원권 내용이 바뀝니다
//  (사진은 public/photos/ 에 넣고 photo 경로만 맞춰주세요)
// ============================================================

export const TILE = 32;
export const WORLD_COLS = 12;   // 가로 (모바일 폭, 12칸 = 384px)
export const WORLD_ROWS = 46;   // 세로 (위=처음 → 아래=1000일, 길게)

// 스테이지 미션: 추억이 열리기 전에 뜨는 작은 게임 (성공 시 🎟 1장, 스테이지당 1회)
//  quiz2    = 2지선다 기억력 문제
//  finddiff = 사진 두 장 중 오른쪽에 몰래 숨겨진 하트 3개 찾기
//  puzzle   = 사진 3x3 조각 퍼즐 (두 조각씩 눌러 교체)
//  runner   = 쿠키런식 점프 러너 (탭으로 장애물 넘어 끝까지 달리기, 10~20초)
//  snowman  = 눈사람 만들기 (스윙하는 눈덩이를 3단으로 쌓기)
//  rockbreak= 바위 깨기 (광클로 픽셀 바위를 깎아 추억 사진 드러내기)
export type ChallengeType = "quiz2" | "finddiff" | "puzzle" | "cookie" | "timing" | "catch" | "simon" | "runner" | "snowman" | "rockbreak";
export interface Challenge {
  type: ChallengeType;
  question?: string;          // quiz2 전용
  options?: [string, string]; // quiz2 전용
  answer?: 0 | 1;             // quiz2 전용 (0부터!)
}

// 상봉 후 스테이지가 변신하는 데이트 장소
export type PlaceKind = "park" | "cinema" | "cafe" | "restaurant" | "beach" | "amusement"
  | "izakaya" | "christmas" | "hotel" | "travel" | "hangang";
export interface Place { kind: PlaceKind; name: string; desc: string; }

export interface Stage {
  id: string;
  order: number;          // 진행 순서 (위→아래)
  col: number;            // 노드 타일 좌표
  row: number;
  branch?: "A" | "B";     // 같은 order에 분기 두 갈래일 때
  label: string;          // 가까이 가면 뜨는 말풍선
  title: string;          // 추억 모달 제목
  date?: string;
  photo?: string;         // /photos/xxx
  text: string;           // 수집할 때 사진 밑에 뜨는 짧은 설명
  story?: string;         // 추억 앨범에서 보는 긴 글 (없으면 text 를 그대로 보여줌)
  past?: string;          // 추억 모달 사진 옆에 둥둥 뜨는 '과거의 우리' 한마디
  challenge?: Challenge;  // 스테이지 미션 (없으면 바로 추억 열림)
  place?: Place;          // 상봉 후 변신할 데이트 장소
}

// 위(처음 만남)에서 아래(지금)로 이어지는 추억 길.
// order 3 은 두 갈래(분기)로 갈라졌다 다시 합쳐집니다.
export const STAGES: Stage[] = [
  { id: "first-meet", order: 1, col: 6, row: 3,
    label: "우리의 처음", title: "우리의 처음", date: "2023.09.30",
    photo: "/photos/stage-01-firstmeet.jpg",
    text: "오빠가 그려준 첫 우리 그림! 이때는 지금처럼 납작하진 않았는데.",
    story: "이때 술 마시면서 무슨 얘기 했었는지 기억 나? 난 이때두 너무 설렜는뎅 ㅎㅎ 옵빠가 막 나 예쁘다 하고 ~~ 남자친구 되면 어떨 거 같냐고 하구 ~~~ 이이잉 부끄렁!!",
    past: "우리 같은 마음 맞지?",
    challenge: { type: "runner" },
    place: { kind: "izakaya", name: "골뱅이상회", desc: "너무 뚝딱거려서 사실 일어나서 이불킥 했었어 ㅎㅎ" } },

  { id: "first-date", order: 2, col: 3, row: 9,
    label: "첫 나들이", title: "첫 나들이", date: "2023.10.27",
    photo: "/photos/stage-02-fisrtdate.jpg",
    text: "사귀고 처음으로 하늘공원 나들이! 이땐 솔직히 좀 어색했던 거 같애 ㅎㅎ",
    story: "어색하고 부끄럽지만 그만큼 기억에 남은 데이트! 이 날 같이 찍어달라고 한 사진 보면 그렇게 머쓱할 수가 없숩 ㅋㅋㅋ 저 날 입으려고 초록색 니트도 새로 샀던 건뎅... ㅎㅎ 막 부끄러워서 사진 못 찍던 거랑 해 지고 같이 계단 내려가던 기억도 선명해!",
    past: "우리 잘 만날 수 있겠지?",
    challenge: { type: "cookie" },
    place: { kind: "park", name: "첫 나들이 하늘공원", desc: "무슨 정신으로 떠들었는지 기억도 잘 안 나!" } },

  // ── 분기: 두 갈래 ──
  { id: "cafe", order: 3, branch: "A", col: 2, row: 15,
    label: "첫 크리스마스", title: "첫 크리스마스", date: "2023.12.25",
    photo: "/photos/stage-03a-christmas.jpg",
    text: "우리 함께 보낸 첫 겨울, 첫 크리스마스!",
    story: "예뻐보이겠다고 원피스에 코트 걸치고 나갔어도 추운 줄도 몰랐는데 ㅎㅎㅎ 이때 밥 먹고 일어나서 목도리 두르던 오빠가 엄청 잘생겨 보여써 이잉... 이제 커플 목도리가 됐지!",
    past: "춥지도 않은가봐..",
    challenge: { type: "snowman" },
    place: { kind: "christmas", name: "설레이던 첫 겨울", desc: "사장님이 막 뽀뽀시킨 거 지금 보니 나쁘지 않을지두." } },
  { id: "movie-night", order: 3, branch: "B", col: 9, row: 15,
    label: "친해졌다!", title: "친해졌다!", date: "2024.01.24",
    photo: "/photos/stage-03b-ugly.jpg",
    text: "처음으로 같이 엽사 찍은 날~ 어색하더니 제법 친해졌나봐!",
    story: "나 원래 사진 찍는 거 엄청엄청 부끄러워 하는데, 오빠가 맨날 카메라 들이미니까 쪼끔 익숙해졌나봐 ㅋㅋㅋ 이제는 엽사만 한가득인 우리... 풋풋했네",
    past: "조금 편해진 것 같아!",
    challenge: { type: "timing" },
    place: { kind: "hotel", name: "함께 잠든 밤", desc: "우리가 점점 더 가까워지는 시간이야~" } },

  { id: "trip", order: 4, col: 5, row: 22,
    label: "첫 여행", title: "첫 여행", date: "2024.03.09",
    photo: "/photos/stage-04-trip.jpg",
    text: "첫 여행 일본! 오빠 덕분에 굵직한 경험을 했지 ㅎㅎㅎ",
    story: "조금 힘들었지만 그만큼 기억에 남는 것도, 재밌는 것도 많았어! 오빠랑 며칠 동안 붙어있어서 더더 좋았어 ㅎㅎ 다음엔 다른 나라도 오빠랑 가보구 시퍼잉",
    past: "4박 5일이라니!",
    challenge: { type: "simon" },
    place: { kind: "travel", name: "오사카로 여행", desc: "첫 해외여행을 함께 와서 행복해~!" } },

  { id: "hundred", order: 5, col: 8, row: 29,
    label: "200일", title: "200일", date: "2024.04.24",
    photo: "/photos/stage-05-200days.jpg",
    text: "200일 기념 서프라이즈! ㅎㅎ 첨으로 좀 기념일 느낌이었던 거 같애.",
    story: "여기는 왠지 오빠랑 막 풋풋하고 첨 기념일 느낌 내고 했어서 나중에 한 번쯤 다시 가보구 시퍼. 그때도 같이 가줄 거지?",
    past: "우리가 벌써 200일이래!",
    challenge: { type: "puzzle" },
    place: { kind: "restaurant", name: "200일 기념 맛집", desc: "오빠랑 먹어서 더 맛있었어!" } },

  { id: "now", order: 6, col: 4, row: 35,
    label: "그리고 지금", title: "그리고 지금", date: "2026.06",
    photo: "/photos/stage-06-now.jpg",
    text: "여기까지 나와 함께 해줘서 고마워, 사랑해!",
    story: "이렇게 긴 시간 오빠와 함께하게 될 줄 몰랐는데, 너무 놀랍고 기뻐 ㅎㅎ 우리 지금까지 서로 많이 아껴왔듯이 앞으로도 서로 배려하고 사랑하자! 내 소중한 옵빵이... 앞으로도 잘 부탁해 !!",
    past: "우리가 1000일이라고?",
    challenge: { type: "rockbreak" },
    place: { kind: "hangang", name: "날 좋을 땐 한강", desc: "매년 따뜻해지고 시원해질 때마다 또 같이 오자!" } },
];

// 마지막 도착지 (모든 추억을 모으면 열림 → 폭죽 연출)
export const GOAL = { col: 6, row: 41, label: "1000일 ♥" };

// 맵에 숨겨진 하트 조각 (풀숲을 탐험해서 줍기, 5개 = 🎟 1장)
export const HEARTS_PER_TICKET = 5;
export const HEART_PIECES: { id: string; col: number; row: number }[] = [
  { id: "h0", col: 2, row: 5 },
  { id: "h1", col: 9, row: 7 },
  { id: "h2", col: 10, row: 12 },
  { id: "h3", col: 1, row: 18 },
  { id: "h4", col: 10, row: 20 },
  { id: "h5", col: 1, row: 27 },
  { id: "h6", col: 10, row: 31 },
  { id: "h7", col: 3, row: 38 },
];

// ── 길가의 표지판 · 과거의 우리 · 벤치 (걸어가 닿으면 말을 건다) ──
//   col,row 는 모두 길(PATH) 위의 칸이라 걷다가 자연히 밟게 됩니다.
export type MarkerKind = "sign" | "ghost" | "bench";
export interface Marker {
  id: string; col: number; row: number; kind: MarkerKind;
  speaker: string; lines: string[];
  event?: "thiefcat"; // 특수 이벤트(도둑 검은 고양이)
}
//   길을 따라 멀찍멀찍 떨어뜨려 둠. 도둑고양이 표지판은 중반 이후(여행 구간) 배치.
export const MARKERS: Marker[] = [
  { id: "s-guide", col: 6, row: 6, kind: "sign", speaker: "🪧 표지판",
    lines: ["여기서부터 둘의 추억 길.", "위에서부터 차례대로 열어야 다음이 열린대!"] },
  { id: "s-joke1", col: 3, row: 12, kind: "sign", speaker: "🪧 표지판",
    lines: ["주의: 너무 귀여운 커플 출몰 구역.", "심장 약하면 우회하세요 💗"] },
  { id: "b-bench", col: 8, row: 31, kind: "bench", speaker: "🪑 벤치",
    lines: ["여기 잠깐 앉았다 갈까?", "…역시 오빠 옆이 제일 편해!"] },
  { id: "s-thief", col: 5, row: 26, kind: "sign", speaker: "🪧 낡은 표지판",
    lines: ["쉿… 이 근처에 도둑고양이가 산대.", "노란 고양이가 준 티켓을 노린다던데…?"],
    event: "thiefcat" },
  { id: "s-joke2", col: 4, row: 39, kind: "sign", speaker: "🪧 표지판",
    lines: ["오늘의 운세: 옆 사람이 당신을 좋아함.", "(적중률 100%)"] },
];

// 도둑 검은 고양이 이벤트 대사
export const THIEF_STEAL: string[] = ["앗! 검은 고양이다!! 🐈‍⬛", "노란 고양이가 준 티켓 하나를 물고 도망쳤다… 🎟💨"];
export const THIEF_SAFE: string[] = ["…다행히 지금은 훔쳐갈 티켓이 없다.", "검은 고양이가 아쉬운 듯 사라졌다."];

// 길가의 고양이 NPC — 가끔 ❗ 띄우고 다가와서 말을 건다 (스토리형 대화)
export const CAT = { col: 7, row: 18 };

// 처음 만났을 때 (끝나면 🎟 1장 선물)
export const CAT_INTRO: string[] = [
  "...큼큼!",
  "숯댕이가 시켜서 인사하러 왔다냥.",
  "냐옹! 깜짝 놀랐냥?",
  "이 길은 너희 둘의 추억으로 만들어진 길이다냥.",
  "위에서부터 차례대로 열어야 다음 추억이 열린다냥.",
  "심심하면 풀숲도 뒤져보라냥. 반짝이는 게 숨어있다냥.",
  "만난 기념으로 이거 하나 주겠다냥. 🎟",
];

// 그 뒤로 가끔 다가와서 하는 수다 (랜덤 시퀀스)
export const CAT_EVENTS: string[][] = [
  ["또 만났네냥.", "갈림길은 양쪽 다 가봤냥?", "안 가본 길에 추억이 잠들어 있을지도 모른다냥."],
  ["저어기 길 끝에서 누가 기다리고 있다냥.", "근데 추억을 전부 모아야 만날 수 있다냥. 힘내라냥."],
  ["하트 조각은 풀숲 구석에 잘 숨는다냥.", "구석진 곳일수록 좋은 게 있다냥."],
  ["1000일이라니, 인간들 대단하다냥.", "난 츄르 1000개가 더 좋다냥."],
  ["둘이 같이 걸으면 길이 분홍빛이 된다는 전설이 있다냥.", "...진짠지 확인해보라냥."],
];

// 커플 퀴즈 — 테마별 세트. 세트를 통과하면 세트당 딱 한 번만 티켓을 줍니다.
//  (절반 이상 = 🎟 1장 / 만점 = 🎟 2장, 보상은 최초 통과 시 1회)
//  answer 는 0부터 시작! (첫 번째 보기 = 0). 정답은 둘만 아는 내용으로 자유롭게 고치세요.
export interface QuizQuestion { q: string; options: string[]; answer: number; }
export interface QuizSet {
  id: string;
  theme: string;     // 세트 제목
  emoji: string;
  desc?: string;     // 세트 한 줄 소개
  questions: QuizQuestion[];
}

export const QUIZ_SETS: QuizSet[] = [
  {
    id: "begin", theme: "우리의 처음, 얼마나 기억나?", emoji: "🌱", desc: "시작하던 그 시절 이야기",
    questions: [
      { q: "오빠가 본 내 첫인상은?", options: ["알바생1", "MZ", "곧 사랑하는 내 여자친구가 되겠군", "기억 안 남"], answer: 2 },
      { q: "우리의 1일은 며칠일까?", options: ["10월 8일", "10월 7일", "10월 3일", "10월 11일"], answer: 0 },
      { q: "우리가 처음 같이 먹은 음식은?", options: ["떡볶이", "파스타", "초밥", "치킨"], answer: 3 },
      { q: "첫 데이트 때 같이 한 것은?", options: ["영화", "산책", "카페", "드라이브"], answer: 0 },
    ],
  },
  {
    id: "taste", theme: "이제 취향은 다 알지?", emoji: "🎯", desc: "서로의 취향, 얼마나 알까?",
    questions: [
      { q: "내가 제일 좋아하는 오빠의 모습은?", options: ["웃을 때", "잘 때", "운동할 때", "먹을 때"], answer: 1 },
      { q: "오빠가 제일 좋아하는 음식은?", options: ["파인애플 볶음밥", "민트초코", "마라탕 3단계", "캬라멜 팝콘"], answer: 0 },
      { q: "오빠 얼굴에서 내가 가장 좋아하는 부위는?", options: ["T존", "콧구멍", "눈", "인중에 콩알수염"], answer: 1 },
      { q: "내가 제일 좋아하는 오빠 냄새는?", options: ["땀냄새", "향수냄새", "살냄새", "발냄새"], answer: 2 },
    ],
  },
  {
    id: "days", theme: "나에 대해 맞춰봐~", emoji: "🔢", desc: "나에 대한 기억",
    questions: [
      { q: "나는 여사친을 어디까지 봐줄까?", options: ["단둘이 밥", "단둘이 술", "단둘이 카페", "아무튼 안됨"], answer: 3 },
      { q: "내가 가장 빡친 순간은?", options: ["운다", "쏘아붙인다", "정색한다", "집에 간다"], answer: 2 },
      { q: "내가 가장 좋아하는 스킨쉽은?", options: ["손잡기", "날갯죽지 고랑에 머리 쏙 파묻고 껴안기", "팔짱끼기", "발박수치기"], answer: 1 },
      { q: "이 퀴즈를 만들고 있는 내 표정은?", options: ["심각하게 고민중", "싱글벙글 유감자", "두근두근 기대중", "귀찮아서 오열중"], answer: 0 },
    ],
  },
  {
    id: "detail", theme: "우리만 아는 디테일", emoji: "💬", desc: "사소하지만 우리만 아는 것들",
    questions: [
      { q: "내가 화났을 때 푸는 방법은?", options: ["푸파하기", "자기", "노래방 가기", "음악 듣기"], answer: 1 },
      { q: "나에게 가장 큰 애정표현 방법은?", options: ["붙어있기", "애교부리기", "냄새맡기", "꿈에 나오기"], answer: 2 },
      { q: "만약 내가 연상, 오빠가 연하였다면?", options: ["완전 어른 여자, 연상의 맛", "그래도 귀엽다", "지금이랑 비슷할듯", "그럴 일 없다"], answer: 0 },
      { q: "만약 권태기가 온다면?", options: ["ok! 쿨하게 헤어진다", "이럴 순 없어 노력해본다", "그런 일은 안 일어난다", "둘 중 하나 숙청한다"], answer: 3 },
    ],
  },
];

// 소원권 룰렛: weight = 칸 크기. 좁은 칸(1)엔 좋은 보상, 넓은 칸(3~4)엔 웃긴 벌칙!
// 당첨 확률은 칸 크기에 비례합니다.
export type WishKind = "rare" | "mid" | "fun" | "miss";
export interface Wish { title: string; emoji: string; weight: number; kind: WishKind; }

export const WISHES: Wish[] = [
  { title: "소원 하나 들어주기", emoji: "⭐", weight: 1, kind: "rare" },
  { title: "엉덩이로 이름 쓰기", emoji: "🍑", weight: 3, kind: "fun" },
  { title: "데이트 메뉴 선정권", emoji: "🍽️", weight: 1, kind: "rare" },
  { title: "고양이 소리로 노래 부르기", emoji: "🐱", weight: 3, kind: "fun" },
  { title: "맛있는 거 사주기", emoji: "🍰", weight: 1, kind: "rare" },
  { title: "꽝! 다음 기회에", emoji: "🤡", weight: 4, kind: "miss" },
  { title: "시키는 거 성대모사", emoji: "💬", weight: 2, kind: "mid" },
  { title: "리버스 벌칙(오빠가 하기)", emoji: "🫨", weight: 3, kind: "fun" },
];

// 상봉 직후 고양이의 축하 + 게임 안내
export const CAT_CONGRATS: string[] = [
  "냐옹!! 해냈구나. 둘 다 축하한다냥!! 🎉",
  "이제 이 세계 전체가 둘의 데이트 코스가 됐다냥.",
  "큼직해진 건물에 들어가면 데이트를 즐길 수 있다냥.",
  "그리고... 아직 즐길거리가 많다냥! <우리집>에 가보면❓퀴즈와 🎁룰렛도 있다냥!",
  "여행하면서 모은 티켓 🎟 으로 마음껏 즐겨보라냥.",
  "그럼 다음 1000일도 잘 부탁한다냥~ 🌸",
];
