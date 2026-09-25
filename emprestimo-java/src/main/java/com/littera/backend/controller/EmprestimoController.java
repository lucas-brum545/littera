package com.littera.backend.controller;

import com.littera.backend.model.Emprestimo;
import com.littera.backend.service.EmprestimoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emprestimos")
@CrossOrigin(origins = "*") // Permite a comunicação com o React sem erros de CORS
public class EmprestimoController {

    private final EmprestimoService service;

    public EmprestimoController(EmprestimoService service) {
        this.service = service;
    }

    @PostMapping
    public Emprestimo cadastrar(@RequestBody Emprestimo emprestimo) {
        return service.salvar(emprestimo);
    }

    @GetMapping
    public List<Emprestimo> listar() {
        return service.listarTodos();
    }
}
