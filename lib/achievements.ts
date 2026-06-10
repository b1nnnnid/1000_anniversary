import { STAGES, HEART_PIECES, QUIZ_SETS } from "@/lib/gameData";
import { LETTERS } from "@/lib/letters";

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  done: (ctx: AchCtx) => boolean;
  series?: string;   // 같은 시리즈(연속 단계)끼리 묶어서 표시
  tier?: number;     // 시리즈 내 단계 순서 (1,2,3...)
}
export interface AchCtx { collected: string[]; pieces: string[]; unlocks: string[]; flags: string[]; }

const stageDone = (c: string[]) => STAGES.filter((s) => c.includes(s.id)).length;
const quizDone = (f: string[]) => f.filter((x) => x.startsWith("quizset-done:")).length;
const QUIZ_HALF = Math.ceil(QUIZ_SETS.length / 2);
const MEM_HALF = Math.ceil(STAGES.length / 2);

// 연속 단계 업적을 묶어서 "사다리"로 보여주기 위한 시리즈 정의
export interface AchSeries {
  id: string;
  name: string;
  progress: (ctx: AchCtx) => { cur: number; total: number; unit: string };
}
export const ACH_SERIES: AchSeries[] = [
  { id: "memory", name: "추억 모으기", progress: (x) => ({ cur: stageDone(x.collected), total: STAGES.length, unit: "개" }) },
  { id: "hearts", name: "하트 줍기", progress: (x) => ({ cur: x.pieces.length, total: HEART_PIECES.length, unit: "개" }) },
  { id: "quiz", name: "커플 퀴즈", progress: (x) => ({ cur: quizDone(x.flags), total: QUIZ_SETS.length, unit: "세트" }) },
];

export const ACHIEVEMENTS: Achievement[] = [
  // ── 시리즈: 추억 모으기 ──
  { id: "first", series: "memory", tier: 1, emoji: "🌱", title: "첫 추억", desc: "추억을 하나 열었어요", done: (x) => stageDone(x.collected) >= 1 },
  { id: "half", series: "memory", tier: 2, emoji: "🌿", title: "절반의 여정", desc: `추억을 ${MEM_HALF}개 이상 열었어요`, done: (x) => stageDone(x.collected) >= MEM_HALF },
  { id: "allmem", series: "memory", tier: 3, emoji: "📷", title: "추억 수집가", desc: "모든 추억을 열었어요", done: (x) => stageDone(x.collected) === STAGES.length },

  // ── 시리즈: 하트 줍기 ──
  { id: "heart3", series: "hearts", tier: 1, emoji: "💗", title: "하트 줍는 손", desc: "숨은 하트를 3개 모았어요", done: (x) => x.pieces.length >= 3 },
  { id: "heartAll", series: "hearts", tier: 2, emoji: "💖", title: "하트 헌터", desc: `숨은 하트 ${HEART_PIECES.length}개를 다 모았어요`, done: (x) => x.pieces.length >= HEART_PIECES.length },

  // ── 시리즈: 커플 퀴즈 (통과한 세트 개수) ──
  { id: "quiz1", series: "quiz", tier: 1, emoji: "💭", title: "퀴즈 입문", desc: "퀴즈 1세트를 통과했어요", done: (x) => quizDone(x.flags) >= 1 },
  { id: "quizHalf", series: "quiz", tier: 2, emoji: "🧠", title: "퀴즈 애호가", desc: `퀴즈를 ${QUIZ_HALF}세트 이상 통과했어요`, done: (x) => quizDone(x.flags) >= QUIZ_HALF },
  { id: "quizAll", series: "quiz", tier: 3, emoji: "🏆", title: "퀴즈왕", desc: "모든 퀴즈 세트를 통과했어요", done: (x) => quizDone(x.flags) === QUIZ_SETS.length },

  // ── 탐방 (단독) ──
  { id: "cat", emoji: "🐱", title: "고양이 집사", desc: "길고양이와 친구가 됐어요", done: (x) => x.collected.includes("cat-intro") },
  { id: "mission", emoji: "🎮", title: "미션 마스터", desc: "모든 스테이지 미션을 깼어요", done: (x) => STAGES.every((s) => !s.challenge || x.collected.includes("ch:" + s.id)) },
  { id: "reunion", emoji: "🌸", title: "재회", desc: "도착지에서 둘이 만났어요", done: (x) => x.collected.includes("reunion") },
  { id: "dateAll", emoji: "💑", title: "데이트 요정", desc: "모든 데이트 장소를 다녀왔어요", done: (x) => STAGES.every((s) => !s.place || x.collected.includes("date:" + s.id)) },

  // ── 우리의 공간 콘텐츠 (단독) ──
  { id: "together", emoji: "⏳", title: "시간 여행자", desc: "함께한 시간을 확인했어요", done: (x) => x.flags.includes("together") },
  { id: "album", emoji: "🖼️", title: "추억 큐레이터", desc: "추억 앨범을 열어봤어요", done: (x) => x.flags.includes("album") },
  { id: "letters", emoji: "💌", title: "편지 수집가", desc: "숨겨둔 편지를 모두 열었어요", done: (x) => LETTERS.every((l) => x.unlocks.includes("letter:" + l.id)) },
  { id: "wishes", emoji: "🎟️", title: "소원 지기", desc: "소원권 보관함을 열어봤어요", done: (x) => x.flags.includes("wishes") },
  { id: "kakao", emoji: "💬", title: "대화 분석가", desc: "카톡 대화를 분석했어요", done: (x) => x.flags.includes("kakao") },
  { id: "mystic", emoji: "🔮", title: "운명 탐구가", desc: "사주와 운세를 모두 열어봤어요", done: (x) => x.unlocks.includes("saju") && x.unlocks.includes("fortune") },
  { id: "cards", emoji: "🃏", title: "유형 발견", desc: "커플 유형 테스트를 완료했어요", done: (x) => x.flags.includes("cards") },
  { id: "photo", emoji: "📸", title: "포토그래퍼", desc: "포토부스로 사진을 저장했어요", done: (x) => x.flags.includes("photo") },
  { id: "roulette", emoji: "🎁", title: "행운을 돌려라", desc: "소원권 룰렛을 돌렸어요", done: (x) => x.flags.includes("roulette") },
];

export function computeAchievements(ctx: AchCtx) {
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.done(ctx) }));
}
