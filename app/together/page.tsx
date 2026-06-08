"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { elapsed } from "@/lib/config";
import { markFlag } from "@/lib/flags";

const MILESTONES = [100, 200, 300, 365, 500, 600, 700, 730, 1000, 1095, 1500, 2000, 3000];

export default function TogetherPage() {
  const [e, setE] = useState(() => elapsed());
  useEffect(() => {
    markFlag("together");
    const iv = setInterval(() => setE(elapsed()), 100);
    return () => clearInterval(iv);
  }, []);

  const next = MILESTONES.find((m) => m > e.dday) ?? (Math.ceil(e.dday / 1000) * 1000);
  const prev = [...MILESTONES].reverse().find((m) => m <= e.dday) ?? 1;
  const span = next - prev;
  const progress = Math.min(100, Math.round(((e.dday - prev) / span) * 100));

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
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left" }}>← 우리의 공간</Link>
      <p className="sparkle" style={{ fontSize: 12, color: "#B85C82", letterSpacing: 2, marginTop: 16 }}>SINCE 2023.10.08</p>
      <h1 style={{ fontSize: 22, color: "#B85C82", margin: "6px 0 2px" }}>우리가 함께한 시간 💗</h1>

      <div className="pixel-border" style={{ background: "var(--cream)", borderRadius: 18, padding: "22px 16px", margin: "18px 0" }}>
        <p style={{ fontSize: 13, color: "#8A7A85", margin: 0 }}>오늘로</p>
        <p style={{ fontSize: 40, color: "#E8556F", margin: "2px 0", lineHeight: 1.1 }}>{e.dday.toLocaleString()}<span style={{ fontSize: 20 }}>일째</span></p>
        <p style={{ fontSize: 15, color: "#6A5A66", margin: "8px 0 0" }}>
          {e.days}일 {String(e.h).padStart(2, "0")}:{String(e.m).padStart(2, "0")}:{String(e.s).padStart(2, "0")}
        </p>
      </div>

      {/* 다음 기념일 진행바 */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 3px 0 rgba(124,90,150,0.12)", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8A7A85", marginBottom: 8 }}>
          <span>{prev}일</span>
          <span style={{ color: "#E8556F" }}>다음 {next.toLocaleString()}일까지 D-{next - e.dday}</span>
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

      {/* 기념일 타임라인 */}
      <p style={{ fontSize: 13, color: "#B85C82", textAlign: "left", margin: "0 0 10px" }}>🗓️ 기념일 여정</p>
      <div style={{ display: "grid", gap: 7 }}>
        {MILESTONES.map((m) => {
          const passed = e.dday >= m;
          return (
            <div key={m} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 10,
              background: passed ? "var(--blush)" : "#fff", boxShadow: "0 2px 0 rgba(124,90,150,0.08)",
            }}>
              <span style={{ fontSize: 15 }}>{passed ? "💗" : "🤍"}</span>
              <span style={{ flex: 1, textAlign: "left", fontSize: 13, color: passed ? "#B85C82" : "#9A8A95" }}>{m.toLocaleString()}일</span>
              <span style={{ fontSize: 11, color: passed ? "#C98AA6" : "#E8556F" }}>{passed ? "지나옴 ✓" : `D-${m - e.dday}`}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
