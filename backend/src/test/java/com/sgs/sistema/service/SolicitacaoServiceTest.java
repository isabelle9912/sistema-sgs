package com.sgs.sistema.service;

import org.junit.jupiter.api.Test;

import com.sgs.sistema.dto.StatusUpdateRequestDTO;
import com.sgs.sistema.exception.RegraNegocioException;
import com.sgs.sistema.entidade.Solicitacao;
import com.sgs.sistema.entidade.StatusSolicitacao;
import com.sgs.sistema.repository.CategoriaRepository;
import com.sgs.sistema.repository.SolicitacaoRepository;
import com.sgs.sistema.repository.SolicitanteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SolicitacaoServiceTest {

    // O @Mock cria instâncias falsas dos repositórios (não bate no banco de dados)
    @Mock
    private SolicitacaoRepository solicitacaoRepository;
    @Mock
    private SolicitanteRepository solicitanteRepository;
    @Mock
    private CategoriaRepository categoriaRepository;

    // O @InjectMocks injeta os repositórios falsos dentro do nosso Service real
    @InjectMocks
    private SolicitacaoService solicitacaoService;

    @Test
    @DisplayName("Deve permitir transição de SOLICITADO para LIBERADO")
    void deveAtualizarStatusComSucesso() {
        // Arrange (Preparação)
        Long id = 1L;
        Solicitacao solicitacaoMock = new Solicitacao();
        solicitacaoMock.setId(id);
        solicitacaoMock.setStatus(StatusSolicitacao.SOLICITADO);

        StatusUpdateRequestDTO dto = new StatusUpdateRequestDTO(StatusSolicitacao.LIBERADO);

        // Quando o service buscar no banco, devolva o nosso mock
        when(solicitacaoRepository.findById(id)).thenReturn(Optional.of(solicitacaoMock));
        
        when(solicitacaoRepository.save(any(Solicitacao.class))).thenReturn(solicitacaoMock);

        // Act (Ação)
        Solicitacao atualizada = solicitacaoService.atualizarStatus(id, dto);

        // Assert (Verificação)
        assertEquals(StatusSolicitacao.LIBERADO, atualizada.getStatus());
        verify(solicitacaoRepository, times(1)).save(solicitacaoMock); // Garante que o save foi chamado
    }

    @Test
    @DisplayName("Deve lançar RegraNegocioException ao tentar pular de SOLICITADO para APROVADO")
    void deveBararTransicaoInvalida() {
        // Arrange
        Long id = 1L;
        Solicitacao solicitacaoMock = new Solicitacao();
        solicitacaoMock.setId(id);
        solicitacaoMock.setStatus(StatusSolicitacao.SOLICITADO); // Status atual

        StatusUpdateRequestDTO dto = new StatusUpdateRequestDTO(StatusSolicitacao.APROVADO); // Tentando pular etapa

        when(solicitacaoRepository.findById(id)).thenReturn(Optional.of(solicitacaoMock));

        // Act & Assert
        RegraNegocioException exception = assertThrows(RegraNegocioException.class, () -> {
            solicitacaoService.atualizarStatus(id, dto);
        });

        assertTrue(exception.getMessage().contains("Transição de status inválida"));
        verify(solicitacaoRepository, never()).save(any()); // Garante que NUNCA salvou no banco
    }
}