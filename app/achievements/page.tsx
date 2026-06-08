"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CharacterReaction from "@/components/CharacterReaction";
import { getProgress } from "@/lib/progressClient";
import { getUnlocks } from "@/lib/unlocks";
import { getFlags } from "@/lib/flags";
import { computeAchievements } from "@/lib/achievements";

export default function AchievementsPage() {
  const [list, setList] = useState<ReturnType<typeof computeAchievements>>([]);
  const [loaded, setLoaded] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const celeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getProgress().then((p) => {
      const computed = computeAchievements({ collected: p.collectedSpots, pieces: p.heartPieces, unlocks: getUnlocks(), flags: getFlags() });
      setList(computed);
      setLoaded(true);
      if (computed.length > 0 && computed.every((a) => a.unlocked)) showCelebration();
    });
    return () => { if (celeTimer.current) clearTimeout(celeTimer.current); };
  }, []);

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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {list.map((a) => (
          <div key={a.id} className="pixel-border" style={{
            borderRadius: 14, padding: "16px 10px", textAlign: "center",
            background: a.unlocked ? "var(--cream)" : "#F1EFE8", opacity: a.unlocked ? 1 : 0.7,
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
