// 클라이언트에서 진행상황/룰렛 기회(티켓)를 읽고 쓴다. DB 실패 시 localStorage 폴백.
export interface ProgressData {
  collectedSpots: string[];
  hearts: number;
  tickets: number;
  fragments: number;
  heartPieces: string[];
}

const LS = "our1000days-tickets";
const lsGet = () => (typeof window === "undefined" ? 0 : Math.max(0, Number(localStorage.getItem(LS) ?? 0)));
const lsSet = (n: number) => { if (typeof window !== "undefined") localStorage.setItem(LS, String(Math.max(0, n))); };
const LSF = "our1000days-frag";
const lsGetF = () => (typeof window === "undefined" ? 0 : Math.max(0, Number(localStorage.getItem(LSF) ?? 0)));
const lsSetF = (n: number) => { if (typeof window !== "undefined") localStorage.setItem(LSF, String(Math.max(0, n))); };

export async function getProgress(): Promise<ProgressData> {
  try {
    const r = await fetch("/api/progress");
    if (!r.ok) throw new Error();
    const d = await r.json();
    return { collectedSpots: d.collectedSpots ?? [], hearts: d.hearts ?? 0, tickets: d.tickets ?? 0, fragments: d.fragments ?? 0, heartPieces: d.heartPieces ?? [] };
  } catch {
    return { collectedSpots: [], hearts: 0, tickets: lsGet(), fragments: lsGetF(), heartPieces: [] };
  }
}

export interface RewardResult { tickets: number; fragments: number; }

// 티켓 조각 추가. 5조각마다 티켓 1장으로 합성. 반환: {tickets, fragments}
export async function addFragments(n: number): Promise<RewardResult> {
  try {
    const r = await fetch("/api/progress", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addFragments: n }),
    });
    if (!r.ok) throw new Error();
    const d = await r.json();
    return { tickets: d.tickets ?? 0, fragments: d.fragments ?? 0 };
  } catch {
    let f = lsGetF() + n;
    let t = lsGet();
    if (f >= 5) { t += Math.floor(f / 5); f = f % 5; lsSet(t); }
    lsSetF(f);
    return { tickets: t, fragments: f };
  }
}

// 티켓 사용(룰렛 돌릴 때). 서버에 차감 저장. 반환: 남은 티켓 수
export async function spendTicket(n = 1): Promise<number> {
  try {
    const r = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spendTicket: n }),
    });
    if (!r.ok) throw new Error();
    const d = await r.json();
    return d.tickets ?? 0;
  } catch {
    const t = Math.max(0, lsGet() - n);
    lsSet(t);
    return t;
  }
}

// 진행 데이터 전부 초기화 (DB + 브라우저 저장)
export async function resetProgress(): Promise<void> {
  try { await fetch("/api/progress", { method: "DELETE" }); } catch {}
  try { localStorage.removeItem(LS); localStorage.removeItem(LSF); } catch {}
}
