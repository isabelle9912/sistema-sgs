package com.sgs.sistema.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SolicitacaoRequestDTO(

        @NotNull(message = "O ID do solicitante é obrigatório")
        Long solicitanteId,

        @NotNull(message = "O ID da categoria é obrigatório")
        Long categoriaId,

        @NotBlank(message = "A descrição é obrigatória")
        String descricao,

        @NotNull(message = "O valor é obrigatório")
        @DecimalMin(value = "0.0", inclusive = false, message = "O valor deve ser maior que zero") // Não permite valores negativos ou zero
        BigDecimal valor
) {
}