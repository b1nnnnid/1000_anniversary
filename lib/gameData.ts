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
  text: string;
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
    challenge: { type: "quiz2", question: "처음 만난 날, 먼저 말을 건 사람은?", options: ["나", "오빠"], answer: 1 },
    place: { kind: "park", name: "처음 만난 공원", desc: "그날처럼 벤치에 나란히 앉았다. 아이스크림은 역시 두 개." } },

  { id: "first-date", order: 2, col: 3, row: 9,
    label: "첫 데이트", title: "첫 데이트", date: "2023.09.20",
    photo: "/photos/sample2.svg",
    text: "둘이 처음 영화를 봤던 날. 가장 좋아하는 사진을 넣어보세요.",
    challenge: { type: "cookie" },
    place: { kind: "cinema", name: "첫 데이트 영화관", desc: "팝콘은 반반. 이번엔 손잡는 데 3분도 안 걸렸다." } },

  // ── 분기: 두 갈래 ──
  { id: "cafe", order: 3, branch: "A", col: 2, row: 15,
    label: "단골 카페", title: "우리 단골 카페", date: "2023.11.02",
    photo: "/photos/sample1.svg",
    text: "자주 가던 그 카페. 왼쪽 길의 추억이에요.",
    challenge: { type: "catch" },
    place: { kind: "cafe", name: "우리 단골 카페", desc: "늘 앉던 그 자리. 사장님이 서비스 쿠키를 주셨다." } },
  { id: "movie-night", order: 3, branch: "B", col: 9, row: 15,
    label: "영화의 밤", title: "같이 본 영화", date: "2023.12.24",
    photo: "/photos/sample2.svg",
    text: "밤새 영화 보던 날. 오른쪽 길의 추억이에요.",
    challenge: { type: "timing" },
    place: { kind: "restaurant", name: "심야 맛집", desc: "영화 보고 나면 역시 야식. 오늘도 둘이 한 그릇 더." } },

  { id: "trip", order: 4, col: 5, row: 22,
    label: "첫 여행", title: "우리의 첫 여행", date: "2024.05.03",
    photo: "/photos/sample3.svg",
    text: "바다를 보러 갔던 1박 2일.",
    challenge: { type: "simon" },
    place: { kind: "beach", name: "그 바닷가", desc: "파도 소리, 모래 위 발자국 두 줄. 또 오자." } },

  { id: "hundred", order: 5, col: 8, row: 29,
    label: "100일", title: "100일 기념", date: "2023.12.19",
    photo: "/photos/sample3.svg",
    text: "벌써 100일이라니. 케이크 불었던 날.",
    challenge: { type: "puzzle" },
    place: { kind: "amusement", name: "놀이동산", desc: "관람차 맨 꼭대기에서 보는 노을. 소원도 빌었다." } },

  { id: "now", order: 6, col: 4, row: 35,
    label: "그리고 지금", title: "그리고 지금", date: "2026.06",
    photo: "/photos/sample1.svg",
    text: "여기까지 함께 걸어와줘서 고마워.",
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

// 커플 퀴즈
export interface QuizQuestion { q: string; options: string[]; answer: number; }
// answer 는 0부터 시작! (첫 번째 보기 = 0)
export const QUIZ: QuizQuestion[] = [
  { q: "우리가 처음 같이 먹은 음식은?", options: ["떡볶이", "파스타", "초밥", "치킨"], answer: 3 },
  { q: "우리의 1일은 며칠일까?", options: ["10월 8일", "10월 7일", "10월 3일", "10월 11일"], answer: 0 },
  { q: "내가 제일 좋아하는 오빠의 모습은?", options: ["웃을 때", "잘 때", "운동할 때", "먹을 때"], answer: 1 },
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
