import { spendTicket } from "@/lib/progressClient";

// 티켓으로 산 해금(편지·사주·운세 등)은 브라우저에 저장. "처음으로"로 초기화하면 함께 삭제.
const KEY = "our1000days-unlocks";

export function getUnlocks(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
export function isUnlocked(key: string): boolean {
  return getUnlocks().includes(key);
}
function addUnlock(key: string) {
  const s = getUnlocks();
  if (!s.includes(key)) { s.push(key); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }
}
export function clearUnlocks() { try { localStorage.removeItem(KEY); } catch {} }

// 티켓 1장 소모하고 해금. 반환: 남은 티켓 수 (-1 = 티켓 부족)
export async function buyUnlock(key: string, cost = 1): Promise<number> {
  if (isUnlocked(key)) return -2; // 이미 해금
  const left = await spendTicket(cost);
  addUnlock(key);
  return left;
}
