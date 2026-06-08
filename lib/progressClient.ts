// 클라이언트에서 진행상황/룰렛 기회(티켓)를 읽고 쓴다. DB 실패 시 localStorage 폴백.
export interface ProgressData {
  collectedSpots: string[];
  hearts: number;
  tickets: number;
  heartPieces: string[];
}

const LS = "our1000days-tickets";
const lsGet = () => (typeof window === "undefined" ? 0 : Math.max(0, Number(localStorage.getItem(LS) ?? 0)));
const lsSet = (n: number) => { if (typeof window !== "undefined") localStorage.setItem(LS, String(Math.max(0, n))); };

export async function getProgress(): Promise<ProgressData> {
  try {
    const r = await fetch("/api/progress");
    if (!r.ok) throw new Error();
    const d = await r.json();
    return { collectedSpots: d.collectedSpots ?? [], hearts: d.hearts ?? 0, tickets: d.tickets ?? 0, heartPieces: d.heartPieces ?? [] };
  } catch {
    return { collectedSpots: [], hearts: 0, tickets: lsGet(), heartPieces: [] };
  }
}

export async function changeTickets(n: number): Promise<number> {
  try {
    const r = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addTickets: n }),
    });
    if (!r.ok) throw new Error();
    const d = await r.json();
    return d.tickets ?? 0;
  } catch {
    const t = lsGet() + n;
    lsSet(t);
    return Math.max(0, t);
  }
}

// 진행 데이터 전부 초기화 (DB + 브라우저 저장)
export async function resetProgress(): Promise<void> {
  try { await fetch("/api/progress", { method: "DELETE" }); } catch {}
  try { localStorage.removeItem(LS); } catch {}
}
