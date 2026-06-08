"use client";

import { useMemo, useState } from "react";
import { Stage } from "@/lib/gameData";

interface Props {
  stage: Stage;
  onDone: (success: boolean) => void;
}

// stage.id 기반 시드 난수 (항상 같은 위치/섞임이 나오게)
function seeded(id: string) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  return () => { h = (h * 1103515245 + 12345) % 2147483647; return (h % 1000) / 1000; };
}

function Quiz2({ stage, onDone }: Props) {
  const ch = stage.challenge!;
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <>
      <p style={{ fontSize: 15, color: "#5A4A55", lineHeight: 1.6, margin: "6px 0 16px" }}>{ch.question}</p>
      <div style={{ display: "grid", gap: 10 }}>
        {ch.options!.map((opt, i) => {
          let bg = "#fff", color = "#5A4A55";
          if (picked !== null) {
            if (i === ch.answer) { bg = "#C7E8D2"; color = "#2F7A52"; }
            else if (i === picked) { bg = "#F4C7C7"; color = "#A33333"; }
          }
          return (
            <button key={i} disabled={picked !== null}
              onClick={() => { setPicked(i); setTimeout(() => onDone(i === ch.answer), 900); }}
              style={{
                background: bg, color, border: "2px solid var(--lav)", borderRadius: 12,
                padding: "13px", fontSize: 14, boxShadow: "0 3px 0 rgba(124,90,150,0.15)",
              }}>{opt}</button>
          );
        })}
      </div>
    </>
  );
}

function FindDiff({ stage, onDone }: Props) {
  // 오른쪽 사진에만 몰래 하트 3개를 얹는다 → 그걸 찾으면 성공
  const spots = useMemo(() => {
    const rnd = seeded(stage.id);
    return [0, 1, 2].map(() => ({ x: 12 + rnd() * 68, y: 12 + rnd() * 64 }));
  }, [stage.id]);
  const [found, setFound] = useState<number[]>([]);
  const img = { width: "100%", aspectRatio: "4/3", objectFit: "cover" as const, borderRadius: 8, display: "block" };
  return (
    <>
      <p style={{ fontSize: 13, color: "#8A7A85", margin: "4px 0 10px" }}>
        오른쪽 사진에 몰래 숨겨둔 하트 <b style={{ color: "#B85C82" }}>{3 - found.length}개</b>를 찾아줘!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stage.photo} alt="원본" style={img} />
        <div style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={stage.photo} alt="틀린그림" style={img} />
          {spots.map((sp, i) => (
            <button key={i} aria-label={`하트 ${i + 1}`}
              onClick={() => { if (!found.includes(i)) {
                const nf = [...found, i]; setFound(nf);
                if (nf.length === 3) setTimeout(() => onDone(true), 700);
              }}}
              style={{
                position: "absolute", left: `${sp.x}%`, top: `${sp.y}%`,
                width: 24, height: 24, padding: 0, lineHeight: 1,
                background: "none", border: "none", fontSize: found.includes(i) ? 22 : 15,
                opacity: found.includes(i) ? 1 : 0.8,
                filter: found.includes(i) ? "none" : "saturate(0.85)",
                transform: "translate(-50%,-50%)",
              }}>{found.includes(i) ? "💗" : "🩷"}</button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 11, color: "#A89AA3", marginTop: 8 }}>찾았으면 톡! 눌러주기</p>
    </>
  );
}

function Puzzle({ stage, onDone }: Props) {
  // 3x3 조각 퍼즐: 두 조각을 눌러 서로 교체
  const init = useMemo(() => {
    const rnd = seeded(stage.id);
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.every((v, i) => v === i)) [arr[0], arr[1]] = [arr[1], arr[0]];
    return arr;
  }, [stage.id]);
  const [order, setOrder] = useState<number[]>(init);
  const [sel, setSel] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const solved = order.every((v, i) => v === i);

  const tap = (i: number) => {
    if (solved) return;
    if (sel === null) { setSel(i); return; }
    if (sel === i) { setSel(null); return; }
    const next = [...order];
    [next[sel], next[i]] = [next[i], next[sel]];
    setOrder(next); setSel(null); setMoves((m) => m + 1);
    if (next.every((v, k) => v === k)) setTimeout(() => onDone(true), 800);
  };

  return (
    <>
      <p style={{ fontSize: 13, color: "#8A7A85", margin: "4px 0 10px" }}>
        조각 두 개를 눌러 사진을 완성해줘! <span style={{ color: "#B85C82" }}>({moves}번 움직임)</span>
      </p>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3,
        width: "100%", maxWidth: 264, margin: "0 auto", aspectRatio: "1",
      }}>
        {order.map((tile, i) => (
          <button key={i} onClick={() => tap(i)} style={{
            padding: 0, border: sel === i ? "3px solid var(--rose)" : "1px solid #fff",
            borderRadius: 6, overflow: "hidden", cursor: "pointer",
            backgroundImage: `url(${stage.photo})`,
            backgroundSize: "300% 300%",
            backgroundPosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%`,
            opacity: solved ? 1 : 0.96,
          }} aria-label={`조각 ${i + 1}`} />
        ))}
      </div>
      {solved && <p style={{ fontSize: 13, color: "#2F7A52", marginTop: 10 }}>완성! 🎉</p>}
    </>
  );
}

const TITLE: Record<string, string> = {
  quiz2: "💭 기억력 테스트!",
  finddiff: "🔍 숨은 하트 찾기!",
  puzzle: "🧩 추억 조각 맞추기!",
};

export default function StageChallenge({ stage, onDone }: Props) {
  const ch = stage.challenge!;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 14,
    }}>
      <div className="pop pixel-border" style={{
        background: "var(--cream)", borderRadius: 16, maxWidth: 340, width: "100%", padding: "16px 16px 18px",
      }}>
        <p style={{ fontSize: 11, color: "#9A8A95", margin: 0 }}>{stage.label}에 도착!</p>
        <h2 style={{ fontSize: 17, color: "#B85C82", margin: "4px 0 8px" }}>{TITLE[ch.type]}</h2>
        {ch.type === "quiz2" && <Quiz2 stage={stage} onDone={onDone} />}
        {ch.type === "finddiff" && <FindDiff stage={stage} onDone={onDone} />}
        {ch.type === "puzzle" && <Puzzle stage={stage} onDone={onDone} />}
        <p style={{ fontSize: 10.5, color: "#A89AA3", margin: "12px 0 0", textAlign: "center" }}>
          성공하면 🎟 1장! (스테이지당 한 번)
        </p>
      </div>
    </div>
  );
}
