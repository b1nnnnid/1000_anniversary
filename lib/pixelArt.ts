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
  hair: "#E889AC", hairLt: "#D9719A", skin: "#FBE0CC",
  ribbon: "#E8556F",
  bHair: "#3F3B45", bHairLt: "#5A5564", bShirt: "#A8CFF0", bShirtSh: "#8FB8DC", bPants: "#5A6B8C",
  shirt: "#FFFFFF", shirtSh: "#F4B8CC", pants: "#E8556F",
  cheek: "#F4A8B8", eye: "#4A3A2E", gold: "#F2C76B", goldDk: "#E0A94A",
};

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export function drawGrass(ctx: CanvasRenderingContext2D, col: number, row: number, pink = false) {
  const x = col * TILE, y = row * TILE;
  if (pink) {
    r(ctx, x, y, TILE, TILE, (col + row) % 2 === 0 ? "#FBDCE8" : "#F8D2E2");
    r(ctx, x + 6, y + 22, 2, 4, "#F2B8CE");
    r(ctx, x + 21, y + 11, 2, 4, "#F2B8CE");
    return;
  }
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

export function drawTree(ctx: CanvasRenderingContext2D, col: number, row: number, pink = false) {
  const x = col * TILE, y = row * TILE;
  r(ctx, x + 13, y + 22, 6, 9, C.trunk);
  if (pink) {
    // 벚꽃나무
    r(ctx, x + 5, y + 11, 22, 13, "#F4BCD4");
    r(ctx, x + 8, y + 5, 16, 13, "#F8CEE0");
    r(ctx, x + 12, y + 1, 9, 8, "#FCE0EC");
    r(ctx, x + 9, y + 8, 3, 3, "#FFFFFF");
    r(ctx, x + 20, y + 14, 3, 3, "#FFFFFF");
    return;
  }
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
  order: number, collected: boolean, bob: number, locked = false
) {
  const x = col * TILE, y = row * TILE - (locked ? 0 : bob);
  if (locked) {
    // 채도 낮춘 잠김 노드 + 자물쇠
    ctx.fillStyle = "rgba(124,90,150,0.12)";
    ctx.beginPath(); ctx.ellipse(x + TILE / 2, row * TILE + TILE - 3, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    r(ctx, x + 14, y + 26, 4, 8, "#B8AEB4");
    r(ctx, x + 4, y + 2, 24, 26, "#E2DCE0");
    r(ctx, x + 4, y + 2, 24, 6, "#D2C8CE");
    r(ctx, x + 8, y + 11, 16, 12, "#CFC6CC");
    r(ctx, x + 12, y + 13, 8, 7, "#F4F1F3");
    r(ctx, x + 14, y + 10, 4, 4, "#B8AEB4");
    r(ctx, x + 15, y + 15, 2, 3, "#B8AEB4");
    r(ctx, x + 2, y + 20, 8, 8, "#B8AEB4");
    ctx.fillStyle = "#fff"; ctx.font = "9px Galmuri11, monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(order), x + 6, y + 25);
    ctx.textBaseline = "alphabetic";
    return;
  }
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
  r(ctx, x + 3, y + 20 - legA, 4, 4 + legA, C.bPants);
  r(ctx, x + 9, y + 20 - legB, 4, 4 + legB, C.bPants);
  r(ctx, x + 2, y + 12, 12, 9, C.bShirt);
  r(ctx, x + 2, y + 18, 12, 3, C.bShirtSh);

  if (dir === "down") {
    r(ctx, x, y + 13, 3, 6, C.skin); r(ctx, x + 13, y + 13, 3, 6, C.skin);
    r(ctx, x + 3, y + 2, 10, 9, C.skin);
    r(ctx, x + 2, y, 12, 5, C.bHair); r(ctx, x + 1, y + 2, 3, 3, C.bHair); r(ctx, x + 12, y + 2, 3, 3, C.bHair);
    r(ctx, x + 2, y + 4, 2, 3, C.bHair); r(ctx, x + 12, y + 4, 2, 3, C.bHair);
    r(ctx, x + 5, y + 6, 2, 2, C.eye); r(ctx, x + 9, y + 6, 2, 2, C.eye);
  } else if (dir === "up") {
    r(ctx, x, y + 13, 3, 6, C.skin); r(ctx, x + 13, y + 13, 3, 6, C.skin);
    r(ctx, x + 3, y + 2, 10, 9, C.bHair); r(ctx, x + 2, y, 12, 6, C.bHair);
    r(ctx, x + 4, y + 9, 8, 2, C.bHairLt);
  } else {
    const flip = dir === "left";
    ctx.save();
    if (flip) { ctx.translate(px * 2 + 32, 0); ctx.scale(-1, 1); }
    r(ctx, x + 6, y + 13, 4, 6, C.skin);
    r(ctx, x + 3, y + 2, 10, 9, C.skin);
    r(ctx, x + 2, y, 12, 5, C.bHair); r(ctx, x + 2, y + 4, 3, 5, C.bHair);
    r(ctx, x + 9, y + 6, 2, 2, C.eye);
    ctx.restore();
  }
}

// ===== 리액션 캐릭터 (퀴즈 정답/오답, 룰렛 두근두근) =====
// 120x120 캔버스 기준, frame = 0|1 로 두 프레임 애니메이션
export type Mood = "happy" | "sad" | "excited";

export function drawReaction(ctx: CanvasRenderingContext2D, mood: Mood, frame: number, who: "girl" | "boy" = "girl") {
  const U = 3;
  const g = (gx: number, gy: number, gw: number, gh: number, c: string) => {
    ctx.fillStyle = c; ctx.fillRect(gx * U, gy * U, gw * U, gh * U);
  };
  const oy = mood === "happy" && frame === 1 ? -1 : 0;
  const hair = who === "girl" ? C.hair : C.bHair;

  // 머리 (+여자는 리본)
  g(12, 7 + oy, 16, 5, hair);
  if (who === "girl") {
    g(11, 9 + oy, 3, 11, hair); g(26, 9 + oy, 3, 11, hair);
    g(23, 5 + oy, 4, 3, C.ribbon); g(20, 6 + oy, 3, 2, C.ribbon);
  } else {
    g(11, 9 + oy, 3, 6, hair); g(26, 9 + oy, 3, 6, hair);
    g(10, 6 + oy, 4, 4, hair); g(26, 5 + oy, 4, 4, hair);
  }
  g(14, 12 + oy, 12, 9, C.skin);

  if (mood === "happy") {
    g(16, 15 + oy, 1, 1, C.eye); g(17, 14 + oy, 1, 1, C.eye); g(18, 15 + oy, 1, 1, C.eye);
    g(21, 15 + oy, 1, 1, C.eye); g(22, 14 + oy, 1, 1, C.eye); g(23, 15 + oy, 1, 1, C.eye);
    g(18, 18 + oy, 4, 2, C.eye); g(19, 19 + oy, 2, 1, "#F08CA0");
    g(15, 17 + oy, 2, 1, C.cheek); g(23, 17 + oy, 2, 1, C.cheek);
  } else if (mood === "sad") {
    g(15, 13, 2, 1, C.eye); g(23, 13, 2, 1, C.eye);
    g(16, 15, 2, 2, C.eye); g(22, 15, 2, 2, C.eye);
    const ty = frame === 0 ? 17 : 18;
    g(15, ty, 1, 2, "#9FC7E8"); g(24, ty + 1, 1, 2, "#9FC7E8");
    g(18, 20, 4, 1, C.eye); g(17, 19, 1, 1, C.eye); g(22, 19, 1, 1, C.eye);
  } else {
    g(16, 14, 2, 2, C.eye); g(22, 14, 2, 2, C.eye);
    g(16, 14, 1, 1, "#fff"); g(22, 14, 1, 1, "#fff");
    g(19, 18, 2, 2, C.eye);
    g(15, 17, 2, 1, C.cheek); g(23, 17, 2, 1, C.cheek);
  }

  // 몸통
  if (who === "girl") {
    g(14, 21 + oy, 12, 8, C.shirt);
    g(14, 27 + oy, 12, 2, C.shirtSh);
    g(16, 29 + oy, 3, 4, C.skin); g(21, 29 + oy, 3, 4, C.skin);
    g(16, 33 + oy, 3, 2, C.ribbon); g(21, 33 + oy, 3, 2, C.ribbon);
  } else {
    g(14, 21 + oy, 12, 8, C.bShirt);
    g(14, 27 + oy, 12, 2, C.bShirtSh);
    g(16, 29 + oy, 3, 4, C.bPants); g(21, 29 + oy, 3, 4, C.bPants);
    g(16, 33 + oy, 3, 2, "#FFFFFF"); g(21, 33 + oy, 3, 2, "#FFFFFF");
  }

  // 팔
  if (mood === "happy") {
    const ay = frame === 0 ? 17 : 15;
    g(11, ay, 3, 5, C.skin); g(26, ay, 3, 5, C.skin);
  } else if (mood === "sad") {
    g(12, 22, 2, 6, C.skin); g(26, 22, 2, 6, C.skin);
  } else {
    g(17, 23, 6, 3, C.skin);
  }

  // 이펙트
  const heart = (hx: number, hy: number, c: string) => {
    g(hx, hy, 2, 2, c); g(hx + 3, hy, 2, 2, c); g(hx, hy + 2, 5, 2, c); g(hx + 1, hy + 4, 3, 1, c); g(hx + 2, hy + 5, 1, 1, c);
  };
  if (mood === "happy") {
    if (frame === 0) { heart(4, 10, C.rose); heart(31, 14, "#F2A3C0"); }
    else { heart(3, 8, "#F2A3C0"); heart(32, 11, C.rose); }
  } else if (mood === "sad") {
    const dy = frame === 0 ? 0 : 2;
    g(7, 10 + dy, 1, 3, "#9FC7E8"); g(32, 8 + dy, 1, 3, "#9FC7E8");
  } else {
    const sx = frame === 0 ? 0 : 1;
    g(6 + sx, 12, 1, 3, C.gold); g(5 + sx, 13, 3, 1, C.gold);
    g(32 - sx, 9, 1, 3, C.gold); g(31 - sx, 10, 3, 1, C.gold);
  }
}

// 여자친구: 핑크 단발 + 리본 + 흰 원피스, 도착지에서 손 흔들며 기다림 (2프레임)
export function drawGirlfriend(ctx: CanvasRenderingContext2D, px: number, py: number, frame: number) {
  const x = px + 8, y = py + 4;
  ctx.fillStyle = "rgba(124,90,150,0.18)";
  ctx.beginPath(); ctx.ellipse(px + 16, py + 28, 9, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  // 다리 + 빨간 신발
  r(ctx, x + 3, y + 21, 4, 4, C.skin); r(ctx, x + 9, y + 21, 4, 4, C.skin);
  r(ctx, x + 3, y + 24, 4, 2, C.ribbon); r(ctx, x + 9, y + 24, 4, 2, C.ribbon);
  // 원피스 (살짝 퍼지게)
  r(ctx, x + 2, y + 12, 12, 8, C.shirt);
  r(ctx, x + 1, y + 18, 14, 3, C.shirt);
  r(ctx, x + 1, y + 19, 14, 2, C.shirtSh);
  // 왼팔 내리고
  r(ctx, x, y + 13, 3, 6, C.skin);
  // 오른팔 흔들기
  const wy = frame === 0 ? y + 6 : y + 9;
  r(ctx, x + 13, wy, 3, 7, C.skin);
  // 머리 (단발)
  r(ctx, x + 3, y + 2, 10, 9, C.skin);
  r(ctx, x + 2, y, 12, 5, C.hair);
  r(ctx, x + 1, y + 3, 3, 7, C.hair); r(ctx, x + 12, y + 3, 3, 7, C.hair);
  r(ctx, x + 11, y - 2, 4, 3, C.ribbon); r(ctx, x + 10, y, 2, 2, C.ribbon);
  // 눈 + 볼
  r(ctx, x + 5, y + 6, 2, 2, C.eye); r(ctx, x + 9, y + 6, 2, 2, C.eye);
  r(ctx, x + 4, y + 8, 2, 1, C.cheek); r(ctx, x + 10, y + 8, 2, 1, C.cheek);
}

// 숨은 하트 조각 (둥둥 떠서 반짝임)
export function drawHeartPiece(ctx: CanvasRenderingContext2D, col: number, row: number, bob: number) {
  const x = col * TILE + 10, y = row * TILE + 8 - bob;
  ctx.fillStyle = "rgba(124,90,150,0.14)";
  ctx.beginPath(); ctx.ellipse(col * TILE + 16, row * TILE + 26, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
  r(ctx, x + 1, y, 3, 3, C.rose); r(ctx, x + 6, y, 3, 3, C.rose);
  r(ctx, x, y + 2, 10, 4, C.rose); r(ctx, x + 1, y + 6, 8, 2, C.rose);
  r(ctx, x + 3, y + 8, 4, 2, C.rose); r(ctx, x + 2, y + 2, 2, 2, "#FBD2E0");
  r(ctx, x + 12, y - 3, 2, 2, C.gold); r(ctx, x - 3, y + 5, 2, 2, C.gold);
}

// 길가의 고양이 (꼬리 살랑살랑 2프레임)
export function drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  ctx.fillStyle = "rgba(124,90,150,0.16)";
  ctx.beginPath(); ctx.ellipse(x + 16, y + 28, 9, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  // 꼬리
  if (frame === 0) { r(ctx, x + 24, y + 14, 3, 10, "#E8D5B8"); r(ctx, x + 25, y + 12, 3, 4, "#E8D5B8"); }
  else { r(ctx, x + 24, y + 16, 3, 8, "#E8D5B8"); r(ctx, x + 26, y + 14, 3, 4, "#E8D5B8"); }
  // 몸 (앉은 자세)
  r(ctx, x + 8, y + 16, 16, 10, "#F2E3C8");
  r(ctx, x + 8, y + 24, 16, 3, "#E8D5B8");
  // 머리
  r(ctx, x + 9, y + 6, 14, 11, "#F2E3C8");
  // 귀
  r(ctx, x + 9, y + 2, 4, 5, "#F2E3C8"); r(ctx, x + 19, y + 2, 4, 5, "#F2E3C8");
  r(ctx, x + 10, y + 4, 2, 2, "#F4A8B8"); r(ctx, x + 20, y + 4, 2, 2, "#F4A8B8");
  // 무늬
  r(ctx, x + 13, y + 6, 2, 3, "#D9BC92"); r(ctx, x + 17, y + 6, 2, 3, "#D9BC92");
  // 눈 + 코 + 수염
  r(ctx, x + 12, y + 10, 2, 2, "#4A3A2E"); r(ctx, x + 18, y + 10, 2, 2, "#4A3A2E");
  r(ctx, x + 15, y + 13, 2, 1, "#E8889C");
  r(ctx, x + 6, y + 11, 3, 1, "#D9BC92"); r(ctx, x + 23, y + 11, 3, 1, "#D9BC92");
  // 앞발
  r(ctx, x + 10, y + 23, 3, 4, "#F2E3C8"); r(ctx, x + 19, y + 23, 3, 4, "#F2E3C8");
}

// 머리 위 느낌표 이모트 (고양이가 플레이어를 발견했을 때)
export function drawEmote(ctx: CanvasRenderingContext2D, px: number, py: number) {
  r(ctx, px + 10, py - 16, 12, 14, "#FFFFFF");
  r(ctx, px + 12, py - 4, 4, 3, "#FFFFFF");
  r(ctx, px + 14, py - 13, 4, 7, "#E8556F");
  r(ctx, px + 14, py - 4, 4, 0, "#E8556F");
  r(ctx, px + 14, py - 5, 4, 2, "#E8556F");
}

// 걷는 여자친구 (상봉 후 동행용) — 핑크 단발+리본+원피스, 4방향 2프레임
export function drawGirlfriendWalk(
  ctx: CanvasRenderingContext2D, px: number, py: number,
  dir: "down" | "up" | "left" | "right", frame: number
) {
  const x = px + 8, y = py + 4;
  ctx.fillStyle = "rgba(124,90,150,0.18)";
  ctx.beginPath(); ctx.ellipse(px + 16, py + 28, 9, 3.5, 0, 0, Math.PI * 2); ctx.fill();

  const legA = frame === 0 ? 0 : 2, legB = frame === 0 ? 2 : 0;
  r(ctx, x + 3, y + 21 - legA, 4, 3 + legA, C.skin);
  r(ctx, x + 9, y + 21 - legB, 4, 3 + legB, C.skin);
  r(ctx, x + 3, y + 24, 4, 2, C.ribbon); r(ctx, x + 9, y + 24, 4, 2, C.ribbon);
  // 원피스
  r(ctx, x + 2, y + 12, 12, 8, C.shirt);
  r(ctx, x + 1, y + 18, 14, 3, C.shirt);
  r(ctx, x + 1, y + 19, 14, 2, C.shirtSh);

  if (dir === "down") {
    r(ctx, x, y + 13, 3, 6, C.skin); r(ctx, x + 13, y + 13, 3, 6, C.skin);
    r(ctx, x + 3, y + 2, 10, 9, C.skin);
    r(ctx, x + 2, y, 12, 5, C.hair); r(ctx, x + 1, y + 3, 3, 7, C.hair); r(ctx, x + 12, y + 3, 3, 7, C.hair);
    r(ctx, x + 11, y - 2, 4, 3, C.ribbon); r(ctx, x + 10, y, 2, 2, C.ribbon);
    r(ctx, x + 5, y + 6, 2, 2, C.eye); r(ctx, x + 9, y + 6, 2, 2, C.eye);
    r(ctx, x + 4, y + 8, 2, 1, C.cheek); r(ctx, x + 10, y + 8, 2, 1, C.cheek);
  } else if (dir === "up") {
    r(ctx, x, y + 13, 3, 6, C.skin); r(ctx, x + 13, y + 13, 3, 6, C.skin);
    r(ctx, x + 3, y + 2, 10, 9, C.hair); r(ctx, x + 2, y, 12, 6, C.hair);
    r(ctx, x + 4, y + 9, 8, 2, C.hairLt);
    r(ctx, x + 1, y - 2, 4, 3, C.ribbon);
  } else {
    const flip = dir === "left";
    ctx.save();
    if (flip) { ctx.translate(px * 2 + 32, 0); ctx.scale(-1, 1); }
    r(ctx, x + 6, y + 13, 4, 6, C.skin);
    r(ctx, x + 3, y + 2, 10, 9, C.skin);
    r(ctx, x + 2, y, 12, 5, C.hair); r(ctx, x + 1, y + 3, 3, 8, C.hair);
    r(ctx, x + 2, y - 2, 4, 3, C.ribbon);
    r(ctx, x + 9, y + 6, 2, 2, C.eye); r(ctx, x + 8, y + 8, 2, 1, C.cheek);
    ctx.restore();
  }
}

// 상봉 후 스테이지가 변신하는 데이트 장소 건물들
export function drawPlace(ctx: CanvasRenderingContext2D, col: number, row: number, kind: string, bob: number) {
  const x = col * TILE, y = row * TILE;
  ctx.fillStyle = "rgba(124,90,150,0.16)";
  ctx.beginPath(); ctx.ellipse(x + 16, y + TILE - 3, 14, 4, 0, 0, Math.PI * 2); ctx.fill();

  if (kind === "cafe") {
    r(ctx, x + 2, y + 8, 28, 22, "#F2E3C8");
    r(ctx, x, y + 4, 32, 7, "#E8889C");
    r(ctx, x + 4, y + 4, 5, 7, "#FFFFFF"); r(ctx, x + 14, y + 4, 5, 7, "#FFFFFF"); r(ctx, x + 24, y + 4, 5, 7, "#FFFFFF");
    r(ctx, x + 6, y + 16, 8, 8, "#BFE0F5");
    r(ctx, x + 19, y + 16, 8, 14, "#9C7A5A");
    r(ctx, x + 24, y + 22, 2, 2, "#F2C76B");
    r(ctx, x + 12, y - 4 - bob, 8, 7, "#FFFFFF"); r(ctx, x + 14, y - 7 - bob, 4, 3, "#FFFFFF");
    r(ctx, x + 14, y - 2 - bob, 4, 3, "#9C7A5A");
  } else if (kind === "restaurant") {
    r(ctx, x + 2, y + 8, 28, 22, "#FBE9D8");
    r(ctx, x, y + 4, 32, 7, "#E8556F");
    r(ctx, x + 5, y + 4, 6, 7, "#FFFFFF"); r(ctx, x + 16, y + 4, 6, 7, "#FFFFFF"); r(ctx, x + 26, y + 4, 4, 7, "#FFFFFF");
    r(ctx, x + 6, y + 15, 9, 9, "#FBD86B");
    r(ctx, x + 19, y + 15, 8, 15, "#A8552F");
    r(ctx, x + 12, y - 5 - bob, 8, 8, "#FFFFFF");
    r(ctx, x + 14, y - 3 - bob, 4, 4, "#E8556F");
  } else if (kind === "cinema") {
    r(ctx, x + 2, y + 6, 28, 24, "#6B6478");
    r(ctx, x + 5, y + 10, 22, 10, "#FFF8E8");
    r(ctx, x + 13, y + 12, 6, 6, "#E8556F");
    r(ctx, x + 13, y + 22, 6, 8, "#4A4454");
    r(ctx, x, y + 2, 32, 5, "#F2C76B");
    r(ctx, x + 4, y - 3 - bob, 4, 4, "#FBD86B"); r(ctx, x + 14, y - 5 - bob, 4, 4, "#FBD86B"); r(ctx, x + 24, y - 3 - bob, 4, 4, "#FBD86B");
  } else if (kind === "park") {
    r(ctx, x + 18, y + 12, 12, 4, "#C7A07A");
    r(ctx, x + 18, y + 16, 2, 8, "#A88260"); r(ctx, x + 28, y + 16, 2, 8, "#A88260");
    r(ctx, x + 18, y + 8, 12, 2, "#C7A07A");
    r(ctx, x + 4, y + 14, 5, 12, "#C7A07A");
    r(ctx, x - 1, y + 2, 15, 13, "#F4BCD4"); r(ctx, x + 2, y - 2, 9, 8, "#F8CEE0");
    r(ctx, x + 20, y + 26, 4, 4, "#F2A3C0"); r(ctx, x + 26, y + 27, 3, 3, "#F6E05E");
    r(ctx, x + 8, y - 6 - bob, 5, 5, "#F2A3C0");
  } else if (kind === "beach") {
    r(ctx, x, y + 18, 32, 12, "#FBE6C8");
    r(ctx, x, y + 10, 32, 8, "#9FC7E8");
    r(ctx, x + 2, y + 12, 6, 2, "#FFFFFF"); r(ctx, x + 20, y + 14, 8, 2, "#FFFFFF");
    r(ctx, x + 14, y + 2, 4, 22, "#C7A07A");
    r(ctx, x + 4, y - 2 - bob, 24, 5, "#E8556F");
    r(ctx, x + 8, y - 5 - bob, 16, 4, "#FFFFFF");
    r(ctx, x + 6, y + 2 - bob, 6, 2, "#FFFFFF"); r(ctx, x + 20, y + 2 - bob, 6, 2, "#E8556F");
  } else if (kind === "amusement") {
    // 미니 관람차
    r(ctx, x + 14, y + 14, 4, 16, "#B8AEB4");
    r(ctx, x + 8, y + 22, 16, 3, "#B8AEB4");
    const cx = x + 16, cy = y + 10;
    r(ctx, cx - 2, cy - 2, 4, 4, "#E8889C");
    const cabs = [[0, -10], [9, -4], [6, 8], [-6, 8], [-9, -4]];
    cabs.forEach(([dx2, dy2], i) => {
      const colors = ["#F2C76B", "#9FC7E8", "#F2A3C0", "#A8E0C8", "#C9A7F0"];
      r(ctx, cx + dx2 - 3 + (bob > 1 ? 1 : 0), cy + dy2 - 3, 6, 6, colors[i]);
    });
  }
}
