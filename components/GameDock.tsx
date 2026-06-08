"use client";

import { useRouter } from "next/navigation";

interface Props {
  onHome?: () => void;
  gamesLocked?: boolean;      // 추억탐방 완주 전엔 퀴즈/룰렛 잠금
  onLockedTry?: () => void;   // 잠긴 걸 눌렀을 때
}

export default function GameDock({ onHome, gamesLocked = false, onLockedTry }: Props) {
  const router = useRouter();
  const items = [
    { emoji: "🏠", label: "처음으로", lockable: false, act: () => (onHome ? onHome() : router.push("/")) },
    { emoji: "❓", label: "퀴즈", lockable: true, act: () => router.push("/games/quiz") },
    { emoji: "🎁", label: "룰렛", lockable: true, act: () => router.push("/games/roulette") },
  ];
  return (
    <div style={{ position: "absolute", top: 4, right: 4, zIndex: 30, display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it) => {
        const locked = gamesLocked && it.lockable;
        return (
          <button key={it.label} aria-label={it.label + (locked ? " (잠김)" : "")}
            onClick={() => (locked ? onLockedTry?.() : it.act())}
            style={{
              width: 50, height: 50, borderRadius: 14, border: "2px solid #fff",
              background: locked ? "#E2DCE0" : "var(--blush)",
              boxShadow: "0 3px 0 rgba(124,90,150,0.25)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              lineHeight: 1, gap: 1, position: "relative",
              opacity: locked ? 0.85 : 1,
            }}>
            <span style={{ fontSize: 19, filter: locked ? "grayscale(1)" : "none" }}>{it.emoji}</span>
            <span style={{ fontSize: 8.5, color: locked ? "#9A8A95" : "#B85C82" }}>{it.label}</span>
            {locked && (
              <span style={{ position: "absolute", top: -6, right: -6, fontSize: 14 }}>🔒</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
