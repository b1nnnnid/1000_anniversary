import { STAGES, HEART_PIECES } from "@/lib/gameData";
import { LETTERS } from "@/lib/letters";

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  done: (ctx: AchCtx) => boolean;
}
export interface AchCtx { collected: string[]; pieces: string[]; unlocks: string[]; flags: string[]; }

const stageDone = (c: string[]) => STAGES.filter((s) => c.includes(s.id)).length;

export const ACHIEVEMENTS: Achievement[] = [
  // ── 탐방 ──
  { id: "first", emoji: "🌱", title: "첫 추억", desc: "추억을 하나 열었어요", done: (x) => stageDone(x.collected) >= 1 },
  { id: "half", emoji: "🌿", title: "절반의 여정", desc: "추억을 절반 이상 열었어요", done: (x) => stageDone(x.collected) >= Math.ceil(STAGES.length / 2) },
  { id: "allmem", emoji: "📷", title: "추억 수집가", desc: "모든 추억을 열었어요", done: (x) => stageDone(x.collected) === STAGES.length },
  { id: "cat", emoji: "🐱", title: "고양이 집사", desc: "길고양이와 친구가 됐어요", done: (x) => x.collected.includes("cat-intro") },
  { id: "heart3", emoji: "💗", title: "하트 줍기", desc: "숨은 하트를 3개 모았어요", done: (x) => x.pieces.length >= 3 },
  { id: "heartAll", emoji: "💖", title: "하트 헌터", desc: "숨은 하트 8개를 다 모았어요", done: (x) => x.pieces.length >= HEART_PIECES.length },
  { id: "mission", emoji: "🎮", title: "미션 마스터", desc: "모든 스테이지 미션을 깼어요", done: (x) => STAGES.every((s) => !s.challenge || x.collected.includes("ch:" + s.id)) },
  { id: "reunion", emoji: "🌸", title: "재회", desc: "도착지에서 둘이 만났어요", done: (x) => x.collected.includes("reunion") },
  { id: "dateAll", emoji: "💑", title: "데이트 요정", desc: "모든 데이트 장소를 다녀왔어요", done: (x) => STAGES.every((s) => !s.place || x.collected.includes("date:" + s.id)) },
  // ── 우리의 공간 콘텐츠 ──
  { id: "together", emoji: "⏳", title: "시간 여행자", desc: "함께한 시간을 확인했어요", done: (x) => x.flags.includes("together") },
  { id: "album", emoji: "🖼️", title: "추억 큐레이터", desc: "추억 앨범을 열어봤어요", done: (x) => x.flags.includes("album") },
  { id: "slideshow", emoji: "🎞️", title: "우리들의 영화관", desc: "추억 슬라이드쇼를 봤어요", done: (x) => x.flags.includes("slideshow") },
  { id: "letters", emoji: "💌", title: "편지 수집가", desc: "숨겨둔 편지를 모두 열었어요", done: (x) => LETTERS.every((l) => x.unlocks.includes("letter:" + l.id)) },
  { id: "wishes", emoji: "🎟️", title: "소원 지기", desc: "소원권 보관함을 열어봤어요", done: (x) => x.flags.includes("wishes") },
  { id: "kakao", emoji: "💬", title: "대화 분석가", desc: "카톡 대화를 분석했어요", done: (x) => x.flags.includes("kakao") },
  { id: "mystic", emoji: "🔮", title: "운명 탐구가", desc: "사주와 운세를 모두 열어봤어요", done: (x) => x.unlocks.includes("saju") && x.unlocks.includes("fortune") },
  { id: "cards", emoji: "🃏", title: "유형 발견", desc: "커플 유형 테스트를 완료했어요", done: (x) => x.flags.includes("cards") },
  { id: "photo", emoji: "📸", title: "포토그래퍼", desc: "포토부스로 사진을 저장했어요", done: (x) => x.flags.includes("photo") },
  { id: "quiz", emoji: "💭", title: "퀴즈왕", desc: "커플 퀴즈를 통과했어요", done: (x) => x.flags.includes("quiz") },
  { id: "roulette", emoji: "🎁", title: "행운을 돌려라", desc: "소원권 룰렛을 돌렸어요", done: (x) => x.flags.includes("roulette") },
];

export function computeAchievements(ctx: AchCtx) {
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.done(ctx) }));
}
