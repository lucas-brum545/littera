package com.littera.api.controller;

import com.littera.api.dto.EmprestimoRequest;
import com.littera.api.dto.EmprestimoResponse;
import com.littera.api.dto.EmprestimoResumo;
import com.littera.api.model.Emprestimo;
import com.littera.api.repository.EmprestimoRepository;
import com.littera.api.service.EmprestimoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<EmprestimoResumo> buscarPorId(@PathVariable Long id) {
        return emprestimoService.buscarPorIdResumo(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<EmprestimoResponse>> listarTodos() {
        return ResponseEntity.ok(emprestimoService.listarTodos());
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<EmprestimoResponse> buscarId(@PathVariable Long codigo) {
        return ResponseEntity.ok(emprestimoService.buscarId(codigo));
    }

    @PostMapping
    public ResponseEntity<EmprestimoResponse> criar(@RequestBody EmprestimoRequest request) {
        EmprestimoResponse novoEmprestimo = emprestimoService.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoEmprestimo);
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<EmprestimoResponse> atualizar(@PathVariable Long codigo, @RequestBody EmprestimoRequest request) {
        EmprestimoResponse emprestimoAtualizado = emprestimoService.atualizar(codigo, request);
        return ResponseEntity.ok(emprestimoAtualizado);
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> deletar(@PathVariable Long codigo) {
        emprestimoService.deletar(codigo);
        return ResponseEntity.noContent().build();
    }
}