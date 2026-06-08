"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PixelIcon from "@/components/PixelIcon";
import HelpModal from "@/components/HelpModal";
import { toggleBgm, isPlaying } from "@/lib/bgm";

interface Props {
  onHome?: () => void;
  gamesLocked?: boolean;      // 추억탐방 완주 전엔 잠금
  onLockedTry?: () => void;
}

export default function GameDock({ onHome, gamesLocked = false, onLockedTry }: Props) {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [bgmOn, setBgmOn] = useState(false);

  useEffect(() => { setBgmOn(isPlaying()); }, []);

  const items = [
    { icon: "home", label: "처음으로", lockable: false, locked: false, act: () => (onHome ? onHome() : router.push("/")) },
    { icon: "heart", label: "우리집", lockable: true, locked: gamesLocked, act: () => router.push("/us") },
    { icon: "help", label: "조작법", lockable: false, locked: false, act: () => setShowHelp(true) },
    { icon: bgmOn ? "sound" : "mute", label: bgmOn ? "음악 ON" : "음악 OFF", lockable: false, locked: false, act: () => setBgmOn(toggleBgm()) },
  ];

  return (
    <>
      <div style={{ position: "absolute", top: 4, right: 4, zIndex: 30, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <button key={it.label} aria-label={it.label + (it.locked ? " (잠김)" : "")}
            onClick={() => (it.locked ? onLockedTry?.() : it.act())}
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
