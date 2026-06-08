// 우리의 시작 (1일째) — 2023년 10월 8일 새벽 2시 30분
export const START_DATE = new Date("2023-10-08T02:30:00");

// 다가오는 기념일 계산용
export function elapsed(now: Date = new Date()) {
  const ms = now.getTime() - START_DATE.getTime();
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  // 사귄 날을 1일째로 세는 한국식 D-day
  const dday = Math.floor(ms / 86400000) + 1;
  return { ms, totalSeconds: sec, days, h, m, s, dday };
}
