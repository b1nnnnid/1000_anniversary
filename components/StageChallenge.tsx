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

// ── 쿠키런식 점프 러너 (연인에게 달려가기, 10~20초) ──
function RunnerGame({ onDone }: { onDone: (s: boolean) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(3);
  const [lives, setLives] = useState(3);
  const [prog, setProg] = useState(0);
  const started = useRef(false), over = useRef(false);
  const onDoneRef = useRef(onDone); onDoneRef.current = onDone;

  useEffect(() => {
    if (count <= 0) { started.current = true; return; }
    const t = setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [count]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = 288, H = 168, groundY = H - 26;
    let raf = 0, t = 0, cancelled = false;
    const TARGET = 2300;
    let dist = 0, speed = 3.0;
    const ch = { x: 46, y: groundY, vy: 0, w: 18, h: 26, onGround: true, inv: 0 };
    const GRAV = 0.62, JUMP = -9.0;
    type Ob = { x: number; kind: number; w: number; h: number };
    let obs: Ob[] = [];
    let nextGap = 90, lv = 3, lastP = 0;

    const setProgT = (p: number) => { if (Math.abs(p - lastP) > 0.02) { lastP = p; setProg(Math.min(1, p)); } };
    const doJump = () => { if (!started.current || over.current) return; if (ch.onGround) { ch.vy = JUMP; ch.onGround = false; } };

    const drawRunner = (x: number, footY: number, run: number, blink: boolean) => {
      if (blink && Math.floor(t / 4) % 2 === 0) return;
      const topY = footY - ch.h;
      ctx.fillStyle = "#5A6B8C";
      if (ch.onGround) {
        const ph = run % 2 === 0;
        ctx.fillRect(x + 3, footY - 7, 5, 7);
        ctx.fillRect(x + 10, footY - (ph ? 7 : 4), 5, ph ? 7 : 4);
      } else { ctx.fillRect(x + 3, footY - 6, 5, 6); ctx.fillRect(x + 10, footY - 6, 5, 6); }
      ctx.fillStyle = "#E8799F"; ctx.fillRect(x + 1, topY + 11, 16, 11);
      ctx.fillStyle = "#FBE0CC"; ctx.fillRect(x + 3, topY, 12, 11);
      ctx.fillStyle = "#4A3A2E"; ctx.fillRect(x + 2, topY - 1, 14, 4); ctx.fillRect(x + 2, topY, 3, 7);
      ctx.fillStyle = "#4A3A2E"; ctx.fillRect(x + 10, topY + 4, 2, 2);
    };

    const loop = () => {
      if (cancelled) return; t++;
      ctx.fillStyle = "#DCEFF7"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#CDEBD8"; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.fillStyle = "#B7DEC6"; ctx.fillRect(0, groundY, W, 3);
      ctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < 3; i++) {
        const cx2 = (((i * 120 - t * 0.6) % (W + 60)) + W + 60) % (W + 60) - 30;
        ctx.fillRect(cx2, 16 + i * 10, 18, 6); ctx.fillRect(cx2 + 5, 12 + i * 10, 10, 6);
      }

      if (started.current && !over.current) {
        dist += speed; speed = 3.0 + dist / 1500; setProgT(dist / TARGET);
        ch.vy += GRAV; ch.y += ch.vy;
        if (ch.y >= groundY) { ch.y = groundY; ch.vy = 0; ch.onGround = true; }
        if (ch.inv > 0) ch.inv--;
        nextGap -= speed;
        if (nextGap <= 0) {
          const kind = Math.floor(Math.random() * 3);
          const h = 14 + kind * 3, w = 14 + (kind === 2 ? 8 : 0);
          obs.push({ x: W + 10, kind, w, h });
          nextGap = 84 + Math.random() * 50 + speed * 9;
        }
        for (const o of obs) {
          o.x -= speed;
          if (ch.inv <= 0 && o.x < ch.x + ch.w - 3 && o.x + o.w > ch.x + 3) {
            const oTop = groundY - o.h;
            if (ch.y > oTop - 2) {
              lv--; setLives(Math.max(0, lv)); ch.inv = 50; o.x = -999;
              if (lv <= 0) { over.current = true; setTimeout(() => onDoneRef.current(false), 500); }
            }
          }
        }
        obs = obs.filter((o) => o.x + o.w > -10);
        if (dist >= TARGET) { over.current = true; setProg(1); setTimeout(() => onDoneRef.current(true), 500); }
      }

      for (const o of obs) {
        const oy = groundY - o.h;
        if (o.kind === 0) {
          ctx.fillStyle = "#9A938C"; ctx.fillRect(o.x, oy, o.w, o.h);
          ctx.fillStyle = "#B7B0A8"; ctx.fillRect(o.x, oy, o.w, 3);
          ctx.fillStyle = "#6E665F"; ctx.fillRect(o.x, oy + o.h - 3, o.w, 3);
        } else if (o.kind === 1) {
          ctx.fillStyle = "#7FB98E"; ctx.fillRect(o.x, oy, o.w, o.h);
          ctx.fillStyle = "#A7D8B6"; ctx.fillRect(o.x, oy, o.w, 4);
          ctx.fillStyle = "#E8799F"; ctx.fillRect(o.x + 3, oy + 4, 3, 3);
        } else {
          ctx.fillStyle = "#3F3B45"; ctx.fillRect(o.x, oy + 2, o.w, o.h - 2);
          ctx.fillRect(o.x + 1, oy, 3, 4); ctx.fillRect(o.x + o.w - 4, oy, 3, 4);
          ctx.fillStyle = "#A8E0C0"; ctx.fillRect(o.x + 3, oy + 6, 2, 2); ctx.fillRect(o.x + o.w - 5, oy + 6, 2, 2);
        }
      }
      // 도착 하트 (끝 근처에 둥둥)
      if (dist > TARGET * 0.78) { ctx.font = "20px sans-serif"; ctx.textAlign = "center"; ctx.fillText("💗", W - 16, groundY - 30 + Math.sin(t / 8) * 4); }
      drawRunner(ch.x, ch.y, Math.floor(t / 6), ch.inv > 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onDown = (e: Event) => { e.preventDefault(); doJump(); };
    cv.addEventListener("pointerdown", onDown);
    const onKey = (e: KeyboardEvent) => { if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") { e.preventDefault(); doJump(); } };
    window.addEventListener("keydown", onKey);
    return () => { cancelled = true; cancelAnimationFrame(raf); cv.removeEventListener("pointerdown", onDown); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6A5A66", margin: "0 4px 6px" }}>
        <span>🏃 {Math.round(prog * 100)}%</span>
        <span>{"❤️".repeat(Math.max(0, lives))}</span>
      </div>
      <div style={{ position: "relative", maxWidth: 288, margin: "0 auto" }}>
        <canvas ref={ref} width={288} height={168} style={{ width: "100%", maxWidth: 288, height: "auto", borderRadius: 10, touchAction: "none", display: "block" }} />
        {count > 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.55)", borderRadius: 10 }}>
            <span key={count} className="pop" style={{ fontSize: 64, color: "#E8556F", fontWeight: 700 }}>{count}</span>
          </div>
        )}
      </div>
      <div style={{ height: 7, background: "#EADfE6", borderRadius: 4, margin: "8px auto 0", maxWidth: 288, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.round(prog * 100)}%`, background: "var(--rose)", transition: "width .1s" }} />
      </div>
      <p style={{ fontSize: 11.5, color: "#A89AA3", margin: "8px 0 0" }}>탭(또는 스페이스)으로 점프! 장애물을 넘어 끝까지 달려가 💗</p>
    </div>
  );
}

// ── 눈사람 만들기 (스윙하는 눈덩이를 3단으로 쌓기) ──
function SnowmanGame({ onDone }: { onDone: (s: boolean) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(3);
  const [placed, setPlaced] = useState(0);
  const [lives, setLives] = useState(3);
  const started = useRef(false), over = useRef(false), dropReq = useRef(false);
  const onDoneRef = useRef(onDone); onDoneRef.current = onDone;

  useEffect(() => {
    if (count <= 0) { started.current = true; return; }
    const t = setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [count]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = 260, H = 300, groundY = H - 22;
    let raf = 0, t = 0, cancelled = false;
    const RADII = [34, 25, 17];
    const stack: { cx: number; cy: number; r: number }[] = [];
    let idx = 0, sweepX = W / 2, dir = 1, lv = 3;
    const ball = { x: W / 2, y: 54, falling: false, vy: 0 };
    const snow = Array.from({ length: 28 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: 0.4 + Math.random() }));

    const baseTop = () => stack.length === 0 ? groundY : stack[stack.length - 1].cy - stack[stack.length - 1].r;
    const prevCx = () => stack.length === 0 ? W / 2 : stack[stack.length - 1].cx;

    const drawBall = (cx: number, cy: number, r: number) => {
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#E8EEF5"; ctx.beginPath(); ctx.arc(cx + r * 0.32, cy + r * 0.34, r * 0.62, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx - r * 0.22, cy - r * 0.22, r * 0.66, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#D6E0EC"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    };

    const loop = () => {
      if (cancelled) return; t++;
      ctx.fillStyle = "#BFE0F0"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#EAF4FA"; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.fillStyle = "#FFFFFF";
      for (const s of snow) { s.y += s.s; if (s.y > H) { s.y = -4; s.x = Math.random() * W; } ctx.fillRect(s.x, s.y, 3, 3); }

      for (const b of stack) drawBall(b.cx, b.cy, b.r);

      if (started.current && !over.current && idx < 3) {
        const r = RADII[idx];
        if (!ball.falling) {
          const speed = 2.0 + idx * 0.5;
          sweepX += dir * speed;
          if (sweepX > W - r - 6) { sweepX = W - r - 6; dir = -1; }
          if (sweepX < r + 6) { sweepX = r + 6; dir = 1; }
          ball.x = sweepX; ball.y = 54;
          if (dropReq.current) { dropReq.current = false; ball.falling = true; ball.vy = 0; }
        } else {
          ball.vy += 0.9; ball.y += ball.vy;
          const landY = baseTop() - r;
          if (ball.y >= landY) {
            ball.y = landY;
            const off = Math.abs(ball.x - prevCx());
            const tol = idx === 0 ? 999 : RADII[idx - 1] * 0.85 + 6;
            if (off <= tol) {
              stack.push({ cx: ball.x, cy: ball.y, r }); idx++; setPlaced(idx);
              ball.falling = false; ball.x = sweepX = W / 2; dir = 1;
              if (idx >= 3) { over.current = true; setTimeout(() => onDoneRef.current(true), 950); }
            } else {
              lv--; setLives(Math.max(0, lv)); ball.falling = false; ball.x = sweepX = W / 2; dir = 1;
              if (lv <= 0) { over.current = true; setTimeout(() => onDoneRef.current(false), 600); }
            }
          }
        }
        drawBall(ball.x, ball.y, r);
        if (!ball.falling) { ctx.strokeStyle = "rgba(184,92,130,0.4)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ball.x, ball.y + r); ctx.lineTo(ball.x, groundY); ctx.stroke(); ctx.setLineDash([]); }
      }

      if (idx >= 3) {
        const head = stack[2], mid = stack[1];
        ctx.fillStyle = "#3A3A3A"; ctx.fillRect(head.cx - 7, head.cy - 4, 3, 3); ctx.fillRect(head.cx + 4, head.cy - 4, 3, 3);
        ctx.fillStyle = "#F2922F"; ctx.beginPath(); ctx.moveTo(head.cx, head.cy + 1); ctx.lineTo(head.cx + 13, head.cy + 3); ctx.lineTo(head.cx, head.cy + 5); ctx.fill();
        ctx.strokeStyle = "#7A5230"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(mid.cx - mid.r, mid.cy); ctx.lineTo(mid.cx - mid.r - 16, mid.cy - 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mid.cx + mid.r, mid.cy); ctx.lineTo(mid.cx + mid.r + 16, mid.cy - 10); ctx.stroke();
        ctx.fillStyle = "#E8556F"; ctx.fillRect(head.cx - head.r, head.cy + head.r - 4, head.r * 2, 6); ctx.fillRect(head.cx + 4, head.cy + head.r - 2, 6, 12);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onDown = (e: Event) => { e.preventDefault(); if (started.current && !over.current) dropReq.current = true; };
    cv.addEventListener("pointerdown", onDown);
    const onKey = (e: KeyboardEvent) => { if (e.code === "Space" || e.key === " ") { e.preventDefault(); if (started.current && !over.current) dropReq.current = true; } };
    window.addEventListener("keydown", onKey);
    return () => { cancelled = true; cancelAnimationFrame(raf); cv.removeEventListener("pointerdown", onDown); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6A5A66", margin: "0 4px 6px" }}>
        <span>⛄ {placed}/3 단</span>
        <span>{"❤️".repeat(Math.max(0, lives))}</span>
      </div>
      <div style={{ position: "relative", maxWidth: 260, margin: "0 auto" }}>
        <canvas ref={ref} width={260} height={300} style={{ width: "100%", maxWidth: 260, height: "auto", borderRadius: 10, touchAction: "none", display: "block" }} />
        {count > 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.55)", borderRadius: 10 }}>
            <span key={count} className="pop" style={{ fontSize: 64, color: "#E8556F", fontWeight: 700 }}>{count}</span>
          </div>
        )}
      </div>
      <p style={{ fontSize: 11.5, color: "#A89AA3", margin: "8px 0 0" }}>탭으로 눈덩이를 떨어뜨려 가운데에 잘 쌓아줘! ⛄</p>
    </div>
  );
}

// ── 바위 깨기 (광클로 픽셀 바위를 깎아 추억 사진 드러내기) ──
function RockBreak({ stage, onDone }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [pct, setPct] = useState(0);
  const onDoneRef = useRef(onDone); onDoneRef.current = onDone;

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = 264, H = 198, COLS = 22, ROWS = 16, BW = W / COLS, BH = H / ROWS;
    const total = COLS * ROWS;
    const gone = new Uint8Array(total);
    let removed = 0, raf = 0, cancelled = false, shake = 0, done = false;
    type Chip = { x: number; y: number; vx: number; vy: number; life: number; c: string };
    let chips: Chip[] = [];
    const img = new Image(); let imgOk = false;
    img.onload = () => { imgOk = true; };
    if (stage.photo) img.src = stage.photo;
    const ROCK = ["#8C857E", "#948D86", "#827B74"];
    const idxAt = (c: number, r: number) => r * COLS + c;

    const removeAround = (px: number, py: number) => {
      if (done) return;
      const cc = Math.floor(px / BW), cr = Math.floor(py / BH), rad = 2;
      let any = false;
      for (let dr = -rad; dr <= rad; dr++) for (let dc = -rad; dc <= rad; dc++) {
        const c = cc + dc, r = cr + dr;
        if (c < 0 || c >= COLS || r < 0 || r >= ROWS) continue;
        if (dc * dc + dr * dr > rad * rad) continue;
        const i = idxAt(c, r);
        if (!gone[i]) {
          gone[i] = 1; removed++; any = true;
          for (let kk = 0; kk < 2; kk++) chips.push({ x: c * BW + BW / 2, y: r * BH + BH / 2, vx: (Math.random() - 0.5) * 4, vy: -2 - Math.random() * 2, life: 20 + Math.random() * 12, c: ROCK[(c + r) % 3] });
        }
      }
      if (any && Math.random() < 0.5) { const ni = Math.floor(Math.random() * total); if (!gone[ni]) { gone[ni] = 1; removed++; } }
      if (any) shake = 4;
      const p = removed / total; setPct(Math.min(1, p));
      if (!done && p >= 0.86) { done = true; for (let i = 0; i < total; i++) gone[i] = 1; setTimeout(() => onDoneRef.current(true), 650); }
    };

    const loop = () => {
      if (cancelled) return;
      const sx = shake > 0 ? (Math.random() - 0.5) * shake : 0, sy = shake > 0 ? (Math.random() - 0.5) * shake : 0;
      if (shake > 0) shake -= 0.5;
      ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.translate(sx, sy);
      if (imgOk) {
        const ir = img.width / img.height, cr2 = W / H; let dw = W, dh = H, dx = 0, dy = 0;
        if (ir > cr2) { dh = H; dw = H * ir; dx = (W - dw) / 2; } else { dw = W; dh = W / ir; dy = (H - dh) / 2; }
        ctx.drawImage(img, dx, dy, dw, dh);
      } else { ctx.fillStyle = "#F4D6E6"; ctx.fillRect(0, 0, W, H); }
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (gone[idxAt(c, r)]) continue;
        const x = c * BW, y = r * BH;
        ctx.fillStyle = ROCK[(c + r) % 3]; ctx.fillRect(x, y, BW + 1, BH + 1);
        ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(x, y, BW + 1, 2);
        ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.fillRect(x, y + BH - 2, BW + 1, 2);
      }
      chips = chips.filter((p) => p.life > 0);
      for (const p of chips) { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.life--; ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), 3, 3); }
      ctx.restore();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const at = (e: PointerEvent) => { const rect = cv.getBoundingClientRect(); removeAround((e.clientX - rect.left) / rect.width * W, (e.clientY - rect.top) / rect.height * H); };
    const onDown = (e: PointerEvent) => { e.preventDefault(); at(e); };
    const onMove = (e: PointerEvent) => { if (e.pressure > 0 || (e.buttons & 1)) { e.preventDefault(); at(e); } };
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    return () => { cancelled = true; cancelAnimationFrame(raf); cv.removeEventListener("pointerdown", onDown); cv.removeEventListener("pointermove", onMove); };
  }, [stage.photo]);

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#8A7A85", margin: "2px 0 8px" }}>광클해서 바위를 깨고 추억을 드러내봐! ({Math.round(pct * 100)}%)</p>
      <canvas ref={ref} width={264} height={198} style={{ width: "100%", maxWidth: 264, height: "auto", borderRadius: 10, touchAction: "none", display: "block", margin: "0 auto", cursor: "pointer" }} />
      <div style={{ height: 8, background: "#EADfE6", borderRadius: 4, margin: "10px auto 0", maxWidth: 264, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.round(pct * 100)}%`, background: "var(--rose)", transition: "width .1s" }} />
      </div>
    </div>
  );
}

const TITLE: Record<string, string> = {
  quiz2: "💭 기억력 테스트!", finddiff: "🔍 숨은 하트 찾기!", puzzle: "🧩 추억 조각 맞추기!",
  cookie: "🍪 쿠키 받기!", timing: "🎯 타이밍을 맞춰!", catch: "💗 하트 캐치!", simon: "🎵 순서를 기억해!",
  runner: "🏃 달려서 만나러 가기!", snowman: "⛄ 눈사람 만들기!", rockbreak: "⛏️ 바위를 깨고 추억 발견!",
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
        {ch.type === "runner" && <RunnerGame onDone={onDone} />}
        {ch.type === "snowman" && <SnowmanGame onDone={onDone} />}
        {ch.type === "rockbreak" && <RockBreak stage={stage} onDone={onDone} />}
        <p style={{ fontSize: 10.5, color: "#A89AA3", margin: "12px 0 0", textAlign: "center" }}>
          성공하면 🧩 조각 +2! (스테이지당 한 번)
        </p>
      </div>
    </div>
  );
}
