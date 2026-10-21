package com.littera.api.dto;

import java.time.LocalDate;

public record EmprestimoRequest(
        Long codigoUsuario,
        Long codigoItemAcervo,
        LocalDate dataEmprestimo,
        LocalDate dataDevolucaoPrevista,
        LocalDate dataDevolucaoReal
) {
}
