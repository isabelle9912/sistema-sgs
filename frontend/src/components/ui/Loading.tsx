import React from "react";

type LoadingProps = {
  title?: string;
};

const Loading: React.FC<LoadingProps> = ({ title = "Carregando..." }) => {
  return (
    <div style={overlayStyle} role="status" aria-live="polite">
      <div style={containerStyle}>
        <div style={spinnerStyle} />
        <span style={titleStyle}>{title}</span>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.35)",
  zIndex: 9999,
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 12,
  padding: 20,
  borderRadius: 8,
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
};

const spinnerStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  border: "6px solid #e6e6e6",
  borderTop: "6px solid #2563eb",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  color: "#111827",
};

// keyframes insertion for spin
const styleEl =
  typeof document !== "undefined"
    ? document.getElementById("loading-spinner-style")
    : null;
if (typeof document !== "undefined" && !styleEl) {
  const s = document.createElement("style");
  s.id = "loading-spinner-style";
  s.innerHTML = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
}

export default Loading;
