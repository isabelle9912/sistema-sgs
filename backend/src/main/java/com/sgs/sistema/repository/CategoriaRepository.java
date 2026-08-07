package com.sgs.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sgs.sistema.entidade.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {}
