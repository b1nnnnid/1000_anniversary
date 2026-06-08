"use client";

import { useEffect, useRef } from "react";
import { drawReaction, Mood } from "@/lib/pixelArt";

export default function CharacterReaction({ mood, size = 110 }: { mood: Mood; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    let f = 0;
    const draw = () => { ctx.clearRect(0, 0, 120, 120); drawReaction(ctx, mood, f); f = 1 - f; };
    draw();
    const iv = setInterval(draw, 300);
    return () => clearInterval(iv);
  }, [mood]);

  return <canvas ref={ref} width={120} height={120} style={{ width: size, height: size, imageRendering: "pixelated" }} />;
}
