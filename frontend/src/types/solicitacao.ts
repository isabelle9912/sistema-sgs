export type Solicitacao = {
  id: number;
  solicitanteId: number;
  solicitanteNome: string;
  solicitanteDocumento: string;
  categoriaId: number | null;
  categoriaNome: string;
  descricao: string | null;
  valor: number;
  dataSolicitacao: string | null;
  status: StatusSolicitacao;
};

export type CreateSolicitacaoPayload = {
  solicitanteId: number;
  categoriaId: number;
  descricao: string;
  valor: number;
};

export type UpdateStatusPayload = {
  status: StatusSolicitacao;
};

export type StatusSolicitacao =
  | "SOLICITADO"
  | "LIBERADO"
  | "APROVADO"
  | "REJEITADO"
  | "CANCELADO";

export type ListarSolicitacoesParams = {
  status?: StatusSolicitacao;
  categoriaId?: number;
  dataInicio?: string;
  dataFim?: string;
};
