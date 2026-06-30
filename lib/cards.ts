// 서로 알아가기 질문 카드 + 커플 유형 테스트

export interface QuestionCard { q: string; }
export const QUESTIONS: QuestionCard[] = [
  { q: "지금 이 사이트를 마주한 심정은?" },
  { q: "우리 데이트 중 제일 기억에 남는 날은?" },
  { q: "내가 해줬을 때 제일 감동이었던 말은?" },
  { q: "10년 뒤 우리는 뭘 하고 있을까?" },
  { q: "요즘 나한테 제일 고마웠던 순간은?" },
  { q: "같이 꼭 가보고 싶은 여행지는?" },
  { q: "내가 더 자주 해줬으면 하는 거 하나는?" },
  { q: "내가 고쳤으면 하는 행동은?" },
  { q: "나만 아는 상대방의 습관은?" },
  { q: "상대방이 가장 멋있어 보이는 순간은?" },
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

// ── 커플 싱크로율 테스트 (한 폰으로 번갈아 답하고 일치율 보기) ──
export interface SyncQuestion { q: string; options: string[]; }
export interface SyncRound { theme: string; emoji: string; questions: SyncQuestion[]; }

export const SYNC_ROUNDS: SyncRound[] = [
  { theme: "황당 싱크", emoji: "🤪", questions: [
    { q: "평생 둘 중 하나라면?", options: ["손이 발 크기", "발이 손 크기"] },
    { q: "이건 좀 고민되는데, 굳이?", options: ["모든 음료가 슬러시", "모든 음료가 미지근"] },
    { q: "남들 앞에서 더 견딜 만한 건?", options: ["방귀 뀔 때마다 트럼펫 소리", "재채기할 때마다 비명 소리"] },
    { q: "차라리 이게 낫다면?", options: ["한겨울에 반팔", "한여름에 패딩"] },
    { q: "평생 이렇게만 말해야 한다면?", options: ["평생 반말만", "평생 노래로만 말하기"] },
    { q: "상상도 하기 싫지만… 하나는?", options: ["1년 안 씻기", "1년 양치 안 하기"] },
    { q: "둘 중 덜 충격인 쪽은?", options: ["침이 형광색", "눈물이 무지개색"] },
  ] },
  { theme: "시뮬 싱크", emoji: "😼", questions: [
    { q: "좀비 사태! 먼저 좀비 되는 사람은?", options: ["숯댕이", "옵빵이"] },
    { q: "무인도 표류, 더 쓸모있는 사람은?", options: ["숯댕이", "옵빵이"] },
    { q: "둘이 은행 털면 망하는 이유는?", options: ["숯댕이가 쫄아서", "옵빵이가 자랑해서"] },
    { q: "우리 커플 드라마 장르는?", options: ["달달 로맨스", "병맛 코미디", "액션 스릴러"] },
    { q: "외계인이 둘 중 하나만 납치한다면?", options: ["숯댕이", "옵빵이"] },
    { q: "같이 게임하면 버스 태우는 사람은?", options: ["숯댕이", "옵빵이"] },
    { q: "우리 전생 관계는?", options: ["전생에도 부부", "전생엔 원수", "그냥 모르는 사이"] },
  ] },
  { theme: "솔직 싱크", emoji: "🌶️", questions: [
    { q: "더 이상한 검색기록 가진 사람은?", options: ["숯댕이", "옵빵이"] },
    { q: "화장실 갈 때 폰 가져가는 사람은?", options: ["숯댕이만", "옵빵이만", "둘 다"] },
    { q: "머릿속 상상이 더 위험한 사람은?", options: ["숯댕이", "옵빵이"] },
    { q: "자고 일어나면 이불 개는 사람은?", options: ["숯댕이", "옵빵이", "아무도 안 갬"] },
    { q: "둘 중 더 잘 삐지는 사람은?", options: ["숯댕이", "옵빵이"] },
    { q: "치킨 마지막 한 조각, 누가?", options: ["숯댕이", "옵빵이", "가위바위보"] },
  ] },
];

export interface SyncVerdict { min: number; emoji: string; title: string; desc: string; }
export const SYNC_VERDICTS: SyncVerdict[] = [
  { min: 90, emoji: "🧠", title: "텔레파시 커플", desc: "거의 한 몸! 무서울 만큼 척척 맞는 사이예요." },
  { min: 70, emoji: "🍡", title: "찰떡 케미 커플", desc: "역시 우리. 손발이 착착 맞아떨어져요!" },
  { min: 45, emoji: "✨", title: "알아가는 재미 커플", desc: "닮은 듯 다른 듯, 알아갈수록 더 재밌는 사이." },
  { min: 25, emoji: "🌗", title: "서로 다른 매력 커플", desc: "취향은 달라도 그게 또 끌리는 거죠 ㅎㅎ" },
  { min: 0, emoji: "🧲", title: "정반대의 끌림 커플", desc: "완전 딴판인데 붙어있는 거 보면… 이게 운명?" },
];
export function syncVerdict(pct: number): SyncVerdict {
  return SYNC_VERDICTS.find((v) => pct >= v.min) ?? SYNC_VERDICTS[SYNC_VERDICTS.length - 1];
}
