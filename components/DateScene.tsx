"use client";

import { useEffect, useRef } from "react";

// 데이트 장소별 픽셀 애니메이션 (캐릭터가 직접 논다). 탭하면 하트가 퐁퐁.
type Kind = "park" | "cinema" | "cafe" | "restaurant" | "beach" | "amusement"
  | "izakaya" | "christmas" | "hotel" | "travel" | "hangang";

const SKIN = "#FBE0CC", HAIRG = "#E889AC", HAIRB = "#3F3B45";
const DRESS = "#FFFFFF", DRESS_SH = "#ECE4F2", SUIT = "#3A3F4C", TIARA = "#F2C76B";

export default function DateScene({ kind }: { kind: Kind }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hearts = useRef<{ x: number; y: number; life: number }[]>([]);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    const W = 300, H = 168;
    let raf = 0, t = 0;
    const px = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

    // 미니 신랑(정장)/신부(드레스). bobUp: 위아래 흔들림
    const groom = (x: number, y: number, bob = 0) => {
      px(x + 3, y - 6 + bob, 10, 7, SKIN);
      px(x + 2, y - 8 + bob, 12, 4, HAIRB);
      px(x + 5, y - 3 + bob, 2, 2, "#2A2A2A"); px(x + 9, y - 3 + bob, 2, 2, "#2A2A2A");
      px(x + 2, y + 1 + bob, 12, 12, SUIT);
      px(x + 6, y + 1 + bob, 4, 8, "#F4F4F8"); px(x + 7, y + 2 + bob, 2, 2, "#C24A5E");
      px(x + 3, y + 13 + bob, 4, 5, "#2C303B"); px(x + 9, y + 13 + bob, 4, 5, "#2C303B");
    };
    const bride = (x: number, y: number, bob = 0) => {
      px(x + 3, y - 6 + bob, 10, 7, SKIN);
      px(x + 2, y - 8 + bob, 12, 4, HAIRG); px(x + 1, y - 4 + bob, 3, 7, HAIRG); px(x + 12, y - 4 + bob, 3, 7, HAIRG);
      px(x + 4, y - 10 + bob, 8, 2, TIARA); px(x + 1, y - 9 + bob, 14, 2, DRESS_SH);
      px(x + 5, y - 3 + bob, 2, 2, "#4A3A2E"); px(x + 9, y - 3 + bob, 2, 2, "#4A3A2E");
      px(x + 4, y - 1 + bob, 2, 1, "#F4A8B8"); px(x + 10, y - 1 + bob, 2, 1, "#F4A8B8");
      px(x + 2, y + 1 + bob, 12, 10, DRESS);
      px(x, y + 11 + bob, 16, 7, DRESS); px(x + 1, y + 12 + bob, 14, 2, DRESS_SH);
    };
    const heart = (x: number, y: number, s: number, c: string) => {
      px(x, y, s, s, c); px(x + s * 2, y, s, s, c);
      px(x - s, y + s, s * 4, s, c); px(x, y + s * 2, s * 2, s, c); px(x + s / 2, y + s * 3, s, s, c);
    };

    const loop = () => {
      t++;
      ctx.clearRect(0, 0, W, H);

      if (kind === "amusement") {
        px(0, 0, W, H, "#FBE8F2");
        const cx = W / 2, cy = 78, R = 56;
        px(cx - 3, cy, 6, H - cy, "#B0A6AE"); // 기둥
        ctx.strokeStyle = "#C9B6D4"; ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          const a = t * 0.02 + (i * Math.PI) / 3;
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
        const cols = ["#F2C76B", "#9FC7E8", "#F2A3C0", "#A8E0C8", "#C9A7F0", "#F8B8C8"];
        for (let i = 0; i < 6; i++) {
          const a = t * 0.02 + (i * Math.PI) / 3;
          const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
          px(Math.round(x - 8), Math.round(y - 6), 16, 12, cols[i]);
          if (i === 0) { // 커플 탄 칸
            px(Math.round(x - 7), Math.round(y - 5), 6, 8, "#FFE"); px(Math.round(x + 1), Math.round(y - 5), 6, 8, "#FFE");
            px(Math.round(x - 5), Math.round(y - 3), 2, 2, HAIRB); px(Math.round(x + 3), Math.round(y - 3), 2, 2, HAIRG);
          }
        }
        if (t % 50 < 25) heart(cx + 40, 24, 2, "#E8799F");
      } else if (kind === "park") {
        px(0, 0, W, H, "#E2F2E6"); px(0, H - 26, W, 26, "#CDEBD8");
        // 벚꽃나무 + 그네 틀
        px(40, 30, 8, 100, "#C7A07A"); px(20, 14, 48, 26, "#F8CEE0"); px(28, 6, 32, 16, "#FCE0EC");
        const fx = [60, 130, 200, 250], swA = Math.sin(t * 0.06) * 18;
        px(70, 34, 150, 4, "#9C7A5A");
        // 그네 줄 + 발판 (커플이 같이 탐)
        const sx = 145 + swA;
        ctx.strokeStyle = "#9C7A5A"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(120, 38); ctx.lineTo(sx - 14, 96); ctx.moveTo(170, 38); ctx.lineTo(sx + 14, 96); ctx.stroke();
        px(sx - 20, 96, 40, 5, "#B98C63");
        groom(sx - 22, 80, 0); bride(sx + 4, 80, 0);
        fx.forEach((x, i) => { if ((t + i * 13) % 90 < 45) heart(x, 60 + (i % 2) * 20, 2, i % 2 ? "#F2A3C0" : "#E8799F"); });
      } else if (kind === "cafe") {
        px(0, 0, W, H, "#F7EBDD"); px(0, H - 30, W, 30, "#E8D8C4");
        // 테이블
        px(108, 96, 84, 8, "#C89A6B"); px(120, 104, 8, 40, "#A8825E"); px(172, 104, 8, 40, "#A8825E");
        bride(96, 88); groom(176, 88);
        // 커피잔 + 김
        px(126, 88, 10, 8, "#FFF"); px(160, 88, 10, 8, "#FFF");
        const s = Math.sin(t * 0.1) * 2;
        px(130 + s, 78 - (t % 20), 2, 4, "#E0D5C8"); px(164 - s, 80 - (t % 22), 2, 4, "#E0D5C8");
        if (t % 60 < 30) heart(150, 60, 2, "#E8799F");
      } else if (kind === "cinema") {
        px(0, 0, W, H, "#221F29");
        const frames = ["#FBD8A8", "#A8CFF0", "#F2A3C0", "#FCE0EC"];
        px(40, 16, 220, 80, "#000"); px(44, 20, 212, 72, frames[Math.floor(t / 24) % frames.length]);
        // 스크린 속 작은 커플 실루엣
        px(130, 50, 8, 18, "#5A4A55"); px(160, 50, 8, 18, "#5A4A55");
        // 관객석 커플 뒤통수
        px(120, 120, 22, 24, "#2C2A33"); px(160, 120, 22, 24, "#2C2A33");
        px(125, 116, 12, 6, HAIRB); px(165, 116, 12, 6, HAIRG);
        // 팝콘
        px(146, 130, 10, 12, "#E8556F"); px(146, 128, 10, 3, "#FBE6A8");
        if (t % 70 < 30) heart(150, 104, 2, "#F2A3C0");
      } else if (kind === "restaurant") {
        px(0, 0, W, H, "#FBE9E0"); px(0, H - 30, W, 30, "#EAD6C8");
        px(104, 100, 92, 8, "#C0894F"); px(118, 108, 8, 36, "#9C6B3A"); px(176, 108, 8, 36, "#9C6B3A");
        bride(92, 92); groom(180, 92);
        // 건배 (주기적으로 잔이 가운데로)
        const c = Math.sin(t * 0.12);
        const lift = c > 0.6 ? -4 : 0;
        px(132 + (c > 0.6 ? 6 : 0), 84 + lift, 5, 9, "#D8B8E0");
        px(163 - (c > 0.6 ? 6 : 0), 84 + lift, 5, 9, "#D8B8E0");
        px(140, 98, 20, 6, "#F2C76B"); // 음식 접시
        if (c > 0.62 && c < 0.7) { heart(148, 70, 2, "#E8799F"); }
      } else if (kind === "beach") {
        px(0, 0, W, H, "#E2F1FB"); px(0, 70, W, 30, "#9FC7E8"); px(0, 98, W, H - 98, "#FBE6C8");
        // 파도
        for (let i = 0; i < 5; i++) { const wx = (i * 64 + t * 0.6) % (W + 40) - 20; px(wx, 92 + Math.sin((t + i * 20) * 0.1) * 2, 18, 3, "#FFF"); }
        // 파라솔
        px(150, 60, 4, 50, "#C7A07A"); px(126, 52, 52, 8, "#E8556F"); px(126, 52, 52, 3, "#FFF");
        bride(118, 96); groom(160, 96);
        px(112, 112, 6, 6, "#F2A3C0"); // 모래 위 조개
        if ((t % 80) < 30) heart(150, 40, 2, "#E8799F");
      } else if (kind === "izakaya") {
        // 소개팅 술집 — 따뜻한 목조 + 붉은 등 + 소주 건배
        px(0, 0, W, H, "#3A2A2A"); px(0, H - 30, W, 30, "#5A3E36");
        const lampX = 42 + Math.sin(t * 0.05) * 3;
        px(lampX + 6, 0, 2, 14, "#7A2A2A");
        px(lampX, 14, 16, 18, "#D8443C"); px(lampX, 18, 16, 2, "#A82E2E"); px(lampX, 26, 16, 2, "#A82E2E");
        px(lampX + 2, 31, 12, 3, "#F2C76B");
        px(104, 100, 92, 8, "#7A4A2E"); px(118, 108, 8, 36, "#5E371F"); px(176, 108, 8, 36, "#5E371F");
        bride(92, 92); groom(180, 92);
        px(146, 84, 6, 16, "#3C7A3C"); px(147, 80, 4, 4, "#2C5A2C"); // 소주병
        const c = Math.sin(t * 0.12);
        const lift = c > 0.6 ? -4 : 0;
        px(130 + (c > 0.6 ? 5 : 0), 92 + lift, 5, 7, "#DDEFE0");
        px(165 - (c > 0.6 ? 5 : 0), 92 + lift, 5, 7, "#DDEFE0");
        if (c > 0.62 && c < 0.72) heart(148, 68, 2, "#E8799F");
      } else if (kind === "christmas") {
        // 첫 크리스마스 — 밤하늘 + 눈 + 트리 + 목도리 커플
        px(0, 0, W, H, "#1E2A48"); px(0, H - 26, W, 26, "#E8EEF5");
        for (let i = 0; i < 14; i++) {
          const sx = (i * 47 + t * 0.4 + i * 9) % W;
          const sy = (t * (0.6 + (i % 3) * 0.2) + i * 37) % (H - 26);
          px(Math.round(sx), Math.round(sy), 2, 2, "#FFFFFF");
        }
        const tx = 150;
        px(tx - 2, 120, 4, 14, "#7A4A2A");
        px(tx - 22, 104, 44, 18, "#2E7D4F"); px(tx - 16, 86, 32, 20, "#34924F"); px(tx - 10, 70, 20, 18, "#3CA85A");
        if (t % 40 < 24) { px(tx - 2, 62, 4, 4, "#FBD86B"); px(tx - 4, 64, 8, 2, "#FBD86B"); px(tx - 1, 60, 2, 8, "#FBD86B"); }
        const oc = ["#E8556F", "#F2C76B", "#9FC7E8", "#F2A3C0"];
        ([[tx - 12, 96], [tx + 8, 100], [tx - 4, 86], [tx + 10, 82], [tx - 14, 110]] as const).forEach(([ox, oy], i) => { if ((t + i * 12) % 36 < 24) px(ox, oy, 3, 3, oc[i % oc.length]); });
        bride(92, 96); groom(180, 96);
        px(94, 95, 12, 3, "#E8556F"); px(182, 95, 12, 3, "#9FC7E8"); // 목도리
        if (t % 60 < 30) heart(118, 58, 2, "#E8799F");
      } else if (kind === "hotel") {
        // 함께 잠든 밤 — 창밖 도시 야경 + 달 + 소파 커플
        px(0, 0, W, H, "#15182E");
        px(20, 30, W - 40, 78, "#0E1022");
        ([[30, 70], [58, 46], [92, 84], [120, 40], [150, 64], [186, 50], [214, 78], [240, 44]] as const).forEach(([bx, by], i) => {
          px(bx, by, 22, 100 - by, "#23284A");
          for (let wy = by + 4; wy < 100; wy += 8) for (let wx = bx + 3; wx < bx + 19; wx += 7) if ((wx + wy + i) % 3 !== 0) px(wx, wy, 3, 3, "#F2D88A");
        });
        px(238, 18, 12, 12, "#FBEFC4"); px(235, 20, 4, 8, "#15182E");
        for (let i = 0; i < 8; i++) { const stx = (i * 39 + 14) % (W - 40) + 20, sty = (i * 13) % 24 + 8; if ((t + i * 7) % 50 < 28) px(stx, sty, 2, 2, "#FFFFFF"); }
        px(18, 28, W - 36, 3, "#3A3E60"); px(18, 106, W - 36, 4, "#3A3E60"); px(W / 2 - 1, 30, 2, 78, "#3A3E60");
        px(0, H - 30, W, 30, "#2A2440");
        px(96, 124, 108, 18, "#5A3E5E"); // 소파
        bride(112, 116); groom(160, 116);
        if (t % 64 < 32) heart(150, 96, 2, "#F2A3C0");
      } else if (kind === "travel") {
        // 오사카 여행 — 하늘 + 비행기 + 도리이 + 라멘
        px(0, 0, W, H, "#CFEAF7"); px(0, H - 40, W, 40, "#CFE6D0");
        px(40, 24, 28, 8, "#FFFFFF"); px(48, 18, 16, 8, "#FFFFFF");
        px(210, 40, 30, 8, "#FFFFFF"); px(218, 34, 16, 8, "#FFFFFF");
        const ax = (t * 1.4) % (W + 60) - 60;
        px(ax, 16, 22, 6, "#EDEDF2"); px(ax + 20, 17, 8, 4, "#D6D6DE");
        px(ax + 6, 12, 8, 4, "#C9C9D2"); px(ax + 6, 22, 8, 4, "#C9C9D2");
        px(ax - 2, 14, 3, 8, "#E8556F");
        px(96, 70, 6, 54, "#D8443C"); px(150, 70, 6, 54, "#D8443C");
        px(86, 64, 78, 7, "#C23A33"); px(90, 74, 70, 5, "#D8443C"); px(110, 58, 32, 6, "#E2554C");
        px(206, 110, 26, 12, "#E8556F"); px(206, 108, 26, 3, "#FBE6A8");
        px(214, 100 - (t % 16), 2, 4, "#E0D5C8");
        bride(108, 112); groom(140, 112);
        if (t % 70 < 30) heart(124, 50, 2, "#E8799F");
      } else if (kind === "hangang") {
        // 한강 야경 — 노을 + 강 + 다리 + 돗자리 치맥
        px(0, 0, W, H, "#FBD9C4"); px(0, 40, W, 18, "#F6C2C0"); px(0, 58, W, 26, "#7FA6C8");
        ([[10, 46], [34, 38], [60, 48], [86, 34], [120, 44], [150, 40], [180, 48], [210, 36], [240, 46], [270, 42]] as const).forEach(([bx, by]) => px(bx, by, 18, 58 - by, "#9A7FB0"));
        px(0, 60, W, 4, "#6E8DAE"); for (let i = 0; i < 7; i++) px(i * 44 + 16, 56, 3, 8, "#6E8DAE");
        for (let i = 0; i < 6; i++) { const wx = (i * 52 + t * 0.5) % W; if ((t + i * 9) % 40 < 20) px(Math.round(wx), 70 + (i % 3) * 4, 4, 2, "#CDE4F2"); }
        px(0, 110, W, H - 110, "#BFE0A8");
        for (let gx = 96; gx < 200; gx += 12) for (let gy = 128; gy < 150; gy += 8) px(gx, gy, 6, 4, (gx + gy) % 8 < 4 ? "#E8D8B0" : "#F4ECD8");
        px(96, 126, 108, 3, "#D8C8A0");
        px(108, 116, 14, 10, "#E8B04C"); px(108, 114, 14, 3, "#C8893A"); // 치킨박스
        px(184, 114, 7, 12, "#F2C24C"); px(184, 112, 7, 3, "#FBE6A8"); // 맥주
        bride(124, 116); groom(158, 116);
        if (t % 66 < 32) heart(150, 96, 2, "#E8799F");
      }

      // 탭 하트
      const hs = hearts.current;
      for (let i = hs.length - 1; i >= 0; i--) {
        const h = hs[i]; h.y -= 1.4; h.life--;
        heart(h.x, h.y, 2, h.life % 2 ? "#E8799F" : "#F2A3C0");
        if (h.life <= 0) hs.splice(i, 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [kind]);

  const tap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 300;
    const y = ((e.clientY - rect.top) / rect.height) * 168;
    for (let i = 0; i < 4; i++) hearts.current.push({ x: x + (i - 2) * 6, y, life: 40 + i * 6 });
  };

  return (
    <canvas ref={ref} width={300} height={168} onClick={tap}
      style={{ width: "100%", height: "auto", display: "block", borderRadius: 10, imageRendering: "pixelated", cursor: "pointer" }}
      aria-label="데이트 장면" />
  );
}
