package com.littera.api.service;

import com.littera.api.dto.UsuarioRequest;
import com.littera.api.dto.UsuarioResumo;
import com.littera.api.exception.RecursoNaoEncontradoException;
import com.littera.api.model.Usuario;
import com.littera.api.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioResumo> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResumo::fromEntity)
                .toList();
    }

    public UsuarioResumo buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com o ID: " + id));
        return UsuarioResumo.fromEntity(usuario);
    }

    // No método salvar:
    public UsuarioResumo salvar(UsuarioRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setTelefone(request.telefone());
        usuario.setDataNascimento(request.dataNascimento());

        if (request.tipoUsuario() != null) {
            usuario.setTipoUsuario(request.tipoUsuario());
        }

        // Encripta a senha antes de guardar na base de dados
        if (request.senha() != null && !request.senha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        }

        Usuario salvo = usuarioRepository.save(usuario);
        return UsuarioResumo.fromEntity(salvo);
    }

    // UPDATE - Atualizar usuário existente de forma segura
    public UsuarioResumo atualizar(Long id, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com o ID: " + id));

        if (request.nome() != null) {
            usuario.setNome(request.nome());
        }
        if (request.email() != null) {
            usuario.setEmail(request.email());
        }
        if (request.telefone() != null) {
            usuario.setTelefone(request.telefone());
        }

        // Só atualiza a data de nascimento se ela for enviada no request
        if (request.dataNascimento() != null) {
            usuario.setDataNascimento(request.dataNascimento());
        }

        if (request.tipoUsuario() != null) {
            usuario.setTipoUsuario(request.tipoUsuario());
        }

        // Só atualiza a senha se o usuário preencheu uma nova
        if (request.senha() != null && !request.senha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        }

        Usuario atualizado = usuarioRepository.save(usuario);
        return UsuarioResumo.fromEntity(atualizado);
    }

    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado com o ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}