package com.littera.api.service;

import com.littera.api.dto.EmprestimoRequest;
import com.littera.api.dto.EmprestimoResponse;
import com.littera.api.dto.EmprestimoResumo;
import com.littera.api.exception.RecursoNaoEncontradoException;
import com.littera.api.model.Emprestimo;
import com.littera.api.model.ItemAcervo;
import com.littera.api.model.Usuario;
import com.littera.api.repository.EmprestimoRepository;
import com.littera.api.repository.ItemAcervoRepository;
import com.littera.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmprestimoService {
    private final EmprestimoRepository emprestimoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ItemAcervoRepository itemAcervoRepository;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, UsuarioRepository usuarioRepository, ItemAcervoRepository itemAcervoRepository) {
        this.emprestimoRepository = emprestimoRepository;
        this.usuarioRepository = usuarioRepository;
        this.itemAcervoRepository = itemAcervoRepository;
    }

    public List<EmprestimoResumo> listarTodosResumo() {
        return emprestimoRepository.findAll().stream()
                .map(EmprestimoResumo::fromEntity)
                .toList();
    }

    public List<EmprestimoResponse> listarTodos() {
        return emprestimoRepository.findAll().stream()
                .map(EmprestimoResponse::fromEntity)
                .toList();
    }

    public Optional<EmprestimoResumo> buscarPorIdResumo(Long id) {
        return emprestimoRepository.findById(id)
                .map(EmprestimoResumo::fromEntity);
    }

    public Emprestimo salvar(Emprestimo emprestimo) {
        return emprestimoRepository.save(emprestimo);
    }

    // CREATE - Registar novo empréstimo
    public EmprestimoResponse salvar(EmprestimoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.codigoUsuario())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com o ID: " + request.codigoUsuario()));

        ItemAcervo item = itemAcervoRepository.findById(request.codigoItemAcervo())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Item do acervo não encontrado com o código: " + request.codigoItemAcervo()));

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUsuario(usuario);
        emprestimo.setItemAcervo(item);
        emprestimo.setDataEmprestimo(request.dataEmprestimo() != null ? request.dataEmprestimo() : LocalDate.now());
        emprestimo.setDataDevolucao(request.dataDevolucao());

        Emprestimo salvo = emprestimoRepository.save(emprestimo);
        return EmprestimoResponse.fromEntity(salvo);
    }

    // UPDATE - Atualizar empréstimo (ex: registar data de devolução ou alterar dados)
    public EmprestimoResponse atualizar(Long codigo, EmprestimoRequest request) {
        Emprestimo emprestimo = emprestimoRepository.findById(codigo)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empréstimo não encontrado com o código: " + codigo));

        if (request.codigoUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(request.codigoUsuario())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com o ID: " + request.codigoUsuario()));
            emprestimo.setUsuario(usuario);
        }

        if (request.codigoItemAcervo() != null) {
            ItemAcervo item = itemAcervoRepository.findById(request.codigoItemAcervo())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Item do acervo não encontrado com o código: " + request.codigoItemAcervo()));
            emprestimo.setItemAcervo(item);
        }

        if (request.dataEmprestimo() != null) {
            emprestimo.setDataEmprestimo(request.dataEmprestimo());
        }

        // Permite atualizar a data de devolução (baixa do empréstimo)
        emprestimo.setDataDevolucao(request.dataDevolucao());

        Emprestimo atualizado = emprestimoRepository.save(emprestimo);
        return EmprestimoResponse.fromEntity(atualizado);
    }

    // DELETE - Excluir registo de empréstimo
    public void deletar(Long codigo) {
        if (!emprestimoRepository.existsById(codigo)) {
            throw new RecursoNaoEncontradoException("Empréstimo não encontrado com o código: " + codigo);
        }
        emprestimoRepository.deleteById(codigo);
    }

    public EmprestimoResponse buscarId(Long codigo) {
        Emprestimo emprestimo = emprestimoRepository.findById(codigo)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empréstimo não encontrado com o código: " + codigo));
        return EmprestimoResponse.fromEntity(emprestimo);
    }
}
