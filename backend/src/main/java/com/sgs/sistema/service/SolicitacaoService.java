package com.sgs.sistema.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import com.sgs.sistema.dto.SolicitacaoRequestDTO;
import com.sgs.sistema.dto.StatusUpdateRequestDTO;
import com.sgs.sistema.entidade.Categoria;
import com.sgs.sistema.entidade.Solicitacao;
import com.sgs.sistema.entidade.Solicitante;
import com.sgs.sistema.entidade.StatusSolicitacao;
import com.sgs.sistema.exception.RecursoNaoEncontradoException;
import com.sgs.sistema.exception.RegraNegocioException;
import com.sgs.sistema.repository.CategoriaRepository;
import com.sgs.sistema.repository.SolicitacaoRepository;
import com.sgs.sistema.repository.SolicitanteRepository;
import com.sgs.sistema.repository.projection.SolicitacaoResumoProjection;


@Service
public class SolicitacaoService {
    private final SolicitacaoRepository solicitacaoRepository;
    private final SolicitanteRepository solicitanteRepository;
    private final CategoriaRepository categoriaRepository;

    // Injecao de dependencias via construtor
    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository, SolicitanteRepository solicitanteRepository, CategoriaRepository categoriaRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.solicitanteRepository = solicitanteRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional
    public Solicitacao criar(SolicitacaoRequestDTO dto) {
        Solicitante solicitante = solicitanteRepository.findById(dto.solicitanteId())
                .orElseThrow(() -> new RegraNegocioException("Solicitante não encontrado"));

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RegraNegocioException("Categoria não encontrada"));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setSolicitante(solicitante);
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricao(dto.descricao());
        solicitacao.setValor(dto.valor());
        solicitacao.setDataSolicitacao(dto.dataSolicitacao());
        // O status é definido automaticamente pelo @PrePersist.
        // A data é definida pelo DTO ou, caso não informada, pelo @PrePersist.

        return solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoResumoProjection> listarComFiltros(String status, Integer categoriaId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        return solicitacaoRepository.buscarSolicitacoesComFiltros(status, categoriaId, dataInicio, dataFim);
    }

    public Solicitacao buscarPorId(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Solicitação com ID " + id + " não encontrada"));
    }

    @Transactional
    public Solicitacao atualizarStatus(Long id, StatusUpdateRequestDTO dto) {
        Solicitacao solicitacao = buscarPorId(id);
        
        validarTransicaoStatus(solicitacao.getStatus(), dto.status());
        
        solicitacao.setStatus(dto.status());
        return solicitacaoRepository.save(solicitacao);
    }

    private void validarTransicaoStatus(StatusSolicitacao atual, StatusSolicitacao novo) {
        // Regra: REJEITADO e CANCELADO são estados finais
        if (atual == StatusSolicitacao.REJEITADO || atual == StatusSolicitacao.CANCELADO) {
            throw new RegraNegocioException("Não é possível alterar uma solicitação que está em um estado final (" + atual + ").");
        }

        // Validação das transições permitidas
        boolean transicaoValida = switch (atual) {
            case SOLICITADO -> novo == StatusSolicitacao.LIBERADO || novo == StatusSolicitacao.REJEITADO;
            case LIBERADO -> novo == StatusSolicitacao.APROVADO || novo == StatusSolicitacao.REJEITADO;
            case APROVADO -> novo == StatusSolicitacao.CANCELADO;
            default -> false;
        };

        if (!transicaoValida) {
            throw new RegraNegocioException("Transição de status inválida de " + atual + " para " + novo + ".");
        }
    }
}
