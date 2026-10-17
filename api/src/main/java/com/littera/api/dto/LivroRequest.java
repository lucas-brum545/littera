package com.littera.api.dto;

import com.littera.api.model.TipoItemAcervo;

public record LivroRequest(
        String titulo,
        Integer ano,
        TipoItemAcervo tipo,
        Boolean disponivel,
        String localizacao,
        String autor,
        String isbn,
        String genero,
        Integer totalExemplares,
        Integer totalDisponivel,
        Integer totalEmprestados
) {
}
