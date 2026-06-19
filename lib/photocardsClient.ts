// 포토부스 1000일 추억카드 — 브라우저(localStorage)에 우선 저장하고,
// DB(/api/photocards)에는 가능하면 함께 동기화한다.
// 이렇게 하면 DB 스키마(prisma db push)가 아직 안 맞아도 추억카드가 사라지지 않는다.
export interface PhotoCardData {
  id: string;        // 클라이언트 생성 id
  title: string;
  message: string;
  date: string;      // "YYYY.MM.DD"
  dday: number;
  image: string;     // dataURL (base64 PNG)
  createdAt: number; // epoch ms
}

const KEY = "our1000days-photocards";

function lsRead(): PhotoCardData[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function lsWrite(list: PhotoCardData[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

// 오래된 → 최신 순으로 반환 (타임라인 맨 끝에 붙이기 위함)
export async function getPhotoCards(): Promise<PhotoCardData[]> {
  const local = lsRead();
  try {
    const r = await fetch("/api/photocards");
    if (!r.ok) throw new Error();
    const rows: Array<{ id: number; title: string; message: string; date: string; dday: number; image: string; createdAt: string }> = await r.json();
    const haveImages = new Set(local.map((c) => c.image));
    for (const row of rows) {
      if (!haveImages.has(row.image)) {
        local.push({
          id: `db-${row.id}`, title: row.title, message: row.message,
          date: row.date, dday: row.dday, image: row.image,
          createdAt: new Date(row.createdAt).getTime(),
        });
      }
    }
    lsWrite(local);
  } catch { /* DB 없거나 스키마 미반영 — 로컬만 사용 */ }
  return [...local].sort((a, b) => a.createdAt - b.createdAt);
}

export async function addPhotoCard(input: { title?: string; message?: string; date: string; dday: number; image: string }): Promise<PhotoCardData> {
  const card: PhotoCardData = {
    id: `pc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title ?? "우리의 1000일",
    message: input.message ?? "",
    date: input.date,
    dday: input.dday,
    image: input.image,
    createdAt: Date.now(),
  };
  const list = lsRead();
  list.push(card);
  lsWrite(list);
  // DB에도 best-effort 저장 (실패해도 무시)
  try {
    fetch("/api/photocards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: card.title, message: card.message, date: card.date, dday: card.dday, image: card.image }),
    }).catch(() => {});
  } catch { /* noop */ }
  return card;
}
