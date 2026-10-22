package com.littera.api.repository;

import com.littera.api.model.Revista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RevistaRepository extends JpaRepository<Revista, Long> {
    List<Revista> findByIssn(String issn);
}
