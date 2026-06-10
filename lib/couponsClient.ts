// 당첨된 소원권을 브라우저(localStorage)에 우선 저장하고, DB에는 best-effort 로 동기화.
// 서버리스(SQLite) 환경에서 DB 쓰기가 실패해도 기기 안에는 항상 남는다.
export interface Coupon { id: number; title: string; emoji: string; used: boolean; earnedAt: string; }

const KEY = "our1000days-coupons";

function read(): Coupon[] {
  if (typeof window === "undefined") return [];
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(d) ? d : [];
  } catch { return []; }
}
function write(list: Coupon[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

// DB 동기화(가능하면). 실패해도 무시.
function dbPost(title: string, emoji: string) {
  fetch("/api/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, emoji }) }).catch(() => {});
}

export function listCoupons(): Coupon[] {
  return read();
}

export function addCoupon(title: string, emoji = "🎁"): Coupon {
  const c: Coupon = { id: Date.now() * 1000 + Math.floor(Math.random() * 1000), title, emoji, used: false, earnedAt: new Date().toISOString() };
  write([c, ...read()]);
  dbPost(title, emoji);
  return c;
}

export function setCouponUsed(id: number, used: boolean): Coupon[] {
  const list = read().map((c) => (c.id === id ? { ...c, used } : c));
  write(list);
  return list;
}

export function clearCoupons() { try { localStorage.removeItem(KEY); } catch {} }
