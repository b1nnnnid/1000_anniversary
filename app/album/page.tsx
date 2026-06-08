"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STAGES, Stage } from "@/lib/gameData";
import { getProgress } from "@/lib/progressClient";
import { markFlag } from "@/lib/flags";

export default function AlbumPage() {
  const [collected, setCollected] = useState<string[]>([]);
  const [open, setOpen] = useState<Stage | null>(null);
  useEffect(() => { markFlag("album"); getProgress().then((p) => setCollected(p.collectedSpots)); }, []);

  const list = [...STAGES].sort((a, b) => a.order - b.order);

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 4px" }}>추억 앨범 📷</h1>
      <p style={{ fontSize: 12, color: "#8A7A85", textAlign: "center", margin: "0 0 16px" }}>
        {collected.filter((id) => STAGES.some((s) => s.id === id)).length}/{STAGES.length}개의 추억
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {list.map((s) => {
          const got = collected.includes(s.id);
          return (
            <button key={s.id} onClick={() => got && setOpen(s)}
              style={{ padding: 0, border: "none", background: "none", textAlign: "left", cursor: got ? "pointer" : "default" }}>
              <div className="pixel-border" style={{ borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", background: "#F1EFE8" }}>
                  {got ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.photo} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, filter: "grayscale(1)", opacity: 0.4 }}>🔒</div>
                  )}
                </div>
                <div style={{ padding: "6px 8px" }}>
                  <p style={{ margin: 0, fontSize: 12, color: got ? "#B85C82" : "#B8AEB4" }}>{got ? s.title : "아직 안 열린 추억"}</p>
                  {got && s.date && <p style={{ margin: "2px 0 0", fontSize: 10, color: "#A89AA3" }}>{s.date}</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="pop pixel-border" style={{ background: "var(--cream)", borderRadius: 16, maxWidth: 320, width: "100%", overflow: "hidden" }}>
            <div style={{ background: "var(--blush)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "#B85C82", fontSize: 15 }}>{open.title}</strong>
              {open.date && <span style={{ fontSize: 11, color: "#B85C82" }}>{open.date}</span>}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.photo} alt={open.title} style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
            <p style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.7, color: "#6A5A66", margin: 0 }}>{open.text}</p>
            <div style={{ padding: "0 16px 16px", textAlign: "center" }}>
              <button className="btn-rose" onClick={() => setOpen(null)} style={{ fontSize: 14, padding: "10px 24px" }}>닫기 ♥</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
