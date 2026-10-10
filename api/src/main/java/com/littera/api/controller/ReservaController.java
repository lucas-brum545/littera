package com.littera.api.controller;

import com.littera.api.dto.ReservaResumo;
import com.littera.api.service.ReservaService;
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
    public ResponseEntity<List<ReservaResumo>> listarResumos() {
        List<ReservaResumo> resumos = reservaService.listarTodas();
        return ResponseEntity.ok(resumos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResumo> buscarPorId(@PathVariable Long id) {
        return reservaService.buscarPorIdResumo(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}