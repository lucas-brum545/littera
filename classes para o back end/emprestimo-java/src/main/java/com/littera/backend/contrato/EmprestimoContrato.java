package com.littera.backend.contrato;
import com.littera.backend.modelo.Emprestimo;
import java.util.List;

public interface EmprestimoContrato {


    Emprestimo salvar(Emprestimo emprestimo);

    List<Emprestimo> listarTodos();
}

