"use client";
import React from "react";

// 작은 픽셀 아이콘 모음. <PixelIcon name="heart" size={16} />
type Icon = { pal: Record<string, string>; rows: string[] };

const R = "#E8799F", D = "#B85C82", L = "#F8C9DC", W = "#FFFFFF", o = "#F2C76B", g = "#E0A94A",
  k = "#5A4A55", b = "#9FC7E8", v = "#C9A7F0", m = "#9FD9B8", p = "#7E6CC4", n = "#C7A07A", t = "#3F3B45";

const ICONS: Record<string, Icon> = {
  heart: { pal: { R, L }, rows: [
    "            ", " RR    RR   ", "RLLR  RRRR  ", "RLLLRRRRRRR ", "RRRRRRRRRRR ",
    " RRRRRRRRRR ", "  RRRRRRRR  ", "   RRRRRR   ", "    RRRR    ", "     RR     ", "            ", "            "] },
  ticket: { pal: { o, g, W }, rows: [
    "            ", "            ", " oooooooooo ", " oggggggggo ", " ogWggggWgo ", "ooggWggWggoo",
    " ogWggggWgo ", " oggggggggo ", " oooooooooo ", "            ", "            ", "            "] },
  fragment: { pal: { m: "#7 FCFAE".replace(" ",""), t: "#1D9E75", L: "#BFEAD8" }, rows: [
    "     mm     ", "    mLLm    ", "   mLLLLm   ", "  mLLLLLLm  ", " mLLLLLLLLm ", "mLLLLLLLLLLm",
    " tttttttttt ", "  tttttttt  ", "   tttttt   ", "    tttt    ", "     tt     ", "            "] },
  camera: { pal: { k, W, b }, rows: [
    "            ", "   kkk      ", " kkkkkkkkkk ", " kWWWWWWWWk ", " kWkkkkkkWk ", " kWkbbbbkWk ",
    " kWkbWWbkWk ", " kWkbbbbkWk ", " kWkkkkkkWk ", " kWWWWWWWWk ", " kkkkkkkkkk ", "            "] },
  home: { pal: { R, D, W, o }, rows: [
    "     RR     ", "    RRRR    ", "   RRRRRR   ", "  RRRRRRRR  ", " RRRRRRRRRR ", "RRRRRRRRRRRR",
    " DWWDDDDWWD ", " DWWDDDDWWD ", " DDDoooDDDD ", " DDDoooDDDD ", " DDDoooDDDD ", "            "] },
  gift: { pal: { R, D, o, W }, rows: [
    "    R  R    ", "   RR  RR   ", "    RooR    ", "  oooooooo  ", "  oRoooRoo  ", " oooooooooo ",
    " oDooooooDo ", " oDoRRRRoDo ", " oDoRRRRoDo ", " oDoRRRRoDo ", " oooRRRRooo ", "            "] },
  bubble: { pal: { v, p, W }, rows: [
    " vvvvvvvvvv ", "vppppppppppv", "vpWWpppWWpp v".replace(" v","pv"), "vppppppppppv", "vpppWWWppppv", "vpppWppppppv",
    "vpppWppppppv", "vppppppppppv", " vvvvvpvvvv ", "      pp    ", "     pp     ", "            "] },
  lock: { pal: { g, o, k }, rows: [
    "            ", "    gggg    ", "   g    g   ", "   g    g   ", "  oooooooo  ", "  oooooooo  ",
    "  ooo  ooo  ", "  oo kk oo  ", "  oo kk oo  ", "  oooooooo  ", "            ", "            "] },
  clock: { pal: { D, W, R }, rows: [
    "    DDDD    ", "  DDWWWWDD  ", " DWWWWWWWWD ", " DWWWRWWWWD ", "DWWWWRWWWWWD", "DWWWWRRRWWWD",
    "DWWWWWWWWWWD", " DWWWWWWWWD ", " DWWWWWWWWD ", "  DDWWWWDD  ", "    DDDD    ", "            "] },
  chat: { pal: { R, v, W }, rows: [
    " RRRRRRR    ", "RWWWWWWWR   ", "RWWWWWWWR   ", "RWWWWWWWR   ", " RRRRRRR    ", "   vvvvvvv  ",
    "  vWWWWWWWv ", "  vWWWWWWWv ", "   vvvvvvv  ", "      vv    ", "       v    ", "            "] },
  crystal: { pal: { v, p, W, o }, rows: [
    "            ", "    pppp    ", "  ppvvvvpp  ", " pvvvvvvvvp ", " pvvWWvvvvp ", " pvWvvvvvvp ",
    " pvvvvvvvvp ", "  ppvvvvpp  ", "    pppp    ", "   oooooo   ", "  oooooooo  ", "            "] },
  moon: { pal: { o, g, W }, rows: [
    "    oooo    ", "  oooooo    ", " ooooo      ", " oooo       ", "ooog        ", "ooo         ",
    "ooog        ", " oooo       ", " ooooo      ", "  oooooo    ", "    oooo    ", "            "] },
  star: { pal: { o, g, W }, rows: [
    "     oo     ", "     oo     ", "    oWWo    ", "ooooWWWWoooo", " oooWWWWooo ", "  ooWWWWoo  ",
    "  oWWWWWWo  ", " oWWoooWWo  ", " oWo   oWo  ", "oo       oo ", "            ", "            "] },
  sparkle: { pal: { o, W }, rows: [
    "     o      ", "     o      ", "    oWo     ", "  o oWo o   ", "  oWoWoWo   ", "ooooWWWoooo ",
    "  oWoWoWo   ", "  o oWo o   ", "    oWo     ", "     o      ", "     o      ", "            "] },
  cat: { pal: { n, t, R }, rows: [
    " n      n   ", " nn    nn   ", " nnnnnnnn   ", "nnnnnnnnnn  ", "nntnnnntnn  ", "nnnnnnnnnn  ",
    "nnntnntnnn  ", "nnnnRnnnnn  ", " nnnnnnnn   ", "  nnnnnn    ", "            ", "            "] },
  flower: { pal: { R, o, m }, rows: [
    "            ", "    RRR     ", "   RRRRR    ", " RRRoooRRR  ", "RRRRoooRRRR ", " RRRoooRRR  ",
    "   RRRRR    ", "    RRR     ", "     m      ", "    mmm     ", "     m      ", "            "] },
};

export default function PixelIcon({ name, size = 16, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  const ic = ICONS[name];
  if (!ic) return null;
  const rows = ic.rows, h = rows.length, w = rows[0].length;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "-0.18em", imageRendering: "pixelated", ...style }}>
      {rows.flatMap((row, y) =>
        row.split("").map((ch, x) => (ch === " " || ch === "." || !ic.pal[ch]) ? null :
          <rect key={`${x}-${y}`} x={x} y={y} width={1.05} height={1.05} fill={ic.pal[ch]} />)
      )}
    </svg>
  );
}
