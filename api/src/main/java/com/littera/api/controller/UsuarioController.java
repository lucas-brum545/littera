package com.littera.api.controller;

import com.littera.api.dto.UsuarioCadastro;
import com.littera.api.dto.UsuarioResumo;
import com.littera.api.model.Usuario;
import com.littera.api.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Injeção de dependência via construtor (recomendado pelo Spring)
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // 1. Listar todos os usuários (GET /api/usuarios)
    @GetMapping
    public List<UsuarioResumo> listar() {
        return usuarioService.listarTodos();
    }

    // 2. Buscar usuário por ID (GET /api/usuarios/{id})
    @GetMapping("/{id}")
    public UsuarioResumo buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id).orElse(null);
    }

//    // 3. Criar um novo usuário (POST /api/usuarios)
//    @PostMapping
//    public ResponseEntity<Usuario> criar(@RequestBody UsuarioCadastro usuario) {
//        UsuarioCadastro novoUsuario = usuarioService.salvar(usuario);
//        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
//    }

    // 4. Atualizar um usuário existente (PUT /api/usuarios/{id})
//    @PutMapping("/{id}")
//    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
//        Usuario usuarioAtualizado = usuarioService.atualizar(id, usuario);
//        return ResponseEntity.ok(usuarioAtualizado);
//    }

    // 5. Remover um usuário (DELETE /api/usuarios/{id})
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deletar(@PathVariable Long id) {
//        usuarioService.deletar(id);
//        return ResponseEntity.noContent().build();
//    }
}