package com.littera.api.dto;

import com.littera.api.model.TipoUsuario;
import java.time.LocalDate;

public record UsuarioRequest(
        String nome,
        String email,
        String telefone,
        LocalDate dataNascimento,
        String senha,
        TipoUsuario tipoUsuario,
        Integer quantidadeEmprestada,
        Boolean bloqueado,
        LocalDate dataFimBloqueio
) {
}