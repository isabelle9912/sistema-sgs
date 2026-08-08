package com.sgs.sistema.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sgs.sistema.entidade.Solicitante;
import com.sgs.sistema.repository.SolicitanteRepository;

@Service
public class SolicitanteService {
    private final SolicitanteRepository solicitanteRepository;

    public SolicitanteService(SolicitanteRepository solicitanteRepository) {
        this.solicitanteRepository = solicitanteRepository;
    }

    public List<Solicitante> listarTodos() {
        return solicitanteRepository.findAll();
    }

}