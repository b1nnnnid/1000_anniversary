"use client";

import { useEffect } from "react";
import Link from "next/link";
import CharacterReaction from "@/components/CharacterReaction";

// 자정에 기념일로 넘어가는 순간 터지는 풀스크린 축하 연출
export default function MilestoneCelebration({
  label,
  day,
  onClose,
}: {
  label: string;   // 예: "1000일"
  day: number;     // 예: 1000
  onClose: () => void;
}) {
  const big = day >= 1000; // 1000일 이상은 금빛 특별 연출

  // 떨어지는 콘페티
  const pieces = big
    ? ["🎉", "💛", "✨", "💗", "⭐", "🌟", "🎊", "💫"]
    : ["🎉", "💗", "✨", "🌸", "⭐", "💕"];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-label={`${label} 축하`}
      style={{
        position: "fixed", inset: 0, zIndex: 90, overflow: "hidden",
        background: big
          ? "radial-gradient(120% 120% at 50% 0%, rgba(255,247,230,.92), rgba(244,214,230,.92) 60%, rgba(124,90,150,.55))"
          : "rgba(90,74,85,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      {/* 떨어지는 콘페티 */}
      {[...Array(28)].map((_, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            top: "-12vh",
            left: `${(i * 37) % 100}%`,
            fontSize: 16 + (i % 4) * 8,
            animation: `celebrate-fall ${2.4 + (i % 5) * 0.5}s linear ${(i % 7) * 0.25}s infinite`,
          }}
        >
          {pieces[i % pieces.length]}
        </span>
      ))}

      <div
        className="pixel-border"
        style={{
          position: "relative",
          background: big ? "linear-gradient(135deg, #FFF7E6, #FBF3F8 60%, #FFF7E6)" : "var(--cream)",
          borderColor: big ? "#FBE6A8" : "#fff",
          boxShadow: big
            ? "0 0 0 3px #F2C76B, 0 0 30px rgba(224,169,74,.55), 4px 8px 0 rgba(124,90,150,.25)"
            : undefined,
          borderRadius: 18, padding: "26px 22px", textAlign: "center", maxWidth: 340,
          animation: "celebrate-pop .5s cubic-bezier(.2,.8,.2,1.4) both",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 0 }}>
          <CharacterReaction mood="happy" who="boy" size={92} />
          <CharacterReaction mood="happy" who="girl" size={92} />
        </div>

        <p className="day-pulse" style={{
          margin: "4px 0 0", fontSize: 46, lineHeight: 1,
          color: big ? "#E0A94A" : "#E8556F", fontWeight: 800,
          textShadow: big ? "0 0 18px rgba(224,169,74,.6)" : "none",
        }}>
          {day.toLocaleString()}<span style={{ fontSize: 22 }}>일</span>
        </p>

        <h2 style={{ fontSize: 19, color: "#B85C82", margin: "8px 0 6px" }}>
          {big ? "🎉 우리, 드디어 1000일! 🎉" : `🎉 우리 ${label} 축하해 ♥`}
        </h2>
        <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6A5A66", margin: "0 0 16px" }}>
          {big ? (
            <>방금 자정을 넘어 <b style={{ color: "#E0A94A" }}>천 일</b>이 됐어.<br />
            여기까지 함께 와줘서 고마워.<br />
            앞으로의 하루하루도 <b style={{ color: "#B85C82" }}>같이 걷자 ♥</b></>
          ) : (
            <>오늘로 우리 <b style={{ color: "#B85C82" }}>{label}</b>이야.<br />함께한 시간, 계속 쌓아가자!</>
          )}
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {big && (
            <Link href="/photobooth" className="btn-rose" style={{
              fontSize: 13, padding: "11px 18px", textDecoration: "none",
              background: "#E0A94A", boxShadow: "0 4px 0 rgba(156,122,46,.4)",
            }}>
              📸 1000일 사진 남기기
            </Link>
          )}
          <button className="btn-rose" onClick={onClose} style={{ fontSize: 13, padding: "11px 18px" }}>
            좋아 ♥
          </button>
        </div>
      </div>
    </div>
  );
}
