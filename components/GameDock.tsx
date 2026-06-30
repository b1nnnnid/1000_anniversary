"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PixelIcon from "@/components/PixelIcon";
import HelpModal from "@/components/HelpModal";
import { toggleBgm, isPlaying, startBgm, bgmPref, resumeBgm } from "@/lib/bgm";
import { playClick, playLocked } from "@/lib/sfx";
import { getProgress } from "@/lib/progressClient";
import { getUnlocks } from "@/lib/unlocks";
import { getFlags } from "@/lib/flags";
import { computeAchievements } from "@/lib/achievements";

interface Props {
  onHome?: () => void;
  gamesLocked?: boolean;      // 추억탐방 완주 전엔 잠금
  onLockedTry?: () => void;
  onShowcaseLockedTry?: () => void;   // 쇼케이스(전체보기) 잠금 안내
}

export default function GameDock({ onHome, gamesLocked = false, onLockedTry, onShowcaseLockedTry }: Props) {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [bgmOn, setBgmOn] = useState(false);
  const [allAchDone, setAllAchDone] = useState(false);

  // 사운드 기본 ON: 설정이 off가 아니면 자동 재생 (자동재생 차단 시 첫 입력에서 재개)
  useEffect(() => {
    const ensure = () => {
      if (bgmPref() && !isPlaying()) startBgm();
      resumeBgm();
      setBgmOn(isPlaying());
    };
    ensure();
    const kick = () => {
      ensure();
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
  }, []);

  // 모든 업적 달성 여부 → 쇼케이스 잠금 해제 판정 (업적 변동 시 재확인)
  useEffect(() => {
    const check = () => {
      getProgress().then((p) => {
        const list = computeAchievements({ collected: p.collectedSpots, pieces: p.heartPieces, unlocks: getUnlocks(), flags: getFlags() });
        setAllAchDone(list.length > 0 && list.every((a) => a.unlocked));
      });
    };
    check();
    window.addEventListener("ach-check", check);
    return () => window.removeEventListener("ach-check", check);
  }, []);

  type DockItem = { icon: string; label: string; locked: boolean; act: () => void; onLocked?: () => void };
  const items: DockItem[] = [
    { icon: "home", label: "처음으로", locked: false, act: () => (onHome ? onHome() : router.push("/")) },
    { icon: "heart", label: "우리집", locked: false, act: () => router.push("/us"), onLocked: onLockedTry },
    { icon: "star", label: "전체보기", locked: !allAchDone, act: () => router.push("/showcase"), onLocked: onShowcaseLockedTry },
    { icon: "help", label: "조작법", locked: false, act: () => setShowHelp(true) },
    { icon: bgmOn ? "sound" : "mute", label: bgmOn ? "음악 ON" : "음악 OFF", locked: false, act: () => setBgmOn(toggleBgm()) },
  ];

  return (
    <>
      <div style={{ position: "absolute", top: 4, right: 4, zIndex: 30, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <button key={it.label} aria-label={it.label + (it.locked ? " (잠김)" : "")}
            onClick={() => { if (it.locked) { playLocked(); it.onLocked?.(); } else { playClick(); it.act(); } }}
            style={{
              width: 50, height: 50, borderRadius: 14, border: "2px solid #fff",
              background: it.locked ? "#E2DCE0" : "var(--blush)", boxShadow: "0 3px 0 rgba(124,90,150,0.25)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              lineHeight: 1, gap: 1, position: "relative", opacity: it.locked ? 0.85 : 1,
            }}>
            <span style={{ filter: it.locked ? "grayscale(1)" : "none", opacity: it.locked ? 0.6 : 1 }}>
              <PixelIcon name={it.icon} size={20} />
            </span>
            <span style={{ fontSize: 8, color: it.locked ? "#9A8A95" : "#B85C82" }}>{it.label}</span>
            {it.locked && <span style={{ position: "absolute", top: -7, right: -7 }}><PixelIcon name="lock" size={16} /></span>}
          </button>
        ))}
      </div>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
