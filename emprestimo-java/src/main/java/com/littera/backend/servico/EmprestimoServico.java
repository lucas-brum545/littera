
package com.littera.backend.servico;

import com.littera.backend.contrato.EmprestimoContrato;
import com.littera.backend.modelo.Emprestimo;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class EmprestimoServico implements EmprestimoContrato {

    private final List<Emprestimo> repositorio = new ArrayList<>();
    private long proximoId = 1L;

    @Override
    public synchronized Emprestimo salvar(Emprestimo emprestimo) {

        // Define o prazo de devolução
        int prazo = "revista".equalsIgnoreCase(emprestimo.getTipoItem())
                ? 7 : 14;

        // Define a data do empréstimo, caso esteja vazia
        if (emprestimo.getDataEmprestimo() == null) {
            emprestimo.setDataEmprestimo(LocalDate.now());
        }

        // Calcula a data de devolução
        emprestimo.setDataDevolucao(
                emprestimo.getDataEmprestimo().plusDays(prazo)
        );

        // Gera o ID e guarda o empréstimo
        emprestimo.setId(proximoId++);
        repositorio.add(emprestimo);

        return emprestimo;
    }

    @Override
    public synchronized List<Emprestimo> listarTodos() {
        return new ArrayList<>(repositorio);
    }
}