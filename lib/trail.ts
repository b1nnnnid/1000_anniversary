// 스테이지 노드를 순서대로(분기 포함) 이어 길(PATH)을 만들고,
// 길 주변을 비운 채 나무(TREES)를 흩뿌려 풍경/충돌을 구성한다.
import { STAGES, GOAL, WORLD_COLS, WORLD_ROWS } from "./gameData";

const key = (c: number, r: number) => `${c},${r}`;

export const PATH = new Set<string>();

function line(c1: number, r1: number, c2: number, r2: number) {
  // 세로 먼저, 가로 나중 (ㄱ자)
  const [rlo, rhi] = r1 < r2 ? [r1, r2] : [r2, r1];
  for (let r = rlo; r <= rhi; r++) PATH.add(key(c1, r));
  const [clo, chi] = c1 < c2 ? [c1, c2] : [c2, c1];
  for (let c = clo; c <= chi; c++) PATH.add(key(c, r2));
}

// order 별 그룹
const orders = Array.from(new Set(STAGES.map((s) => s.order))).sort((a, b) => a - b);
const groups = orders.map((o) => STAGES.filter((s) => s.order === o));

// 인접 그룹끼리 모두 연결 (분기 = 한 그룹에 노드 2개면 자연히 갈라졌다 합쳐짐)
for (let i = 0; i < groups.length - 1; i++) {
  for (const a of groups[i]) for (const b of groups[i + 1]) line(a.col, a.row, b.col, b.row);
}
// 마지막 그룹 → 도착지
for (const a of groups[groups.length - 1]) line(a.col, a.row, GOAL.col, GOAL.row);

// 노드 좌표 모음 (나무 제외용)
const NODES = [...STAGES.map((s) => ({ c: s.col, r: s.row })), { c: GOAL.col, r: GOAL.row }];

function nearPath(c: number, r: number) {
  for (let dc = -1; dc <= 1; dc++)
    for (let dr = -1; dr <= 1; dr++)
      if (PATH.has(key(c + dc, r + dr))) return true;
  return false;
}
function nearNode(c: number, r: number) {
  return NODES.some((n) => Math.abs(n.c - c) <= 2 && Math.abs(n.r - r) <= 2);
}

export const TREES = new Set<string>();
for (let r = 1; r < WORLD_ROWS - 1; r++) {
  for (let c = 1; c < WORLD_COLS - 1; c++) {
    if ((c * 7 + r * 5) % 6 !== 0) continue;      // 듬성듬성
    if (nearPath(c, r) || nearNode(c, r)) continue; // 길/노드 주변은 비움
    TREES.add(key(c, r));
  }
}

export const isPath = (c: number, r: number) => PATH.has(key(c, r));

export function isBlocked(c: number, r: number) {
  if (c < 0 || c >= WORLD_COLS || r < 0 || r >= WORLD_ROWS) return true;
  if (c === 0 || c === WORLD_COLS - 1 || r === 0 || r === WORLD_ROWS - 1) return true; // 테두리 숲
  return TREES.has(key(c, r));
}
