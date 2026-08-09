import type { Categoria } from "../types/categoria.ts";
import api from "./api";

export const categoriaService = {
  // GET - Listar todas as categorias
  async listarCategorias(): Promise<Categoria[]> {
    try {
      const response = await api.get<Categoria[]>("/categorias");
      return response.data;
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      throw error;
    }
  },
};
