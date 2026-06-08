// 진행상황은 브라우저(localStorage)에 우선 저장하고, DB에는 가능하면 함께 동기화한다.
// 이렇게 하면 DB 스키마가 안 맞거나 연결이 안 돼도 진행상황이 사라지지 않는다.
export interface ProgressData {
  collectedSpots: string[];
  hearts: number;
  tickets: number;
  heartPieces: string[];
}

const PKEY = "our1000days-progress";
const empty = (): ProgressData => ({ collectedSpots: [], hearts: 0, tickets: 0, heartPieces: [] });

function lsRead(): ProgressData {
  if (typeof window === "undefined") return empty();
  try {
    const d = JSON.parse(localStorage.getItem(PKEY) ?? "null");
    if (!d) return empty();
    return { collectedSpots: d.collectedSpots ?? [], hearts: d.hearts ?? 0, tickets: d.tickets ?? 0, heartPieces: d.heartPieces ?? [] };
  } catch { return empty(); }
}
function lsWrite(p: ProgressData) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch {}
}
const uniq = (a: string[], b: string[]) => Array.from(new Set([...a, ...b]));

// 업적 감시기에게 "확인해" 신호
function ping() { if (typeof window !== "undefined") { try { window.dispatchEvent(new Event("ach-check")); } catch {} } }

function dbPost(body: Record<string, unknown>) {
  fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => {});
}

// 동기 로컬 읽기 (업적 감시기용)
export function getProgressLocal(): ProgressData { return lsRead(); }

export async function getProgress(): Promise<ProgressData> {
  const local = lsRead();
  const hasLocal = local.collectedSpots.length > 0 || local.heartPieces.length > 0 || local.tickets > 0 || local.hearts > 0;
  try {
    const r = await fetch("/api/progress");
    if (!r.ok) throw new Error();
    const d = await r.json();
    const merged: ProgressData = {
      collectedSpots: uniq(local.collectedSpots, d.collectedSpots ?? []),
      heartPieces: uniq(local.heartPieces, d.heartPieces ?? []),
      hearts: Math.max(local.hearts, d.hearts ?? 0),
      tickets: hasLocal ? local.tickets : (d.tickets ?? 0),
    };
    lsWrite(merged);
    return merged;
  } catch {
    return local;
  }
}

export function addCollected(id: string): ProgressData {
  const p = lsRead();
  if (!p.collectedSpots.includes(id)) { p.collectedSpots.push(id); lsWrite(p); }
  dbPost({ collectSpot: id });
  ping();
  return p;
}

export function addHeart(id: string): ProgressData {
  const p = lsRead();
  if (!p.heartPieces.includes(id)) { p.heartPieces.push(id); p.tickets += 1; lsWrite(p); }
  dbPost({ collectHeart: id });
  ping();
  return p;
}

export function addTickets(n: number): number {
  const p = lsRead();
  p.tickets = Math.max(0, p.tickets + n);
  lsWrite(p);
  dbPost({ addTickets: n });
  ping();
  return p.tickets;
}

export async function spendTicket(n = 1): Promise<number> {
  const p = lsRead();
  p.tickets = Math.max(0, p.tickets - n);
  lsWrite(p);
  dbPost({ spendTicket: n });
  ping();
  return p.tickets;
}

// 진행 데이터 전부 초기화 (DB + 브라우저 저장)
export async function resetProgress(): Promise<void> {
  try { await fetch("/api/progress", { method: "DELETE" }); } catch {}
  try {
    localStorage.removeItem(PKEY);
    localStorage.removeItem("our1000days-kakao");
    localStorage.removeItem("our1000days-unlocks");
    localStorage.removeItem("our1000days-flags");
    localStorage.removeItem("our1000days-ach-seen");
  } catch {}
}
