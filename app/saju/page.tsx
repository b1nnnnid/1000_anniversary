"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ME, OPPA, zodiacAnimal, starSign, dayElement, compatibility, Person } from "@/lib/fortune";
import TicketGate from "@/components/TicketGate";

function CountUp({ target, duration = 1100 }: { target: number; duration?: number }) {
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

function PersonCard({ p, index }: { p: Person; index: number }) {
  const an = zodiacAnimal(p.y), sg = starSign(p.m, p.d), el = dayElement(p.y);
  return (
    <div className="pixel-border sj-card" style={{ background: "var(--cream)", borderRadius: 16, padding: "14px 12px", textAlign: "center", animationDelay: `${index * 0.12}s` }}>
      <p style={{ margin: 0, fontSize: 14, color: "#B85C82" }}>{p.name}</p>
      <p style={{ margin: "2px 0 10px", fontSize: 11, color: "#A89AA3" }}>
        {p.y}.{String(p.m).padStart(2, "0")}.{String(p.d).padStart(2, "0")}{p.hour != null ? ` ${p.hour}:${String(p.min ?? 0).padStart(2, "0")}` : ""}
      </p>
      <div style={{ fontSize: 34, display: "inline-block", animation: "sj-bob 3s ease-in-out infinite", animationDelay: `${index * 0.4}s` }}>{an.emoji}</div>
      <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5A4A55" }}>{an.name}띠</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8, fontSize: 11, flexWrap: "wrap" }}>
        <span className="chip">{sg.emoji} {sg.name}</span>
        <span className="chip">{el.emoji} {el.elem}({el.stem})</span>
      </div>
    </div>
  );
}

function SajuContent() {
  const c = compatibility();
  const [boot, setBoot] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBoot(true), 300); return () => clearTimeout(t); }, []);

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>

      <div style={{ position: "relative", textAlign: "center", margin: "12px 0 2px" }}>
        <span style={{ position: "absolute", left: "18%", top: 0, fontSize: 12, color: "#CDB8E6", animation: "sj-twinkle 1.8s ease-in-out infinite" }}>✦</span>
        <span style={{ position: "absolute", right: "20%", top: 4, fontSize: 13, color: "#E8799F", animation: "sj-twinkle 2.2s .4s ease-in-out infinite" }}>✧</span>
        <h1 style={{ fontSize: 20, color: "#B85C82", margin: 0, display: "inline-block" }}>
          커플 사주 · 궁합 <span style={{ display: "inline-block", animation: "sj-bob 3s ease-in-out infinite" }}>🔮</span>
        </h1>
      </div>
      <p style={{ fontSize: 11, color: "#A89AA3", textAlign: "center", margin: "0 0 16px" }}>재미로 보는 우리 둘의 기운</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <PersonCard p={OPPA} index={0} />
        <PersonCard p={ME} index={1} />
      </div>

      <div className="pixel-border sj-card" style={{ background: "#fff", borderRadius: 18, padding: "20px 16px", textAlign: "center", animationDelay: "0.28s" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#8A7A85" }}>우리 궁합</p>
        <p style={{ margin: "2px 0", fontSize: 46, color: "#E8556F", lineHeight: 1.1, display: "inline-block", animation: "sj-pulse 2.4s ease-in-out infinite" }}>
          <CountUp target={c.score} /><span style={{ fontSize: 20 }}>점</span>
        </p>
        <p style={{ margin: "0 0 14px", fontSize: 16, color: "#B85C82" }}>{c.title}</p>
        <div style={{ display: "grid", gap: 8, textAlign: "left", marginBottom: 12 }}>
          {c.bars.map((b, i) => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#6A5A66", width: 64 }}>{b.label}</span>
              <div style={{ flex: 1, background: "#F1EFE8", borderRadius: 6, height: 14, overflow: "hidden" }}>
                <div style={{
                  width: boot ? `${b.value}%` : "0%", height: "100%", background: "#E8799F", borderRadius: 6,
                  transition: `width 1.1s ${0.1 + i * 0.12}s cubic-bezier(.22,.8,.24,1)`,
                }} />
              </div>
              <span style={{ fontSize: 11, color: "#9A8A95", width: 30 }}>{boot ? b.value : 0}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#6A5A66", lineHeight: 1.7 }}>{c.comment}</p>
      </div>

      <p style={{ textAlign: "center", marginTop: 18 }}>
        <Link href="/fortune" style={{ fontSize: 13, color: "#B85C82" }}>🌙 오늘의 운세 보러가기 →</Link>
      </p>
      <p style={{ fontSize: 10, color: "#B8AEB4", textAlign: "center", marginTop: 8 }}>
        ※ 정통 명리학이 아닌 재미용 콘텐츠예요
      </p>
    </main>
  );
}

export default function SajuPage() {
  return (
    <TicketGate
      unlockKey="saju"
      title="커플 사주·궁합"
      iconName="crystal"
      cost={1}
      revealMs={3000}
      revealMessages={["두 사람의 사주를 풀어보는 중", "별자리와 띠를 맞춰보고 있어요", "궁합의 기운을 계산하는 중"]}
    >
      <SajuContent />
    </TicketGate>
  );
}
