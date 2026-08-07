package com.sgs.sistema.repository.projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

// A anotação @JsonPropertyOrder é usada para definir a ordem das propriedades ao serializar o objeto em JSON.
@JsonPropertyOrder({
    "id",
    "solicitanteNome",
    "solicitanteDocumento",
    "categoriaNome",
    "status",
    "valor",
    "dataSolicitacao"
 })
public interface SolicitacaoResumoProjection {
    Long getId();
    String getSolicitanteNome();
    String getSolicitanteDocumento();
    String getCategoriaNome();
    String getStatus();
    BigDecimal getValor();
    LocalDateTime getDataSolicitacao();
}