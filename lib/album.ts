// ============================================================
//  추억 타임라인 갤러리 — 탐방 게임과 무관하게 자유롭게 늘리는 곳
//  · 사진은 public/photos/ 에 넣고 photo 경로만 맞추면 됩니다.
//  · 항목을 배열에 계속 추가만 하면 날짜순으로 자동 정렬됩니다.
//  · kind 로 콘텐츠 종류를 섞을 수 있어요:
//      "photo"     = 사진 + 한 줄 캡션
//      "note"      = 사진 없이 손글씨 메모/서로에게 한 말
//      "milestone" = 기념일 마커 (100일·1주년 등, 강조 표시)
// ============================================================

export type TimelineKind = "photo" | "note" | "milestone";

export interface TimelineItem {
  id: string;
  date: string;        // "YYYY.MM.DD" (일자 모르면 "YYYY.MM" 도 가능)
  kind: TimelineKind;
  title?: string;      // 카드 제목 / 기념일 이름
  text?: string;       // 캡션 · 메모 내용
  photo?: string;      // "/photos/xxx.jpg" (photo 종류일 때)
  emoji?: string;      // note·milestone 의 포인트 이모지
}

// 👇 여기에 계속 추가하세요 (순서는 상관 없어요 — 날짜로 정렬됩니다)
export const TIMELINE: TimelineItem[] = [
  { id: "t-start", date: "2023.10.08", kind: "milestone", title: "우리 1일", emoji: "💗",
    text: "여기서부터 시작된 이야기." },

  { id: "t-1", date: "2023.11.28", kind: "photo", title: "투다리 단골 시절",
    photo: "/photos/timeline-01.jpg", text: "이땐 동네 데이트도 엄청 멋 부렸다 ㅎㅎ" },

  { id: "t-note1", date: "2023.11.18", kind: "note", emoji: "✏️",
    text: "내가 오빠한테 양파 쿵야 닮았다고 해서 그걸로 한참 웃은 날 ㅋㅋㅋ" },

  { id: "t-2", date: "2023.12.18", kind: "photo", title: "소소한 데이트들",
    photo: "/photos/timeline-02.jpg", text: "별 거 안 해도 오빠랑 있으면 행복해!" },

  { id: "t-3", date: "2023.12.20", kind: "photo", title: "첫 코엑스? 전시회!",
    photo: "/photos/timeline-03.jpg", text: "까마득하지만 우리 같이 막 전시회도 봤었다 ㅎㅎㅎ" },

  { id: "t-100", date: "2024.01.15", kind: "milestone", title: "100일 🎂", emoji: "🎉",
    text: "벌써 세 자리 수라니!" },

  { id: "t-4", date: "2024.07.07", kind: "photo", title: "다시 맞이한 여름",
    photo: "/photos/timeline-04.jpg", text: "이번에는 여자친구, 남자친구로! 더워도 팔짱은 포기 못해." },

  { id: "t-1y", date: "2024.10.08", kind: "milestone", title: "1주년 🥂", emoji: "🌸",
    text: "함께한 첫 일 년, 항상 고맙고 소중한 내 옵빵이..." },

  { id: "t-5", date: "2025.02.27", kind: "photo",
    photo: "/photos/timeline-05.jpg", text: "오빠가 유감자 닮았다면서 보여줬던 거 ㅋㅋㅋ 어이없숩. 만두 같애.." },

  { id: "t-6", date: "2025.03.21", kind: "photo", title: "드디어 북한산 정복!",
    photo: "/photos/timeline-06.jpg", text: "올해도 시원해지면 다시 가자 ㅎㅎㅎ 이번엔 좀 덜 힘든 데로 ㅋㅋ" },

  { id: "t-2y", date: "2025.10.08", kind: "milestone", title: "2주년 💞", emoji: "✨",
    text: "어느덧 다시 1년이 돌아왔어! 시간 참 빠르다 그칭?" },
];

// 날짜 문자열("YYYY.MM.DD" / "YYYY.MM")을 비교용 숫자로
function dateNum(d: string): number {
  const [y, m = "1", day = "1"] = d.split(/[.\-/]/).map((s) => s.trim());
  return Number(y) * 10000 + Number(m) * 100 + Number(day);
}

// 정렬된 타임라인 (기본: 오래된 → 최신)
export function sortedTimeline(dir: "asc" | "desc" = "asc"): TimelineItem[] {
  const arr = [...TIMELINE].sort((a, b) => dateNum(a.date) - dateNum(b.date));
  return dir === "desc" ? arr.reverse() : arr;
}

export function timelineYear(d: string): string {
  return d.split(/[.\-/]/)[0];
}
