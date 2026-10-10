package com.littera.api.service;

import com.littera.api.dto.EmprestimoResumo;
import com.littera.api.model.Emprestimo;
import com.littera.api.repository.EmprestimoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmprestimoService {
    private final EmprestimoRepository emprestimoRepository;

    public EmprestimoService(EmprestimoRepository emprestimoRepository) {
        this.emprestimoRepository = emprestimoRepository;
    }

    public List<EmprestimoResumo> listarTodos() {
        return emprestimoRepository.findAll().stream()
                .map(EmprestimoResumo::fromEntity)
                .toList();
    }

    public Optional<EmprestimoResumo> buscarPorIdResumo(Long id) {
        return emprestimoRepository.findById(id)
                .map(EmprestimoResumo::fromEntity);
    }

    public Emprestimo salvar(Emprestimo emprestimo) {
        return emprestimoRepository.save(emprestimo);
    }
}
