"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ } from "@/lib/gameData";

export default function QuizPage() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [reward, setReward] = useState(false);

  const q = QUIZ[idx];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === q.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 < QUIZ.length) {
        setIdx((n) => n + 1);
        setPicked(null);
      } else {
        const finalScore = score + (correct ? 1 : 0);
        setDone(true);
        if (finalScore >= Math.ceil(QUIZ.length / 2)) {
          setReward(true);
          fetch("/api/coupons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "퀴즈 통과 소원권", emoji: "🧠" }),
          }).catch(() => {});
        }
      }
    }, 700);
  };

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px", minHeight: "100vh" }}>
      <Link href="/map" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 맵으로</Link>
      <h1 style={{ fontSize: 19, color: "#B85C82", textAlign: "center", margin: "10px 0 18px" }}>커플 퀴즈 ❓</h1>

      {!done ? (
        <div className="pixel-border" style={{ background: "var(--cream)", borderRadius: 14, padding: 18 }}>
          <p style={{ fontSize: 12, color: "#9A8A95", margin: 0 }}>{idx + 1} / {QUIZ.length}</p>
          <p style={{ fontSize: 16, color: "#5A4A55", margin: "8px 0 18px", lineHeight: 1.5 }}>{q.q}</p>
          <div style={{ display: "grid", gap: 10 }}>
            {q.options.map((opt, i) => {
              let bg = "#fff", color = "#5A4A55";
              if (picked !== null) {
                if (i === q.answer) { bg = "#C7E8D2"; color = "#2F7A52"; }
                else if (i === picked) { bg = "#F4C7C7"; color = "#A33"; }
              }
              return (
                <button key={i} onClick={() => choose(i)} style={{
                  background: bg, color, border: "2px solid var(--lav)", borderRadius: 10,
                  padding: "12px", fontSize: 14, textAlign: "left",
                  boxShadow: "0 3px 0 rgba(124,90,150,0.15)",
                }}>{opt}</button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="pixel-border pop" style={{ background: "var(--cream)", borderRadius: 14, padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 40, margin: "4px 0" }}>{reward ? "🎉" : "🌱"}</p>
          <p style={{ fontSize: 17, color: "#B85C82", margin: "6px 0" }}>
            {QUIZ.length}문제 중 {score}개 정답!
          </p>
          <p style={{ fontSize: 14, color: "#5A4A55", lineHeight: 1.6 }}>
            {reward
              ? "통과! 소원권을 하나 얻었어요. 룰렛에서 더 모아봐요 ♥"
              : "아쉬워요! 다시 도전해볼까요?"}
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
            <button onClick={() => { setIdx(0); setScore(0); setPicked(null); setDone(false); setReward(false); }}
              style={{ background: "#fff", color: "#B85C82", border: "2px solid var(--lav)", borderRadius: 10, padding: "10px 18px", fontSize: 14 }}>
              다시 풀기
            </button>
            <Link href="/games/roulette" style={{ background: "var(--rose)", color: "#fff", borderRadius: 10, padding: "10px 18px", fontSize: 14, textDecoration: "none" }}>
              룰렛 가기 →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
