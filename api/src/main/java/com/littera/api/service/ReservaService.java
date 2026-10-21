package com.littera.api.service;

import com.littera.api.dto.ReservaRequest;
import com.littera.api.dto.ReservaResponse;
import com.littera.api.dto.ReservaResumo;
import com.littera.api.exception.RecursoNaoEncontradoException;
import com.littera.api.model.ItemAcervo;
import com.littera.api.model.Reserva;
import com.littera.api.model.Usuario;
import com.littera.api.repository.ItemAcervoRepository;
import com.littera.api.repository.ReservaRepository;
import com.littera.api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ItemAcervoRepository  itemAcervoRepository;

    public ReservaService(ReservaRepository reservaRepository, UsuarioRepository usuarioRepository, ItemAcervoRepository itemAcervoRepository) {
        this.reservaRepository = reservaRepository;
        this.usuarioRepository = usuarioRepository;
        this.itemAcervoRepository = itemAcervoRepository;
    }

    public List<ReservaResumo> listarTodasResumo() {
        return reservaRepository.findAll().stream()
                .map(ReservaResumo::fromEntity)
                .toList();
    }

    public Optional<ReservaResumo> buscarPorIdResumo(Long id) {
        return reservaRepository.findById(id)
                .map(ReservaResumo::fromEntity);
    }

    // READ - Listar todas as reservas
    public List<ReservaResponse> listarTodas() {
        return reservaRepository.findAll().stream()
                .map(ReservaResponse::fromEntity)
                .toList();
    }

    // READ - Buscar por ID
    public ReservaResponse buscarPorId(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Reserva não encontrada com o ID: " + id));
        return ReservaResponse.fromEntity(reserva);
    }

    // CREATE - Criar nova reserva
    public ReservaResponse salvar(ReservaRequest request) {
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        ItemAcervo item = itemAcervoRepository.findById(request.itemCodigo())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Item do acervo não encontrado."));

        // 1. Validação de Bloqueio do Utilizador
        if (usuario.getBloqueado()) {
            if (usuario.getDataFimBloqueio() != null && LocalDate.now().isBefore(usuario.getDataFimBloqueio())) {
                throw new RuntimeException("Usuário bloqueado. Não pode realizar reservas.");
            } else {
                usuario.setBloqueado(false);
                usuario.setDataFimBloqueio(null);
                usuarioRepository.save(usuario);
            }
        }

        // 2. Regra: Só se reserva o que está emprestado/indisponível
        if (item.isDisponivel()) {
            throw new RuntimeException("Este item está disponível na biblioteca. Pode realizar o empréstimo direto.");
        }

        // 3. Criação da Reserva
        Reserva reserva = new Reserva();
        reserva.setUsuario(usuario);
        reserva.setItemAcervo(item);
        reserva.setDataReserva(LocalDate.now());
        // Poderia ter um campo status, ex: "ATIVA", "CONCLUIDA", "CANCELADA"
        reserva.setStatus("ATIVA");

        Reserva salva = reservaRepository.save(reserva);
        return ReservaResponse.fromEntity(salva);
    }

    // UPDATE - Atualizar reserva existente (ex: alterar status para CONFIRMADA ou CANCELADA)
    public ReservaResponse atualizar(Long id, ReservaRequest request) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Reserva não encontrada com o ID: " + id));

        if (request.usuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(request.usuarioId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com o ID: " + request.usuarioId()));
            reserva.setUsuario(usuario);
        }

        if (request.itemCodigo() != null) {
            ItemAcervo item = itemAcervoRepository.findById(request.itemCodigo())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Item do acervo não encontrado com o código: " + request.itemCodigo()));
            reserva.setItemAcervo(item);
        }

        if (request.dataReserva() != null) {
            reserva.setDataReserva(request.dataReserva());
        }

        if (request.status() != null && !request.status().isBlank()) {
            reserva.setStatus(request.status());
        }

        Reserva atualizada = reservaRepository.save(reserva);
        return ReservaResponse.fromEntity(atualizada);
    }

    // DELETE - Excluir reserva
    public void deletar(Long id) {
        if (!reservaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Reserva não encontrada com o ID: " + id);
        }
        reservaRepository.deleteById(id);
    }

}
