package com.littera.api.dto;

import com.littera.api.model.Livro;
import com.littera.api.model.TipoItemAcervo;

public record LivroResponse(
        Long codigo,
        String titulo,
        Integer ano,
        TipoItemAcervo tipoItemAcervo,
        Boolean disponivel,
        String localizacao,
        String autor,
        String isbn,
        String genero,
        Integer totalExemplares,
        Integer totalDisponivel,
        Integer totalEmprestados

) {
    // Método estático para converter a Entidade Livro no DTO de Resposta
    public static LivroResponse fromEntity(Livro livro) {
        return new LivroResponse(
                livro.getCodigo(),
                livro.getTitulo(),
                livro.getAno(),
                livro.getTipoItemAcervo(),
                livro.getDisponivel(),
                livro.getLocalizacao(),
                livro.getAutor(),
                livro.getIsbn(),
                livro.getGenero(),
                livro.getTotalExemplares(),
                livro.getTotalDisponivel(),
                livro.getTotalEmprestados()
        );
    }
}
