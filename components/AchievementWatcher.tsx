"use client";

import { useEffect, useRef, useState } from "react";
import { getProgressLocal } from "@/lib/progressClient";
import { getUnlocks } from "@/lib/unlocks";
import { getFlags } from "@/lib/flags";
import { computeAchievements } from "@/lib/achievements";

const SEEN = "our1000days-ach-seen";
interface Pop { id: string; emoji: string; title: string; }

export default function AchievementWatcher() {
  const [queue, setQueue] = useState<Pop[]>([]);
  const [current, setCurrent] = useState<Pop | null>(null);
  const inited = useRef(false);

  useEffect(() => {
    const readSeen = (): Set<string> => { try { return new Set(JSON.parse(localStorage.getItem(SEEN) ?? "[]")); } catch { return new Set(); } };
    const writeSeen = (s: Set<string>) => { try { localStorage.setItem(SEEN, JSON.stringify([...s])); } catch {} };

    const check = () => {
      const p = getProgressLocal();
      const list = computeAchievements({ collected: p.collectedSpots, pieces: p.heartPieces, unlocks: getUnlocks(), flags: getFlags() });
      const unlocked = list.filter((a) => a.unlocked);
      const firstRun = !inited.current && localStorage.getItem(SEEN) === null;
      const seen = readSeen();

      if (firstRun) {
        // 첫 실행: 이미 달성된 건 토스트 없이 seen 처리
        const s = new Set(unlocked.map((a) => a.id));
        writeSeen(s);
        inited.current = true;
        return;
      }
      inited.current = true;
      const fresh = unlocked.filter((a) => !seen.has(a.id));
      if (fresh.length) {
        fresh.forEach((a) => seen.add(a.id));
        writeSeen(seen);
        setQueue((q) => [...q, ...fresh.map((a) => ({ id: a.id, emoji: a.emoji, title: a.title }))]);
      }
    };

    check();
    window.addEventListener("ach-check", check);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.removeEventListener("ach-check", check);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  // 큐에서 하나씩 3초 표시
  useEffect(() => {
    if (current || queue.length === 0) return;
    const nextPop = queue[0];
    setCurrent(nextPop);
    setQueue((q) => q.slice(1));
    const t = setTimeout(() => setCurrent(null), 3000);
    return () => clearTimeout(t);
  }, [queue, current]);

  if (!current) return null;
  return (
    <div style={{ position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 200, pointerEvents: "none" }}>
      <div className="ach-pop pixel-border" style={{
        display: "flex", alignItems: "center", gap: 10, background: "var(--cream)",
        borderRadius: 14, padding: "10px 16px 10px 12px", boxShadow: "0 5px 0 rgba(124,90,150,0.25)",
        maxWidth: "92vw",
      }}>
        <span style={{ fontSize: 30 }}>{current.emoji}</span>
        <div style={{ textAlign: "left" }}>
          <p style={{ margin: 0, fontSize: 10.5, color: "#E8799F" }}>🏆 업적 달성!</p>
          <p style={{ margin: "1px 0 0", fontSize: 14, color: "#B85C82", whiteSpace: "nowrap" }}>{current.title}</p>
        </div>
      </div>
      <style>{`
        @keyframes achIn { 0%{transform:translateY(-26px) scale(.8);opacity:0} 60%{transform:translateY(4px) scale(1.04)} 100%{transform:translateY(0) scale(1);opacity:1} }
        .ach-pop { animation: achIn .4s cubic-bezier(.2,1.3,.4,1); }
      `}</style>
    </div>
  );
}
