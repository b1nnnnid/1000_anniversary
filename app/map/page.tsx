"use client";

import { useCallback, useEffect, useState } from "react";
import TrailMap from "@/components/TrailMap";
import GameDock from "@/components/GameDock";
import MemoryModal from "@/components/MemoryModal";
import Celebration from "@/components/Celebration";
import { Stage, STAGES } from "@/lib/gameData";
import { getProgress } from "@/lib/progressClient";

export default function MapPage() {
  const [collected, setCollected] = useState<string[]>([]);
  const [hearts, setHearts] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [modal, setModal] = useState<Stage | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    getProgress().then((p) => {
      setCollected(p.collectedSpots);
      setHearts(p.hearts);
      setTickets(p.tickets);
    });
  }, []);

  const allCollected = STAGES.every((s) => collected.includes(s.id));

  const onStage = useCallback((s: Stage) => {
    setModal(s);
    setCollected((c) => {
      if (c.includes(s.id)) return c;
      setHearts((h) => h + 1);
      fetch("/api/progress", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectSpot: s.id }),
      }).catch(() => {});
      return [...c, s.id];
    });
  }, []);

  const onGoal = useCallback(() => setCelebrate(true), []);

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "12px 10px 28px", position: "relative" }}>
      <header style={{ position: "relative", marginBottom: 8 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 16, color: "#B85C82" }}>우리의 1000일 ♥</h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 6 }}>
            <span className="chip">♥ {hearts}</span>
            <span className="chip">📷 {collected.length}/{STAGES.length}</span>
            <span className="chip">🎟 {tickets}</span>
          </div>
        </div>
        <GameDock />
      </header>

      <TrailMap collected={collected} allCollected={allCollected} onStage={onStage} onGoal={onGoal} />

      {modal && <MemoryModal spot={modal} onClose={() => setModal(null)} />}
      {celebrate && <Celebration onClose={() => setCelebrate(false)} />}
    </main>
  );
}
