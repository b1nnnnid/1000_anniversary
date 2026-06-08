"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ } from "@/lib/gameData";
import GameIntro from "@/components/GameIntro";
import CharacterReaction from "@/components/CharacterReaction";
import { changeTickets } from "@/lib/progressClient";

const PASS = Math.ceil(QUIZ.length / 2);

export default function QuizPage() {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [earned, setEarned] = useState(0);

  const start = () => { setIdx(0); setScore(0); setPicked(null); setEarned(0); setPhase("play"); };

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === QUIZ[idx].answer;
    const newScore = score + (correct ? 1 : 0);
    if (correct) setScore(newScore);
    setTimeout(() => {
      if (idx + 1 < QUIZ.length) { setIdx(idx + 1); setPicked(null); }
      else {
        const t = newScore === QUIZ.length ? 2 : newScore >= PASS ? 1 : 0;
        setEarned(t);
        if (t > 0) changeTickets(t).catch(() => {});
        setPhase("done");
      }
    }, 1300);
  };

  const q = QUIZ[idx];

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px", minHeight: "100dvh" }}>
      {phase === "intro" && (
        <GameIntro
          emoji="💭"
          title="커플 퀴즈"
          desc={"우리에 대해 얼마나 알고 있을까?\n맞히면 룰렛을 돌릴 기회를 줄게."}
          rules={[
            `총 ${QUIZ.length}문제, 절반 이상 맞히면 통과`,
            "통과하면 룰렛 기회 🎟 1장",
            "전부 다 맞히면 🎟 2장!",
          ]}
          startLabel="시작하기 →"
          onStart={start}
        />
      )}

      {phase === "play" && (
        <div className="slideup">
          <Link href="/map" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 맵으로</Link>
          <div style={{ display: "flex", gap: 5, margin: "16px 0 14px" }}>
            {QUIZ.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 6, borderRadius: 3,
                background: i < idx ? "var(--rose)" : i === idx ? "var(--lav)" : "#E8DCE6",
              }} />
            ))}
          </div>
          <div key={idx} className="pixel-border pop" style={{ background: "var(--cream)", borderRadius: 16, padding: 18 }}>
            <p style={{ fontSize: 12, color: "#9A8A95", margin: 0 }}>Q{idx + 1}.</p>
            <p style={{ fontSize: 16, color: "#5A4A55", margin: "8px 0 18px", lineHeight: 1.6 }}>{q.q}</p>
            <div style={{ display: "grid", gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg = "#fff", color = "#5A4A55";
                if (picked !== null) {
                  if (i === q.answer) { bg = "#C7E8D2"; color = "#2F7A52"; }
                  else if (i === picked) { bg = "#F4C7C7"; color = "#A33333"; }
                }
                return (
                  <button key={i} onClick={() => choose(i)} style={{
                    background: bg, color, border: "2px solid var(--lav)", borderRadius: 12,
                    padding: "12px 14px", fontSize: 14, textAlign: "left",
                    boxShadow: "0 3px 0 rgba(124,90,150,0.15)",
                  }}>{opt}</button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="slideup" style={{ textAlign: "center", paddingTop: 30 }}>
          <div className="floaty" style={{ fontSize: 58 }}>{earned > 0 ? "🎉" : "🌧"}</div>
          <h1 style={{ fontSize: 20, color: "#B85C82", margin: "14px 0 6px" }}>
            {QUIZ.length}문제 중 {score}개 정답!
          </h1>
          {earned > 0 ? (
            <>
              <p style={{ fontSize: 14, color: "#6A5A66", lineHeight: 1.7 }}>
                룰렛 기회 <b style={{ color: "#B85C82" }}>🎟 {earned}장</b>을 얻었어요!
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18 }}>
                <Link href="/games/roulette" className="btn-rose" style={{ textDecoration: "none", fontSize: 14 }}>
                  🎁 룰렛 돌리러 가기
                </Link>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 14, color: "#6A5A66", lineHeight: 1.7 }}>
                아쉬워요! 다시 도전하면 분명 통과할 거예요.
              </p>
              <button className="btn-rose" onClick={start} style={{ marginTop: 18, fontSize: 14 }}>다시 풀기</button>
            </>
          )}
          <p style={{ marginTop: 16 }}>
            {earned > 0 && (
              <button onClick={start} style={{ background: "none", border: "none", fontSize: 12, color: "#A89AA3", textDecoration: "underline" }}>
                한 번 더 풀기
              </button>
            )}
          </p>
          <Link href="/map" style={{ fontSize: 12, color: "#A89AA3", textDecoration: "none" }}>← 맵으로 돌아가기</Link>
        </div>
      )}
      {phase === "play" && picked !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div className="pop" style={{ background: "rgba(255,255,255,0.94)", borderRadius: 18, padding: "14px 26px 12px", textAlign: "center", boxShadow: "0 5px 0 rgba(124,90,150,0.22)" }}>
            <CharacterReaction mood={picked === q.answer ? "happy" : "sad"} />
            <p style={{ margin: "2px 0 0", fontSize: 14, color: picked === q.answer ? "#2F7A52" : "#A33333" }}>
              {picked === q.answer ? "정답이야! 역시 우리 💗" : "앗... 그게 아니야 😢"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
