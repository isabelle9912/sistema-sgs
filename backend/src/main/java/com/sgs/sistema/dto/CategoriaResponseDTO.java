package com.sgs.sistema.dto;


import com.sgs.sistema.entidade.Categoria;

public record CategoriaResponseDTO(Long id, String nome) {
    public static CategoriaResponseDTO fromEntity(Categoria categoria) {
        return new CategoriaResponseDTO(categoria.getId(), categoria.getNome());
    }

}
