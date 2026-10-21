package com.littera.api.repository;

import com.littera.api.model.ItemAcervo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemAcervoRepository extends JpaRepository<ItemAcervo, Long> {
    // Como o ItemAcervo é a classe pai, este repositório consegue gerir
    // operações globais (como findAll, findById, deleteById) para todas as subclasses (Livro, Revista, etc.)


}
