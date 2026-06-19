// 우리의 시작 (1일째) — 2023년 10월 8일.
// D-day(며칠째)와 기념일은 "자정(00:00)" 기준으로 넘어갑니다.
export const START_DATE = new Date("2023-10-08T00:00:00");

// 로컬 자정 기준 timestamp (시·분·초 버리고 날짜만)
function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// 다가오는 기념일 계산용
export function elapsed(now: Date = new Date()) {
  const ms = now.getTime() - START_DATE.getTime();
  const sec = Math.floor(ms / 1000);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  // 자정 기준 경과 일수 — 날짜가 바뀌는 순간(00:00)에 하루가 올라감
  const days = Math.round((startOfLocalDay(now) - startOfLocalDay(START_DATE)) / 86400000);
  // 사귄 날을 1일째로 세는 한국식 D-day
  const dday = days + 1;
  return { ms, totalSeconds: sec, days, h, m, s, dday };
}
