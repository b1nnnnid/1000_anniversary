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

  { id: "t-1", date: "2023.10.15", kind: "photo", title: "첫 주말 데이트",
    photo: "/photos/sample1.svg", text: "괜히 멋 부리고 나갔던 날 ㅎㅎ" },

  { id: "t-note1", date: "2023.10.22", kind: "note", emoji: "✏️",
    text: "\"오늘 너랑 걷는데 시간이 너무 빨리 갔어.\" — 그날 받은 메시지" },

  { id: "t-100", date: "2024.01.15", kind: "milestone", title: "100일 🎂", emoji: "🎉",
    text: "벌써 세 자리 수라니!" },

  { id: "t-2", date: "2024.05.03", kind: "photo", title: "첫 바다 여행",
    photo: "/photos/sample3.svg", text: "파도 소리, 모래 위 발자국 두 줄." },

  { id: "t-3", date: "2024.08.10", kind: "photo", title: "여름 불꽃놀이",
    photo: "/photos/sample2.svg", text: "더웠지만 하늘은 예뻤다." },

  { id: "t-1y", date: "2024.10.08", kind: "milestone", title: "1주년 🥂", emoji: "🌸",
    text: "함께한 첫 일 년. 고마워." },

  { id: "t-note2", date: "2025.02.14", kind: "note", emoji: "💌",
    text: "초콜릿보다 네가 더 달다는 오글거리는 카드를 받았다." },

  { id: "t-4", date: "2025.07.20", kind: "photo", title: "둘이 만든 저녁",
    photo: "/photos/sample1.svg", text: "주방이 난리였지만 맛은 합격." },

  { id: "t-2y", date: "2025.10.08", kind: "milestone", title: "2주년 💞", emoji: "✨",
    text: "두 번째 일 년도 무사히." },

  { id: "t-5", date: "2026.05.30", kind: "photo", title: "요즘의 우리",
    photo: "/photos/sample2.svg", text: "특별할 것 없는 하루가 제일 좋아." },
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
