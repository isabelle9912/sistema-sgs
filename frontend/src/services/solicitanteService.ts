import type { Solicitante } from "../types/solicitante.ts";
import api from "./api";

export const solicitanteService = {
  // GET - Listar todos os solicitantes
  async listarSolicitantes(): Promise<Solicitante[]> {
    try {
      const response = await api.get<Solicitante[]>("/solicitantes");
      return response.data;
    } catch (error) {
      console.error("Erro ao listar solicitantes:", error);
      throw error;
    }
  },
};
