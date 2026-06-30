"use client";

import React, { useEffect, useRef, useState } from "react";
import { playPop, playSparkle } from "@/lib/sfx";

// 편지마다 다른 "봉인 뜯기" 인터랙션 (조건 없이, 5초 이상 즐기며 열기)
export type SealKind = "sticker" | "tear" | "wax" | "ribbon";

const HINT: Record<SealKind, string> = {
  sticker: "스티커를 문질러서 살살 떼어 보세요 🩹",
  tear: "왼쪽부터 주욱— 오른쪽으로 찢어 보세요 ✂️",
  wax: "왁스 씰을 꾹 눌러 녹여 보세요 🔥",
  ribbon: "리본을 잡고 쭉 당겨서 풀어 보세요 🎀",
};

// 봉투 그림 (진행도 p, 완료 done 에 따라 변형)
function Envelope({ kind, p, done }: { kind: SealKind; p: number; done: boolean }) {
  const flap = (
    <g transform={`rotate(${done ? -156 : 0} 130 54)`} style={{ transition: "transform .6s cubic-bezier(.3,.9,.3,1)" }}>
      <polygon points="26,54 234,54 130,122" fill="#F6E6C8" stroke="#E6D2B5" strokeWidth="3" />
    </g>
  );
  const body = (
    <>
      <ellipse cx="130" cy="168" rx="106" ry="11" fill="rgba(60,40,55,.18)" />
      <rect x="26" y="52" width="208" height="114" rx="8" fill="#FBEFD9" stroke="#E6D2B5" strokeWidth="3" />
      <rect x="26" y="156" width="208" height="10" rx="4" fill="#F2E2C4" />
    </>
  );

  if (kind === "sticker") {
    return (
      <>
        {body}
        <g transform={`rotate(${done ? -156 : 0} 130 54)`} style={{ transition: "transform .6s cubic-bezier(.3,.9,.3,1)" }}>
          <polygon points="26,54 234,54 130,122" fill="#F6E6C8" stroke="#E6D2B5" strokeWidth="3" />
          {/* 떼어진 자국 */}
          <circle cx="130" cy="80" r="20" fill="none" stroke="#D8B58E" strokeWidth="2" strokeDasharray="4 4" opacity={p * 0.9} />
          {/* 스티커 (p만큼 들려 올라감) */}
          {!done && (
            <g transform={`translate(${p * 8} ${-p * 30}) rotate(${p * 38} 130 80)`}>
              <circle cx="130" cy="80" r="20" fill="#F08AA8" stroke="#fff" strokeWidth="3" />
              <text x="130" y="86" textAnchor="middle" fontSize="18" fill="#fff">♥</text>
              <path d={`M150 80 q${6 + p * 8} -6 ${10 + p * 10} 2`} fill="none" stroke="#fff" strokeWidth="2" opacity={p} />
            </g>
          )}
        </g>
      </>
    );
  }

  if (kind === "wax") {
    const r = 20 + Math.sin(p * 40) * p * 1.5;
    return (
      <>
        {body}
        <g transform={`rotate(${done ? -156 : 0} 130 54)`} style={{ transition: "transform .6s cubic-bezier(.3,.9,.3,1)" }}>
          <polygon points="26,54 234,54 130,122" fill="#F6E6C8" stroke="#E6D2B5" strokeWidth="3" />
          {!done && (
            <g transform={`translate(${Math.sin(p * 50) * p * 2} 0)`}>
              <circle cx="130" cy="82" r={r} fill={p > 0.5 ? "#FF7E5F" : "#C7466E"} stroke="#9E2F4F" strokeWidth="2" />
              <text x="130" y="88" textAnchor="middle" fontSize="16" fill="#fff">♥</text>
              {p > 0.3 && <line x1="130" y1="64" x2={130 + (p - 0.3) * 26} y2="100" stroke="#7A2540" strokeWidth="2" />}
              {p > 0.55 && <line x1="112" y1="80" x2={148} y2={80 + (p - 0.55) * 36} stroke="#7A2540" strokeWidth="2" />}
              {p > 0.75 && <line x1="130" y1="82" x2={114} y2={70 - (p - 0.75) * 30} stroke="#7A2540" strokeWidth="2" />}
            </g>
          )}
        </g>
      </>
    );
  }

  if (kind === "ribbon") {
    const loop = 15 * (1 - p);
    const tail = 10 + p * 58;
    return (
      <>
        {body}
        {flap}
        {!done && (
          <>
            <rect x="120" y="52" width="20" height="114" fill="#E8799F" />
            <rect x="26" y="100" width="208" height="20" fill="#E8799F" />
            <g transform="translate(130 110)">
              <rect x="-8" y="0" width="7" height={tail} fill="#D8537A" />
              <rect x="1" y="0" width="7" height={tail * 0.9} fill="#D8537A" />
              <ellipse cx={-15} cy="-2" rx={loop} ry={loop * 0.7} fill="#F2A3C0" stroke="#D8537A" strokeWidth="2" />
              <ellipse cx={15} cy="-2" rx={loop} ry={loop * 0.7} fill="#F2A3C0" stroke="#D8537A" strokeWidth="2" />
              <rect x="-9" y="-9" width="18" height="18" rx="4" fill="#E8556F" />
            </g>
          </>
        )}
      </>
    );
  }

  // tear
  const tearX = 26 + p * 208;
  const teeth = Math.max(0, Math.floor((tearX - 26) / 11));
  return (
    <>
      {body}
      {/* 남은 봉합 띠 (오른쪽) */}
      <rect x={tearX} y="44" width={Math.max(0, 234 - tearX)} height="16" rx="3" fill="#F0DEBE" stroke="#E0CBA8" strokeWidth="2" />
      {!done && <line x1={tearX + 2} y1="52" x2="232" y2="52" stroke="#C9A77A" strokeWidth="2" strokeDasharray="5 5" />}
      {/* 찢긴 톱니 가장자리 (왼쪽) */}
      {Array.from({ length: teeth }).map((_, i) => (
        <polygon key={i} points={`${26 + i * 11},46 ${31.5 + i * 11},39 ${37 + i * 11},46`} fill="#FBEFD9" stroke="#E6D2B5" strokeWidth="1" />
      ))}
    </>
  );
}

