package com.littera.api.controller;

import com.littera.api.dto.ReservaRequest;
import com.littera.api.dto.ReservaResponse;
import com.littera.api.service.ReservaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponse>> listarTodas() {
        return ResponseEntity.ok(reservaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ReservaResponse> criar(@RequestBody ReservaRequest request) {
        ReservaResponse novaReserva = reservaService.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaReserva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponse> atualizar(@PathVariable Long id, @RequestBody ReservaRequest request) {
        ReservaResponse reservaAtualizada = reservaService.atualizar(id, request);
        return ResponseEntity.ok(reservaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        reservaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}