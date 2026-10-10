package com.littera.api.service;

import com.littera.api.dto.UsuarioResumo;
import com.littera.api.model.Usuario;
import com.littera.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<UsuarioResumo> listarTodos() {

        return usuarioRepository.findAll()
                .stream()
                .map(this::paraDTO)
                .toList();
    }

    private UsuarioResumo paraDTO(Usuario usuario) {
        return new UsuarioResumo(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getQuantidadeEmprestada()
        );
    }

    public Optional<UsuarioResumo> buscarPorId(Long id) {
        return listarTodos()
                .stream()
                .filter(usuario -> usuario.id().equals(id))
                .findFirst();
    }

    public Usuario salvar(Usuario usuario) {
        // Validação básica de e-mail duplicado
        usuarioRepository.findByEmail(usuario.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Já existe um usuário cadastrado com este e-mail.");
        });
        return usuarioRepository.save(usuario);
    }

//    public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
//        Usuario usuarioExistente = buscarPorId(id);
//
//        usuarioExistente.setNome(usuarioAtualizado.getNome());
//        usuarioExistente.setEmail(usuarioAtualizado.getEmail());
//        usuarioExistente.setTelefone(usuarioAtualizado.getTelefone());
//        usuarioExistente.setDataNascimento(usuarioAtualizado.getDataNascimento());
//
//        return usuarioRepository.save(usuarioExistente);
//    }

//    public void deletar(Long id) {
//        Usuario usuario = buscarPorId(id);
//        usuarioRepository.delete(usuario);
//    }
}