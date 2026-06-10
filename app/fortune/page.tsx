"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ME, OPPA, dailyFortune, coupleTip, todayKey, Person } from "@/lib/fortune";
import TicketGate from "@/components/TicketGate";

function CountUp({ target, duration = 900 }: { target: number; duration?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <>{v}</>;
}

function Stars({ n, delay = 0 }: { n: number; delay?: number }) {
  return (
    <span style={{ color: "#E8799F", letterSpacing: 1 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="ft-star" style={{ animationDelay: `${delay + i * 0.08}s`, color: i < n ? "#E8799F" : "#E3D4DE", display: "inline-block" }}>
          {i < n ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

function FortuneCard({ p, dateKey, index }: { p: Person; dateKey: string; index: number }) {
  const f = dailyFortune(p, dateKey);
  return (
    <div className="pixel-border ft-card" style={{ background: "var(--cream)", borderRadius: 16, padding: "16px 14px", animationDelay: `${index * 0.14}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 14, color: "#B85C82" }}>{p.name}의 운세</span>
        <span style={{ fontSize: 20, color: "#E8556F", fontWeight: 800 }}><CountUp target={f.score} />점</span>
      </div>
      <p style={{ margin: "8px 0 12px", fontSize: 13, color: "#5A4A55", lineHeight: 1.6 }}>{f.total}</p>
      <div style={{ display: "grid", gap: 5, marginBottom: 10 }}>
        {f.cats.map((c, ci) => (
          <div key={c.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
            <span style={{ color: "#6A5A66" }}>{c.label}</span>
            <Stars n={c.stars} delay={0.2 + ci * 0.12} />
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
    <TicketGate
      unlockKey="fortune"
      title="오늘의 운세"
      iconName="moon"
      cost={1}
      revealMs={3000}
      revealMessages={["별님에게 물어보고 있어요", "오늘의 기운을 모으는 중", "두 사람의 운세를 펼치고 있어요"]}
    >
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>

      <div style={{ position: "relative", textAlign: "center", margin: "12px 0 2px" }}>
        <span style={{ position: "absolute", left: "16%", top: 0, fontSize: 12, color: "#D9A7C4", animation: "ft-twinkle 1.8s ease-in-out infinite" }}>✦</span>
        <span style={{ position: "absolute", right: "18%", top: 6, fontSize: 14, color: "#CDB8E6", animation: "ft-twinkle 2.2s .4s ease-in-out infinite" }}>✧</span>
        <span style={{ position: "absolute", right: "30%", top: -4, fontSize: 9, color: "#E8799F", animation: "ft-twinkle 1.5s .7s ease-in-out infinite" }}>⋆</span>
        <h1 style={{ fontSize: 20, color: "#B85C82", margin: 0, display: "inline-block" }}>
          오늘의 운세 <span style={{ display: "inline-block", animation: "ft-moon 3s ease-in-out infinite" }}>🌙</span>
        </h1>
      </div>
      <p style={{ fontSize: 11, color: "#A89AA3", textAlign: "center", margin: "0 0 16px" }}>
        {today.getFullYear()}.{String(today.getMonth() + 1).padStart(2, "0")}.{String(today.getDate()).padStart(2, "0")} · 매일 바뀌어요
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        <FortuneCard p={OPPA} dateKey={dateKey} index={0} />
        <FortuneCard p={ME} dateKey={dateKey} index={1} />
      </div>

      <div className="pixel-border ft-card" style={{ background: "#fff", borderRadius: 16, padding: "16px", marginTop: 14, textAlign: "center", animationDelay: "0.3s" }}>
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
