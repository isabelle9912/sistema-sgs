import React, { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70";
  const variants = {
    primary: "bg-cyan-500 text-slate-950 hover:bg-cyan-400",
    secondary:
      "border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
