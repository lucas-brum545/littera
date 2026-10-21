package com.littera.api.dto;

import com.littera.api.model.Emprestimo;
import java.time.LocalDate;

public record EmprestimoResponse(
        Long codigo,
        Long codigoUsuario,
        String nomeUsuario,
        Long codigoItemAcervo,
        String tituloItemAcervo,
        LocalDate dataEmprestimo,
        LocalDate dataDevolucaoPrevista,
        LocalDate dataDevolucaoReal
) {
    public static EmprestimoResponse fromEntity(Emprestimo emprestimo) {
        return new EmprestimoResponse(
                emprestimo.getCodigo(),
                emprestimo.getUsuario() != null ? emprestimo.getUsuario().getId() : null,
                emprestimo.getUsuario() != null ? emprestimo.getUsuario().getNome() : null,
                emprestimo.getItemAcervo() != null ? emprestimo.getItemAcervo().getCodigo() : null,
                emprestimo.getItemAcervo() != null ? emprestimo.getItemAcervo().getTitulo() : null,
                emprestimo.getDataEmprestimo(),
                emprestimo.getDataDevolucaoPrevista(),
                emprestimo.getDataDevolucaoReal()
        );
    }
}