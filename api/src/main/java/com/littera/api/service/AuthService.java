package com.littera.api.service;

import com.littera.api.dto.LoginRequest;
import com.littera.api.dto.UsuarioResumo;
import com.littera.api.exception.RecursoNaoEncontradoException;
import com.littera.api.model.Usuario;
import com.littera.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }


    public UsuarioResumo autenticar(LoginRequest request) {
        // Busca o usuário pelo email
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElse(null);

        // Se o usuário não existir, lança a exceção
        if (usuario == null) {
            throw new RecursoNaoEncontradoException("E-mail ou senha inválidos.");
        }

        // Compara a senha informada com o hash guardado na base de dados
        boolean senhaValida = passwordEncoder.matches(request.senha(), usuario.getSenhaHash());

        if (!senhaValida) {
            throw new RuntimeException("E-mail ou senha inválidos.");
        }

        return UsuarioResumo.fromEntity(usuario);
    }

}