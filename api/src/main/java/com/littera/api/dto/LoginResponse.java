package com.littera.api.dto;

import com.littera.api.model.TipoUsuario;

public record LoginResponse(String token, Long id, String nome, String email, TipoUsuario tipoUsuario) {
}