"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BALANCE, QUESTIONS } from "@/lib/cards";

type Mode = "balance" | "question";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function CardsPage() {
  const [mode, setMode] = useState<Mode>("balance");
  const [seed, setSeed] = useState(0);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<"a" | "b" | null>(null);

  const deck = useMemo(() => mode === "balance" ? shuffle(BALANCE) : shuffle(QUESTIONS), [mode, seed]);
  const total = deck.length;

  const next = () => { setPick(null); setI((v) => (v + 1) % total); };
  const restart = (m: Mode) => { setMode(m); setSeed((s) => s + 1); setI(0); setPick(null); };

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh", textAlign: "center" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", margin: "12px 0 2px" }}>커플 카드게임 🃏</h1>
      <p style={{ fontSize: 11.5, color: "#8A7A85", margin: "0 0 14px" }}>둘이 번갈아 골라보고 이야기 나눠요</p>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        <button onClick={() => restart("balance")} className="chip" style={{ cursor: "pointer", border: mode === "balance" ? "2px solid var(--rose)" : "none", padding: "8px 16px" }}>⚖️ 밸런스 게임</button>
        <button onClick={() => restart("question")} className="chip" style={{ cursor: "pointer", border: mode === "question" ? "2px solid var(--rose)" : "none", padding: "8px 16px" }}>💬 알아가기</button>
      </div>

      <p style={{ fontSize: 12, color: "#A89AA3", marginBottom: 10 }}>{i + 1} / {total}</p>

      {mode === "balance" ? (
        <div key={`b${seed}-${i}`} className="slideup" style={{ display: "grid", gap: 12 }}>
          {(["a", "b"] as const).map((side) => {
            const card = deck[i] as { a: string; b: string };
            const selected = pick === side;
            const other = pick && !selected;
            return (
              <button key={side} onClick={() => setPick(side)}
                className="pixel-border" style={{
                  borderRadius: 16, padding: "26px 16px", fontSize: 17, lineHeight: 1.5, cursor: "pointer",
                  background: selected ? "var(--rose)" : "var(--cream)",
                  color: selected ? "#fff" : "#5A4A55",
                  opacity: other ? 0.5 : 1, transition: "all .2s",
                }}>
                {side === "a" ? card.a : card.b}
              </button>
            );
          })}
          <p style={{ fontSize: 12, color: "#8A7A85", margin: "2px 0" }}>
            {pick ? "서로 왜 골랐는지 말해보기! 🗣️" : "둘 중 하나를 골라보세요"}
          </p>
        </div>
      ) : (
        <div key={`q${seed}-${i}`} className="slideup pixel-border" style={{ background: "var(--cream)", borderRadius: 18, padding: "40px 20px", minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: 18, color: "#5A4A55", lineHeight: 1.7, margin: 0 }}>{(deck[i] as { q: string }).q}</p>
        </div>
      )}

      <button onClick={next} className="btn-rose" style={{ marginTop: 18, fontSize: 14 }}>다음 카드 →</button>
    </main>
  );
}
