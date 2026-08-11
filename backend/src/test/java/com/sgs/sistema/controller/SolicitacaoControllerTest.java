package com.sgs.sistema.controller;

import com.sgs.sistema.dto.SolicitacaoRequestDTO;
import com.sgs.sistema.service.SolicitacaoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest(SolicitacaoController.class)
class SolicitacaoControllerTest {

    @Autowired
    private MockMvc mockMvc; 

    @Autowired
    private tools.jackson.databind.ObjectMapper objectMapper; // Transforma objetos Java em JSON

    @MockitoBean // Mocka o Service, pois só queremos testar a camada Controller/Web
    private SolicitacaoService solicitacaoService;

    @Test
    @DisplayName("Deve retornar 400 Bad Request quando os dados do cadastro forem inválidos (Validação @Valid)")
    void deveRetornarErro400AoCadastrarComDadosInvalidos() throws Exception {
        // Arrange: Criamos um DTO faltando a descrição e com valor zero (inválido)
        SolicitacaoRequestDTO requestInvalida = new SolicitacaoRequestDTO(
                1L, 
                1L, 
                "", // Descrição em branco (Viola o @NotBlank)
                BigDecimal.ZERO // Valor menor que 0.01 (Viola o @DecimalMin)
        );

        String jsonPayload = objectMapper.writeValueAsString(requestInvalida);

        // Act & Assert: Disparamos a requisição e esperamos as falhas
        mockMvc.perform(post("/api/solicitacoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isBadRequest()) // Espera erro 400
                .andExpect(jsonPath("$.erro").value("Erro de Validação")) // Verifica se passou pelo GlobalExceptionHandler
                .andExpect(jsonPath("$.mensagem").value(org.hamcrest.Matchers.containsString("A descrição é obrigatória")))
                .andExpect(jsonPath("$.mensagem").value(org.hamcrest.Matchers.containsString("O valor deve ser maior que zero")));
    }
}