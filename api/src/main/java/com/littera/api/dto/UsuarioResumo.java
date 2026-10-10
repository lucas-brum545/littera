package com.littera.api.dto;

import com.littera.api.model.TipoUsuario;

// campos permitidos exposicao no front end
public record UsuarioResumo(
        Long id,
        String nome,
        String email,
        String telefone,
        Integer quantidadeEmprestada
) {}