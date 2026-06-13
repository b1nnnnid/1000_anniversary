"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { isBlocked, isPath, TREES } from "@/lib/trail";
import {
  drawGrass, drawPathTile, drawTree, drawFlower, drawStageNode, drawGoal,
  drawCharacter, drawGirlfriend, drawGirlfriendWalk, drawHeartPiece, drawCat, drawEmote, drawPlace,
  drawSign, drawBench, drawGhost, drawBlackCat, drawFlowerBloom, drawFootprint, drawBounce,
} from "@/lib/pixelArt";
import { STAGES, GOAL, CAT, HEART_PIECES, MARKERS, Marker, Stage, TILE, WORLD_COLS, WORLD_ROWS } from "@/lib/gameData";

type Dir = "down" | "up" | "left" | "right";
const VW = WORLD_COLS * TILE;
const VH = 560;
const WORLD_H = WORLD_ROWS * TILE;
const SPEED = 0.85;

type CatState = "idle" | "notice" | "approach" | "talk" | "return";

interface Props {
  collected: string[];
  allCollected: boolean;
  heartPieces: string[];
  lockedIds: string[];       // 잠긴 스테이지 id
  celebrated: boolean;       // 상봉 후 핑크 월드
  busy: boolean;             // 모달/대화 등 UI가 떠 있으면 이동·고양이 정지
  catActive: boolean;        // false면 고양이가 더 이상 다가오지 않음
  thiefRun: number;          // 값이 바뀌면 도둑 검은 고양이 달리기 연출 시작
  catIntro: number;          // 값이 바뀌면 노란 고양이가 시작 지점으로 다가와 인사
  onStage: (s: Stage) => void;
  onGoal: () => void;
  onHeart: (id: string) => void;
  onCatTalk: () => void;     // 고양이가 말을 걸 때
  onMarker: (m: Marker) => void; // 표지판·과거의우리·벤치에 닿았을 때
}

