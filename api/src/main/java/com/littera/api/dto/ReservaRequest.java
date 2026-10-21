package com.littera.api.dto;

import java.time.LocalDate;

public record ReservaRequest(
        Long usuarioId,
        Long itemCodigo,
        LocalDate dataReserva,
        String status
) {
}
