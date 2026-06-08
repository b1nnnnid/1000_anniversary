// 재미로 보는 커플 사주 / 오늘의 운세 (정통 만세력 X, 엔터테인먼트용)

export interface Person { name: string; y: number; m: number; d: number; hour?: number; min?: number; }

// 두 사람 생일 — 여기만 고치면 됩니다
export const ME: Person = { name: "나", y: 2003, m: 10, d: 3, hour: 11, min: 15 };
export const OPPA: Person = { name: "오빠", y: 1996, m: 9, d: 18 }; // 시간 모름

const ANIMALS = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];
const ANIMAL_EMOJI = ["🐵", "🐔", "🐶", "🐷", "🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑"];
const STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const STEM_ELEM = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
const ELEM_EMOJI: Record<string, string> = { 목: "🌳", 화: "🔥", 토: "⛰️", 금: "⚙️", 수: "💧" };

const SIGNS: { name: string; emoji: string; from: [number, number] }[] = [
  { name: "물병자리", emoji: "🏺", from: [1, 20] }, { name: "물고기자리", emoji: "🐟", from: [2, 19] },
  { name: "양자리", emoji: "🐏", from: [3, 21] }, { name: "황소자리", emoji: "🐂", from: [4, 20] },
  { name: "쌍둥이자리", emoji: "👯", from: [5, 21] }, { name: "게자리", emoji: "🦀", from: [6, 22] },
  { name: "사자자리", emoji: "🦁", from: [7, 23] }, { name: "처녀자리", emoji: "🌾", from: [8, 23] },
  { name: "천칭자리", emoji: "⚖️", from: [9, 23] }, { name: "전갈자리", emoji: "🦂", from: [10, 23] },
  { name: "사수자리", emoji: "🏹", from: [11, 22] }, { name: "염소자리", emoji: "🐐", from: [12, 22] },
];

export function zodiacAnimal(y: number) { const i = ((y % 12) + 12) % 12; return { name: ANIMALS[i], emoji: ANIMAL_EMOJI[i] }; }
export function starSign(m: number, d: number) {
  let idx = 0;
  for (let i = 0; i < SIGNS.length; i++) { const [sm, sd] = SIGNS[i].from; if (m > sm || (m === sm && d >= sd)) idx = i; }
  if (m === 1 && d < 20) idx = 11; // 1월 초 = 염소
  return SIGNS[idx];
}
export function dayElement(y: number) { const s = ((y - 4) % 10 + 10) % 10; return { stem: STEMS[s], elem: STEM_ELEM[s], emoji: ELEM_EMOJI[STEM_ELEM[s]] }; }

// 결정적 해시 (생일 조합 → 고정 궁합)
function hash(str: string) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); }
function mulberry32(seed: number) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export interface Compatibility {
  score: number;
  title: string;
  comment: string;
  bars: { label: string; value: number }[];
}

// 오행 상생/상극 보정
const ELEM_ORDER = ["목", "화", "토", "금", "수"];
function elemRel(a: string, b: string) {
  const i = ELEM_ORDER.indexOf(a), j = ELEM_ORDER.indexOf(b);
  if (i === j) return 6;                 // 같은 기운
  if ((i + 1) % 5 === j || (j + 1) % 5 === i) return 10; // 상생
  return 4;                              // 상극(그래도 끌림)
}

export function compatibility(): Compatibility {
  const seed = hash(`${ME.y}-${ME.m}-${ME.d}_${OPPA.y}-${OPPA.m}-${OPPA.d}`);
  const rnd = mulberry32(seed);
  const eMe = dayElement(ME.y).elem, eOp = dayElement(OPPA.y).elem;
  const bonus = elemRel(eMe, eOp); // 4~10

  // 항목별 (83~99 사이로 따뜻하게)
  const mk = () => Math.round(83 + rnd() * 14 + (bonus - 6));
  const bars = [
    { label: "성격 케미", value: Math.min(99, mk()) },
    { label: "대화 합", value: Math.min(99, mk()) },
    { label: "애정 온도", value: Math.min(99, mk()) },
    { label: "미래 궁합", value: Math.min(99, mk()) },
  ];
  const score = Math.round(bars.reduce((s, b) => s + b.value, 0) / bars.length);
  const title = score >= 95 ? "천생연분 ♥" : score >= 88 ? "찰떡궁합 🍡" : "단단한 인연 🌿";
  const comments = [
    "서로의 부족한 기운을 채워주는 사이예요. 오래 갈 인연!",
    "티격태격해도 결국 서로를 가장 잘 아는 한 쌍.",
    "함께 있을수록 닮아가는, 봄날 같은 궁합이에요.",
  ];
  return { score, title, comment: comments[seed % comments.length], bars };
}

// ── 오늘의 운세 (날짜 + 사람 시드, 매일 바뀜) ──
const COLORS = ["코랄 핑크", "라벤더", "민트", "크림 옐로", "하늘색", "체리 레드", "올리브", "피치"];
const TOTAL_MSG = [
  "오늘은 작은 일에도 웃게 되는 날! 😊", "마음이 통하는 하루. 솔직하게 표현해봐요.",
  "예상 못한 행운이 찾아올지도? 🍀", "조금 느긋하게 가도 괜찮은 날이에요.",
  "당신의 다정함이 빛나는 하루 ✨", "사소한 오해는 대화로 술술 풀려요.",
];
const LOVE_MSG = [
  "먼저 연락하면 분위기 급상승 📱", "같이 있는 시간이 유난히 달콤한 날.",
  "작은 선물이나 메모가 큰 감동이 돼요 🎁", "솔직한 한마디가 사이를 더 가깝게.",
];
const COUPLE_TIP = [
  "오늘은 같이 디저트 먹으러 가보세요 🍰", "서로 칭찬 3개씩 말해주기!",
  "추억 사진 한 장 같이 보기 📷", "오늘 고마웠던 일 하나씩 나누기 💬",
  "10분만 같이 산책하기 🚶", "좋아하는 노래 서로 추천하기 🎵",
];

export interface DailyFortune {
  score: number;
  total: string;
  love: string;
  cats: { label: string; stars: number }[];
  color: string;
  number: number;
}

export function dailyFortune(person: Person, dateKey: string): DailyFortune {
  const rnd = mulberry32(hash(`${dateKey}_${person.name}_${person.y}${person.m}${person.d}`));
  const stars = () => 1 + Math.floor(rnd() * 5);
  const cats = [
    { label: "애정운", stars: stars() }, { label: "금전운", stars: stars() },
    { label: "건강운", stars: stars() }, { label: "행운", stars: stars() },
  ];
  const score = Math.round(cats.reduce((s, c) => s + c.stars, 0) / cats.length * 20);
  return {
    score,
    total: TOTAL_MSG[Math.floor(rnd() * TOTAL_MSG.length)],
    love: LOVE_MSG[Math.floor(rnd() * LOVE_MSG.length)],
    cats,
    color: COLORS[Math.floor(rnd() * COLORS.length)],
    number: 1 + Math.floor(rnd() * 45),
  };
}

export function coupleTip(dateKey: string): string {
  const rnd = mulberry32(hash(`${dateKey}_couple`));
  return COUPLE_TIP[Math.floor(rnd() * COUPLE_TIP.length)];
}

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
