"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { QUESTIONS, SYNC_ROUNDS, syncVerdict } from "@/lib/cards";
import { markFlag } from "@/lib/flags";

type Mode = "sync" | "question";

// 플레이어 색/이름 (한 폰으로 번갈아)
const P = {
  p1: { name: "숯댕이 💗", color: "#E8556F", bg: "#FBEAF0", border: "#F4C0D1" },
  p2: { name: "옵빵이 💙", color: "#3E7BC2", bg: "#E6F0FB", border: "#B5D4F4" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function CardsPage() {
  const [mode, setMode] = useState<Mode>("sync");

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh", textAlign: "center" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", margin: "12px 0 2px" }}>커플 카드 🃏</h1>
      <p style={{ fontSize: 11.5, color: "#8A7A85", margin: "0 0 14px" }}>둘이 함께 즐겨요</p>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}>
        <button onClick={() => setMode("sync")} className="chip" style={{ cursor: "pointer", border: mode === "sync" ? "2px solid var(--rose)" : "none", padding: "8px 16px" }}>💞 싱크로율</button>
        <button onClick={() => setMode("question")} className="chip" style={{ cursor: "pointer", border: mode === "question" ? "2px solid var(--rose)" : "none", padding: "8px 16px" }}>💬 알아가기</button>
      </div>

      {mode === "sync" ? <SyncTest /> : <QuestionDeck />}
    </main>
  );
}

