package com.sgs.sistema.dto;

import com.sgs.sistema.entidade.StatusSolicitacao;

import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequestDTO(
    @NotNull(message = "O novo status é obrigatório")
    StatusSolicitacao status
) {}
