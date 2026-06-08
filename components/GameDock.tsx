"use client";

import { useRouter } from "next/navigation";

// 화면 우측 구석 아이콘 메뉴. "처음으로"는 초기화 확인을 거친다.
export default function GameDock({ onHome }: { onHome?: () => void }) {
  const router = useRouter();
  const items = [
    { emoji: "🏠", label: "처음으로", act: () => (onHome ? onHome() : router.push("/")) },
    { emoji: "❓", label: "퀴즈", act: () => router.push("/games/quiz") },
    { emoji: "🎁", label: "룰렛", act: () => router.push("/games/roulette") },
  ];
  return (
    <div style={{ position: "absolute", top: 4, right: 4, zIndex: 30, display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it) => (
        <button key={it.label} onClick={it.act} aria-label={it.label}
          style={{
            width: 50, height: 50, borderRadius: 14, border: "2px solid #fff",
            background: "var(--blush)", boxShadow: "0 3px 0 rgba(124,90,150,0.25)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            lineHeight: 1, gap: 1,
          }}>
          <span style={{ fontSize: 19 }}>{it.emoji}</span>
          <span style={{ fontSize: 8.5, color: "#B85C82" }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}
