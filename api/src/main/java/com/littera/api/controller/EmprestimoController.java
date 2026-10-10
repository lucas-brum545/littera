package com.littera.api.controller;

import com.littera.api.dto.EmprestimoResumo;
import com.littera.api.model.Emprestimo;
import com.littera.api.repository.EmprestimoRepository;
import com.littera.api.service.EmprestimoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    @GetMapping
    public ResponseEntity<List<EmprestimoResumo>> buscarTodos() {
        List<EmprestimoResumo> resumos = emprestimoService.listarTodos();
        return ResponseEntity.ok(resumos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmprestimoResumo> buscarPorId(@PathVariable Long id) {
        return emprestimoService.buscarPorIdResumo(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}