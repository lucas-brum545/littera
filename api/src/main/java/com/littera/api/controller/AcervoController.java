package com.littera.api.controller;

import com.littera.api.dto.LivroRequest;
import com.littera.api.dto.LivroResponse;
import com.littera.api.service.AcervoService;
import com.littera.api.service.RevistaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public class AcervoController {
    private final AcervoService acervoService;

    public AcervoController(AcervoService acervoService) {
        this.acervoService = acervoService;
    }

    // CREATE (Pode receber um DTO de criação para Livro ou Revista)
    @PostMapping("/livros")
    public ResponseEntity<LivroResponse> criarLivro(@RequestBody LivroRequest dto) {
        LivroResponse novoLivro = acervoService.salvarLivro(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoLivro);
    }

    // UPDATE
    @PutMapping("/livros/{codigo}")
    public ResponseEntity<LivroResponse> atualizarLivro(@PathVariable Long codigo, @RequestBody LivroRequest dto) {
        LivroResponse livroAtualizado = acervoService.atualizarLivro(codigo, dto);
        return ResponseEntity.ok(livroAtualizado);
    }

    // DELETE
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> deletarItem(@PathVariable Long codigo) {
        acervoService.deletar(codigo);
        return ResponseEntity.noContent().build();
    }
}

