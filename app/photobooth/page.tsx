"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { markFlag } from "@/lib/flags";
import { elapsed } from "@/lib/config";
import { addPhotoCard } from "@/lib/photocardsClient";
import Toast, { ToastMsg } from "@/components/Toast";

type Frame = "hearts" | "flowers" | "anniv" | "dots";
const FRAMES: { id: Frame; label: string }[] = [
  { id: "hearts", label: "💗 하트" }, { id: "flowers", label: "🌸 꽃" },
  { id: "anniv", label: "🎀 1000일" }, { id: "dots", label: "✨ 도트" },
];

export default function PhotoBooth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [frame, setFrame] = useState<Frame>("hearts");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => { setImg(im); URL.revokeObjectURL(url); };
    im.src = url;
  };

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const S = 480, B = 46; // 사진 + 액자 두께
    cv.width = S; cv.height = S;
    ctx.imageSmoothingEnabled = true;

    // 배경 액자
    ctx.fillStyle = "#FBF3F8"; ctx.fillRect(0, 0, S, S);
    // 사진 영역
    const inner = S - B * 2;
    if (img) {
      const r = Math.min(img.width, img.height);
      const sx = (img.width - r) / 2, sy = (img.height - r) / 2;
      ctx.drawImage(img, sx, sy, r, r, B, B, inner, inner);
    } else {
      ctx.fillStyle = "#EDE3EC"; ctx.fillRect(B, B, inner, inner);
      ctx.fillStyle = "#B8A9B4"; ctx.font = "20px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("사진을 올려주세요", S / 2, S / 2);
    }

    const px = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    // 픽셀 액자 테두리
    const border = (c1: string, c2: string) => { px(0, 0, S, B, c1); px(0, S - B, S, B, c1); px(0, 0, B, S, c1); px(S - B, 0, B, S, c1); px(0, 0, S, 8, c2); px(0, S - 8, S, 8, c2); };
    const heart = (x: number, y: number, s: number, c: string) => { px(x, y, s, s, c); px(x + 2 * s, y, s, s, c); px(x - s, y + s, 4 * s, s, c); px(x, y + 2 * s, 2 * s, s, c); px(x + s / 2, y + 3 * s, s, s, c); };
    const flower = (x: number, y: number, s: number, c: string) => { px(x, y - s, s, s, c); px(x, y + s, s, s, c); px(x - s, y, s, s, c); px(x + s, y, s, s, c); px(x, y, s, s, "#F6E05E"); };

    if (frame === "hearts") {
      border("#F4D6E6", "#E8799F");
      for (let x = 14; x < S - 20; x += 56) { heart(x, 14, 4, "#E8799F"); heart(x + 28, S - 30, 4, "#F2A3C0"); }
    } else if (frame === "flowers") {
      border("#E2F2E6", "#9FD9B8");
      for (let x = 24; x < S - 16; x += 60) { flower(x, 22, 5, "#F2A3C0"); flower(x + 30, S - 24, 5, "#C9A7F0"); }
    } else if (frame === "anniv") {
      border("#FBE6A8", "#E0A94A");
      ctx.fillStyle = "#B85C82"; ctx.font = "bold 22px Galmuri11, monospace"; ctx.textAlign = "center";
      ctx.fillText("우리의 1000일 ♥", S / 2, 31);
      ctx.font = "13px Galmuri11, monospace"; ctx.fillStyle = "#9C7A2E";
      ctx.fillText("2023.10.08 ~", S / 2, S - 16);
    } else {
      border("#E2D0FB", "#9FC7E8");
      for (let x = 16; x < S; x += 28) { px(x, 18, 6, 6, x % 2 ? "#E8799F" : "#9FC7E8"); px(x, S - 26, 6, 6, x % 2 ? "#C9A7F0" : "#F2C76B"); }
    }
  }, [img, frame]);

  const download = () => {
    try {
      const cv = canvasRef.current!;
      const a = document.createElement("a");
      a.download = "우리의1000일_포토부스.png";
      a.href = cv.toDataURL("image/png");
      a.click();
      markFlag("photo");
      showToast("사진을 저장했어요! 📥 사진/다운로드 폴더를 확인해줘요");
    } catch {
      showToast("저장에 실패했어요 ㅠ 다시 한 번 눌러줄래요?", false);
    }
  };

  // 즉석 사진을 추억 타임라인 맨 끝에 "1000일 추억카드"로 추가
  const saveMemory = async () => {
    const cv = canvasRef.current;
    if (!cv || !img || saving) return;
    setSaving(true);
    try {
      const now = new Date();
      const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
      const { dday } = elapsed(now);
      await addPhotoCard({
        title: dday === 1000 ? "우리의 1000일 💝" : `${dday.toLocaleString()}일의 우리 💝`,
        message: message.trim(),
        date,
        dday,
        image: cv.toDataURL("image/png"),
      });
      markFlag("photo");
      setSaved(true);
      showToast("추억 앨범에 담았어요! 🎉");
    } catch {
      showToast("저장에 실패했어요 ㅠ 잠시 후 다시 해줘요", false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 36px", minHeight: "100dvh", textAlign: "center" }}>
      <Link href="/us" style={{ color: "#B85C82", fontSize: 13, textDecoration: "none", display: "block", textAlign: "left" }}>← 우리의 공간</Link>
      <h1 style={{ fontSize: 20, color: "#B85C82", margin: "12px 0 2px" }}>포토부스 📸</h1>
      <p style={{ fontSize: 11.5, color: "#8A7A85", margin: "0 0 14px" }}>커플 사진에 픽셀 액자를 씌워 저장해요</p>

      <canvas ref={canvasRef} style={{ width: "100%", maxWidth: 320, height: "auto", borderRadius: 12, imageRendering: "pixelated", boxShadow: "0 4px 0 rgba(124,90,150,0.2)" }} />

      <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", margin: "14px 0" }}>
        {FRAMES.map((f) => (
          <button key={f.id} onClick={() => setFrame(f.id)} className="chip"
            style={{ cursor: "pointer", border: frame === f.id ? "2px solid var(--rose)" : "none" }}>{f.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        <label className="chip" style={{ cursor: "pointer", border: "2px solid var(--lav)", padding: "10px 16px" }}>
          📂 사진 올리기
          <input type="file" accept="image/*" onChange={(e) => { setSaved(false); onFile(e); }} style={{ display: "none" }} />
        </label>
        <button className="btn-rose" onClick={download} disabled={!img} style={{ fontSize: 13, padding: "10px 18px", opacity: img ? 1 : 0.5 }}>📥 저장</button>
      </div>

      {/* 1000일 추억카드로 남기기 */}
      <div className="pixel-border" style={{ background: "linear-gradient(135deg, #FFF7E6, #FBF3F8 60%, #FFF7E6)", borderColor: "#FBE6A8", borderRadius: 16, padding: "16px 14px", marginTop: 20, textAlign: "center" }}>
        <p style={{ margin: "0 0 4px", fontSize: 14, color: "#9C7A2E", fontWeight: 700 }}>💝 추억 타임라인에 남기기</p>
        <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#A89AA3" }}>지금 이 사진이 추억 앨범 맨 끝에 1000일 카드로 추가돼요</p>
        <input
          value={message}
          onChange={(e) => { setMessage(e.target.value); setSaved(false); }}
          maxLength={60}
          placeholder="한 줄 메시지 (예: 천 일째의 우리 ♥)"
          style={{
            width: "100%", border: "2px solid #F2C76B", borderRadius: 10, padding: "10px 12px",
            fontSize: 13, fontFamily: "inherit", color: "#6A5A66", background: "#fff", outline: "none",
          }}
        />
        {saved ? (
          <div style={{ marginTop: 12 }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#9C7A2E", fontWeight: 700 }}>추억 앨범에 추가했어요! 🎉</p>
            <Link href="/album?tab=timeline" className="btn-rose" style={{ display: "inline-block", textDecoration: "none", fontSize: 13, padding: "10px 20px", background: "#E0A94A", boxShadow: "0 4px 0 rgba(156,122,46,.4)" }}>
              추억 앨범에서 보기 →
            </Link>
          </div>
        ) : (
          <button
            onClick={saveMemory}
            disabled={!img || saving}
            className="btn-rose"
            style={{ marginTop: 12, fontSize: 14, padding: "11px 22px", background: "#E0A94A", boxShadow: "0 4px 0 rgba(156,122,46,.4)", opacity: img && !saving ? 1 : 0.5 }}
          >
            {saving ? "남기는 중…" : "💝 1000일 추억으로 남기기"}
          </button>
        )}
        {!img && <p style={{ margin: "8px 0 0", fontSize: 11, color: "#B8AEB4" }}>먼저 사진을 올려주세요</p>}
      </div>

      <Toast toast={toast} />
    </main>
  );
}
