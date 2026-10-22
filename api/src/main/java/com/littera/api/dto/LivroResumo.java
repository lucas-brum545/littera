package com.littera.api.dto;

import com.littera.api.model.TipoItemAcervo;

public record LivroResumo(
        Long codigo,
        String titulo,
        String autor,
        Integer ano,
        Boolean disponivel,
        TipoItemAcervo tipo,
        String localizacao
) {
}
