"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PixelIcon from "@/components/PixelIcon";
import { LETTERS, Letter } from "@/lib/letters";
import { getProgress } from "@/lib/progressClient";
import { getUnlocks, buyUnlock } from "@/lib/unlocks";

export default function LettersPage() {
  const [tickets, setTickets] = useState<number | null>(null);
  const [unlocks, setUnlocks] = useState<string[]>([]);
  const [open, setOpen] = useState<Letter | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getProgress().then((p) => setTickets(p.tickets));
    setUnlocks(getUnlocks());
  }, []);

  const key = (l: Letter) => "letter:" + l.id;
  const isOpen = (l: Letter) => unlocks.includes(key(l));

  const tryOpen = async (l: Letter) => {
    if (isOpen(l)) { setOpen(l); return; }
    if (busy) return;
    if ((tickets ?? 0) < l.cost) { setMsg(`티켓이 ${l.cost}장 필요해요 (지금 ${tickets ?? 0}장)`); return; }
    setBusy(true);
    const left = await buyUnlock(key(l), l.cost); // 티켓 cost장 차감 + 해금
    setTickets(left);
    setUnlocks(getUnlocks());
    setBusy(false);
    setMsg(null);
    setOpen(l);
  };

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 4px" }}>
        <h1 style={{ fontSize: 20, color: "#B85C82" }}>숨겨둔 편지함 💌</h1>
        <span className="chip"><PixelIcon name="ticket" size={14} /> {tickets ?? "..."}</span>
      </div>
      <p style={{ fontSize: 11.5, color: "#8A7A85", margin: "0 0 16px" }}>티켓으로 봉투를 하나씩 열어보세요</p>
      {msg && <p style={{ fontSize: 12.5, color: "#A33333", textAlign: "center", marginBottom: 10 }}>{msg}</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {LETTERS.map((l) => {
          const opened = isOpen(l);
          return (
            <button key={l.id} onClick={() => tryOpen(l)} disabled={busy}
              className="pixel-border" style={{
                textAlign: "left", borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                background: opened ? "var(--cream)" : "#fff",
                display: "flex", alignItems: "center", gap: 12,
              }}>
              <span style={{ fontSize: 28, filter: opened ? "none" : "grayscale(0.3)" }}>{opened ? "💌" : "✉️"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 11, color: "#A89AA3" }}>{l.from}</p>
                <p style={{ margin: "2px 0 0", fontSize: 14, color: opened ? "#B85C82" : "#5A4A55" }}>
                  {opened ? l.title : "🔒 잠긴 편지"}
                </p>
              </div>
              {!opened && (
                <span className="chip" style={{ flexShrink: 0 }}>
                  <PixelIcon name="ticket" size={13} /> {l.cost}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
          <div onClick={(e) => e.stopPropagation()} className="pop pixel-border" style={{ background: "#FFFDF8", borderRadius: 16, maxWidth: 320, width: "100%", padding: "20px 18px" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#A89AA3", textAlign: "center" }}>{open.from}</p>
            <h2 style={{ fontSize: 16, color: "#B85C82", textAlign: "center", margin: "4px 0 14px" }}>{open.title}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: "#5A4A55", margin: 0, whiteSpace: "pre-line" }}>{open.body}</p>
            <div style={{ textAlign: "center", marginTop: 18 }}>
              <button className="btn-rose" onClick={() => setOpen(null)} style={{ fontSize: 14, padding: "10px 24px" }}>고이 접어두기 ♥</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
