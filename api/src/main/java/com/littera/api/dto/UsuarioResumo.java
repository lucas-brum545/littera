package com.littera.api.dto;

import com.littera.api.model.TipoUsuario;
import com.littera.api.model.Usuario;
import java.time.LocalDate;

public record UsuarioResumo(
        Long id,
        String nome,
        String email,
        String telefone,
        LocalDate dataNascimento,
        TipoUsuario tipoUsuario,
        Integer quantidadeEmprestada
) {
    public static UsuarioResumo fromEntity(Usuario usuario) {
        return new UsuarioResumo(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getDataNascimento(),
                usuario.getTipoUsuario(),
                usuario.getQuantidadeEmprestada()
        );
    }
}