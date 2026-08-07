package com.sgs.sistema.controller;

import com.sgs.sistema.dto.SolicitacaoRequestDTO;
import com.sgs.sistema.dto.SolicitacaoResponseDTO;
import com.sgs.sistema.dto.StatusUpdateRequestDTO;
import com.sgs.sistema.entidade.Solicitacao;
import com.sgs.sistema.repository.projection.SolicitacaoResumoProjection;
import com.sgs.sistema.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    // Injeção de dependência (o Spring faz o "new SolicitacaoService()" automaticamente)
    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> criar(@RequestBody @Valid SolicitacaoRequestDTO dto) {
        
        Solicitacao solicitacaoCriada = solicitacaoService.criar(dto);
        SolicitacaoResponseDTO response = SolicitacaoResponseDTO.fromEntity(solicitacaoCriada);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // Retorna 201 Created
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoResumoProjection>> listar(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer categoriaId,
            @RequestParam(required = false) LocalDateTime dataInicio,
            @RequestParam(required = false) LocalDateTime dataFim
    ) {
        // O required = false indica que os filtros são opcionais.
        List<SolicitacaoResumoProjection> lista = solicitacaoService.listarComFiltros(status, categoriaId, dataInicio, dataFim);
       
        return ResponseEntity.ok(lista); // Retorna 200 OK
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> detalhar(@PathVariable Long id) {
        Solicitacao solicitacao = solicitacaoService.buscarPorId(id);
        SolicitacaoResponseDTO response = SolicitacaoResponseDTO.fromEntity(solicitacao);
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SolicitacaoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody @Valid StatusUpdateRequestDTO dto
    ) {
        Solicitacao solicitacaoAtualizada = solicitacaoService.atualizarStatus(id, dto);
        SolicitacaoResponseDTO response = SolicitacaoResponseDTO.fromEntity(solicitacaoAtualizada);
        
        return ResponseEntity.ok(response);
    }
}