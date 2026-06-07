"use client";

import { useRouter } from "next/navigation";

const ITEMS = [
  { emoji: "🏠", label: "처음", href: "/" },
  { emoji: "❓", label: "퀴즈", href: "/games/quiz" },
  { emoji: "🎁", label: "룰렛", href: "/games/roulette" },
];

// 화면 우측 구석에 세로로 떠 있는 아이콘 메뉴
export default function GameDock() {
  const router = useRouter();
  return (
    <div style={{
      position: "absolute", top: 4, right: 4, zIndex: 30,
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {ITEMS.map((it) => (
        <button key={it.href} onClick={() => router.push(it.href)} aria-label={it.label}
          style={{
            width: 50, height: 50, borderRadius: 14, border: "2px solid #fff",
            background: "var(--blush)", boxShadow: "0 3px 0 rgba(124,90,150,0.25)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            lineHeight: 1, gap: 1,
          }}>
          <span style={{ fontSize: 19 }}>{it.emoji}</span>
          <span style={{ fontSize: 9, color: "#B85C82" }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}