export default function TrailMap({
  collected, allCollected, heartPieces, lockedIds, celebrated, busy, catActive, thiefRun, catIntro,
  onStage, onGoal, onHeart, onCatTalk, onMarker,
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
  const catActiveRef = useRef(catActive);
  const grabbedRef = useRef<Set<string>>(new Set());
  const hist = useRef<{ x: number; y: number; d: Dir }[]>([]);
  const cat = useRef<{ x: number; y: number; state: CatState; timer: number; cooldown: number; seenBusy: boolean }>({
    x: CAT.col * TILE, y: CAT.row * TILE, state: "idle", timer: 0, cooldown: 360, seenBusy: false,
  });
  const [near, setNear] = useState<string | null>(null);
  const nearId = useRef<string | null>(null);
  // 표지판/과거의우리/벤치, 꽃, 발자국, 튕김, 도둑고양이
  const standMarker = useRef<string | null>(null);
  const bloom = useRef<Set<string>>(new Set());
  const foot = useRef<{ x: number; y: number }[]>([]);
  const bounce = useRef({ x: 0, y: 0, t: 0, cd: 0 });
  const thief = useRef({ active: false, x: 0, y: 0, t: 0 });
  const thiefInit = useRef(true);

  useEffect(() => { collectedRef.current = collected; }, [collected]);
  useEffect(() => { allRef.current = allCollected; }, [allCollected]);
  useEffect(() => { piecesRef.current = heartPieces; }, [heartPieces]);
  useEffect(() => { lockedRef.current = lockedIds; }, [lockedIds]);
  useEffect(() => { celebRef.current = celebrated; }, [celebrated]);
  useEffect(() => { busyRef.current = busy; }, [busy]);
  useEffect(() => { catActiveRef.current = catActive; }, [catActive]);

  // 도둑 검은 고양이 달리기 연출 시작 (thiefRun 값이 바뀔 때)
  useEffect(() => {
    if (thiefInit.current) { thiefInit.current = false; return; }
    const m = MARKERS.find((x) => x.event === "thiefcat");
    const sx = (m ? m.col : 6) * TILE, sy = (m ? m.row : 8) * TILE;
    thief.current = { active: true, x: sx, y: sy - 10, t: 150 };
  }, [thiefRun]);

  // 노란 고양이 인사: 시작 캐릭터 근처에 나타나 ❗ 띄우고 다가와 인사 → 제자리로
  const catIntroInit = useRef(true);
  useEffect(() => {
    if (catIntroInit.current) { catIntroInit.current = false; return; }
    const c = cat.current;
    c.x = Math.min((WORLD_COLS - 2) * TILE, pos.current.x + 2.4 * TILE);
    c.y = pos.current.y + 1.3 * TILE;
    c.state = "notice"; c.timer = 48; c.seenBusy = false;
  }, [catIntro]);

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
      // 나무에 막히면 "띠용" 튕김
      const tryBounce = (fx: number, fy: number) => {
        const tc = Math.floor(fx / TILE), tr = Math.floor(fy / TILE);
        if (TREES.has(`${tc},${tr}`) && bounce.current.cd <= 0) {
          bounce.current = { x: pos.current.x, y: pos.current.y, t: 16, cd: 30 };
        }
      };
      if (dx !== 0) {
        if (canMove(pos.current.x + dx, pos.current.y)) pos.current.x += dx;
        else tryBounce(pos.current.x + 16 + Math.sign(dx) * 13, pos.current.y + 24);
      }
      if (dy !== 0) {
        if (canMove(pos.current.x, pos.current.y + dy)) pos.current.y += dy;
        else tryBounce(pos.current.x + 16, pos.current.y + 24 + Math.sign(dy) * 8);
      }
      if (bounce.current.cd > 0) bounce.current.cd--;
      if (bounce.current.t > 0) bounce.current.t--;

      // 발자국 기록
      if (moving && tick % 7 === 0) {
        foot.current.push({ x: pos.current.x, y: pos.current.y });
        if (foot.current.length > 24) foot.current.shift();
      }

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
        if (catActiveRef.current && !busyRef.current && ((c.cooldown <= 0 && dPlayer < 7 * TILE) || dPlayer < 1.3 * TILE)) {
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
          if (dPlayer < 1.15 * TILE || c.timer <= 0) {
            c.state = "talk"; c.timer = 30; c.seenBusy = false; onCatTalk();
          }
        }
      } else if (c.state === "talk") {
        // setDialog()로 busy가 켜지기까지 몇 프레임 걸리므로, busy를 한 번
        // 본 뒤(대화창 열림) 닫힐 때까지 제자리를 지킨다.
        if (busyRef.current) c.seenBusy = true;
        if (c.seenBusy) {
          if (!busyRef.current) c.state = "return";        // 대화 끝 → 복귀
        } else if (c.timer-- <= 0) {
          c.state = "return";                              // 대화창이 안 떴으면 복귀
        }
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
      const hereStage = STAGES.find((s) =>
        celebRef.current && s.place
          ? pty === s.row && Math.abs(ptx - s.col) <= 1
          : s.col === ptx && s.row === pty
      );
      const onGoalTile = GOAL.col === ptx && GOAL.row === pty;
      const hereId = hereStage ? hereStage.id : onGoalTile ? "goal" : null;
      if (hereId && standing.current !== hereId) {
        standing.current = hereId;
        if (hereStage) onStage(hereStage);
        else if (onGoalTile && allRef.current) onGoal();
      } else if (!hereId) standing.current = null;

      // 표지판·과거의우리·벤치 — 닿으면 말 걸기 (칸 진입 시 1회)
      const hereMarker = MARKERS.find((m) => m.col === ptx && m.row === pty);
      const hereMkId = hereMarker ? hereMarker.id : null;
      if (hereMkId && standMarker.current !== hereMkId) {
        standMarker.current = hereMkId;
        if (!busyRef.current) onMarker(hereMarker!);
      } else if (!hereMkId) standMarker.current = null;

      // 꽃 밟으면 피어남
      if ((ptx * 5 + pty * 3) % 11 === 0) bloom.current.add(`${ptx},${pty}`);

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
          else if ((col * 5 + row * 3) % 11 === 0) {
            if (bloom.current.has(`${col},${row}`)) drawFlowerBloom(ctx, col, row, tick);
            else drawFlower(ctx, col, row);
          }
        }
      }
      // 지나온 발자국 (오래된 것일수록 흐리게)
      const fl = foot.current.length;
      foot.current.forEach((f, i) => drawFootprint(ctx, f.x, f.y, 0.08 + (i / Math.max(1, fl)) * 0.22));

      const bob = Math.floor(Math.abs(Math.sin(tick / 18)) * 3);
      for (const s of STAGES) {
        if (s.row < r0 - 4 || s.row > r1 + 2) continue;
        if (pink && s.place) {
          // 큼직한 데이트 건물 (바닥 중심 기준 2.6배)
          const ax = (s.col + 0.5) * TILE, ay = (s.row + 1) * TILE;
          ctx.save();
          ctx.translate(ax, ay); ctx.scale(2.0, 2.0); ctx.translate(-ax, -ay);
          drawPlace(ctx, s.col, s.row, s.place.kind, bob);
          ctx.restore();
        } else {
          drawStageNode(ctx, s.col, s.row, s.order, collectedRef.current.includes(s.id), bob, lockedRef.current.includes(s.id));
        }
      }
      for (const h of HEART_PIECES) {
        if (piecesRef.current.includes(h.id) || grabbedRef.current.has(h.id)) continue;
        if (h.row < r0 - 1 || h.row > r1 + 1) continue;
        drawHeartPiece(ctx, h.col, h.row, bob);
      }
      // 표지판 · 과거의 우리 · 벤치
      const gbob = Math.floor(Math.abs(Math.sin(tick / 26)) * 3);
      for (const m of MARKERS) {
        if (m.row < r0 - 2 || m.row > r1 + 2) continue;
        if (m.kind === "sign") drawSign(ctx, m.col, m.row, 0);
        else if (m.kind === "bench") drawBench(ctx, m.col, m.row);
        else drawGhost(ctx, m.col, m.row, gbob);
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
        drawGirlfriendWalk(ctx, gx, gy, gdir, moving ? (Math.floor(tick / 8) % 2) : 0, true);
      } else {
        drawGirlfriend(ctx, (GOAL.col + 1) * TILE + 6, GOAL.row * TILE, Math.floor(tick / 22) % 2);
      }
      drawCharacter(ctx, pos.current.x, pos.current.y, dir.current, frame, pink);

      // 도둑 검은 고양이 달리기 (티켓 물고 도망)
      if (thief.current.active) {
        const th = thief.current;
        th.t--; th.x += 1.7; th.y += 1.0;
        drawBlackCat(ctx, th.x, th.y, Math.floor(tick / 6) % 2);
        ctx.fillStyle = "#F4D6E6"; ctx.fillRect(Math.round(th.x + 30), Math.round(th.y + 12), 9, 6);
        ctx.fillStyle = "#E8799F"; ctx.fillRect(Math.round(th.x + 30), Math.round(th.y + 12), 9, 1);
        if (th.t <= 0) th.active = false;
      }
      // 나무 튕김 효과
      if (bounce.current.t > 0) drawBounce(ctx, bounce.current.x, bounce.current.y, bounce.current.t);

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
  }, [onStage, onGoal, onHeart, onCatTalk, onMarker]);

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

  // ── 모바일 조이스틱 ──
  const joyBase = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const startJoy = useCallback((e: { clientX: number; clientY: number; preventDefault: () => void }) => {
    e.preventDefault();
    const base = joyBase.current; if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const R = 38, T = 9; // 최대 반경 / 데드존
    const apply = (clientX: number, clientY: number) => {
      let vx = clientX - cx, vy = clientY - cy;
      const mag = Math.hypot(vx, vy);
      if (mag > R) { vx = (vx / mag) * R; vy = (vy / mag) * R; }
      setKnob({ x: vx, y: vy });
      const k = keys.current;
      k.right = vx > T; k.left = vx < -T; k.down = vy > T; k.up = vy < -T; // 8방향
    };
    apply(e.clientX, e.clientY);
    const mv = (ev: PointerEvent) => { ev.preventDefault(); apply(ev.clientX, ev.clientY); };
    const end = () => {
      setKnob({ x: 0, y: 0 });
      const k = keys.current; k.up = k.down = k.left = k.right = false;
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
    window.addEventListener("pointermove", mv, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }, []);

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

        {/* 맵 위에 떠 있는 조이스틱 — 끌어서 이동 (이동하며 화면을 볼 수 있어요) */}
        <div ref={joyBase} onPointerDown={startJoy} style={{
          position: "absolute", right: 16, bottom: 16, width: 118, height: 118, borderRadius: "50%",
          background: "rgba(255,255,255,0.40)", border: "2px solid rgba(184,92,130,0.45)",
          boxShadow: "0 2px 0 rgba(124,90,150,0.18)", touchAction: "none", userSelect: "none",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5,
        }}>
          <span style={{ position: "absolute", top: 4, color: "#B85C82", fontSize: 11, opacity: 0.7 }}>▲</span>
          <span style={{ position: "absolute", bottom: 4, color: "#B85C82", fontSize: 11, opacity: 0.7 }}>▼</span>
          <span style={{ position: "absolute", left: 6, color: "#B85C82", fontSize: 11, opacity: 0.7 }}>◀</span>
          <span style={{ position: "absolute", right: 6, color: "#B85C82", fontSize: 11, opacity: 0.7 }}>▶</span>
          <div style={{
            width: 54, height: 54, borderRadius: "50%", background: "var(--rose)", border: "3px solid #fff",
            boxShadow: "0 3px 0 rgba(124,90,150,0.3)", pointerEvents: "none",
            transform: `translate(${knob.x}px, ${knob.y}px)`,
          }} />
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "#A89AA3", marginTop: 10 }}>
        가운데 동그라미를 끌어 이동해요 · PC는 방향키 / WASD
      </p>
    </div>
  );
}
