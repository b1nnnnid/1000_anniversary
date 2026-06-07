// 파스텔 픽셀아트 그리기 헬퍼 (ctx는 카메라만큼 translate 된 상태로 호출 → 월드 좌표 사용)
import { TILE } from "./gameData";

const C = {
  grass: "#CDEBD8", grassDk: "#C2E4CF", blade: "#A7D8B6",
  path: "#F3E3CE", pathEdge: "#E6CDA8", stone: "#E9D6BC",
  trunk: "#C7A07A", tDk: "#A7D8B6", tMid: "#BCE6C8", tLt: "#CDEFD6",
  flower: ["#F2A3C0", "#C9A7F0", "#F6E05E"],
  card: "#FFFFFF", cardBar: "#F4D6E6", photo: "#BFE0F5", leaf: "#8FC9A0",
  rose: "#E8799F", roseDk: "#B85C82", post: "#B98C63",
  // 캐릭터
  hair: "#7A5A8E", hairLt: "#A07FB8", skin: "#FBE0CC",
  shirt: "#9FC7E8", shirtSh: "#7FA8CC", pants: "#6B8AA8",
  cheek: "#F4A8B8", eye: "#4A3A2E", gold: "#F2C76B", goldDk: "#E0A94A",
};

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export function drawGrass(ctx: CanvasRenderingContext2D, col: number, row: number) {
  const x = col * TILE, y = row * TILE;
  r(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? C.grass : C.grassDk);
  r(ctx, x + 6, y + 22, 2, 4, C.blade);
  r(ctx, x + 21, y + 11, 2, 4, C.blade);
}

export function drawPathTile(ctx: CanvasRenderingContext2D, col: number, row: number) {
  const x = col * TILE, y = row * TILE;
  r(ctx, x, y, TILE, TILE, C.path);
  r(ctx, x, y, TILE, 2, C.pathEdge);
  r(ctx, x, y + TILE - 2, TILE, 2, C.pathEdge);
  // 디딤돌 점점
  r(ctx, x + 8, y + 12, 5, 5, C.stone);
  r(ctx, x + 19, y + 20, 4, 4, C.stone);
}

export function drawTree(ctx: CanvasRenderingContext2D, col: number, row: number) {
  const x = col * TILE, y = row * TILE;
  r(ctx, x + 13, y + 22, 6, 9, C.trunk);
  r(ctx, x + 5, y + 11, 22, 13, C.tDk);
  r(ctx, x + 8, y + 5, 16, 13, C.tMid);
  r(ctx, x + 12, y + 1, 9, 8, C.tLt);
}

export function drawFlower(ctx: CanvasRenderingContext2D, col: number, row: number) {
  const x = col * TILE, y = row * TILE;
  const c = C.flower[(col * 3 + row) % C.flower.length];
  r(ctx, x + 13, y + 14, 4, 4, "#F6E05E");
  r(ctx, x + 9, y + 14, 4, 4, c); r(ctx, x + 17, y + 14, 4, 4, c);
  r(ctx, x + 13, y + 10, 4, 4, c); r(ctx, x + 13, y + 18, 4, 4, c);
}

