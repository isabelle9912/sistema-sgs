export const formatDateToPtBR = (
  value: string | Date | null | undefined,
): string => {
  if (value == null) return "";

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrencyBRL = (
  value: string | number | null | undefined,
): string => {
  if (value == null || value === "") return "";

  const normalized =
    typeof value === "string"
      ? value
          .replace(/\./g, "")
          .replace(/,/g, ".")
          .replace(/[^\d.-]/g, "")
      : value;

  const amount = Number(normalized);
  if (Number.isNaN(amount)) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

export const formatCpfCnpj = (
  value: string | number | null | undefined,
): string => {
  if (value == null) return "";

  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  if (digits.length === 14) {
    return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }

  return digits;
};

export const displayValue = (value: string | null) =>
  value && value.trim() ? value : "Não informado";
