package com.littera.api.repository;

import com.littera.api.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {

    // Podemos buscar livros pelo ISBN cadastrado
    Optional<Livro> findByIsbn(String isbn);
}