package com.littera.api.dto;

import com.littera.api.model.Revista;
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
    public static RevistaResumo fromEntity(Revista revista) {
        return new RevistaResumo(
                revista.getCodigo(),
                revista.getTitulo(),
                revista.getAno(),
                revista.getDisponivel(),
                revista.getTipoItemAcervo(),
                revista.getEdicao(),
                revista.getIssn(),
                revista.getMesAnoPublicacao(),
                revista.getLocalizacao()
        );
    }
}
