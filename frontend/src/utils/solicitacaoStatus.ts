import type { StatusSolicitacao } from "../types/solicitacao";

const transicoesValidas: Record<StatusSolicitacao, StatusSolicitacao[]> = {
  SOLICITADO: ["LIBERADO", "REJEITADO"],
  LIBERADO: ["APROVADO", "REJEITADO"],
  APROVADO: ["CANCELADO"],
  REJEITADO: [],
  CANCELADO: [],
};

export const podeAlterarStatus = (
  statusAtual: StatusSolicitacao,
  novoStatus: StatusSolicitacao,
): boolean => {
  return transicoesValidas[statusAtual].includes(novoStatus);
};

export const obterStatusDisponiveis = (
  statusAtual: StatusSolicitacao,
): StatusSolicitacao[] => {
  return transicoesValidas[statusAtual];
};
