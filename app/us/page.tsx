"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const ITEMS = [
  { href: "/together", emoji: "⏳", title: "함께한 시간", desc: "초 단위로 쌓이는 우리" },
  { href: "/album", emoji: "📷", title: "추억 앨범", desc: "모은 추억 모아보기" },
  { href: "/wishes", emoji: "🎟", title: "소원권 보관함", desc: "뽑은 소원권 관리" },
  { href: "/kakao", emoji: "💬", title: "카톡 대화 분석", desc: "우리 대화 통계" },
  { href: "/saju", emoji: "🔮", title: "커플 사주·궁합", desc: "우리 둘의 기운" },
  { href: "/fortune", emoji: "🌙", title: "오늘의 운세", desc: "매일 바뀌어요" },
  { href: "/games/quiz", emoji: "💭", title: "커플 퀴즈", desc: "조각 모으기" },
  { href: "/games/roulette", emoji: "🎁", title: "소원권 룰렛", desc: "티켓으로 돌리기" },
];

export default function UsHub() {
  const router = useRouter();
  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
      <button onClick={() => router.push("/map")} style={{ color: "#B85C82", fontSize: 13, background: "none", border: "none", textDecoration: "none" }}>← 맵으로</button>
      <h1 style={{ fontSize: 22, color: "#B85C82", textAlign: "center", margin: "10px 0 2px" }}>우리의 공간 🌸</h1>
      <p style={{ fontSize: 12, color: "#8A7A85", textAlign: "center", margin: "0 0 18px" }}>함께 즐길 수 있는 것들</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {ITEMS.map((it) => (
          <Link key={it.href} href={it.href} className="pixel-border"
            style={{ textDecoration: "none", background: "var(--cream)", borderRadius: 16, padding: "18px 12px", textAlign: "center", display: "block" }}>
            <div className="floaty" style={{ fontSize: 34 }}>{it.emoji}</div>
            <p style={{ margin: "8px 0 2px", fontSize: 14, color: "#B85C82" }}>{it.title}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#9A8A95" }}>{it.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
