"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { QUESTIONS, TYPE_QUESTIONS, resultType, Axis, CoupleType } from "@/lib/cards";
import { markFlag } from "@/lib/flags";

type Mode = "type" | "question";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function CardsPage() {
  const [mode, setMode] = useState<Mode>("type");

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh", textAlign: "center" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", margin: "12px 0 2px" }}>커플 카드 🃏</h1>
      <p style={{ fontSize: 11.5, color: "#8A7A85", margin: "0 0 14px" }}>둘이 함께 즐겨요</p>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}>
        <button onClick={() => setMode("type")} className="chip" style={{ cursor: "pointer", border: mode === "type" ? "2px solid var(--rose)" : "none", padding: "8px 16px" }}>🔮 유형 테스트</button>
        <button onClick={() => setMode("question")} className="chip" style={{ cursor: "pointer", border: mode === "question" ? "2px solid var(--rose)" : "none", padding: "8px 16px" }}>💬 알아가기</button>
      </div>

      {mode === "type" ? <TypeTest /> : <QuestionDeck />}
    </main>
  );
}

// ── 커플 유형 테스트 ──
function TypeTest() {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [i, setI] = useState(0);
  const [counts, setCounts] = useState<Record<Axis, number>>({ E: 0, C: 0, P: 0, F: 0 });
  const [result, setResult] = useState<CoupleType | null>(null);

  const start = () => { setI(0); setCounts({ E: 0, C: 0, P: 0, F: 0 }); setResult(null); setPhase("play"); };

  const pick = (axis: Axis) => {
    const next = { ...counts, [axis]: counts[axis] + 1 };
    setCounts(next);
    if (i + 1 < TYPE_QUESTIONS.length) setI(i + 1);
    else { setResult(resultType(next)); setPhase("done"); markFlag("cards"); }
  };

  if (phase === "intro") {
    return (
      <div className="slideup" style={{ paddingTop: 14 }}>
        <div className="floaty" style={{ fontSize: 56 }}>🔮</div>
        <h2 style={{ fontSize: 18, color: "#B85C82", margin: "14px 0 8px" }}>우리는 어떤 커플일까?</h2>
        <p style={{ fontSize: 13, color: "#8A7A85", lineHeight: 1.7, margin: "0 0 20px" }}>
          {TYPE_QUESTIONS.length}개의 질문에 <b style={{ color: "#B85C82" }}>둘이 함께</b> 답하면<br />우리 커플 유형이 나와요!
        </p>
        <button className="btn-rose" onClick={start} style={{ fontSize: 15 }}>테스트 시작 →</button>
      </div>
    );
  }

  if (phase === "done" && result) {
    return (
      <div className="slideup pixel-border" style={{ background: "var(--cream)", borderRadius: 18, padding: "26px 20px", marginTop: 10 }}>
        <p style={{ fontSize: 12, color: "#A89AA3", margin: 0 }}>우리 커플 유형은</p>
        <div className="floaty" style={{ fontSize: 60, margin: "8px 0" }}>{result.emoji}</div>
        <p style={{ fontSize: 12, color: "#E8799F", letterSpacing: 2, margin: 0 }}>{result.code} TYPE</p>
        <h2 style={{ fontSize: 20, color: "#B85C82", margin: "4px 0 12px" }}>{result.title}</h2>
        <p style={{ fontSize: 14, color: "#5A4A55", lineHeight: 1.8, margin: 0 }}>{result.desc}</p>
        <button className="btn-rose" onClick={start} style={{ fontSize: 14, marginTop: 20 }}>다시 해보기</button>
      </div>
    );
  }

  const q = TYPE_QUESTIONS[i];
  return (
    <div className="slideup">
      <div style={{ display: "flex", gap: 5, margin: "4px 0 16px" }}>
        {TYPE_QUESTIONS.map((_, k) => (
          <div key={k} style={{ flex: 1, height: 6, borderRadius: 3, background: k < i ? "var(--rose)" : k === i ? "var(--lav)" : "#E8DCE6" }} />
        ))}
      </div>
      <div key={i} className="pop pixel-border" style={{ background: "var(--cream)", borderRadius: 16, padding: "24px 18px", marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: "#9A8A95", margin: 0 }}>Q{i + 1}.</p>
        <p style={{ fontSize: 17, color: "#5A4A55", margin: "8px 0 0", lineHeight: 1.5 }}>{q.q}</p>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {q.options.map((opt, k) => (
          <button key={k} onClick={() => pick(opt.axis)} style={{
            background: "#fff", color: "#5A4A55", border: "2px solid var(--lav)", borderRadius: 12,
            padding: "14px", fontSize: 14, cursor: "pointer", boxShadow: "0 3px 0 rgba(124,90,150,0.15)",
          }}>{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

// ── 알아가기 질문 덱 ──
function QuestionDeck() {
  const [seed, setSeed] = useState(0);
  const [i, setI] = useState(0);
  const deck = useMemo(() => shuffle(QUESTIONS), [seed]);
  const next = () => { if (i + 1 < deck.length) setI(i + 1); else { setSeed((s) => s + 1); setI(0); } };

  return (
    <div className="slideup">
      <p style={{ fontSize: 12, color: "#A89AA3", marginBottom: 10 }}>{i + 1} / {deck.length}</p>
      <div key={`${seed}-${i}`} className="slideup pixel-border" style={{ background: "var(--cream)", borderRadius: 18, padding: "44px 20px", minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 18, color: "#5A4A55", lineHeight: 1.7, margin: 0 }}>{deck[i].q}</p>
      </div>
      <button onClick={next} className="btn-rose" style={{ marginTop: 18, fontSize: 14 }}>다음 카드 →</button>
    </div>
  );
}
