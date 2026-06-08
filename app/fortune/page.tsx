"use client";

import { useState } from "react";
import Link from "next/link";
import { ME, OPPA, dailyFortune, coupleTip, todayKey, Person } from "@/lib/fortune";
import TicketGate from "@/components/TicketGate";

function stars(n: number) { return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }

function FortuneCard({ p, dateKey }: { p: Person; dateKey: string }) {
  const f = dailyFortune(p, dateKey);
  return (
    <div className="pixel-border" style={{ background: "var(--cream)", borderRadius: 16, padding: "16px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 14, color: "#B85C82" }}>{p.name}의 운세</span>
        <span style={{ fontSize: 20, color: "#E8556F" }}>{f.score}점</span>
      </div>
      <p style={{ margin: "8px 0 12px", fontSize: 13, color: "#5A4A55", lineHeight: 1.6 }}>{f.total}</p>
      <div style={{ display: "grid", gap: 5, marginBottom: 10 }}>
        {f.cats.map((c) => (
          <div key={c.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
            <span style={{ color: "#6A5A66" }}>{c.label}</span>
            <span style={{ color: "#E8799F", letterSpacing: 1 }}>{stars(c.stars)}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: "0 0 8px", fontSize: 12, color: "#8A7A85", lineHeight: 1.6 }}>💕 {f.love}</p>
      <div style={{ display: "flex", gap: 6, fontSize: 11 }}>
        <span className="chip">🎨 행운색 {f.color}</span>
        <span className="chip">🔢 행운수 {f.number}</span>
      </div>
    </div>
  );
}

export default function FortunePage() {
  const [dateKey] = useState(() => todayKey());
  const tip = coupleTip(dateKey);
  const today = new Date();
  return (
    <TicketGate unlockKey="fortune" title="오늘의 운세" iconName="moon" cost={1}>
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 2px" }}>오늘의 운세 🌙</h1>
      <p style={{ fontSize: 11, color: "#A89AA3", textAlign: "center", margin: "0 0 16px" }}>
        {today.getFullYear()}.{String(today.getMonth() + 1).padStart(2, "0")}.{String(today.getDate()).padStart(2, "0")} · 매일 바뀌어요
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        <FortuneCard p={OPPA} dateKey={dateKey} />
        <FortuneCard p={ME} dateKey={dateKey} />
      </div>

      <div className="pixel-border" style={{ background: "#fff", borderRadius: 16, padding: "16px", marginTop: 14, textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#B85C82" }}>💑 오늘 둘이 하면 좋은 것</p>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#5A4A55" }}>{tip}</p>
      </div>

      <p style={{ textAlign: "center", marginTop: 16 }}>
        <Link href="/saju" style={{ fontSize: 13, color: "#B85C82" }}>🔮 커플 사주·궁합 보기 →</Link>
      </p>
    </main>
    </TicketGate>
  );
}
