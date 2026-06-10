"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CharacterReaction from "@/components/CharacterReaction";
import { getProgress } from "@/lib/progressClient";
import { getUnlocks } from "@/lib/unlocks";
import { getFlags } from "@/lib/flags";
import { computeAchievements, ACH_SERIES } from "@/lib/achievements";

type AchItem = ReturnType<typeof computeAchievements>[number];
interface SeriesData { id: string; name: string; cur: number; total: number; unit: string; tiers: AchItem[]; }

function SeriesCard({ s, delay }: { s: SeriesData; delay: number }) {
  const pct = s.total ? Math.min(100, (s.cur / s.total) * 100) : 0;
  const unlockedCount = s.tiers.filter((t) => t.unlocked).length;
  const fill = s.tiers.length > 1 ? Math.max(0, (unlockedCount - 1) / (s.tiers.length - 1)) * 100 : 0;
  return (
    <div className="pixel-border k-pop" style={{ borderRadius: 14, padding: "14px 16px", background: "#fff", marginBottom: 12, animationDelay: `${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: 14, color: "#B85C82", fontWeight: 600 }}>{s.name}</p>
        <span style={{ fontSize: 12, color: "#E8556F" }}>{s.cur}/{s.total}{s.unit}</span>
      </div>
      <div style={{ background: "#F1EFE8", borderRadius: 6, height: 8, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, var(--rose), var(--lav))", borderRadius: 6, transition: "width .7s cubic-bezier(.22,.8,.24,1)" }} />
      </div>
      <div style={{ position: "relative", paddingLeft: 32 }}>
        <span style={{ position: "absolute", left: 13, top: 8, bottom: 8, width: 2, background: "#EAD9E4", borderRadius: 2 }} />
        <span style={{ position: "absolute", left: 13, top: 8, width: 2, height: `calc((100% - 16px) * ${fill / 100})`, background: "var(--rose)", borderRadius: 2, transition: "height .7s .2s cubic-bezier(.22,.8,.24,1)" }} />
        {s.tiers.map((t, i) => (
          <div key={t.id} style={{ position: "relative", marginBottom: i < s.tiers.length - 1 ? 11 : 0, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              position: "absolute", left: -32, top: "50%", marginTop: -12, width: 24, height: 24, borderRadius: "50%",
              background: t.unlocked ? "var(--rose)" : "#fff", border: `2px solid ${t.unlocked ? "var(--rose)" : "#D9C7D2"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              filter: t.unlocked ? "none" : "grayscale(1)", opacity: t.unlocked ? 1 : 0.6, zIndex: 1,
            }}>{t.unlocked ? t.emoji : "❔"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, color: t.unlocked ? "#B85C82" : "#A89AA3", fontWeight: 600 }}>{t.title}</p>
              <p style={{ margin: "1px 0 0", fontSize: 10.5, color: "#9A8A95", lineHeight: 1.4 }}>{t.desc}</p>
            </div>
            <span style={{ flexShrink: 0, fontSize: 10, color: t.unlocked ? "#E8799F" : "#C5B7C0" }}>{t.unlocked ? "✓ 달성" : "잠김"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const [list, setList] = useState<AchItem[]>([]);
  const [series, setSeries] = useState<SeriesData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const celeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getProgress().then((p) => {
      const ctx = { collected: p.collectedSpots, pieces: p.heartPieces, unlocks: getUnlocks(), flags: getFlags() };
      const computed = computeAchievements(ctx);
      setList(computed);
      setSeries(ACH_SERIES.map((s) => {
        const prog = s.progress(ctx);
        return { id: s.id, name: s.name, ...prog, tiers: computed.filter((a) => a.series === s.id).sort((a, b) => (a.tier ?? 0) - (b.tier ?? 0)) };
      }));
      setLoaded(true);
      if (computed.length > 0 && computed.every((a) => a.unlocked)) showCelebration();
    });
    return () => { if (celeTimer.current) clearTimeout(celeTimer.current); };
  }, []);

  const standalone = list.filter((a) => !a.series);

  const showCelebration = () => {
    setCelebrate(true);
    celeTimer.current = setTimeout(() => setCelebrate(false), 4600); // 5초 이내
  };

  const got = list.filter((a) => a.unlocked).length;
  const allDone = loaded && got === list.length && list.length > 0;

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 2px" }}>업적 도감 🏆</h1>
      {loaded && (
        <p style={{ fontSize: 12, color: "#8A7A85", textAlign: "center", margin: "0 0 16px" }}>
          {got} / {list.length} 달성{allDone && " · 올 클리어! 🎉"}
        </p>
      )}

      {allDone && (
        <p style={{ textAlign: "center", marginBottom: 12 }}>
          <button onClick={showCelebration} className="chip" style={{ cursor: "pointer", border: "none" }}>🎉 축하 애니메이션 다시 보기</button>
        </p>
      )}

      {/* 연속 단계 업적 (시리즈 사다리) */}
      {series.map((s, i) => <SeriesCard key={s.id} s={s} delay={i * 0.08} />)}

      {/* 단독 업적 */}
      {standalone.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: series.length ? 4 : 0 }}>
          {standalone.map((a, i) => (
            <div key={a.id} className="pixel-border k-pop" style={{
              borderRadius: 14, padding: "16px 10px", textAlign: "center",
              background: a.unlocked ? "var(--cream)" : "#F1EFE8", opacity: a.unlocked ? 1 : 0.7,
              animationDelay: `${0.2 + i * 0.04}s`,
            }}>
              <div style={{ fontSize: 34, filter: a.unlocked ? "none" : "grayscale(1)", opacity: a.unlocked ? 1 : 0.45 }}>
                {a.unlocked ? a.emoji : "❔"}
              </div>
              <p style={{ margin: "8px 0 2px", fontSize: 13, color: a.unlocked ? "#B85C82" : "#9A8A95" }}>{a.unlocked ? a.title : "???"}</p>
              <p style={{ margin: 0, fontSize: 10.5, color: "#9A8A95", lineHeight: 1.5 }}>{a.desc}</p>
              {a.unlocked && <p style={{ margin: "6px 0 0", fontSize: 10, color: "#E8799F" }}>✓ 달성</p>}
            </div>
          ))}
        </div>
      )}

      {celebrate && (
        <div onClick={() => setCelebrate(false)} style={{
          position: "fixed", inset: 0, zIndex: 90, background: "rgba(90,74,85,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer",
        }}>
          {[...Array(18)].map((_, i) => (
            <span key={i} style={{
              position: "absolute", top: "-8%", left: `${(i * 53) % 100}%`, fontSize: 16 + (i % 3) * 8,
              animation: `confettiFall ${2 + (i % 4) * 0.5}s linear ${(i % 6) * 0.25}s infinite`,
            }}>{["🎉", "🏆", "💗", "✨", "🎊", "⭐"][i % 6]}</span>
          ))}
          <div className="pop" style={{ textAlign: "center", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 0 }}>
              <span className="bounceA"><CharacterReaction mood="happy" who="boy" size={104} /></span>
              <span className="bounceB"><CharacterReaction mood="happy" who="girl" size={104} /></span>
            </div>
            <p style={{ fontSize: 30, margin: "4px 0 0" }}>🏆</p>
            <h2 style={{ fontSize: 20, color: "#fff", margin: "4px 0", textShadow: "0 2px 4px rgba(90,40,70,0.5)" }}>올 클리어!</h2>
            <p style={{ fontSize: 13, color: "#FBE0EC", margin: 0 }}>모든 업적을 달성했어요 🎉</p>
          </div>

          <style>{`
            @keyframes confettiFall { 0%{transform:translateY(0) rotate(0)} 100%{transform:translateY(120vh) rotate(360deg)} }
            @keyframes bA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
            @keyframes bB { 0%,100%{transform:translateY(-14px)} 50%{transform:translateY(0)} }
            .bounceA{display:inline-block;animation:bA .6s ease-in-out infinite}
            .bounceB{display:inline-block;animation:bB .6s ease-in-out infinite}
          `}</style>
        </div>
      )}
    </main>
  );
}
