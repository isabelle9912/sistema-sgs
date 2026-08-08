package com.sgs.sistema.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sgs.sistema.dto.SolicitanteResponseDTO;
import com.sgs.sistema.service.SolicitanteService;

@RestController
@RequestMapping("/api/solicitantes")
public class SolicitanteController {

    private final SolicitanteService solicitanteService;
    public SolicitanteController(SolicitanteService solicitanteService) {
        this.solicitanteService = solicitanteService;
    }

    @GetMapping
    public ResponseEntity<List<SolicitanteResponseDTO>> listarTodos() {
        return ResponseEntity.ok(solicitanteService.listarTodos().stream()
                .map(SolicitanteResponseDTO::fromEntity)
                .toList());
    }
    
}
