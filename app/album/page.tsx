"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { STAGES, Stage } from "@/lib/gameData";
import { sortedTimeline, timelineYear, TimelineItem } from "@/lib/album";
import { getProgress } from "@/lib/progressClient";
import { markFlag } from "@/lib/flags";

type Tab = "journey" | "timeline";

const NODE_EMOJI: Record<TimelineItem["kind"], string> = { photo: "📷", note: "✏️", milestone: "💗" };

export default function AlbumPage() {
  const [collected, setCollected] = useState<string[]>([]);
  const [open, setOpen] = useState<Stage | null>(null);
  const [photo, setPhoto] = useState<TimelineItem | null>(null);
  const [tab, setTab] = useState<Tab>("journey");

  useEffect(() => { markFlag("album"); getProgress().then((p) => setCollected(p.collectedSpots)); }, []);

  // 타임라인 스크롤 등장 애니메이션
  useEffect(() => {
    if (tab !== "timeline") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [tab]);

  const list = [...STAGES].sort((a, b) => a.order - b.order);
  const gotCount = collected.filter((id) => STAGES.some((s) => s.id === id)).length;

  const timeline = sortedTimeline("asc");
  let prevYear = "";

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 12px" }}>추억 앨범 📷</h1>

      {/* 탭 */}
      <div style={{ display: "flex", gap: 6, background: "#F1EBF0", borderRadius: 12, padding: 4, marginBottom: 16 }}>
        {([["journey", "🗺 추억 길"], ["timeline", "🗓 타임라인"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className="tab-btn" style={{
            flex: 1, border: "none", borderRadius: 9, padding: "9px 0", fontSize: 13, cursor: "pointer",
            background: tab === t ? "#fff" : "transparent",
            color: tab === t ? "#B85C82" : "#A89AA3",
            fontWeight: tab === t ? 700 : 400,
            boxShadow: tab === t ? "0 2px 0 rgba(124,90,150,0.12)" : "none",
          }}>{label}</button>
        ))}
      </div>

      {tab === "journey" && (
        <>
          <p style={{ fontSize: 12, color: "#8A7A85", textAlign: "center", margin: "0 0 16px" }}>
            탐방으로 모은 {gotCount}/{STAGES.length}개의 추억
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {list.map((s, i) => {
              const got = collected.includes(s.id);
              const rot = [-3, 2, -1.5, 2.5, -2, 1.5][i % 6];
              return (
                <button key={s.id} onClick={() => got && setOpen(s)}
                  className="pola-wrap" style={{
                    padding: 0, border: "none", background: "none", textAlign: "left",
                    cursor: got ? "pointer" : "default", width: "calc(50% - 6px)",
                    animationDelay: `${i * 0.07}s`,
                  }}>
                  <div className="pola pixel-border" style={{
                    background: "#fff", borderRadius: 8, padding: "8px 8px 10px",
                    transform: `rotate(${rot}deg)`, opacity: got ? 1 : 0.55,
                  }}>
                    <div style={{ position: "relative", aspectRatio: "4/3", background: "#F1EFE8", borderRadius: 4, overflow: "hidden" }}>
                      {got ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.photo} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, filter: "grayscale(1)", opacity: 0.5 }}>🔒</div>
                      )}
                    </div>
                    <p style={{ margin: "8px 2px 0", fontSize: 12.5, color: got ? "#B85C82" : "#B8AEB4", fontWeight: 600 }}>{got ? s.title : "아직 안 열린 추억"}</p>
                    {got && s.date && <p style={{ margin: "2px 2px 0", fontSize: 10, color: "#A89AA3" }}>{s.date}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {tab === "timeline" && (
        <>
          <p style={{ fontSize: 12, color: "#8A7A85", textAlign: "center", margin: "0 0 18px" }}>
            우리의 시간을 날짜순으로 ({timeline.length})
          </p>
          <div style={{ position: "relative", paddingLeft: 34 }}>
            {/* 세로 라인 */}
            <span className="tl-line-fill" style={{ position: "absolute", left: 13, top: 6, bottom: 6, width: 3, background: "linear-gradient(var(--rose), var(--lav))", borderRadius: 2 }} />

            {timeline.map((it) => {
              const year = timelineYear(it.date);
              const showYear = year !== prevYear;
              prevYear = year;
              return (
                <Fragment key={it.id}>
                  {showYear && (
                    <div className="reveal" style={{ display: "flex", alignItems: "center", margin: "6px 0 12px", marginLeft: -34 }}>
                      <span style={{ background: "var(--rose-dark)", color: "#fff", fontSize: 12, borderRadius: 999, padding: "3px 12px", marginLeft: 4 }}>{year}</span>
                    </div>
                  )}
                  <div className="reveal" style={{ position: "relative", marginBottom: 16 }}>
                    {/* 노드 */}
                    <span className={`tl-node${it.kind === "milestone" ? " tl-mile-node" : ""}`} style={{
                      position: "absolute", left: -34, top: 2, width: 26, height: 26, borderRadius: "50%",
                      background: it.kind === "milestone" ? "var(--rose)" : "#fff",
                      border: "2px solid var(--rose)", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, zIndex: 1,
                    }}>{it.emoji ?? NODE_EMOJI[it.kind]}</span>

                    {it.kind === "photo" && (
                      <button onClick={() => setPhoto(it)} style={{ display: "block", width: "100%", textAlign: "left", padding: 0, border: "none", background: "none", cursor: "pointer" }}>
                        <div className="pixel-border" style={{ borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={it.photo} alt={it.title ?? ""} style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
                          <div style={{ padding: "8px 10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                              <p style={{ margin: 0, fontSize: 13, color: "#B85C82", fontWeight: 600 }}>{it.title}</p>
                              <span style={{ fontSize: 10, color: "#A89AA3", whiteSpace: "nowrap" }}>{it.date}</span>
                            </div>
                            {it.text && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6A5A66", lineHeight: 1.5 }}>{it.text}</p>}
                          </div>
                        </div>
                      </button>
                    )}

                    {it.kind === "note" && (
                      <div style={{ background: "var(--blush)", borderRadius: 12, padding: "12px 14px", transform: "rotate(-.6deg)", boxShadow: "0 3px 0 rgba(124,90,150,0.12)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 16 }}>{it.emoji ?? "✏️"}</span>
                          <span style={{ fontSize: 10, color: "#B07E96" }}>{it.date}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: "#7A5A6C", lineHeight: 1.6 }}>{it.text}</p>
                      </div>
                    )}

                    {it.kind === "milestone" && (
                      <div style={{ background: "linear-gradient(135deg, var(--cream), #fff)", borderRadius: 14, padding: "12px 14px", border: "2px solid var(--rose)", textAlign: "center" }}>
                        <span className="tl-bob" style={{ fontSize: 24, display: "inline-block" }}>{it.emoji ?? "💗"}</span>
                        <p style={{ margin: "2px 0 0", fontSize: 15, color: "#E8556F", fontWeight: 800 }}>{it.title}</p>
                        {it.text && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8A7A85" }}>{it.text}</p>}
                        <p style={{ margin: "4px 0 0", fontSize: 10, color: "#B7A6B1" }}>{it.date}</p>
                      </div>
                    )}
                  </div>
                </Fragment>
              );
            })}
          </div>
          <p style={{ textAlign: "center", fontSize: 10.5, color: "#B8AEB4", marginTop: 14 }}>
            ※ 사진·메모는 lib/album.ts 에 자유롭게 더 넣을 수 있어요
          </p>
        </>
      )}

      {/* 탐방 추억 모달 */}
      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="pop pixel-border" style={{ background: "var(--cream)", borderRadius: 16, maxWidth: 320, width: "100%", overflow: "hidden" }}>
            <div style={{ background: "var(--blush)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "#B85C82", fontSize: 15 }}>{open.title}</strong>
              {open.date && <span style={{ fontSize: 11, color: "#B85C82" }}>{open.date}</span>}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.photo} alt={open.title} style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }} />
            <p style={{ padding: "14px 16px", fontSize: 13, lineHeight: 1.85, color: "#6A5A66", margin: 0, whiteSpace: "pre-line" }}>{open.story ?? open.text}</p>
            <div style={{ padding: "0 16px 16px", textAlign: "center" }}>
              <button className="btn-rose" onClick={() => setOpen(null)} style={{ fontSize: 14, padding: "10px 24px" }}>닫기 ♥</button>
            </div>
          </div>
        </div>
      )}

      {/* 타임라인 사진 확대 모달 */}
      {photo && (
        <div onClick={() => setPhoto(null)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} className="pop pixel-border" style={{ background: "var(--cream)", borderRadius: 16, maxWidth: 340, width: "100%", overflow: "hidden" }}>
            <div style={{ background: "var(--blush)", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "#B85C82", fontSize: 15 }}>{photo.title}</strong>
              <span style={{ fontSize: 11, color: "#B85C82" }}>{photo.date}</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.photo} alt={photo.title ?? ""} style={{ width: "100%", display: "block", objectFit: "contain", maxHeight: "60vh" }} />
            {photo.text && <p style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.7, color: "#6A5A66", margin: 0 }}>{photo.text}</p>}
            <div style={{ padding: "0 16px 16px", textAlign: "center" }}>
              <button className="btn-rose" onClick={() => setPhoto(null)} style={{ fontSize: 14, padding: "10px 24px" }}>닫기 ♥</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
