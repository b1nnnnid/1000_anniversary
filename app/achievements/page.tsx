"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProgress } from "@/lib/progressClient";
import { getUnlocks } from "@/lib/unlocks";
import { computeAchievements } from "@/lib/achievements";

export default function AchievementsPage() {
  const [list, setList] = useState<ReturnType<typeof computeAchievements>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getProgress().then((p) => {
      setList(computeAchievements({ collected: p.collectedSpots, pieces: p.heartPieces, unlocks: getUnlocks() }));
      setLoaded(true);
    });
  }, []);

  const got = list.filter((a) => a.unlocked).length;

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 2px" }}>업적 도감 🏆</h1>
      {loaded && (
        <p style={{ fontSize: 12, color: "#8A7A85", textAlign: "center", margin: "0 0 16px" }}>
          {got} / {list.length} 달성
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {list.map((a) => (
          <div key={a.id} className="pixel-border" style={{
            borderRadius: 14, padding: "16px 10px", textAlign: "center",
            background: a.unlocked ? "var(--cream)" : "#F1EFE8",
            opacity: a.unlocked ? 1 : 0.7,
          }}>
            <div style={{ fontSize: 34, filter: a.unlocked ? "none" : "grayscale(1)", opacity: a.unlocked ? 1 : 0.45 }}>
              {a.unlocked ? a.emoji : "❔"}
            </div>
            <p style={{ margin: "8px 0 2px", fontSize: 13, color: a.unlocked ? "#B85C82" : "#9A8A95" }}>
              {a.unlocked ? a.title : "???"}
            </p>
            <p style={{ margin: 0, fontSize: 10.5, color: "#9A8A95", lineHeight: 1.5 }}>{a.desc}</p>
            {a.unlocked && <p style={{ margin: "6px 0 0", fontSize: 10, color: "#E8799F" }}>✓ 달성</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
