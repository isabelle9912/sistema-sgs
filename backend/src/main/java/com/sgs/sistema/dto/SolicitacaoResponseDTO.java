package com.sgs.sistema.dto;

import com.sgs.sistema.entidade.Solicitacao;
import com.sgs.sistema.entidade.StatusSolicitacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SolicitacaoResponseDTO(
    Long id,
    Long solicitanteId,
    String solicitanteNome,
    String solicitanteDocumento,
    Long categoriaId,
    String categoriaNome,
    String descricao,
    BigDecimal valor,
    LocalDateTime dataSolicitacao,
    StatusSolicitacao status
) {
    public static SolicitacaoResponseDTO fromEntity(Solicitacao solicitacao) {
        return new SolicitacaoResponseDTO(
            solicitacao.getId(),
            solicitacao.getSolicitante().getId(),
            solicitacao.getSolicitante().getNome(),
            solicitacao.getSolicitante().getCpfCnpj(),
            solicitacao.getCategoria().getId(),
            solicitacao.getCategoria().getNome(),
            solicitacao.getDescricao(),
            solicitacao.getValor(),
            solicitacao.getDataSolicitacao(),
            solicitacao.getStatus()
        );
    }
}
