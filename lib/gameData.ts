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
export type ChallengeType = "quiz2" | "finddiff" | "puzzle" | "cookie" | "timing" | "catch" | "simon";
export interface Challenge {
  type: ChallengeType;
  question?: string;          // quiz2 전용
  options?: [string, string]; // quiz2 전용
  answer?: 0 | 1;             // quiz2 전용 (0부터!)
}

// 상봉 후 스테이지가 변신하는 데이트 장소
export type PlaceKind = "park" | "cinema" | "cafe" | "restaurant" | "beach" | "amusement";
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
  challenge?: Challenge;  // 스테이지 미션 (없으면 바로 추억 열림)
  place?: Place;          // 상봉 후 변신할 데이트 장소
}

// 위(처음 만남)에서 아래(지금)로 이어지는 추억 길.
// order 3 은 두 갈래(분기)로 갈라졌다 다시 합쳐집니다.
export const STAGES: Stage[] = [
  { id: "first-meet", order: 1, col: 6, row: 3,
    label: "처음 만난 날", title: "처음 만난 날", date: "2023.09.18",
    photo: "/photos/sample1.svg",
    text: "어색하게 인사했던 그날. 여기에 그날의 사진과 이야기를 넣어주세요.",
    story: "어색하게 인사하고, 무슨 말을 해야 할지 몰라 괜히 하늘만 봤던 날.\n그런데 헤어질 때쯤엔 벌써 다음에 또 보고 싶어졌어.\n돌아보면 그게 우리 이야기의 첫 페이지였어. 여기에 그날의 사진과 긴 이야기를 적어보세요.",
    challenge: { type: "quiz2", question: "처음 만난 날, 먼저 말을 건 사람은?", options: ["나", "오빠"], answer: 1 },
    place: { kind: "park", name: "처음 만난 공원", desc: "그날처럼 벤치에 나란히 앉았다. 아이스크림은 역시 두 개." } },

  { id: "first-date", order: 2, col: 3, row: 9,
    label: "첫 데이트", title: "첫 데이트", date: "2023.09.20",
    photo: "/photos/sample2.svg",
    text: "둘이 처음 영화를 봤던 날. 가장 좋아하는 사진을 넣어보세요.",
    story: "둘이 처음 영화를 봤던 날.\n팝콘은 반반, 손을 잡을까 말까 고민만 하다 영화가 끝나버렸지.\n그래도 집에 오는 길이 하나도 안 멀게 느껴졌어. 가장 좋아하는 사진과 함께 그날의 기분을 길게 남겨보세요.",
    challenge: { type: "cookie" },
    place: { kind: "cinema", name: "첫 데이트 영화관", desc: "팝콘은 반반. 이번엔 손잡는 데 3분도 안 걸렸다." } },

  // ── 분기: 두 갈래 ──
  { id: "cafe", order: 3, branch: "A", col: 2, row: 15,
    label: "단골 카페", title: "우리 단골 카페", date: "2023.11.02",
    photo: "/photos/sample1.svg",
    text: "자주 가던 그 카페. 왼쪽 길의 추억이에요.",
    story: "자주 가던 그 카페. 늘 앉던 창가 자리에서 시답잖은 얘기로 몇 시간을 보냈어.\n사장님이 우리 얼굴을 다 외울 정도였지.\n별것 아닌 그 시간들이 사실은 제일 행복했던 것 같아.",
    challenge: { type: "catch" },
    place: { kind: "cafe", name: "우리 단골 카페", desc: "늘 앉던 그 자리. 사장님이 서비스 쿠키를 주셨다." } },
  { id: "movie-night", order: 3, branch: "B", col: 9, row: 15,
    label: "영화의 밤", title: "같이 본 영화", date: "2023.12.24",
    photo: "/photos/sample2.svg",
    text: "밤새 영화 보던 날. 오른쪽 길의 추억이에요.",
    story: "밤새 영화를 몰아보던 날.\n무서운 장면에선 서로 더 무서운 척하면서 꼭 붙어 있었어.\n새벽에 시켜 먹은 야식이 그날의 하이라이트였지.",
    challenge: { type: "timing" },
    place: { kind: "restaurant", name: "심야 맛집", desc: "영화 보고 나면 역시 야식. 오늘도 둘이 한 그릇 더." } },

  { id: "trip", order: 4, col: 5, row: 22,
    label: "첫 여행", title: "우리의 첫 여행", date: "2024.05.03",
    photo: "/photos/sample3.svg",
    text: "바다를 보러 갔던 1박 2일.",
    story: "처음으로 멀리 떠났던 1박 2일.\n바다 앞에서 한참을 그냥 앉아 있었어. 별다른 걸 안 했는데도 제일 기억에 남는 여행이야.\n파도 소리랑 모래 위 발자국 두 줄, 그거면 충분했어.",
    challenge: { type: "simon" },
    place: { kind: "beach", name: "그 바닷가", desc: "파도 소리, 모래 위 발자국 두 줄. 또 오자." } },

  { id: "hundred", order: 5, col: 8, row: 29,
    label: "100일", title: "100일 기념", date: "2023.12.19",
    photo: "/photos/sample3.svg",
    text: "벌써 100일이라니. 케이크 불었던 날.",
    story: "벌써 100일이라니, 믿기지 않았던 날.\n작은 케이크에 초를 꽂고 둘 다 같은 소원을 빌었던 것 같아.\n숫자가 늘어가는 게 이렇게 설레는 일인 줄 몰랐어.",
    challenge: { type: "puzzle" },
    place: { kind: "amusement", name: "놀이동산", desc: "관람차 맨 꼭대기에서 보는 노을. 소원도 빌었다." } },

  { id: "now", order: 6, col: 4, row: 35,
    label: "그리고 지금", title: "그리고 지금", date: "2026.06",
    photo: "/photos/sample1.svg",
    text: "여기까지 함께 걸어와줘서 고마워.",
    story: "여기까지 함께 걸어와줘서 고마워.\n특별할 것 없는 하루하루가 모여서 어느새 우리가 됐어.\n앞으로의 날들도 지금처럼 천천히, 같이 걷자. 다음 1000일도 잘 부탁해.",
    challenge: { type: "finddiff" },
    place: { kind: "park", name: "야경 공원", desc: "1000일의 마무리는 천천히 걷기. 다음 1000일도 잘 부탁해." } },
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
export const MARKERS: Marker[] = [
  { id: "s-guide", col: 6, row: 6, kind: "sign", speaker: "🪧 표지판",
    lines: ["여기서부터 둘의 추억 길.", "위에서부터 차례대로 열어야 다음이 열린대!"] },
  { id: "s-thief", col: 6, row: 8, kind: "sign", speaker: "🪧 낡은 표지판",
    lines: ["쉿… 이 근처에 도둑고양이가 산대.", "노란 고양이가 준 티켓을 노린다던데…?"],
    event: "thiefcat" },
  { id: "s-joke1", col: 5, row: 9, kind: "sign", speaker: "🪧 표지판",
    lines: ["주의: 너무 귀여운 커플 출몰 구역.", "심장 약하면 우회하세요 💗"] },
  { id: "s-joke2", col: 4, row: 9, kind: "sign", speaker: "🪧 표지판",
    lines: ["오늘의 운세: 옆 사람이 당신을 좋아함.", "(적중률 100%)"] },
  { id: "g-first", col: 6, row: 4, kind: "ghost", speaker: "👻 과거의 우리",
    lines: ["…처음 만난 날의 우리야.", "무슨 말 할지 몰라서 괜히 하늘만 봤었지 ㅎㅎ"] },
  { id: "g-trip", col: 6, row: 22, kind: "ghost", speaker: "👻 과거의 우리",
    lines: ["바다 보러 가던 날 기억나?", "가는 내내 신나서 떠들었잖아."] },
  { id: "b-bench", col: 8, row: 31, kind: "bench", speaker: "🪑 벤치",
    lines: ["여기 잠깐 앉았다 갈까?", "…역시 네 옆이 제일 편해."] },
];

// 도둑 검은 고양이 이벤트 대사
export const THIEF_STEAL: string[] = ["앗! 검은 고양이다!! 🐈‍⬛", "노란 고양이가 준 티켓 하나를 물고 도망쳤다… 🎟💨"];
export const THIEF_SAFE: string[] = ["…다행히 지금은 훔쳐갈 티켓이 없다.", "검은 고양이가 아쉬운 듯 사라졌다."];

// 길가의 고양이 NPC — 가끔 ❗ 띄우고 다가와서 말을 건다 (스토리형 대화)
export const CAT = { col: 7, row: 18 };

// 처음 만났을 때 (끝나면 🎟 1장 선물)
export const CAT_INTRO: string[] = [
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
    id: "begin", theme: "처음의 우리", emoji: "🌱", desc: "시작하던 그 시절 이야기",
    questions: [
      { q: "우리가 처음 만난 곳은?", options: ["학교", "소개팅", "동아리", "회사"], answer: 1 },
      { q: "우리의 1일은 며칠일까?", options: ["10월 8일", "10월 7일", "10월 3일", "10월 11일"], answer: 0 },
      { q: "우리가 처음 같이 먹은 음식은?", options: ["떡볶이", "파스타", "초밥", "치킨"], answer: 3 },
      { q: "첫 데이트 때 같이 한 것은?", options: ["영화", "전시", "공연", "야구"], answer: 0 },
    ],
  },
  {
    id: "taste", theme: "취향 맞히기", emoji: "🎯", desc: "서로의 취향, 얼마나 알까?",
    questions: [
      { q: "내가 제일 좋아하는 오빠의 모습은?", options: ["웃을 때", "잘 때", "운동할 때", "먹을 때"], answer: 1 },
      { q: "오빠가 제일 좋아하는 음식은?", options: ["고기", "회", "떡볶이", "라면"], answer: 0 },
      { q: "내가 가장 좋아하는 계절은?", options: ["봄", "여름", "가을", "겨울"], answer: 2 },
      { q: "둘이 제일 자주 가는 데이트 코스는?", options: ["카페", "영화관", "공원", "쇼핑"], answer: 0 },
    ],
  },
  {
    id: "days", theme: "기념일과 숫자", emoji: "🔢", desc: "날짜와 숫자에 대한 기억",
    questions: [
      { q: "우리 1주년은 몇 월일까?", options: ["10월", "9월", "11월", "12월"], answer: 0 },
      { q: "100일은 몇 월이었지?", options: ["1월", "12월", "2월", "11월"], answer: 0 },
      { q: "함께한 첫 여행지는?", options: ["바다", "산", "온천", "섬"], answer: 0 },
      { q: "둘 중 생일이 빠른 사람은?", options: ["나", "오빠", "같은 달", "비밀"], answer: 1 },
    ],
  },
  {
    id: "detail", theme: "우리만 아는 디테일", emoji: "💬", desc: "사소하지만 우리만 아는 것들",
    questions: [
      { q: "내가 화났을 때 푸는 방법은?", options: ["맛있는 거", "잠", "산책", "수다"], answer: 0 },
      { q: "오빠 휴대폰 배경화면은?", options: ["우리 사진", "풍경", "캐릭터", "기본"], answer: 0 },
      { q: "우리가 자주 쓰는 애칭은?", options: ["자기", "애기", "여보", "이름"], answer: 1 },
      { q: "헤어지기 전 항상 하는 것은?", options: ["포옹", "사진", "간식", "산책"], answer: 0 },
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
  { title: "애교 3종 세트 시전", emoji: "🐰", weight: 3, kind: "fun" },
  { title: "맛있는 거 사주기", emoji: "🍰", weight: 1, kind: "rare" },
  { title: "꽝! 다음 기회에", emoji: "🤡", weight: 4, kind: "miss" },
  { title: "안마 30분 쿠폰", emoji: "💆", weight: 2, kind: "mid" },
  { title: "오늘 설거지 당번", emoji: "🧽", weight: 3, kind: "fun" },
];

// 상봉 직후 고양이의 축하 + 게임 안내
export const CAT_CONGRATS: string[] = [
  "냐옹!! 해냈구나. 둘 다 축하한다냥!! 🎉",
  "이제 이 세계 전체가 둘의 데이트 코스가 됐다냥.",
  "큼직해진 건물에 들어가면 데이트를 즐길 수 있다냥.",
  "그리고... 잠겨있던 ❓퀴즈와 🎁룰렛도 열렸다냥!",
  "여행하면서 모은 티켓 🎟 으로 룰렛을 돌려보라냥.",
  "그럼 다음 1000일도 잘 부탁한다냥~ 🌸",
];
