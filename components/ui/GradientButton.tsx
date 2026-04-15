import type { ReactNode } from "react";

export function GradientButton({
  children,
  size = "md",
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      style={{
        background: "linear-gradient(135deg,#3b8bfd,#6d28d9)",
        color: "white",
        border: "none",
        borderRadius: 12,
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(59,139,253,.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}