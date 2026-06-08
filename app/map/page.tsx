"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TrailMap from "@/components/TrailMap";
import GameDock from "@/components/GameDock";
import MemoryModal from "@/components/MemoryModal";
import Celebration from "@/components/Celebration";
import StageChallenge from "@/components/StageChallenge";
import { Stage, STAGES, HEART_PIECES, HEARTS_PER_TICKET, CAT_LINES } from "@/lib/gameData";
import { getProgress, changeTickets } from "@/lib/progressClient";

export default function MapPage() {
  const [collected, setCollected] = useState<string[]>([]);
  const [hearts, setHearts] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [pieces, setPieces] = useState<string[]>([]);
  const [modal, setModal] = useState<Stage | null>(null);
  const [challenge, setChallenge] = useState<Stage | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const catCount = useRef(0);

  useEffect(() => {
    getProgress().then((p) => {
      setCollected(p.collectedSpots);
      setHearts(p.hearts);
      setTickets(p.tickets);
      setPieces(p.heartPieces);
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const stageDone = collected.filter((id) => STAGES.some((s) => s.id === id)).length;
  const allCollected = STAGES.every((s) => collected.includes(s.id));

  const saveSpot = useCallback((id: string) => {
    fetch("/api/progress", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectSpot: id }),
    }).catch(() => {});
  }, []);

  const openMemory = useCallback((s: Stage) => {
    setModal(s);
    setCollected((c) => {
      if (c.includes(s.id)) return c;
      setHearts((h) => h + 1);
      saveSpot(s.id);
      return [...c, s.id];
    });
  }, [saveSpot]);

  // 스테이지 도착: 미션이 있고 아직 안 깼으면 미션부터
  const onStage = useCallback((s: Stage) => {
    setCollected((c) => {
      if (s.challenge && !c.includes("ch:" + s.id)) setChallenge(s);
      else openMemory(s);
      return c;
    });
  }, [openMemory]);

  const onChallengeDone = useCallback((success: boolean) => {
    const s = challenge;
    setChallenge(null);
    if (!s) return;
    if (success) {
      setCollected((c) => c.includes("ch:" + s.id) ? c : [...c, "ch:" + s.id]);
      saveSpot("ch:" + s.id);
      setTickets((t) => t + 1);
      changeTickets(1).catch(() => {});
      showToast("미션 성공! 🎟 +1");
    } else {
      showToast("아쉽다! 추억은 열어줄게 💗");
    }
    openMemory(s);
  }, [challenge, openMemory, saveSpot, showToast]);

  // 숨은 하트 조각
  const onHeart = useCallback((id: string) => {
    setPieces((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (next.length % HEARTS_PER_TICKET === 0) {
        setTickets((t) => t + 1);
        showToast(`💗 ${next.length}개 모음! 🎟 +1`);
      } else {
        showToast(`하트 조각 발견! (${next.length}/${HEART_PIECES.length})`);
      }
      fetch("/api/progress", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectHeart: id }),
      }).catch(() => {});
      return next;
    });
  }, [showToast]);

  // 고양이
  const onCat = useCallback(() => {
    setCollected((c) => {
      if (!c.includes("cat-gift")) {
        saveSpot("cat-gift");
        setTickets((t) => t + 1);
        changeTickets(1).catch(() => {});
        setHearts((h) => h + 1);
        showToast("🐱 냐옹~ (티켓을 물어다 줬다! 🎟 +1)");
        return [...c, "cat-gift"];
      }
      showToast("🐱 " + CAT_LINES[catCount.current++ % CAT_LINES.length]);
      return c;
    });
  }, [saveSpot, showToast]);

  const onGoal = useCallback(() => setCelebrate(true), []);

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "12px 10px 28px", position: "relative" }}>
      <header style={{ position: "relative", marginBottom: 8 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 16, color: "#B85C82" }}>우리의 1000일 ♥</h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <span className="chip">📷 {stageDone}/{STAGES.length}</span>
            <span className="chip">💗 {pieces.length}/{HEART_PIECES.length}</span>
            <span className="chip">🎟 {tickets}</span>
          </div>
        </div>
        <GameDock />
      </header>

      <TrailMap
        collected={collected} allCollected={allCollected} heartPieces={pieces}
        onStage={onStage} onGoal={onGoal} onHeart={onHeart} onCat={onCat}
      />

      {toast && (
        <div className="pop" style={{
          position: "fixed", left: "50%", bottom: 96, transform: "translateX(-50%)",
          background: "#fff", color: "#6A5A66", padding: "9px 16px", borderRadius: 12,
          fontSize: 13, whiteSpace: "nowrap", zIndex: 65, boxShadow: "0 3px 0 rgba(124,90,150,0.2)",
        }}>{toast}</div>
      )}

      {challenge && <StageChallenge stage={challenge} onDone={onChallengeDone} />}
      {modal && <MemoryModal spot={modal} onClose={() => setModal(null)} />}
      {celebrate && <Celebration onClose={() => setCelebrate(false)} />}
    </main>
  );
}
