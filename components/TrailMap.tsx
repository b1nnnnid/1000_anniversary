"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { isBlocked, isPath, TREES } from "@/lib/trail";
import { drawGrass, drawPathTile, drawTree, drawFlower, drawStageNode, drawGoal, drawCharacter, drawGirlfriend, drawHeartPiece, drawCat } from "@/lib/pixelArt";
import { STAGES, GOAL, CAT, HEART_PIECES, Stage, TILE, WORLD_COLS, WORLD_ROWS } from "@/lib/gameData";

type Dir = "down" | "up" | "left" | "right";
const VW = WORLD_COLS * TILE;          // 384
const VH = 560;                        // 보이는 세로 영역
const WORLD_H = WORLD_ROWS * TILE;     // 1472
const SPEED = 2.2;

interface Props {
  collected: string[];
  allCollected: boolean;
  heartPieces: string[];          // 주운 하트 조각 id
  onStage: (s: Stage) => void;
  onGoal: () => void;
  onHeart: (id: string) => void;  // 하트 조각 밟음
  onCat: () => void;              // 고양이 만남
}

export default function TrailMap({ collected, allCollected, heartPieces, onStage, onGoal, onHeart, onCat }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef<Record<string, boolean>>({});
  const pos = useRef({ x: 6 * TILE, y: 5 * TILE });
  const dir = useRef<Dir>("down");
  const standing = useRef<string | null>(null);
  const collectedRef = useRef(collected);
  const allRef = useRef(allCollected);
  const piecesRef = useRef(heartPieces);
  const grabbedRef = useRef<Set<string>>(new Set());
  const [near, setNear] = useState<string | null>(null);
  const nearId = useRef<string | null>(null);

  useEffect(() => { collectedRef.current = collected; }, [collected]);
  useEffect(() => { allRef.current = allCollected; }, [allCollected]);
  useEffect(() => { piecesRef.current = heartPieces; }, [heartPieces]);

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
      const k = keys.current;
      let dx = 0, dy = 0;
      if (k["up"]) { dy -= SPEED; dir.current = "up"; }
      if (k["down"]) { dy += SPEED; dir.current = "down"; }
      if (k["left"]) { dx -= SPEED; dir.current = "left"; }
      if (k["right"]) { dx += SPEED; dir.current = "right"; }
      const moving = dx !== 0 || dy !== 0;
      if (dx !== 0 && canMove(pos.current.x + dx, pos.current.y)) pos.current.x += dx;
      if (dy !== 0 && canMove(pos.current.x, pos.current.y + dy)) pos.current.y += dy;

      // 카메라 (세로 추적)
      let camY = pos.current.y + 16 - VH / 2;
      camY = Math.max(0, Math.min(WORLD_H - VH, camY));

      // 서있는 노드
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

      // 숨은 하트 조각 줍기
      for (const h of HEART_PIECES) {
        if (h.col === ptx && h.row === pty && !piecesRef.current.includes(h.id) && !grabbedRef.current.has(h.id)) {
          grabbedRef.current.add(h.id);
          onHeart(h.id);
        }
      }
      // 고양이
      if (CAT.col === ptx && CAT.row === pty) {
        if (standing.current !== "cat") { standing.current = "cat"; onCat(); }
      }

      // 가까운 라벨
      let best = 1.7 * TILE, label: string | null = null, lid: string | null = null;
      for (const s of STAGES) {
        const d = Math.hypot(s.col * TILE - pos.current.x, s.row * TILE - pos.current.y);
        if (d < best) { best = d; label = s.label; lid = s.id; }
      }
      const gd = Math.hypot(GOAL.col * TILE - pos.current.x, GOAL.row * TILE - pos.current.y);
      if (gd < best) { best = gd; label = allRef.current ? GOAL.label : "추억을 다 모으면 열려요"; lid = "goal"; }
      if (lid !== nearId.current) { nearId.current = lid; setNear(label); }

      // ===== 렌더 =====
      ctx.clearRect(0, 0, VW, VH);
      ctx.fillStyle = "#CDEBD8"; ctx.fillRect(0, 0, VW, VH);
      ctx.save();
      ctx.translate(0, -camY);

      const r0 = Math.max(0, Math.floor(camY / TILE) - 1);
      const r1 = Math.min(WORLD_ROWS - 1, Math.ceil((camY + VH) / TILE) + 1);
      for (let row = r0; row <= r1; row++) {
        for (let col = 0; col < WORLD_COLS; col++) {
          drawGrass(ctx, col, row);
          if (isPath(col, row)) drawPathTile(ctx, col, row);
          else if (TREES.has(`${col},${row}`)) drawTree(ctx, col, row);
          else if (col === 0 || col === WORLD_COLS - 1 || row === 0 || row === WORLD_ROWS - 1) drawTree(ctx, col, row);
          else if ((col * 5 + row * 3) % 11 === 0) drawFlower(ctx, col, row);
        }
      }
      const bob = Math.floor(Math.abs(Math.sin(tick / 18)) * 3);
      for (const s of STAGES) {
        if (s.row < r0 - 1 || s.row > r1 + 1) continue;
        drawStageNode(ctx, s.col, s.row, s.order, collectedRef.current.includes(s.id), bob);
      }
      for (const h of HEART_PIECES) {
        if (piecesRef.current.includes(h.id) || grabbedRef.current.has(h.id)) continue;
        if (h.row < r0 - 1 || h.row > r1 + 1) continue;
        drawHeartPiece(ctx, h.col, h.row, bob);
      }
      drawCat(ctx, CAT.col, CAT.row, Math.floor(tick / 26) % 2);
      drawGoal(ctx, GOAL.col, GOAL.row, allRef.current, bob);
      drawGirlfriend(ctx, (GOAL.col + 1) * TILE + 6, GOAL.row * TILE, Math.floor(tick / 22) % 2);

      const frame = moving ? (Math.floor(tick / 8) % 2) : 0;
      drawCharacter(ctx, pos.current.x, pos.current.y, dir.current, frame);
      ctx.restore();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onStage, onGoal, onHeart, onCat]);

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
