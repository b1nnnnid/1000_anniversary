"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TrailMap from "@/components/TrailMap";
import GameDock from "@/components/GameDock";
import MemoryModal from "@/components/MemoryModal";
import Celebration from "@/components/Celebration";
import StageChallenge from "@/components/StageChallenge";
import DialogBox from "@/components/DialogBox";
import DateModal from "@/components/DateModal";
import { Stage, STAGES, HEART_PIECES, HEARTS_PER_TICKET, CAT_INTRO, CAT_EVENTS } from "@/lib/gameData";
import { getProgress, changeTickets, resetProgress } from "@/lib/progressClient";

export default function MapPage() {
  const router = useRouter();
  const [collected, setCollected] = useState<string[]>([]);
  const [tickets, setTickets] = useState(0);
  const [pieces, setPieces] = useState<string[]>([]);
  const [modal, setModal] = useState<Stage | null>(null);
  const [challenge, setChallenge] = useState<Stage | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [dialog, setDialog] = useState<{ lines: string[]; intro: boolean } | null>(null);
  const [dateScene, setDateScene] = useState<Stage | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getProgress().then((p) => {
      setCollected(p.collectedSpots);
      setTickets(p.tickets);
      setPieces(p.heartPieces);
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const busy = !!(modal || challenge || celebrate || dialog || confirmReset || dateScene);
  const stageDone = collected.filter((id) => STAGES.some((s) => s.id === id)).length;
  const allCollected = STAGES.every((s) => collected.includes(s.id));
  const celebrated = collected.includes("reunion");
  // 이전 순서의 추억을 다 열어야 다음이 열린다
  const lockedIds = STAGES
    .filter((s) => !STAGES.filter((t) => t.order < s.order).every((t) => collected.includes(t.id)))
    .map((s) => s.id);

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
      saveSpot(s.id);
      return [...c, s.id];
    });
  }, [saveSpot]);

  const onStage = useCallback((s: Stage) => {
    setCollected((c) => {
      // 상봉 후엔 데이트 장소로 입장!
      if (c.includes("reunion") && s.place) {
        setDateScene(s);
        if (!c.includes("date:" + s.id)) {
          saveSpot("date:" + s.id);
          showToast("💑 " + s.place.name + " 데이트!");
          return [...c, "date:" + s.id];
        }
        return c;
      }
      const locked = !STAGES.filter((t) => t.order < s.order).every((t) => c.includes(t.id));
      if (locked) { showToast("🔒 이전 추억부터 차례대로 열어줘!"); return c; }
      if (s.challenge && !c.includes("ch:" + s.id)) setChallenge(s);
      else openMemory(s);
      return c;
    });
  }, [openMemory, saveSpot, showToast]);

  const onChallengeDone = useCallback((success: boolean) => {
    const s = challenge;
    setChallenge(null);
    if (!s) return;
    if (success) {
      setCollected((c) => (c.includes("ch:" + s.id) ? c : [...c, "ch:" + s.id]));
      saveSpot("ch:" + s.id);
      setTickets((t) => t + 1);
      changeTickets(1).catch(() => {});
      showToast("미션 성공! 🎟 +1");
    } else {
      showToast("아쉽다! 추억은 열어줄게 💗");
    }
    openMemory(s);
  }, [challenge, openMemory, saveSpot, showToast]);

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

  // 고양이가 다가와서 말 걸기
  const onCatTalk = useCallback(() => {
    setCollected((c) => {
      if (!c.includes("cat-intro")) setDialog({ lines: CAT_INTRO, intro: true });
      else setDialog({ lines: CAT_EVENTS[Math.floor(Math.random() * CAT_EVENTS.length)], intro: false });
      return c;
    });
  }, []);

  const onDialogEnd = useCallback(() => {
    setDialog((d) => {
      if (d?.intro) {
        setCollected((c) => (c.includes("cat-intro") ? c : [...c, "cat-intro"]));
        saveSpot("cat-intro");
        setTickets((t) => t + 1);
        changeTickets(1).catch(() => {});
        showToast("고양이가 티켓을 줬다! 🎟 +1");
      }
      return null;
    });
  }, [saveSpot, showToast]);

  const onGoal = useCallback(() => {
    setCollected((c) => {
      if (!c.includes("reunion")) setCelebrate(true);
      return c;
    });
  }, []);

  const onCelebrationClose = useCallback(() => {
    setCelebrate(false);
    setCollected((c) => (c.includes("reunion") ? c : [...c, "reunion"]));
    saveSpot("reunion");
  }, [saveSpot]);

  const doReset = useCallback(async () => {
    await resetProgress();
    router.push("/");
  }, [router]);

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "12px 10px 28px", position: "relative" }}>
      <header style={{ position: "relative", marginBottom: 8 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 16, color: "#B85C82" }}>
            우리의 1000일 {celebrated ? "🌸" : "♥"}
          </h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <span className="chip">📷 {stageDone}/{STAGES.length}</span>
            <span className="chip">💗 {pieces.length}/{HEART_PIECES.length}</span>
            <span className="chip">🎟 {tickets}</span>
          </div>
        </div>
        <GameDock onHome={() => setConfirmReset(true)} />
      </header>

      <TrailMap
        collected={collected} allCollected={allCollected} heartPieces={pieces}
        lockedIds={lockedIds} celebrated={celebrated} busy={busy}
        onStage={onStage} onGoal={onGoal} onHeart={onHeart} onCatTalk={onCatTalk}
      />

      {toast && (
        <div className="pop" style={{
          position: "fixed", left: "50%", bottom: 96, transform: "translateX(-50%)",
          background: "#fff", color: "#6A5A66", padding: "9px 16px", borderRadius: 12,
          fontSize: 13, whiteSpace: "nowrap", zIndex: 65, boxShadow: "0 3px 0 rgba(124,90,150,0.2)",
        }}>{toast}</div>
      )}

      {dialog && <DialogBox speaker="🐱 길고양이" lines={dialog.lines} onEnd={onDialogEnd} />}
      {dateScene && (
        <DateModal stage={dateScene} onClose={() => setDateScene(null)}
          onMemory={() => { const s = dateScene; setDateScene(null); setModal(s); }} />
      )}
      {challenge && <StageChallenge stage={challenge} onDone={onChallengeDone} />}
      {modal && <MemoryModal spot={modal} onClose={() => setModal(null)} />}
      {celebrate && <Celebration onClose={onCelebrationClose} />}

      {confirmReset && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 90, background: "rgba(90,74,85,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}>
          <div className="pop pixel-border" style={{ background: "var(--cream)", borderRadius: 16, padding: "22px 20px", textAlign: "center", maxWidth: 300 }}>
            <p style={{ fontSize: 36, margin: "0 0 6px" }}>🥺</p>
            <h2 style={{ fontSize: 16, color: "#B85C82", margin: "0 0 8px" }}>처음부터 다시 시작할까요?</h2>
            <p style={{ fontSize: 12.5, color: "#6A5A66", lineHeight: 1.7, margin: "0 0 16px" }}>
              모은 추억·하트 조각·티켓·소원권이<br />전부 사라지고 온보딩으로 돌아가요.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => setConfirmReset(false)} style={{
                background: "#fff", color: "#6A5A66", border: "2px solid var(--lav)",
                borderRadius: 12, padding: "10px 18px", fontSize: 13,
              }}>취소</button>
              <button className="btn-rose" onClick={doReset} style={{ fontSize: 13, padding: "10px 18px" }}>
                초기화하고 처음으로
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
