import { STAGES, HEART_PIECES } from "@/lib/gameData";
import { LETTERS } from "@/lib/letters";

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  done: (ctx: AchCtx) => boolean;
}
export interface AchCtx { collected: string[]; pieces: string[]; unlocks: string[]; }

const stageDone = (c: string[]) => STAGES.filter((s) => c.includes(s.id)).length;

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first", emoji: "🌱", title: "첫 추억", desc: "추억을 하나 열었어요", done: (x) => stageDone(x.collected) >= 1 },
  { id: "half", emoji: "🌿", title: "절반의 여정", desc: "추억을 절반 이상 열었어요", done: (x) => stageDone(x.collected) >= Math.ceil(STAGES.length / 2) },
  { id: "allmem", emoji: "📷", title: "추억 수집가", desc: "모든 추억을 열었어요", done: (x) => stageDone(x.collected) === STAGES.length },
  { id: "cat", emoji: "🐱", title: "고양이 집사", desc: "길고양이와 친구가 됐어요", done: (x) => x.collected.includes("cat-intro") },
  { id: "heart3", emoji: "💗", title: "하트 줍기", desc: "숨은 하트를 3개 모았어요", done: (x) => x.pieces.length >= 3 },
  { id: "heartAll", emoji: "💖", title: "하트 헌터", desc: "숨은 하트 8개를 다 모았어요", done: (x) => x.pieces.length >= HEART_PIECES.length },
  { id: "mission", emoji: "🎮", title: "미션 마스터", desc: "모든 스테이지 미션을 깼어요", done: (x) => STAGES.every((s) => !s.challenge || x.collected.includes("ch:" + s.id)) },
  { id: "reunion", emoji: "🌸", title: "재회", desc: "도착지에서 둘이 만났어요", done: (x) => x.collected.includes("reunion") },
  { id: "dateAll", emoji: "💑", title: "데이트 요정", desc: "모든 데이트 장소를 다녀왔어요", done: (x) => STAGES.every((s) => !s.place || x.collected.includes("date:" + s.id)) },
  { id: "letters", emoji: "💌", title: "편지 수집가", desc: "숨겨둔 편지를 모두 열었어요", done: (x) => LETTERS.every((l) => x.unlocks.includes("letter:" + l.id)) },
  { id: "mystic", emoji: "🔮", title: "운명 탐구가", desc: "사주와 운세를 모두 열어봤어요", done: (x) => x.unlocks.includes("saju") && x.unlocks.includes("fortune") },
];

export function computeAchievements(ctx: AchCtx) {
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.done(ctx) }));
}
