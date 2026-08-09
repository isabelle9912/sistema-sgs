import type {
  CreateSolicitacaoPayload,
  ListarSolicitacoesParams,
  Solicitacao,
  UpdateStatusPayload,
} from "../types/solicitacao";
import api from "./api";

export const solicitacaoService = {
  // GET - Listar todas as solicitações
  async listarSolicitacoes(
    params?: ListarSolicitacoesParams,
  ): Promise<Solicitacao[]> {
    try {
      const response = await api.get<Solicitacao[]>("/solicitacoes", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao listar solicitações:", error);
      throw error;
    }
  },

  // GET - Listar detalhes de uma solicitação
  async detalharSolicitacao(id: string): Promise<Solicitacao> {
    try {
      const response = await api.get<Solicitacao>(`/solicitacoes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao detalhar solicitação:", error);
      throw error;
    }
  },

  // POST - Criar uma nova solicitação
  async criarSolicitacao(
    dados: CreateSolicitacaoPayload,
  ): Promise<Solicitacao> {
    try {
      const response = await api.post<Solicitacao>("/solicitacoes", dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
      throw error;
    }
  },

  // PATCH - Atualizar status de uma solicitação
  async atualizarStatus(
    id: string,
    payload: UpdateStatusPayload,
  ): Promise<Solicitacao> {
    try {
      const response = await api.patch<Solicitacao>(
        `/solicitacoes/${id}/status`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status da solicitação:", error);
      throw error;
    }
  },
};
