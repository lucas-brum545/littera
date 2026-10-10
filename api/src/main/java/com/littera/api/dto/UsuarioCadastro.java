package com.littera.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

//campos que precisa pra ser cadastrado
public record UsuarioCadastro(
    @NotBlank @Size(max = 120) String nome,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8, message = "A senha precisa de ao menos 8 caracteres") String senha)
{}
