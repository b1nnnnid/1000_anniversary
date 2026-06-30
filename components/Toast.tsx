"use client";

// 간단한 하단 토스트. 성공(ok)/실패에 따라 색이 달라진다.
export interface ToastMsg { msg: string; ok: boolean; }

export default function Toast({ toast }: { toast: ToastMsg | null }) {
  if (!toast) return null;
  return (
    <div className="pop" role="status" aria-live="polite" style={{
      position: "fixed", left: "50%", bottom: 92, transform: "translateX(-50%)",
      background: toast.ok ? "#fff" : "#FCEBEB",
      color: toast.ok ? "#6A5A66" : "#A33333",
      border: toast.ok ? "2px solid #EAD0DC" : "2px solid #F2C0C0",
      padding: "10px 18px", borderRadius: 12, fontSize: 13, maxWidth: "90vw", textAlign: "center",
      zIndex: 80, boxShadow: "0 3px 0 rgba(124,90,150,0.2)",
    }}>{toast.msg}</div>
  );
}