// 추억 스테이지 노드: 작은 폴라로이드 + 위에 하트 + 순서 번호
export function drawStageNode(
  ctx: CanvasRenderingContext2D, col: number, row: number,
  order: number, collected: boolean, bob: number
) {
  const x = col * TILE, y = row * TILE - bob;
  // 그림자
  ctx.fillStyle = "rgba(124,90,150,0.16)";
  ctx.beginPath();
  ctx.ellipse(x + TILE / 2, row * TILE + TILE - 3, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
  // 말뚝
  r(ctx, x + 14, y + 26, 4, 8, C.post);
  // 폴라로이드 카드
  r(ctx, x + 4, y + 2, 24, 26, C.card);
  r(ctx, x + 4, y + 2, 24, 6, C.cardBar);
  r(ctx, x + 8, y + 11, 16, 12, C.photo);
  r(ctx, x + 10, y + 16, 5, 7, C.leaf);
  r(ctx, x + 16, y + 13, 6, 10, C.leaf);
  // 위의 하트
  const hx = x + 11, hy = y - 7;
  if (collected) {
    r(ctx, hx + 1, hy + 2, 3, 3, C.rose); r(ctx, hx + 6, hy + 2, 3, 3, C.rose);
    r(ctx, hx, hy + 4, 10, 3, C.rose); r(ctx, hx + 1, hy + 7, 8, 2, C.rose);
    r(ctx, hx + 3, hy + 9, 4, 2, C.rose);
  } else {
    // 빈 하트(외곽) + 반짝임
    r(ctx, hx + 1, hy + 2, 3, 2, C.roseDk); r(ctx, hx + 6, hy + 2, 3, 2, C.roseDk);
    r(ctx, hx, hy + 4, 2, 3, C.roseDk); r(ctx, hx + 8, hy + 4, 2, 3, C.roseDk);
    r(ctx, hx + 2, hy + 7, 2, 2, C.roseDk); r(ctx, hx + 6, hy + 7, 2, 2, C.roseDk);
    r(ctx, hx + 4, hy + 9, 2, 2, C.roseDk);
    r(ctx, x + 26, y, 3, 3, C.gold);
  }
  // 번호 배지
  r(ctx, x + 2, y + 20, 8, 8, C.roseDk);
  ctx.fillStyle = "#fff"; ctx.font = "9px Galmuri11, monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(String(order), x + 6, y + 25);
  ctx.textBaseline = "alphabetic";
}

// 도착지 (1000일): 큰 하트 게이트. unlocked면 반짝, 아니면 자물쇠
export function drawGoal(
  ctx: CanvasRenderingContext2D, col: number, row: number, unlocked: boolean, bob: number
) {
  const x = col * TILE, y = row * TILE - bob;
  ctx.fillStyle = "rgba(124,90,150,0.16)";
  ctx.beginPath(); ctx.ellipse(x + 16, row * TILE + TILE - 2, 15, 5, 0, 0, Math.PI * 2); ctx.fill();
  const col2 = unlocked ? C.rose : "#C9BBD4";
  const colD = unlocked ? C.roseDk : "#A89BB8";
  // 큰 하트
  r(ctx, x + 4, y, 8, 6, col2); r(ctx, x + 20, y, 8, 6, col2);
  r(ctx, x + 2, y + 4, 28, 8, col2); r(ctx, x + 4, y + 12, 24, 6, col2);
  r(ctx, x + 8, y + 18, 16, 5, col2); r(ctx, x + 12, y + 23, 8, 4, col2);
  r(ctx, x + 6, y + 6, 6, 3, "#fff"); // 하이라이트
  if (unlocked) {
    r(ctx, x - 2, y + 2, 3, 3, C.gold); r(ctx, x + 30, y + 6, 3, 3, C.gold);
    r(ctx, x + 14, y - 6, 3, 3, C.gold);
  } else {
    // 자물쇠
    r(ctx, x + 12, y + 10, 8, 7, "#fff"); r(ctx, x + 14, y + 6, 4, 5, colD);
    r(ctx, x + 15, y + 12, 2, 3, colD);
  }
}

export function drawCharacter(
  ctx: CanvasRenderingContext2D, px: number, py: number,
  dir: "down" | "up" | "left" | "right", frame: number
) {
  const x = px + 8, y = py + 4;
  ctx.fillStyle = "rgba(124,90,150,0.18)";
  ctx.beginPath(); ctx.ellipse(px + 16, py + 28, 9, 3.5, 0, 0, Math.PI * 2); ctx.fill();

  const legA = frame === 0 ? 0 : 2, legB = frame === 0 ? 2 : 0;
  r(ctx, x + 3, y + 20 - legA, 4, 4 + legA, C.pants);
  r(ctx, x + 9, y + 20 - legB, 4, 4 + legB, C.pants);
  r(ctx, x + 2, y + 12, 12, 9, C.shirt);
  r(ctx, x + 2, y + 18, 12, 3, C.shirtSh);

  if (dir === "down") {
    r(ctx, x, y + 13, 3, 6, C.skin); r(ctx, x + 13, y + 13, 3, 6, C.skin);
    r(ctx, x + 3, y + 2, 10, 9, C.skin);
    r(ctx, x + 2, y, 12, 5, C.hair); r(ctx, x + 2, y + 4, 2, 4, C.hair); r(ctx, x + 12, y + 4, 2, 4, C.hair);
    r(ctx, x + 5, y + 6, 2, 2, C.eye); r(ctx, x + 9, y + 6, 2, 2, C.eye);
    r(ctx, x + 4, y + 8, 2, 1, C.cheek); r(ctx, x + 10, y + 8, 2, 1, C.cheek);
  } else if (dir === "up") {
    r(ctx, x, y + 13, 3, 6, C.skin); r(ctx, x + 13, y + 13, 3, 6, C.skin);
    r(ctx, x + 3, y + 2, 10, 9, C.hair); r(ctx, x + 2, y, 12, 6, C.hair); r(ctx, x + 4, y + 9, 8, 2, C.hairLt);
  } else {
    const flip = dir === "left";
    ctx.save();
    if (flip) { ctx.translate(px * 2 + 32, 0); ctx.scale(-1, 1); }
    r(ctx, x + 6, y + 13, 4, 6, C.skin);
    r(ctx, x + 3, y + 2, 10, 9, C.skin);
    r(ctx, x + 2, y, 12, 5, C.hair); r(ctx, x + 2, y + 4, 3, 6, C.hair);
    r(ctx, x + 9, y + 6, 2, 2, C.eye); r(ctx, x + 8, y + 8, 2, 1, C.cheek);
    ctx.restore();
  }
}
