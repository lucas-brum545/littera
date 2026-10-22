package com.littera.api.controller;

import com.littera.api.dto.RevistaResumo;
import com.littera.api.model.Revista;
import com.littera.api.service.RevistaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/revistas")
public class RevistaController {

    private final RevistaService revistaService;

    public RevistaController(RevistaService revistaService) {
        this.revistaService = revistaService;
    }

    @GetMapping
    public ResponseEntity<List<RevistaResumo>> listarTodas() {
        List<RevistaResumo> revistas = revistaService.listarTodas();
        return ResponseEntity.ok(revistas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Revista> buscarPorId(@PathVariable Long id) {
        Revista revista = revistaService.buscarPorId(id);
        return ResponseEntity.ok(revista);
    }

    @PostMapping("/criar")
    public ResponseEntity<Revista> criar(@RequestBody Revista revista) {
        Revista novaRevista = revistaService.salvar(revista);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaRevista);
    }
}