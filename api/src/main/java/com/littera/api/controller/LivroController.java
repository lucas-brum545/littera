package com.littera.api.controller;
import com.littera.api.dto.LivroResumo;
import com.littera.api.model.Livro;
import com.littera.api.service.LivroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/livros")
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    // 1. Listar todos os livros (GET /api/livros)
    @GetMapping
    public ResponseEntity<List<LivroResumo>> listarTodos() {
        List<LivroResumo> livros = livroService.listarTodos();
        return ResponseEntity.ok(livros);
    }

    // 2. Buscar livro por código/ID (GET /api/livros/{id})
    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Long id) {
        Livro livro = livroService.buscarPorId(id);
        return ResponseEntity.ok(livro);
    }

    // 3. Cadastrar um novo livro (POST /api/livros)
    @PostMapping
    public ResponseEntity<Livro> criar(@RequestBody Livro livro) {
        Livro novoLivro = livroService.salvar(livro);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoLivro);
    }
}
