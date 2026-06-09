"use client";

import { useEffect, useRef } from "react";

// 전체보기 인트로 영상 오버레이 (/public/cinematic.mp4)
export default function CinematicOverlay({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // 사운드와 함께 자동재생 시도 → 막히면 음소거로 폴백
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <video ref={ref} src="/cinematic.mp4" playsInline onEnded={onDone}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
      <button onClick={onDone} aria-label="건너뛰기"
        style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.85)", color: "#B85C82", border: "none", borderRadius: 999, padding: "8px 16px", fontSize: 13, fontFamily: "var(--font-pixel)", boxShadow: "0 2px 0 rgba(124,90,150,0.25)" }}>
        건너뛰기 ⏭
      </button>
    </div>
  );
}
