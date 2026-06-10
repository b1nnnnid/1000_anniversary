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
  const [burst, setBurst] = useState(false);

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
    setBurst(true);
    setTimeout(() => setBurst(false), 1100);
    setTimeout(() => setOpen(l), 320); // 봉투 개봉 연출 살짝 본 뒤 편지 펼침
  };

  const openedCount = LETTERS.filter((l) => isOpen(l)).length;

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 4px" }}>
        <h1 style={{ fontSize: 20, color: "#B85C82" }}>
          숨겨둔 편지함 <span style={{ display: "inline-block", animation: "lt-sealbob 2.6s ease-in-out infinite" }}><PixelIcon name="letter" size={18} /></span>
        </h1>
        <span className="chip"><PixelIcon name="ticket" size={14} /> {tickets ?? "..."}</span>
      </div>
      <p style={{ fontSize: 11.5, color: "#8A7A85", margin: "0 0 6px" }}>티켓으로 봉투를 하나씩 열어보세요</p>

      {/* 개봉 진행 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 16px" }}>
        <div style={{ flex: 1, height: 6, background: "#EAD9E4", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${LETTERS.length ? (openedCount / LETTERS.length) * 100 : 0}%`, background: "linear-gradient(90deg, var(--rose), var(--lav))", borderRadius: 4, transition: "width .6s cubic-bezier(.22,.8,.24,1)" }} />
        </div>
        <span style={{ fontSize: 11, color: "#B85C82", whiteSpace: "nowrap" }}>{openedCount}/{LETTERS.length} 개봉</span>
      </div>

      {msg && <p style={{ fontSize: 12.5, color: "#A33333", textAlign: "center", marginBottom: 10 }}>{msg}</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {LETTERS.map((l, i) => {
          const opened = isOpen(l);
          return (
            <button key={l.id} onClick={() => tryOpen(l)} disabled={busy}
              className="pixel-border lt-card" style={{
                position: "relative", textAlign: "left", borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                background: opened ? "var(--cream)" : "#fff", overflow: "hidden",
                display: "flex", alignItems: "center", gap: 12, animationDelay: `${i * 0.07}s`,
              }}>
              {/* 잠긴 봉투에 지나가는 광택 */}
              {!opened && (
                <span style={{
                  position: "absolute", top: 0, left: 0, width: 36, height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,.65), transparent)",
                  animation: `lt-shine 3.4s ${1 + i * 0.5}s ease-in-out infinite`, pointerEvents: "none",
                }} />
              )}
              <span style={{
                fontSize: 28, filter: opened ? "none" : "grayscale(0.25)",
                display: "inline-block", animation: opened ? "none" : "lt-sealbob 3s ease-in-out infinite",
              }}>{opened ? "💌" : "✉️"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 11, color: "#A89AA3" }}>{l.from}</p>
                <p style={{ margin: "2px 0 0", fontSize: 14, color: opened ? "#B85C82" : "#5A4A55" }}>
                  {opened ? l.title : "🔒 잠긴 편지"}
                </p>
              </div>
              {opened ? (
                <span style={{ flexShrink: 0, fontSize: 10, color: "#C98AA6", border: "1.5px solid #E3B8CC", borderRadius: 6, padding: "2px 7px" }}>읽음 ✓</span>
              ) : (
                <span style={{
                  flexShrink: 0, width: 32, height: 32, borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 30%, #F08AA8, #D8537A)",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 0 rgba(150,60,90,.4)", lineHeight: 1,
                }} title={`티켓 ${l.cost}장`}>{l.cost}<span style={{ fontSize: 7 }}>🎟</span></span>
              )}
            </button>
          );
        })}
      </div>

      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
          <div onClick={(e) => e.stopPropagation()} className="pixel-border" style={{
            position: "relative", background: "#FFFDF8", borderRadius: 16, maxWidth: 320, width: "100%", padding: "26px 18px 20px",
            transformOrigin: "top center", animation: "lt-unfold .55s cubic-bezier(.2,.8,.2,1) both",
            backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #F2E6EE 27px, #F2E6EE 28px)",
          }}>
            {/* 떠오르는 하트 */}
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                position: "absolute", top: 6, left: `${30 + i * 20}%`, fontSize: 13,
                animation: `lt-heart 1.8s ${0.3 + i * 0.25}s ease-out infinite`,
              }}>💗</span>
            ))}
            {/* 밀랍 인장 */}
            <span style={{
              position: "absolute", top: -16, left: "50%", marginLeft: -18, width: 36, height: 36, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #F08AA8, #C7466E)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              boxShadow: "0 3px 0 rgba(150,60,90,.4)", animation: "lt-seal-stamp .5s .15s ease-out both",
            }}>♥</span>
            <p style={{ margin: "0 0 0", fontSize: 11, color: "#A89AA3", textAlign: "center" }}>{open.from}</p>
            <h2 style={{ fontSize: 16, color: "#B85C82", textAlign: "center", margin: "4px 0 14px" }}>{open.title}</h2>
            <p style={{ fontSize: 14, lineHeight: "28px", color: "#5A4A55", margin: 0, whiteSpace: "pre-line" }}>{open.body}</p>
            <p style={{ textAlign: "right", fontSize: 12, color: "#B85C82", margin: "14px 0 0" }}>— {open.from} 💕</p>
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button className="btn-rose" onClick={() => setOpen(null)} style={{ fontSize: 14, padding: "10px 24px" }}>고이 접어두기 ♥</button>
            </div>
          </div>
        </div>
      )}

      {/* 새 편지 개봉 시 하트 버스트 */}
      {burst && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[...Array(14)].map((_, i) => {
            const ang = (i / 14) * Math.PI * 2;
            const dist = 90 + (i % 3) * 30;
            const parts = ["💌", "💗", "✨", "💕", "🌸", "⭐"];
            return (
              <span key={i} style={{
                position: "absolute", fontSize: 20 + (i % 3) * 8,
                ["--dx" as string]: `${Math.cos(ang) * dist}px`,
                ["--dy" as string]: `${Math.sin(ang) * dist}px`,
                ["--rot" as string]: `${(i % 2 ? 1 : -1) * 180}deg`,
                animation: `lt-confetti 1s ${(i % 4) * 0.04}s ease-out forwards`,
              }}>{parts[i % parts.length]}</span>
            );
          })}
        </div>
      )}
    </main>
  );
}
