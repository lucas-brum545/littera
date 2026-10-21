package com.littera.api.dto;

import com.littera.api.model.Reserva;
import java.time.LocalDate;

public record ReservaResponse(
        Long id,
        Long usuarioId,
        String nomeUsuario,
        Long itemCodigo,
        String tituloItemAcervo,
        LocalDate dataReserva,
        String status
) {
    public static ReservaResponse fromEntity(Reserva reserva) {
        return new ReservaResponse(
                reserva.getId(),
                reserva.getUsuario() != null ? reserva.getUsuario().getId() : null,
                reserva.getUsuario() != null ? reserva.getUsuario().getNome() : null,
                reserva.getItemAcervo() != null ? reserva.getItemAcervo().getCodigo() : null,
                reserva.getItemAcervo() != null ? reserva.getItemAcervo().getTitulo() : null,
                reserva.getDataReserva(),
                reserva.getStatus()
        );
    }
}