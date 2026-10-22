package com.littera.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "item_codigo", nullable = false)
    private ItemAcervo itemAcervo;

    @Column(name = "data_reserva")
    private LocalDate dataReserva = LocalDate.now();

    @Column(name = "status", length = 9, nullable = false)
    private String status = "PENDENTE";

    // Construtores
    public Reserva() {
    }

    public Reserva(Usuario usuario, ItemAcervo itemAcervo) {
        this.usuario = usuario;
        this.itemAcervo = itemAcervo;
        this.dataReserva = LocalDate.now();
        this.status = "PENDENTE";
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public ItemAcervo getItemAcervo() {
        return itemAcervo;
    }

    public void setItemAcervo(ItemAcervo itemAcervo) {
        this.itemAcervo = itemAcervo;
    }

    public LocalDate getDataReserva() {
        return dataReserva;
    }

    public void setDataReserva(LocalDate dataReserva) {
        this.dataReserva = dataReserva;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
