package com.littera.api.controller;

import com.littera.api.dto.UsuarioRequest;
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

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResumo>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResumo> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioResumo> criar(@RequestBody UsuarioRequest request) {
        Usuario novoUsuario = usuarioService.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResumo.fromEntity(novoUsuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResumo> atualizar(@PathVariable Long id, @RequestBody UsuarioRequest request) {
        UsuarioResumo usuarioAtualizado = usuarioService.atualizar(id, request);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}