"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUIZ_SETS, QuizSet } from "@/lib/gameData";
import CharacterReaction from "@/components/CharacterReaction";
import { addTickets } from "@/lib/progressClient";
import { markFlag, hasFlag, getFlags } from "@/lib/flags";
import { playSuccess, playWrong, playWin } from "@/lib/sfx";

const doneKey = (id: string) => `quizset-done:${id}`;
const passCount = (set: QuizSet) => Math.ceil(set.questions.length / 2);

export default function QuizPage() {
  const [phase, setPhase] = useState<"select" | "play" | "done">("select");
  const [set, setSet] = useState<QuizSet | null>(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [earned, setEarned] = useState(0);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [wasClaimed, setWasClaimed] = useState(false); // 이번에 푼 세트가 이미 보상받은 세트였는지

  useEffect(() => { setClaimed(getFlags().filter((f) => f.startsWith("quizset-done:")).map((f) => f.slice("quizset-done:".length))); }, []);

  const start = (s: QuizSet) => { setSet(s); setIdx(0); setScore(0); setPicked(null); setEarned(0); setWasClaimed(false); setPhase("play"); };

  const choose = (i: number) => {
    if (picked !== null || !set) return;
    setPicked(i);
    const correct = i === set.questions[idx].answer;
    if (correct) playSuccess(); else playWrong();
    const newScore = score + (correct ? 1 : 0);
    if (correct) setScore(newScore);
    setTimeout(() => {
      if (idx + 1 < set.questions.length) { setIdx(idx + 1); setPicked(null); }
      else {
        const alreadyClaimed = hasFlag(doneKey(set.id));
        const reward = newScore === set.questions.length ? 2 : newScore >= passCount(set) ? 1 : 0;
        const t = alreadyClaimed ? 0 : reward; // 보상은 세트당 1회만
        setWasClaimed(alreadyClaimed);
        setEarned(t);
        if (t > 0) {
          addTickets(t);
          markFlag(doneKey(set.id));
          markFlag("quiz");
          setClaimed((c) => (c.includes(set.id) ? c : [...c, set.id]));
          playWin();
        } else if (reward > 0) {
          playWin();
        }
        setPhase("done");
      }
    }, 1300);
  };

  // ── 세트 선택 화면 ──
  if (phase === "select") {
    const claimedCount = QUIZ_SETS.filter((s) => claimed.includes(s.id)).length;
    return (
      <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh" }}>
        <Link href="/map" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none" }}>← 맵으로</Link>
        <h1 style={{ fontSize: 20, color: "#B85C82", textAlign: "center", margin: "12px 0 2px" }}>커플 퀴즈 💭</h1>
        <p style={{ fontSize: 11.5, color: "#8A7A85", textAlign: "center", margin: "0 0 6px", lineHeight: 1.6 }}>
          테마를 골라 풀어보세요. <b style={{ color: "#B85C82" }}>세트마다 처음 통과할 때 티켓</b>을 줘요.<br />
          절반 이상 🎟 1장 · 만점 🎟 2장
        </p>
        <p style={{ fontSize: 11, color: "#A89AA3", textAlign: "center", margin: "0 0 16px" }}>완료 {claimedCount}/{QUIZ_SETS.length}</p>

        <div style={{ display: "grid", gap: 10 }}>
          {QUIZ_SETS.map((s, i) => {
            const done = claimed.includes(s.id);
            return (
              <button key={s.id} onClick={() => start(s)} className="pixel-border k-pop" style={{
                textAlign: "left", borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                background: done ? "var(--cream)" : "#fff", display: "flex", alignItems: "center", gap: 12,
                animationDelay: `${i * 0.07}s`,
              }}>
                <span style={{ fontSize: 28 }}>{s.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 15, color: "#B85C82", fontWeight: 600 }}>{s.theme}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#9A8A95" }}>{s.desc} · {s.questions.length}문제</p>
                </div>
                {done ? (
                  <span style={{ flexShrink: 0, fontSize: 11, color: "#C98AA6", border: "1.5px solid #E3B8CC", borderRadius: 8, padding: "3px 9px" }}>완료 ✓</span>
                ) : (
                  <span className="chip" style={{ flexShrink: 0 }}>🎟 받기</span>
                )}
              </button>
            );
          })}
        </div>
      </main>
    );
  }

  if (!set) return null;

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px", minHeight: "100dvh" }}>
      {phase === "play" && (
        <div className="slideup">
          <button onClick={() => setPhase("select")} style={{ color: "#B85C82", fontSize: 13, background: "none", border: "none", cursor: "pointer", padding: 0 }}>← 세트 선택</button>
          <p style={{ fontSize: 13, color: "#B85C82", textAlign: "center", margin: "8px 0 4px" }}>{set.emoji} {set.theme}</p>
          <div style={{ display: "flex", gap: 5, margin: "8px 0 14px" }}>
            {set.questions.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 6, borderRadius: 3,
                background: i < idx ? "var(--rose)" : i === idx ? "var(--lav)" : "#E8DCE6",
              }} />
            ))}
          </div>
          <div key={idx} className="pixel-border pop" style={{ background: "var(--cream)", borderRadius: 16, padding: 18 }}>
            <p style={{ fontSize: 12, color: "#9A8A95", margin: 0 }}>Q{idx + 1}.</p>
            <p style={{ fontSize: 16, color: "#5A4A55", margin: "8px 0 18px", lineHeight: 1.6 }}>{set.questions[idx].q}</p>
            <div style={{ display: "grid", gap: 10 }}>
              {set.questions[idx].options.map((opt, i) => {
                let bg = "#fff", color = "#5A4A55";
                if (picked !== null) {
                  if (i === set.questions[idx].answer) { bg = "#C7E8D2"; color = "#2F7A52"; }
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
          <div className="floaty" style={{ fontSize: 58 }}>{earned > 0 ? "🎉" : wasClaimed ? "😊" : "🌧"}</div>
          <h1 style={{ fontSize: 20, color: "#B85C82", margin: "14px 0 6px" }}>
            {set.questions.length}문제 중 {score}개 정답!
          </h1>
          {earned > 0 ? (
            <p style={{ fontSize: 14, color: "#6A5A66", lineHeight: 1.7 }}>
              룰렛 티켓 <b style={{ color: "#B85C82" }}>🎟 {earned}장</b>을 얻었어요!
            </p>
          ) : wasClaimed ? (
            <p style={{ fontSize: 14, color: "#6A5A66", lineHeight: 1.7 }}>
              이미 보상을 받은 세트예요.<br />복습은 언제든 환영! (티켓은 없어요)
            </p>
          ) : (
            <p style={{ fontSize: 14, color: "#6A5A66", lineHeight: 1.7 }}>
              절반 이상 맞히면 티켓을 받아요.<br />다시 도전해볼까요?
            </p>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
            {earned > 0 && (
              <Link href="/games/roulette" className="btn-rose" style={{ textDecoration: "none", fontSize: 14 }}>
                🎁 룰렛 돌리러 가기
              </Link>
            )}
            {!wasClaimed && earned === 0 && (
              <button className="btn-rose" onClick={() => start(set)} style={{ fontSize: 14 }}>다시 풀기</button>
            )}
            <button onClick={() => setPhase("select")} style={{
              background: "#fff", color: "#B85C82", border: "2px solid var(--lav)", borderRadius: 12,
              padding: "11px 20px", fontSize: 14, cursor: "pointer",
            }}>다른 세트 풀기</button>
          </div>
        </div>
      )}

      {phase === "play" && picked !== null && (
        <div style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div className="pop" style={{ background: "rgba(255,255,255,0.94)", borderRadius: 18, padding: "14px 26px 12px", textAlign: "center", boxShadow: "0 5px 0 rgba(124,90,150,0.22)" }}>
            <CharacterReaction mood={picked === set.questions[idx].answer ? "happy" : "sad"} />
            <p style={{ margin: "2px 0 0", fontSize: 14, color: picked === set.questions[idx].answer ? "#2F7A52" : "#A33333" }}>
              {picked === set.questions[idx].answer ? "정답이야! 역시 우리 💗" : "앗... 그게 아니야 😢"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
