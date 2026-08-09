import React from "react";

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`bg-slate-900/90 mx-auto flex flex-col rounded-3xl border border-slate-800 p-8 shadow-2xl shadow-black/30 backdrop-blur ${className}`}
  >
    {children}
  </div>
);
