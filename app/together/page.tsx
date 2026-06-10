"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { elapsed } from "@/lib/config";
import { markFlag } from "@/lib/flags";

// 기념일: 100·200일 + 1주년 단위 + 1000일 단위
const MILESTONES: { day: number; label: string }[] = [
  { day: 100, label: "100일" },
  { day: 200, label: "200일" },
  { day: 365, label: "1주년" },
  { day: 730, label: "2주년" },
  { day: 1000, label: "1000일" },
  { day: 1095, label: "3주년" },
  { day: 1460, label: "4주년" },
  { day: 1825, label: "5주년" },
  { day: 2000, label: "2000일" },
  { day: 2190, label: "6주년" },
  { day: 2555, label: "7주년" },
  { day: 2920, label: "8주년" },
  { day: 3000, label: "3000일" },
];

export default function TogetherPage() {
  const [e, setE] = useState(() => elapsed());
  useEffect(() => {
    markFlag("together");
    const iv = setInterval(() => setE(elapsed()), 100);
    return () => clearInterval(iv);
  }, []);

  const next = MILESTONES.find((m) => m.day > e.dday) ?? {
    day: Math.ceil(e.dday / 1000) * 1000,
    label: `${Math.ceil(e.dday / 1000) * 1000}일`,
  };
  const prev = [...MILESTONES].reverse().find((m) => m.day <= e.dday) ?? { day: 1, label: "시작" };
  const span = next.day - prev.day;
  const progress = Math.min(100, Math.round(((e.dday - prev.day) / span) * 100));

  // 재미있는 환산
  const fun = [
    { emoji: "⏰", label: "함께한 시간", value: `${Math.floor(e.totalSeconds / 3600).toLocaleString()} 시간` },
    { emoji: "🌙", label: "함께 맞은 밤", value: `${e.days.toLocaleString()} 밤` },
    { emoji: "📅", label: "함께한 주", value: `${Math.floor(e.days / 7).toLocaleString()} 주` },
    { emoji: "🌸", label: "함께 보낸 계절", value: `${Math.floor(e.days / 91).toLocaleString()} 번` },
    { emoji: "🌕", label: "같이 본 보름달", value: `약 ${Math.floor(e.days / 29.5).toLocaleString()} 번` },
    { emoji: "💗", label: "두근거린 심장", value: `약 ${(e.days * 100000).toLocaleString()} 번` },
  ];

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 18px 40px", minHeight: "100dvh", textAlign: "center" }}>
      <style>{`
        @keyframes tick-pop {
          0% { transform: scale(1.35); opacity: .45; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left" }}>← 우리의 공간</Link>
      <p className="sparkle" style={{ fontSize: 12, color: "#B85C82", letterSpacing: 2, marginTop: 16 }}>SINCE 2023.10.08</p>
      <h1 style={{ fontSize: 22, color: "#B85C82", margin: "6px 0 2px" }}>우리가 함께한 시간 💗</h1>

      <div className="pixel-border" style={{ background: "var(--cream)", borderRadius: 18, padding: "22px 16px", margin: "18px 0" }}>
        <p style={{ fontSize: 13, color: "#8A7A85", margin: 0 }}>오늘로</p>
        <p style={{ fontSize: 40, color: "#E8556F", margin: "2px 0", lineHeight: 1.1 }}>{e.dday.toLocaleString()}<span style={{ fontSize: 20 }}>일째</span></p>
        {/* 실시간 시계 — 초가 눈에 띄게 */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ fontSize: 16, color: "#6A5A66" }}>{e.days}일</span>
          <span style={{ fontSize: 20, color: "#6A5A66", marginLeft: 4 }}>
            {String(e.h).padStart(2, "0")}:{String(e.m).padStart(2, "0")}:
          </span>
          <span
            key={e.s}
            style={{
              display: "inline-block",
              minWidth: 38,
              fontSize: 30,
              fontWeight: 800,
              color: "#E8556F",
              animation: "tick-pop .4s ease-out",
            }}
          >
            {String(e.s).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 12, color: "#B85C82", alignSelf: "flex-end", marginBottom: 4 }}>초</span>
        </div>
      </div>

      {/* 다음 기념일 진행바 */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 3px 0 rgba(124,90,150,0.12)", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8A7A85", marginBottom: 8 }}>
          <span>{prev.label}</span>
          <span style={{ color: "#E8556F" }}>다음 {next.label}까지 D-{next.day - e.dday}</span>
        </div>
        <div style={{ background: "#F1EFE8", borderRadius: 8, height: 14, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--rose)", borderRadius: 8, transition: "width .5s" }} />
        </div>
        <p style={{ fontSize: 11, color: "#A89AA3", margin: "6px 0 0" }}>{progress}% 왔어요</p>
      </div>

      {/* 재미있는 환산 통계 */}
      <p style={{ fontSize: 13, color: "#B85C82", textAlign: "left", margin: "0 0 10px" }}>📊 우리의 시간을 풀어보면</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {fun.map((f) => (
          <div key={f.label} style={{ background: "#fff", borderRadius: 12, padding: "12px 10px", boxShadow: "0 2px 0 rgba(124,90,150,0.1)" }}>
            <div style={{ fontSize: 22 }}>{f.emoji}</div>
            <p style={{ margin: "4px 0 1px", fontSize: 15, color: "#E8556F", fontWeight: 700 }}>{f.value}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#9A8A95" }}>{f.label}</p>
          </div>
        ))}
      </div>

      {/* 기념일 타임라인 — 컴팩트 2열 칩 */}
      <p style={{ fontSize: 13, color: "#B85C82", textAlign: "left", margin: "0 0 10px" }}>🗓️ 기념일 여정</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {MILESTONES.map((m) => {
          const passed = e.dday >= m.day;
          const isNext = m.day === next.day;
          return (
            <div key={m.day} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 11px", borderRadius: 10,
              background: passed ? "var(--blush)" : "#fff",
              boxShadow: isNext ? "0 0 0 2px var(--rose)" : "0 2px 0 rgba(124,90,150,0.08)",
            }}>
              <span style={{ fontSize: 14 }}>{passed ? "💗" : "🤍"}</span>
              <span style={{ flex: 1, textAlign: "left", fontSize: 13, fontWeight: 600, color: passed ? "#B85C82" : "#9A8A95" }}>{m.label}</span>
              <span style={{ fontSize: 10, color: passed ? "#C98AA6" : "#E8556F" }}>{passed ? "✓" : `D-${m.day - e.dday}`}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
