package com.littera.api.dto;

import com.littera.api.model.TipoItemAcervo;

public record RevistaResumo(
        Long codigo,
        String titulo,
        Integer ano,
        Boolean disponivel,
        TipoItemAcervo tipoItemAcervo,
        String edicao,
        String issn,
        String mesAnoPublicacao,
        String localizacao
) {
}
