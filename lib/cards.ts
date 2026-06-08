// 서로 알아가기 질문 카드 + 커플 유형 테스트

export interface QuestionCard { q: string; }
export const QUESTIONS: QuestionCard[] = [
  { q: "나의 어떤 모습에 처음 반했어?" },
  { q: "우리 데이트 중 제일 기억에 남는 날은?" },
  { q: "내가 해줬을 때 제일 감동이었던 말은?" },
  { q: "10년 뒤 우리는 뭘 하고 있을까?" },
  { q: "요즘 나한테 제일 고마웠던 순간은?" },
  { q: "같이 꼭 가보고 싶은 여행지는?" },
  { q: "내가 더 자주 해줬으면 하는 거 하나는?" },
  { q: "우리 사이 별명을 새로 짓는다면?" },
  { q: "처음 사귀던 날로 돌아가면 뭐라고 말할래?" },
  { q: "내가 우울할 때 어떻게 위로받고 싶어?" },
];

// ── 커플 유형 테스트 ──
// E(표현 풍부) vs C(은은·차분) / P(계획형) vs F(즉흥·자유)
export type Axis = "E" | "C" | "P" | "F";
export interface TypeOption { label: string; axis: Axis; }
export interface TypeQuestion { q: string; options: TypeOption[]; }

export const TYPE_QUESTIONS: TypeQuestion[] = [
  { q: "데이트 약속을 잡을 때 우리는?", options: [
    { label: "미리 코스를 쫙 짜둔다", axis: "P" },
    { label: "그날 기분 따라 정한다", axis: "F" }] },
  { q: "애정 표현은 보통?", options: [
    { label: "사랑한다고 자주 말한다", axis: "E" },
    { label: "행동으로 은근히 보여준다", axis: "C" }] },
  { q: "여행을 가면?", options: [
    { label: "일정표대로 알차게", axis: "P" },
    { label: "발길 닿는 대로 느긋하게", axis: "F" }] },
  { q: "다퉜을 때 우리는?", options: [
    { label: "바로 감정을 표현하고 푼다", axis: "E" },
    { label: "시간을 두고 차분히 푼다", axis: "C" }] },
  { q: "주말 데이트는?", options: [
    { label: "안 가본 새로운 곳 도전!", axis: "F" },
    { label: "검증된 단골 코스가 편해", axis: "P" }] },
  { q: "평소 연락 스타일은?", options: [
    { label: "시도 때도 없이 톡톡", axis: "E" },
    { label: "만나서 몰아서 수다", axis: "C" }] },
];

export interface CoupleType { code: string; emoji: string; title: string; desc: string; }
export const COUPLE_TYPES: Record<string, CoupleType> = {
  EP: { code: "EP", emoji: "🎯", title: "계획적인 꿀잼 커플", desc: "표현도 풍부하고 계획도 탄탄! 기념일·이벤트를 제대로 즐기는 야무진 한 쌍이에요." },
  EF: { code: "EF", emoji: "🎆", title: "텐션 폭발 즉흥 커플", desc: "감정 표현 만렙 + 그때그때 불타는 즉흥파! 매일이 새롭고 시끌벅적 사랑스러워요." },
  CP: { code: "CP", emoji: "🌳", title: "든든한 안정 커플", desc: "은은하지만 깊고, 계획적이라 믿음직해요. 옆에 있으면 마음이 놓이는 단단한 사이." },
  CF: { code: "CF", emoji: "🍃", title: "편안한 자유영혼 커플", desc: "서로에게 여백을 주는 느긋한 사이. 말없이도 통하는 편안함이 매력이에요." },
};

export function resultType(c: Record<Axis, number>): CoupleType {
  const e = (c.E ?? 0) >= (c.C ?? 0) ? "E" : "C";
  const p = (c.P ?? 0) >= (c.F ?? 0) ? "P" : "F";
  return COUPLE_TYPES[e + p];
}
