package com.littera.api.service;

import com.littera.api.dto.ReservaResumo;
import com.littera.api.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    public List<ReservaResumo> listarTodas() {
        return reservaRepository.findAll().stream()
                .map(ReservaResumo::fromEntity)
                .toList();
    }

    public Optional<ReservaResumo> buscarPorIdResumo(Long id) {
        return reservaRepository.findById(id)
                .map(ReservaResumo::fromEntity);
    }
}
