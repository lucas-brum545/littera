package com.littera.api.dto;

import com.littera.api.model.Emprestimo;

import java.time.LocalDate;

public record EmprestimoResumo(
        Long codigo,
        String nomeUsuario,
        String tituloItem,
        LocalDate dataEmprestimo,
        LocalDate dataDevolucao
) {
    public static EmprestimoResumo fromEntity(Emprestimo emprestimo) {
        return new EmprestimoResumo(
                emprestimo.getCodigo(),
                emprestimo.getUsuario() != null ? emprestimo.getUsuario().getNome() : null,
                emprestimo.getItemAcervo() != null ? emprestimo.getItemAcervo().getTitulo() : null,
                emprestimo.getDataEmprestimo(),
                emprestimo.getDataDevolucao()
        );
    }
}
