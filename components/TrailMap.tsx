"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { isBlocked, isPath, TREES } from "@/lib/trail";
import {
  drawGrass, drawPathTile, drawTree, drawFlower, drawStageNode, drawGoal,
  drawCharacter, drawGirlfriend, drawGirlfriendWalk, drawHeartPiece, drawCat, drawEmote, drawPlace,
} from "@/lib/pixelArt";
import { STAGES, GOAL, CAT, HEART_PIECES, Stage, TILE, WORLD_COLS, WORLD_ROWS } from "@/lib/gameData";

type Dir = "down" | "up" | "left" | "right";
const VW = WORLD_COLS * TILE;
const VH = 560;
const WORLD_H = WORLD_ROWS * TILE;
const SPEED = 2.2;

type CatState = "idle" | "notice" | "approach" | "talk" | "return";

interface Props {
  collected: string[];
  allCollected: boolean;
  heartPieces: string[];
  lockedIds: string[];       // 잠긴 스테이지 id
  celebrated: boolean;       // 상봉 후 핑크 월드
  busy: boolean;             // 모달/대화 등 UI가 떠 있으면 이동·고양이 정지
  onStage: (s: Stage) => void;
  onGoal: () => void;
  onHeart: (id: string) => void;
  onCatTalk: () => void;     // 고양이가 말을 걸 때
}

