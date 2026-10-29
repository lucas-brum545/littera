package br.com.littera.repository;

import br.com.littera.entity.Acervo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcervoRepository extends JpaRepository<Acervo, Long> {

    boolean existsByTipoAndIsbnIgnoreCase(String tipo, String isbn);

    boolean existsByTipoAndIsbnIgnoreCaseAndIdNot(
            String tipo,
            String isbn,
            Long id
    );
}
