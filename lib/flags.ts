// 콘텐츠 방문/사용 기록 (업적용). 변경 시 'ach-check' 이벤트를 쏴서 전역 업적 감시기가 확인하게 한다.
const KEY = "our1000days-flags";

export function getFlags(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
export function hasFlag(k: string): boolean { return getFlags().includes(k); }
export function clearFlags() { try { localStorage.removeItem(KEY); } catch {} }

export function markFlag(k: string) {
  if (typeof window === "undefined") return;
  const f = getFlags();
  if (!f.includes(k)) {
    f.push(k);
    try { localStorage.setItem(KEY, JSON.stringify(f)); } catch {}
  }
  try { window.dispatchEvent(new Event("ach-check")); } catch {}
}
