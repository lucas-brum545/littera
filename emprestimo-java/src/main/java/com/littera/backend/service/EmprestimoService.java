package com.littera.backend.service;

import com.littera.backend.model.Emprestimo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmprestimoService {

    private final List<Emprestimo> repositorio = new ArrayList<>();
    private Long proximoId = 1L;

    public Emprestimo salvar(Emprestimo emprestimo) {
        // Regra de prazos: 7 dias para revistas, 14 dias para livros
        int prazo = "revista".equalsIgnoreCase(emprestimo.getTipoItem()) ? 7 : 14;

        if (emprestimo.getDataEmprestimo() == null) {
            emprestimo.setDataEmprestimo(LocalDate.now());
        }

        emprestimo.setDataDevolucao(emprestimo.getDataEmprestimo().plusDays(prazo));
        emprestimo.setId(proximoId++);
        repositorio.add(emprestimo);

        return emprestimo;
    }

    public List<Emprestimo> listarTodos() {
        return repositorio;
    }
}