export default function TrailMap({
  collected, allCollected, heartPieces, lockedIds, celebrated, busy,
  onStage, onGoal, onHeart, onCatTalk,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef<Record<string, boolean>>({});
  const pos = useRef({ x: 6 * TILE, y: 5 * TILE });
  const dir = useRef<Dir>("down");
  const standing = useRef<string | null>(null);
  const collectedRef = useRef(collected);
  const allRef = useRef(allCollected);
  const piecesRef = useRef(heartPieces);
  const lockedRef = useRef(lockedIds);
  const celebRef = useRef(celebrated);
  const busyRef = useRef(busy);
  const grabbedRef = useRef<Set<string>>(new Set());
  const hist = useRef<{ x: number; y: number; d: Dir }[]>([]);
  const cat = useRef<{ x: number; y: number; state: CatState; timer: number; cooldown: number }>({
    x: CAT.col * TILE, y: CAT.row * TILE, state: "idle", timer: 0, cooldown: 360,
  });
  const [near, setNear] = useState<string | null>(null);
  const nearId = useRef<string | null>(null);

  useEffect(() => { collectedRef.current = collected; }, [collected]);
  useEffect(() => { allRef.current = allCollected; }, [allCollected]);
  useEffect(() => { piecesRef.current = heartPieces; }, [heartPieces]);
  useEffect(() => { lockedRef.current = lockedIds; }, [lockedIds]);
  useEffect(() => { celebRef.current = celebrated; }, [celebrated]);
  useEffect(() => { busyRef.current = busy; }, [busy]);

  const canMove = (nx: number, ny: number) => {
    const pts = [[nx + 8, ny + 18], [nx + 23, ny + 18], [nx + 8, ny + 30], [nx + 23, ny + 30]];
    return pts.every(([cx, cy]) => !isBlocked(Math.floor(cx / TILE), Math.floor(cy / TILE)));
  };

  useEffect(() => {
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    let raf = 0, tick = 0;

    const loop = () => {
      tick++;
      const frozen = busyRef.current;
      const k = keys.current;
      let dx = 0, dy = 0;
      if (!frozen) {
        if (k["up"]) { dy -= SPEED; dir.current = "up"; }
        if (k["down"]) { dy += SPEED; dir.current = "down"; }
        if (k["left"]) { dx -= SPEED; dir.current = "left"; }
        if (k["right"]) { dx += SPEED; dir.current = "right"; }
      }
      const moving = dx !== 0 || dy !== 0;
      if (dx !== 0 && canMove(pos.current.x + dx, pos.current.y)) pos.current.x += dx;
      if (dy !== 0 && canMove(pos.current.x, pos.current.y + dy)) pos.current.y += dy;

      // 동행하는 여자친구용 위치 기록
      if (celebRef.current) {
        const h = hist.current;
        const last = h[h.length - 1];
        if (!last || last.x !== pos.current.x || last.y !== pos.current.y || last.d !== dir.current) {
          h.push({ x: pos.current.x, y: pos.current.y, d: dir.current });
          if (h.length > 40) h.shift();
        }
      }

      // ── 고양이 AI ──
      const c = cat.current;
      const dPlayer = Math.hypot(pos.current.x - c.x, pos.current.y - c.y);
      if (c.state === "idle") {
        if (c.cooldown > 0) c.cooldown--;
        if (!busyRef.current && ((c.cooldown <= 0 && dPlayer < 7 * TILE) || dPlayer < 1.3 * TILE)) {
          c.state = "notice"; c.timer = 42;
        }
      } else if (c.state === "notice") {
        if (busyRef.current) { c.state = "return"; }          // 보던 게 있으면 방해하지 않기
        else { c.timer--; if (c.timer <= 0) { c.state = "approach"; c.timer = 420; } }
      } else if (c.state === "approach") {
        if (busyRef.current) { c.state = "return"; }          // 다가오다가도 철수
        else {
          c.timer--;
          const sp = 1.7;
          const ddx = pos.current.x - c.x, ddy = pos.current.y - c.y;
          if (Math.abs(ddx) > Math.abs(ddy)) c.x += Math.sign(ddx) * Math.min(sp, Math.abs(ddx));
          else c.y += Math.sign(ddy) * Math.min(sp, Math.abs(ddy));
          if (dPlayer < 1.15 * TILE || c.timer <= 0) { c.state = "talk"; onCatTalk(); }
        }
      } else if (c.state === "talk") {
        if (!busyRef.current) c.state = "return";
      } else if (c.state === "return") {
        const hx = CAT.col * TILE, hy = CAT.row * TILE, sp = 1.4;
        const ddx = hx - c.x, ddy = hy - c.y;
        if (Math.abs(ddx) < 2 && Math.abs(ddy) < 2) {
          c.x = hx; c.y = hy; c.state = "idle";
          c.cooldown = 900 + Math.floor(Math.random() * 1500);
        } else if (Math.abs(ddx) > Math.abs(ddy)) c.x += Math.sign(ddx) * sp;
        else c.y += Math.sign(ddy) * sp;
      }

      // 카메라
      let camY = pos.current.y + 16 - VH / 2;
      camY = Math.max(0, Math.min(WORLD_H - VH, camY));

      // 서있는 노드 감지
      const ptx = Math.floor((pos.current.x + 16) / TILE);
      const pty = Math.floor((pos.current.y + 24) / TILE);
      const hereStage = STAGES.find((s) => s.col === ptx && s.row === pty);
      const onGoalTile = GOAL.col === ptx && GOAL.row === pty;
      const hereId = hereStage ? hereStage.id : onGoalTile ? "goal" : null;
      if (hereId && standing.current !== hereId) {
        standing.current = hereId;
        if (hereStage) onStage(hereStage);
        else if (onGoalTile && allRef.current) onGoal();
      } else if (!hereId) standing.current = null;

      // 숨은 하트 조각
      for (const h of HEART_PIECES) {
        if (h.col === ptx && h.row === pty && !piecesRef.current.includes(h.id) && !grabbedRef.current.has(h.id)) {
          grabbedRef.current.add(h.id);
          onHeart(h.id);
        }
      }

      // 가까운 라벨
      let best = 1.7 * TILE, label: string | null = null, lid: string | null = null;
      for (const s of STAGES) {
        const d = Math.hypot(s.col * TILE - pos.current.x, s.row * TILE - pos.current.y);
        if (d < best) {
          best = d;
          label = celebRef.current && s.place ? "💑 " + s.place.name
            : lockedRef.current.includes(s.id) ? "🔒 아직 잠겨있어요" : s.label;
          lid = s.id;
        }
      }
      const gd = Math.hypot(GOAL.col * TILE - pos.current.x, GOAL.row * TILE - pos.current.y);
      if (gd < best) { best = gd; label = allRef.current ? GOAL.label : "추억을 다 모으면 열려요"; lid = "goal"; }
      if (lid !== nearId.current) { nearId.current = lid; setNear(label); }

      // ===== 렌더 =====
      const pink = celebRef.current;
      ctx.clearRect(0, 0, VW, VH);
      ctx.fillStyle = pink ? "#FBDCE8" : "#CDEBD8";
      ctx.fillRect(0, 0, VW, VH);
      ctx.save();
      ctx.translate(0, -camY);

      const r0 = Math.max(0, Math.floor(camY / TILE) - 1);
      const r1 = Math.min(WORLD_ROWS - 1, Math.ceil((camY + VH) / TILE) + 1);
      for (let row = r0; row <= r1; row++) {
        for (let col = 0; col < WORLD_COLS; col++) {
          drawGrass(ctx, col, row, pink);
          if (isPath(col, row)) drawPathTile(ctx, col, row);
          else if (TREES.has(`${col},${row}`)) drawTree(ctx, col, row, pink);
          else if (col === 0 || col === WORLD_COLS - 1 || row === 0 || row === WORLD_ROWS - 1) drawTree(ctx, col, row, pink);
          else if ((col * 5 + row * 3) % 11 === 0) drawFlower(ctx, col, row);
        }
      }
      const bob = Math.floor(Math.abs(Math.sin(tick / 18)) * 3);
      for (const s of STAGES) {
        if (s.row < r0 - 1 || s.row > r1 + 1) continue;
        if (pink && s.place) drawPlace(ctx, s.col, s.row, s.place.kind, bob);
        else drawStageNode(ctx, s.col, s.row, s.order, collectedRef.current.includes(s.id), bob, lockedRef.current.includes(s.id));
      }
      for (const h of HEART_PIECES) {
        if (piecesRef.current.includes(h.id) || grabbedRef.current.has(h.id)) continue;
        if (h.row < r0 - 1 || h.row > r1 + 1) continue;
        drawHeartPiece(ctx, h.col, h.row, bob);
      }
      drawGoal(ctx, GOAL.col, GOAL.row, allRef.current, bob);

      // 고양이
      const catFrame = c.state === "approach" || c.state === "return" ? (Math.floor(tick / 8) % 2) : (Math.floor(tick / 26) % 2);
      drawCat(ctx, c.x, c.y, catFrame);
      if (c.state === "notice") drawEmote(ctx, c.x, c.y);

      // 여자친구: 상봉 전엔 도착지에서 대기, 후엔 동행
      const frame = moving ? (Math.floor(tick / 8) % 2) : 0;
      if (pink) {
        const h = hist.current;
        const g = h.length > 14 ? h[h.length - 14] : null;
        const gx = g ? g.x : pos.current.x - 22;
        const gy = g ? g.y : pos.current.y;
        const gdir = g ? g.d : dir.current;
        drawGirlfriendWalk(ctx, gx, gy, gdir, moving ? (Math.floor(tick / 8) % 2) : 0);
      } else {
        drawGirlfriend(ctx, (GOAL.col + 1) * TILE + 6, GOAL.row * TILE, Math.floor(tick / 22) % 2);
      }
      drawCharacter(ctx, pos.current.x, pos.current.y, dir.current, frame);
      ctx.restore();

      // 벚꽃 잎 흩날리기 (화면 오버레이)
      if (pink) {
        for (let i = 0; i < 14; i++) {
          const sp = 0.4 + (i % 3) * 0.25;
          const px = (i * 53 + tick * sp) % (VW + 20) - 10;
          const py = (i * 97 + tick * (0.5 + (i % 2) * 0.35)) % (VH + 20) - 10;
          const sway = Math.sin((tick + i * 30) / 40) * 6;
          ctx.fillStyle = i % 2 === 0 ? "#F8BBD3" : "#FCD9E8";
          ctx.fillRect(Math.round(px + sway), Math.round(py), 4, 4);
          ctx.fillRect(Math.round(px + sway) + 3, Math.round(py) - 2, 3, 3);
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onStage, onGoal, onHeart, onCatTalk]);

  useEffect(() => {
    const m: Record<string, string> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right",
    };
    const dn = (e: KeyboardEvent) => { if (m[e.key]) { keys.current[m[e.key]] = true; e.preventDefault(); } };
    const up = (e: KeyboardEvent) => { if (m[e.key]) keys.current[m[e.key]] = false; };
    window.addEventListener("keydown", dn); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);

  const press = useCallback((d: string, v: boolean) => { keys.current[d] = v; }, []);
  const pad = (label: string, d: string) => (
    <button className="dpad" aria-label={d}
      onTouchStart={(e) => { e.preventDefault(); press(d, true); }}
      onTouchEnd={(e) => { e.preventDefault(); press(d, false); }}
      onMouseDown={() => press(d, true)} onMouseUp={() => press(d, false)} onMouseLeave={() => press(d, false)}
    >{label}</button>
  );

  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative", width: "100%", maxWidth: VW, margin: "0 auto" }}>
        <canvas ref={canvasRef} width={VW} height={VH}
          className="pixel-border"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: 14 }} />
        {near && (
          <div className="pop" style={{
            position: "absolute", left: "50%", top: 10, transform: "translateX(-50%)",
            background: "#fff", color: "#B85C82", padding: "5px 14px", borderRadius: 12,
            fontSize: 12, whiteSpace: "nowrap", boxShadow: "0 2px 0 rgba(124,90,150,0.2)",
          }}>{near}</div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 14, userSelect: "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,52px)", gridTemplateRows: "repeat(3,52px)", gap: 5 }}>
          <span />{pad("▲", "up")}<span />
          {pad("◀", "left")}<span />{pad("▶", "right")}
          <span />{pad("▼", "down")}<span />
        </div>
      </div>

      <style>{`
        .dpad{background:#fff;border:2px solid var(--lav);border-radius:12px;font-size:18px;
          color:var(--rose);box-shadow:0 3px 0 rgba(124,90,150,0.2);display:flex;align-items:center;justify-content:center}
        .dpad:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(124,90,150,0.2)}
      `}</style>
    </div>
  );
}
