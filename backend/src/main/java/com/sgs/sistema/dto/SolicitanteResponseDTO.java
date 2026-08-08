package com.sgs.sistema.dto;

import com.sgs.sistema.entidade.Solicitante;

public record SolicitanteResponseDTO(
    Long id,
    String nome,
    String cpfCnpj
) {

    public static SolicitanteResponseDTO fromEntity(Solicitante solicitante) {
        return new SolicitanteResponseDTO(
            solicitante.getId(),
            solicitante.getNome(),
            solicitante.getCpfCnpj()
        );
    }
}