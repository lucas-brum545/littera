package com.littera.api.dto;

import com.littera.api.model.Reserva;
import java.time.LocalDate;

public record ReservaResumo(
        Long id,
        String nomeUsuario,
        String tituloItem,
        LocalDate dataReserva,
        String status
) {
    // Método estático auxiliar para mapear da Entidade para o DTO
    public static ReservaResumo fromEntity(Reserva reserva) {
        return new ReservaResumo(
                reserva.getId(),
                reserva.getUsuario() != null ? reserva.getUsuario().getNome() : null,
                reserva.getItemAcervo() != null ? reserva.getItemAcervo().getTitulo() : null,
                reserva.getDataReserva(),
                reserva.getStatus()
        );
    }
}
