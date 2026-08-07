package com.sgs.sistema.repository;

import com.sgs.sistema.entidade.Solicitacao;
import com.sgs.sistema.repository.projection.SolicitacaoResumoProjection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    // A anotação @Query guarda o SQL nativo. 
    @Query(value = """
            SELECT 
                s.id AS id, 
                sol.nome AS solicitanteNome, 
                sol.cpf_cnpj AS solicitanteDocumento, 
                cat.nome AS categoriaNome, 
                s.status AS status, 
                s.valor AS valor, 
                s.data_solicitacao AS dataSolicitacao
            FROM solicitacao s
            INNER JOIN solicitante sol ON s.solicitante_id = sol.id
            INNER JOIN categoria cat ON s.categoria_id = cat.id
            WHERE (:status IS NULL OR UPPER(s.status) = UPPER(:status))
              AND (:categoriaId IS NULL OR s.categoria_id = CAST(CAST(:categoriaId AS TEXT) AS INTEGER))
              AND (CAST(:dataInicio AS TIMESTAMP) IS NULL OR s.data_solicitacao >= CAST(:dataInicio AS TIMESTAMP))
              AND (CAST(:dataFim AS TIMESTAMP) IS NULL OR s.data_solicitacao <= CAST(:dataFim AS TIMESTAMP))
            ORDER BY s.data_solicitacao DESC
            """, nativeQuery = true)
    List<SolicitacaoResumoProjection> buscarSolicitacoesComFiltros(
            @Param("status") String status,
            @Param("categoriaId") Integer categoriaId,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim
    );
}
