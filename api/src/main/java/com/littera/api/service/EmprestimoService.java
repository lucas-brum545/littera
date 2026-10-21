package com.littera.api.service;

import com.littera.api.dto.EmprestimoRequest;
import com.littera.api.dto.EmprestimoResponse;
import com.littera.api.dto.EmprestimoResumo;
import com.littera.api.exception.RecursoNaoEncontradoException;
import com.littera.api.model.Emprestimo;
import com.littera.api.model.ItemAcervo;
import com.littera.api.model.Livro;
import com.littera.api.model.Revista;
import com.littera.api.model.Usuario;
import com.littera.api.repository.EmprestimoRepository;
import com.littera.api.repository.ItemAcervoRepository;
import com.littera.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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

    // CREATE - Registar novo empréstimo com validações de regra de negócio
    public EmprestimoResponse salvar(EmprestimoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.codigoUsuario())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com o ID: " + request.codigoUsuario()));

        ItemAcervo item = itemAcervoRepository.findById(request.codigoItemAcervo())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Item do acervo não encontrado com o código: " + request.codigoItemAcervo()));

        // 1. Validação de Bloqueio do Usuário (se estiver bloqueado e o prazo ainda não expirou)
        if (usuario.getBloqueado()) {
            if (usuario.getDataFimBloqueio() != null && LocalDate.now().isBefore(usuario.getDataFimBloqueio())) {
                throw new RuntimeException("Usuário bloqueado até " + usuario.getDataFimBloqueio() + ". Não pode realizar empréstimos.");
            } else {
                // Se o prazo já passou, limpa o bloqueio automaticamente ao tentar emprestar
                usuario.setBloqueado(false);
                usuario.setDataFimBloqueio(null);
            }
        }

        // 2. Validação de Disponibilidade do Item
        if (!item.isDisponivel()) {
            throw new RuntimeException("Item não está disponível para empréstimo.");
        }

        // 3. Cálculo dinâmico do prazo com base no tipo de item (Livro = 14 dias, Revista = 7 dias)
        LocalDate hoje = LocalDate.now();
        int prazo = 14; // Padrão
        if (item instanceof Revista) {
            prazo = 7;
        } else if (item instanceof Livro) {
            prazo = 14;
        }

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUsuario(usuario);
        emprestimo.setItemAcervo(item);
        emprestimo.setDataEmprestimo(request.dataEmprestimo() != null ? request.dataEmprestimo() : hoje);

        // Define a data prevista de devolução calculada automaticamente
        emprestimo.setDataDevolucaoPrevista(hoje.plusDays(prazo));

        // Na criação, a data de devolução real inicia vazia (null)
        emprestimo.setDataDevolucaoReal(null);

        // 4. Atualização de estados do Usuário e do Item
        usuario.setQuantidadeEmprestada(usuario.getQuantidadeEmprestada() + 1);
        item.setDisponivel(false);

        // Persiste as alterações no utilizador e no item
        usuarioRepository.save(usuario);
        itemAcervoRepository.save(item);

        Emprestimo salvo = emprestimoRepository.save(emprestimo);
        return EmprestimoResponse.fromEntity(salvo);
    }

    // UPDATE / DEVOLUÇÃO - Atualizar empréstimo (Registar devolução real e calcular penalidades)
    public EmprestimoResponse atualizar(Long codigo, EmprestimoRequest request) {
        Emprestimo emprestimo = emprestimoRepository.findById(codigo)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empréstimo não encontrado com o código: " + codigo));

        Usuario usuario = emprestimo.getUsuario();
        ItemAcervo item = emprestimo.getItemAcervo();

        // Se o request informar uma data de devolução real (baixa/devolução do item) e ainda não tiver sido devolvido
        if (request.dataDevolucaoPrevista() != null && emprestimo.getDataDevolucaoReal() == null) {
            LocalDate dataDevolucaoReal = request.dataDevolucaoPrevista();
            emprestimo.setDataDevolucaoReal(dataDevolucaoReal);

            long diasAtraso = 0;
            if (dataDevolucaoReal.isAfter(emprestimo.getDataDevolucaoPrevista())) {
                diasAtraso = ChronoUnit.DAYS.between(emprestimo.getDataDevolucaoPrevista(), dataDevolucaoReal);
            }

            // Aplica a penalidade do dobro dos dias de atraso se houver atraso
            if (diasAtraso > 0) {
                long diasPenalidade = diasAtraso * 2;
                usuario.setBloqueado(true);
                usuario.setDataFimBloqueio(dataDevolucaoReal.plusDays(diasPenalidade));
            }

            // Decrementa a quantidade de itens emprestados e torna o item disponível novamente
            usuario.setQuantidadeEmprestada(Math.max(0, usuario.getQuantidadeEmprestada() - 1));
            item.setDisponivel(true);

            usuarioRepository.save(usuario);
            itemAcervoRepository.save(item);
        }

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