export default function LetterSeal({ kind, from, onOpen, onCancel }: {
  kind: SealKind; from: string; onOpen: () => void; onCancel: () => void;
}) {
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);
  const pRef = useRef(0), downRef = useRef(false), holdRef = useRef(false), doneRef = useRef(false);
  const last = useRef({ x: 0, y: 0 }), lastPop = useRef(0);
  const NEED = kind === "tear" || kind === "ribbon" ? 560 : 640;

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (kind === "wax") {
        if (holdRef.current) pRef.current = Math.min(1, pRef.current + 0.0038);
        else pRef.current = Math.max(0, pRef.current - 0.003);
      }
      const np = pRef.current;
      setP(np);
      if (np > lastPop.current + 0.1 && np < 1) { lastPop.current = np; playPop(); }
      if (np >= 1 && !doneRef.current) { doneRef.current = true; setDone(true); playSparkle(); setTimeout(onOpen, 780); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [kind, onOpen]);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    downRef.current = true; holdRef.current = true; last.current = { x: e.clientX, y: e.clientY };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!downRef.current || doneRef.current) return;
    const dx = e.clientX - last.current.x, dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    let add = 0;
    if (kind === "sticker") add = Math.hypot(dx, dy);
    else if (kind === "tear") add = Math.max(0, dx);
    else if (kind === "ribbon") add = Math.max(0, dy) + Math.abs(dx) * 0.4;
    else add = Math.hypot(dx, dy) * 1.2; // wax: 문지르면 가속
    pRef.current = Math.min(1, pRef.current + add / NEED);
  };
  const onUp = () => { downRef.current = false; holdRef.current = false; };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(90,74,85,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <button onClick={onCancel} style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,.85)", border: "none", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: "#6A5A66" }}>← 그만두기</button>
      <p style={{ color: "#fff", fontSize: 12, margin: "0 0 4px", opacity: .9 }}>{from}</p>
      <p style={{ color: "#fff", fontSize: 14, margin: "0 0 14px", textAlign: "center", textShadow: "0 1px 2px rgba(0,0,0,.3)" }}>
        {done ? "스르륵... 열린다 ✨" : HINT[kind]}
      </p>

      <div style={{ position: "relative", width: 260, maxWidth: "86vw", touchAction: "none", transform: done ? "scale(1.05)" : "scale(1)", transition: "transform .5s", filter: done ? "brightness(1.12)" : "none" }}>
        <svg viewBox="0 0 260 180" style={{ width: "100%", display: "block" }}>
          <Envelope kind={kind} p={p} done={done} />
        </svg>
        {!done && (
          <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
            style={{ position: "absolute", inset: 0, cursor: "grab", touchAction: "none" }} />
        )}
      </div>

      <div style={{ width: 220, maxWidth: "80vw", height: 8, background: "rgba(255,255,255,.35)", borderRadius: 5, overflow: "hidden", marginTop: 18 }}>
        <div style={{ height: "100%", width: `${Math.round(p * 100)}%`, background: "linear-gradient(90deg,#FBE6A8,#F2A3C0)", transition: "width .08s" }} />
      </div>
    </div>
  );
}
