export const STATUS_COLORS = {
  SOLICITADO: "#f59e0b",
  LIBERADO: "#0ea5e2",
  APROVADO: "#16a34a",
  REJEITADO: "#dc2626",
  CANCELADO: "#6b7280",
} as const;

export type StatusKey = keyof typeof STATUS_COLORS;
