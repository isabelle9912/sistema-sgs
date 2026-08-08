package com.sgs.sistema.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sgs.sistema.entidade.Categoria;
import com.sgs.sistema.repository.CategoriaRepository;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;
    
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

}
