// ============================================================
//  여기만 고치면 추억 스테이지 / 퀴즈 / 소원권 내용이 바뀝니다
//  (사진은 public/photos/ 에 넣고 photo 경로만 맞춰주세요)
// ============================================================

export const TILE = 32;
export const WORLD_COLS = 12;   // 가로 (모바일 폭, 12칸 = 384px)
export const WORLD_ROWS = 46;   // 세로 (위=처음 → 아래=1000일, 길게)

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
}

// 위(처음 만남)에서 아래(지금)로 이어지는 추억 길.
// order 3 은 두 갈래(분기)로 갈라졌다 다시 합쳐집니다.
export const STAGES: Stage[] = [
  { id: "first-meet", order: 1, col: 6, row: 3,
    label: "처음 만난 날", title: "처음 만난 날", date: "2023.09.11",
    photo: "/photos/sample1.svg",
    text: "어색하게 인사했던 그날. 여기에 그날의 사진과 이야기를 넣어주세요." },

  { id: "first-date", order: 2, col: 3, row: 9,
    label: "첫 데이트", title: "첫 데이트", date: "2023.09.20",
    photo: "/photos/sample2.svg",
    text: "둘이 처음 영화를 봤던 날. 가장 좋아하는 사진을 넣어보세요." },

  // ── 분기: 두 갈래 ──
  { id: "cafe", order: 3, branch: "A", col: 2, row: 15,
    label: "단골 카페", title: "우리 단골 카페", date: "2023.11.02",
    photo: "/photos/sample1.svg",
    text: "자주 가던 그 카페. 왼쪽 길의 추억이에요." },
  { id: "movie-night", order: 3, branch: "B", col: 9, row: 15,
    label: "영화의 밤", title: "같이 본 영화", date: "2023.12.24",
    photo: "/photos/sample2.svg",
    text: "밤새 영화 보던 날. 오른쪽 길의 추억이에요." },

  { id: "trip", order: 4, col: 5, row: 22,
    label: "첫 여행", title: "우리의 첫 여행", date: "2024.05.03",
    photo: "/photos/sample3.svg",
    text: "바다를 보러 갔던 1박 2일." },

  { id: "hundred", order: 5, col: 8, row: 29,
    label: "100일", title: "100일 기념", date: "2023.12.19",
    photo: "/photos/sample3.svg",
    text: "벌써 100일이라니. 케이크 불었던 날." },

  { id: "now", order: 6, col: 4, row: 35,
    label: "그리고 지금", title: "그리고 지금", date: "2026.06",
    photo: "/photos/sample1.svg",
    text: "여기까지 함께 걸어와줘서 고마워." },
];

// 마지막 도착지 (모든 추억을 모으면 열림 → 폭죽 연출)
export const GOAL = { col: 6, row: 41, label: "1000일 ♥" };

// 커플 퀴즈
export interface QuizQuestion { q: string; options: string[]; answer: number; }
export const QUIZ: QuizQuestion[] = [
  { q: "우리가 처음 같이 먹은 음식은?", options: ["떡볶이", "파스타", "초밥", "치킨"], answer: 4 },
  { q: "우리의 1일은 며칠일까?", options: ["9월 9일", "9월 11일", "9월 20일", "10월 1일"], answer: 1 },
  { q: "내가 제일 좋아하는 오빠의 모습은?", options: ["웃을 때", "잘 때", "운동할 때", "먹을 때"], answer: 2 },
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
