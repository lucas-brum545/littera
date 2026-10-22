package com.littera.api.repository;

import com.littera.api.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    @Query("select e from Emprestimo e join fetch e.usuario join fetch e.itemAcervo")
    List<Emprestimo> findAllComRelacionamentos();
}
