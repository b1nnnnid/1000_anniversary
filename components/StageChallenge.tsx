"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Stage } from "@/lib/gameData";

interface Props { stage: Stage; onDone: (success: boolean) => void; }

function seeded(id: string) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  return () => { h = (h * 1103515245 + 12345) % 2147483647; return (h % 1000) / 1000; };
}

// ── 2지선다 ──
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
              style={{ background: bg, color, border: "2px solid var(--lav)", borderRadius: 12, padding: "13px", fontSize: 14, boxShadow: "0 3px 0 rgba(124,90,150,0.15)" }}>
              {opt}</button>
          );
        })}
      </div>
    </>
  );
}

// ── 틀린그림(숨은 하트) 찾기 ──
function FindDiff({ stage, onDone }: Props) {
  const spots = useMemo(() => {
    const rnd = seeded(stage.id);
    return [0, 1, 2].map(() => ({ x: 12 + rnd() * 68, y: 12 + rnd() * 64 }));
  }, [stage.id]);
  const [found, setFound] = useState<number[]>([]);
  const img = { width: "100%", aspectRatio: "4/3", objectFit: "cover" as const, borderRadius: 8, display: "block" };
  return (
    <>
      <p style={{ fontSize: 13, color: "#8A7A85", margin: "4px 0 10px" }}>
        오른쪽 사진에 숨은 하트 <b style={{ color: "#B85C82" }}>{3 - found.length}개</b>를 찾아줘!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stage.photo} alt="원본" style={img} />
        <div style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={stage.photo} alt="틀린그림" style={img} />
          {spots.map((sp, i) => (
            <button key={i} aria-label={`하트 ${i + 1}`}
              onClick={() => { if (!found.includes(i)) { const nf = [...found, i]; setFound(nf); if (nf.length === 3) setTimeout(() => onDone(true), 700); } }}
              style={{ position: "absolute", left: `${sp.x}%`, top: `${sp.y}%`, width: 24, height: 24, padding: 0, background: "none", border: "none", fontSize: found.includes(i) ? 22 : 15, opacity: found.includes(i) ? 1 : 0.8, transform: "translate(-50%,-50%)" }}>
              {found.includes(i) ? "💗" : "🩷"}</button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── 사진 조각 퍼즐 ──
function Puzzle({ stage, onDone }: Props) {
  const init = useMemo(() => {
    const rnd = seeded(stage.id);
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
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
    const next = [...order]; [next[sel], next[i]] = [next[i], next[sel]];
    setOrder(next); setSel(null); setMoves((m) => m + 1);
    if (next.every((v, k) => v === k)) setTimeout(() => onDone(true), 800);
  };
  return (
    <>
      <p style={{ fontSize: 13, color: "#8A7A85", margin: "4px 0 10px" }}>
        조각 두 개를 눌러 사진을 완성해줘! <span style={{ color: "#B85C82" }}>({moves}번)</span>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3, width: "100%", maxWidth: 264, margin: "0 auto", aspectRatio: "1" }}>
        {order.map((tile, i) => (
          <button key={i} onClick={() => tap(i)} aria-label={`조각 ${i + 1}`}
            style={{ padding: 0, border: sel === i ? "3px solid var(--rose)" : "1px solid #fff", borderRadius: 6, overflow: "hidden", backgroundImage: `url(${stage.photo})`, backgroundSize: "300% 300%", backgroundPosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%` }} />
        ))}
      </div>
      {solved && <p style={{ fontSize: 13, color: "#2F7A52", marginTop: 10 }}>완성! 🎉</p>}
    </>
  );
}

// ── 떨어지는 쿠키 받기 / 하트 캐치 (공용 엔진) ──
function FallingGame({ onDone, mode }: { onDone: (s: boolean) => void; mode: "cookie" | "catch" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const trayX = useRef(130);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [count, setCount] = useState(3);          // 3,2,1 → 0(시작)
  const scoreRef = useRef(0), livesRef = useRef(3), over = useRef(false), started = useRef(false);
  const onDoneRef = useRef(onDone); onDoneRef.current = onDone;
  const target = 8;
  const good = mode === "cookie" ? "🍪" : "💗";

  // 카운트다운
  useEffect(() => {
    if (count <= 0) { started.current = true; return; }
    const t = setTimeout(() => setCount((c) => c - 1), 750);
    return () => clearTimeout(t);
  }, [count]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = 260, H = 300;
    let raf = 0, t = 0, cancelled = false;
    type Item = { x: number; y: number; vy: number; bomb: boolean; e: string };
    let items: Item[] = [];
    const spawn = () => {
      const bomb = mode === "cookie" && Math.random() < 0.26;
      items.push({ x: 22 + Math.random() * (W - 44), y: -16, vy: 1.5 + Math.random() * 1.3 + t / 2600, bomb, e: bomb ? "💣" : good });
    };
    const loop = () => {
      if (cancelled) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = mode === "cookie" ? "#F7EBDD" : "#FBEAF0"; ctx.fillRect(0, 0, W, H);
      const tx = trayX.current;
      ctx.font = "30px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("🧺", tx, H - 16);

      if (started.current && !over.current) {
        t++;
        if (t % Math.max(28 - Math.floor(t / 240), 13) === 0) spawn();
        for (const it of items) {
          it.y += it.vy;
          if (it.y > H - 40 && it.y < H - 6 && Math.abs(it.x - tx) < 28) {
            it.y = 9999;
            if (it.bomb) { livesRef.current--; setLives(livesRef.current); }
            else { scoreRef.current++; setScore(scoreRef.current); }
          }
        }
        items = items.filter((it) => it.y < H + 20);
        if (scoreRef.current >= target) { over.current = true; setTimeout(() => onDoneRef.current(true), 400); }
        else if (livesRef.current <= 0) { over.current = true; setTimeout(() => onDoneRef.current(false), 400); }
      }
      for (const it of items) { ctx.font = "26px sans-serif"; ctx.fillText(it.e, it.x, it.y); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const move = (clientX: number) => {
      const rect = cv.getBoundingClientRect();
      trayX.current = Math.max(22, Math.min(238, ((clientX - rect.left) / rect.width) * W));
    };
    const onMove = (e: PointerEvent) => { e.preventDefault(); move(e.clientX); };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerdown", onMove);
    return () => { cancelled = true; cancelAnimationFrame(raf); cv.removeEventListener("pointermove", onMove); cv.removeEventListener("pointerdown", onMove); };
  }, [mode, target, good]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6A5A66", margin: "0 4px 6px" }}>
        <span>{good} {score}/{target}</span>
        {mode === "cookie" && <span>{"❤️".repeat(Math.max(0, lives))}</span>}
      </div>
      <div style={{ position: "relative", maxWidth: 260, margin: "0 auto" }}>
        <canvas ref={ref} width={260} height={300} style={{ width: "100%", maxWidth: 260, height: "auto", borderRadius: 10, touchAction: "none", imageRendering: "pixelated", display: "block" }} />
        {count > 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.55)", borderRadius: 10 }}>
            <span key={count} className="pop" style={{ fontSize: 64, color: "#E8556F", fontWeight: 700 }}>{count}</span>
          </div>
        )}
      </div>
      <p style={{ fontSize: 11.5, color: "#A89AA3", margin: "8px 0 0" }}>
        바구니를 손가락/마우스로 움직여 {good} 받기{mode === "cookie" ? " · 💣 피하기!" : ""}
      </p>
    </div>
  );
}

// ── 타이밍 탭 ──
function TimingGame({ onDone }: { onDone: (s: boolean) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const posRef = useRef(20), dirRef = useRef(1), stopped = useRef(false);
  const [hits, setHits] = useState(0);
  const hitsRef = useRef(0); const need = 2;
  const [msg, setMsg] = useState("막대가 초록 영역에 올 때 멈춰!");
  const onDoneRef = useRef(onDone); onDoneRef.current = onDone;

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = 260, H = 70; let raf = 0, cancelled = false;
    const loop = () => {
      if (cancelled) return;
      if (!stopped.current) {
        posRef.current += dirRef.current * (2.6 + hitsRef.current * 0.9);
        if (posRef.current > W - 10) { posRef.current = W - 10; dirRef.current = -1; }
        if (posRef.current < 10) { posRef.current = 10; dirRef.current = 1; }
      }
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#F1EFE8"; ctx.fillRect(0, 26, W, 18);
      ctx.fillStyle = "#C7E8D2"; ctx.fillRect(W / 2 - 26, 26, 52, 18);
      ctx.fillStyle = "#9FD9B8"; ctx.fillRect(W / 2 - 8, 26, 16, 18);
      ctx.fillStyle = "#E8556F"; ctx.fillRect(posRef.current - 3, 18, 6, 34);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, []);

  const tap = () => {
    if (stopped.current) return;
    const d = Math.abs(posRef.current - 130);
    if (d < 26) {
      const nh = hitsRef.current + 1; hitsRef.current = nh; setHits(nh);
      setMsg(d < 8 ? "퍼펙트! ✨" : "좋아! 👍");
      if (nh >= need) { stopped.current = true; setTimeout(() => onDoneRef.current(true), 600); }
    } else {
      setMsg("앗 빗나갔다! 다시 노려봐 😣");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#8A7A85", margin: "2px 0 8px" }}>{msg} ({hits}/{need})</p>
      <canvas ref={ref} width={260} height={70} style={{ width: "100%", maxWidth: 260, height: "auto", display: "block", margin: "0 auto 10px" }} />
      <button onClick={tap} className="btn-rose" style={{ fontSize: 15, minWidth: 140 }}>멈춰!</button>
    </div>
  );
}

// ── 순서 기억 (사이먼) ──
const PADS = [
  { on: "#F4A8C0", off: "#F6D6E2" },
  { on: "#A8D8F0", off: "#D6EBF6" },
  { on: "#A8E0C0", off: "#D6F0E2" },
  { on: "#F6D080", off: "#F6E6C0" },
];
function SimonGame({ onDone }: { onDone: (s: boolean) => void }) {
  const [seq, setSeq] = useState<number[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const [turn, setTurn] = useState<"watch" | "play">("watch");
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(0);
  const needRounds = 3; // 3,4,5 길이

  useEffect(() => {
    const len = 3 + round;
    const ns = Array.from({ length: len }, () => Math.floor(Math.random() * 4));
    setSeq(ns); setTurn("watch"); setStep(0);
    let i = 0;
    const iv = setInterval(() => {
      setFlash(ns[i]); setTimeout(() => setFlash(null), 380);
      i++;
      if (i >= ns.length) { clearInterval(iv); setTimeout(() => setTurn("play"), 500); }
    }, 700);
    return () => clearInterval(iv);
  }, [round]);

  const press = (i: number) => {
    if (turn !== "play") return;
    setFlash(i); setTimeout(() => setFlash(null), 180);
    if (seq[step] !== i) { setTimeout(() => onDone(false), 400); return; }
    const ns = step + 1;
    if (ns >= seq.length) {
      if (round + 1 >= needRounds) { setTimeout(() => onDone(true), 500); }
      else { setTurn("watch"); setRound(round + 1); }
    } else setStep(ns);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#8A7A85", margin: "2px 0 12px" }}>
        {turn === "watch" ? "👀 순서를 잘 봐!" : "이제 똑같이 눌러!"} (라운드 {round + 1}/{needRounds})
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 220, margin: "0 auto" }}>
        {PADS.map((p, i) => (
          <button key={i} onClick={() => press(i)} aria-label={`패드 ${i + 1}`}
            style={{ height: 88, borderRadius: 14, border: "3px solid #fff", background: flash === i ? p.on : p.off, boxShadow: "0 3px 0 rgba(124,90,150,0.18)", transition: "background .1s" }} />
        ))}
      </div>
    </div>
  );
}

const TITLE: Record<string, string> = {
  quiz2: "💭 기억력 테스트!", finddiff: "🔍 숨은 하트 찾기!", puzzle: "🧩 추억 조각 맞추기!",
  cookie: "🍪 쿠키 받기!", timing: "🎯 타이밍을 맞춰!", catch: "💗 하트 캐치!", simon: "🎵 순서를 기억해!",
};

export default function StageChallenge({ stage, onDone }: Props) {
  const ch = stage.challenge!;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(90,74,85,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 14 }}>
      <div className="pop pixel-border" style={{ background: "var(--cream)", borderRadius: 16, maxWidth: 340, width: "100%", padding: "16px 16px 18px" }}>
        <p style={{ fontSize: 11, color: "#9A8A95", margin: 0 }}>{stage.label}에 도착!</p>
        <h2 style={{ fontSize: 17, color: "#B85C82", margin: "4px 0 10px" }}>{TITLE[ch.type]}</h2>
        {ch.type === "quiz2" && <Quiz2 stage={stage} onDone={onDone} />}
        {ch.type === "finddiff" && <FindDiff stage={stage} onDone={onDone} />}
        {ch.type === "puzzle" && <Puzzle stage={stage} onDone={onDone} />}
        {ch.type === "cookie" && <FallingGame mode="cookie" onDone={onDone} />}
        {ch.type === "catch" && <FallingGame mode="catch" onDone={onDone} />}
        {ch.type === "timing" && <TimingGame onDone={onDone} />}
        {ch.type === "simon" && <SimonGame onDone={onDone} />}
        <p style={{ fontSize: 10.5, color: "#A89AA3", margin: "12px 0 0", textAlign: "center" }}>
          성공하면 🧩 조각 +2! (스테이지당 한 번)
        </p>
      </div>
    </div>
  );
}
