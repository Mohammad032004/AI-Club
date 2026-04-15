/**
 * Lightweight toast utility — no external dependency.
 * Call toast.success / toast.error / toast.info anywhere client-side.
 */

type ToastType = "success" | "error" | "info" | "warning";

function show(message: string, type: ToastType = "info", duration = 3500) {
  if (typeof document === "undefined") return;

  // Remove existing toast
  document.getElementById("__nexus_toast")?.remove();

  const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.35)", icon: "✓" },
    error:   { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.35)",  icon: "✕" },
    warning: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", icon: "⚠" },
    info:    { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.35)", icon: "ℹ" },
  };

  const c = colors[type];
  const el = document.createElement("div");
  el.id = "__nexus_toast";
  el.innerHTML = `<span style="font-weight:700;font-size:0.9rem">${c.icon}</span> ${message}`;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "1.5rem",
    left: "50%",
    transform: "translateX(-50%) translateY(20px)",
    background: c.bg,
    border: `1px solid ${c.border}`,
    backdropFilter: "blur(12px)",
    color: "#e8f0fe",
    padding: "0.7rem 1.5rem",
    borderRadius: "100px",
    fontSize: "0.875rem",
    fontFamily: "'Space Grotesk', sans-serif",
    zIndex: "9999",
    opacity: "0",
    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  });
  document.body.appendChild(el);

  // Animate in
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(0)";
  });

  // Animate out
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => el.remove(), 300);
  }, duration);
}

export const toast = {
  success: (msg: string) => show(msg, "success"),
  error:   (msg: string) => show(msg, "error"),
  warning: (msg: string) => show(msg, "warning"),
  info:    (msg: string) => show(msg, "info"),
};