// ── 커플 싱크로율 테스트 (한 폰으로 번갈아 → 일치율) ──
function SyncTest() {
  const [phase, setPhase] = useState<"intro" | "answer" | "handoff" | "round" | "final">("intro");
  const [round, setRound] = useState(0);
  const [who, setWho] = useState<"p1" | "p2">("p1");
  const [qi, setQi] = useState(0);
  const [cur, setCur] = useState<number[]>([]);
  const [store, setStore] = useState<{ p1: number[]; p2: number[] }[]>([]);

  const rounds = SYNC_ROUNDS;
  const start = () => { setRound(0); setWho("p1"); setQi(0); setCur([]); setStore([]); setPhase("answer"); };

  const pick = (opt: number) => {
    const nextCur = [...cur, opt];
    const qs = rounds[round].questions;
    if (qi + 1 < qs.length) { setCur(nextCur); setQi(qi + 1); return; }
    if (who === "p1") {
      setStore((s) => { const n = [...s]; n[round] = { p1: nextCur, p2: [] }; return n; });
      setCur([]); setQi(0); setPhase("handoff");
    } else {
      setStore((s) => { const n = [...s]; n[round] = { ...n[round], p2: nextCur }; return n; });
      setPhase("round");
    }
  };
  const handoffDone = () => { setWho("p2"); setQi(0); setCur([]); setPhase("answer"); };
  const nextRound = () => {
    if (round + 1 < rounds.length) { setRound(round + 1); setWho("p1"); setQi(0); setCur([]); setPhase("answer"); }
    else { markFlag("cards"); setPhase("final"); }
  };

  const matchesInRound = (r: number) => {
    const st = store[r]; if (!st) return 0;
    return st.p1.reduce((a, v, k) => a + (v === st.p2[k] ? 1 : 0), 0);
  };
  const totalQ = rounds.reduce((s, r) => s + r.questions.length, 0);
  const totalMatch = rounds.reduce((s, _r, idx) => s + matchesInRound(idx), 0);
  const pct = Math.round((totalMatch / totalQ) * 100);

  if (phase === "intro") {
    return (
      <div className="slideup" style={{ paddingTop: 14 }}>
        <div className="floaty" style={{ fontSize: 54 }}>💞</div>
        <h2 style={{ fontSize: 18, color: "#B85C82", margin: "12px 0 8px" }}>우리 싱크로율 테스트</h2>
        <p style={{ fontSize: 13, color: "#8A7A85", lineHeight: 1.7, margin: "0 0 8px" }}>
          같은 질문에 <b style={{ color: "#B85C82" }}>각자</b> 답하고,<br />얼마나 똑같이 골랐는지 맞춰봐요!
        </p>
        <p style={{ fontSize: 11.5, color: "#A89AA3", lineHeight: 1.6, margin: "0 0 20px" }}>
          숯댕이 먼저 → 폰 넘기기 → 옵빵이 → 같이 결과 확인<br />총 {rounds.length}라운드 · 한 폰으로 번갈아 플레이
        </p>
        <button className="btn-rose" onClick={start} style={{ fontSize: 15 }}>시작하기 →</button>
      </div>
    );
  }

  if (phase === "handoff") {
    return (
      <div className="slideup pixel-border" style={{ background: "var(--cream)", borderRadius: 18, padding: "30px 20px", marginTop: 10 }}>
        <div className="floaty" style={{ fontSize: 50 }}>📱💨</div>
        <h2 style={{ fontSize: 18, color: "#3E7BC2", margin: "14px 0 8px" }}>옵빵이에게 폰을 넘겨주세요!</h2>
        <p style={{ fontSize: 13, color: "#6A5A66", lineHeight: 1.7, margin: "0 0 4px" }}>숯댕이 답변 완료 💗<br />이제 옵빵이가 같은 질문에 답할 차례예요.</p>
        <p style={{ fontSize: 11.5, color: "#A89AA3", margin: "0 0 18px" }}>숯댕이 답은 안 보이니까 솔직하게! 🤫</p>
        <button className="btn-rose" onClick={handoffDone} style={{ fontSize: 14, background: "#3E7BC2", boxShadow: "0 4px 0 rgba(40,80,140,.35)" }}>옵빵이 준비 완료! →</button>
      </div>
    );
  }

  if (phase === "round") {
    const st = store[round]; const qs = rounds[round].questions; const m = matchesInRound(round);
    return (
      <div className="slideup">
        <div className="pixel-border" style={{ background: "var(--cream)", borderRadius: 16, padding: "18px 16px", marginBottom: 14 }}>
          <p style={{ fontSize: 12, color: "#A89AA3", margin: 0 }}>{rounds[round].emoji} {rounds[round].theme} 결과</p>
          <p style={{ fontSize: 24, color: "#B85C82", fontWeight: 700, margin: "4px 0 0" }}>{m} / {qs.length} 싱크!</p>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {qs.map((qq, k) => {
            const ok = st.p1[k] === st.p2[k];
            return (
              <div key={k} style={{ background: "#fff", borderRadius: 12, padding: "10px 12px", boxShadow: "0 2px 0 rgba(124,90,150,.1)", textAlign: "left", border: ok ? "2px solid #9FD9B8" : "2px solid #F4C0D1" }}>
                <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "#5A4A55" }}>{ok ? "✅" : "❌"} {qq.q}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 11.5 }}>
                  <span style={{ color: "#E8556F" }}>💗 {qq.options[st.p1[k]]}</span>
                  <span style={{ color: "#3E7BC2" }}>💙 {qq.options[st.p2[k]]}</span>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn-rose" onClick={nextRound} style={{ marginTop: 16, fontSize: 14 }}>
          {round + 1 < rounds.length ? "다음 라운드 →" : "최종 결과 보기 ✨"}
        </button>
      </div>
    );
  }

  if (phase === "final") {
    const v = syncVerdict(pct);
    return (
      <div className="slideup pixel-border" style={{ background: "var(--cream)", borderRadius: 18, padding: "26px 20px", marginTop: 10 }}>
        <p style={{ fontSize: 12, color: "#A89AA3", margin: 0 }}>우리 싱크로율은</p>
        <p style={{ fontSize: 52, color: "#E8556F", fontWeight: 700, margin: "4px 0 0", lineHeight: 1 }}>{pct}<span style={{ fontSize: 24 }}>%</span></p>
        <div className="floaty" style={{ fontSize: 46, margin: "10px 0 4px" }}>{v.emoji}</div>
        <h2 style={{ fontSize: 20, color: "#B85C82", margin: "0 0 8px" }}>{v.title}</h2>
        <p style={{ fontSize: 13.5, color: "#5A4A55", lineHeight: 1.8, margin: "0 0 14px" }}>{v.desc}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {rounds.map((r, idx) => (
            <span key={idx} className="chip" style={{ fontSize: 11 }}>{r.emoji} {matchesInRound(idx)}/{r.questions.length}</span>
          ))}
        </div>
        <button className="btn-rose" onClick={start} style={{ fontSize: 14 }}>다시 하기 🔄</button>
      </div>
    );
  }

  // phase === "answer"
  const me = P[who]; const qs = rounds[round].questions; const q = qs[qi];
  return (
    <div className="slideup">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: "#9A8A95" }}>{rounds[round].emoji} {rounds[round].theme} · R{round + 1}/{rounds.length}</span>
        <span style={{ fontSize: 12, color: me.color, fontWeight: 700, background: me.bg, border: `1.5px solid ${me.border}`, borderRadius: 10, padding: "3px 10px" }}>{me.name} 차례</span>
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
        {qs.map((_, k) => (
          <div key={k} style={{ flex: 1, height: 6, borderRadius: 3, background: k < qi ? me.color : k === qi ? me.border : "#E8DCE6" }} />
        ))}
      </div>
      <div key={`${who}-${round}-${qi}`} className="pop pixel-border" style={{ background: "var(--cream)", borderRadius: 16, padding: "24px 18px", marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: "#9A8A95", margin: 0 }}>Q{qi + 1}.</p>
        <p style={{ fontSize: 17, color: "#5A4A55", margin: "8px 0 0", lineHeight: 1.5 }}>{q.q}</p>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {q.options.map((opt, k) => (
          <button key={k} onClick={() => pick(k)} style={{
            background: "#fff", color: "#5A4A55", border: `2px solid ${me.border}`, borderRadius: 12,
            padding: "14px", fontSize: 14, cursor: "pointer", boxShadow: "0 3px 0 rgba(124,90,150,0.12)",
          }}>{opt}</button>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "#A89AA3", textAlign: "center", marginTop: 12 }}>🤫 상대가 뭘 골랐는지는 결과에서 같이 확인해요</p>
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
