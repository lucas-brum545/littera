package com.littera.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "item_acervo")
@Inheritance(strategy = InheritanceType.JOINED) // Define como vira tabela
public abstract class ItemAcervo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(nullable = false, length = 200)
    private String titulo;

    private Integer ano;

    @Column(nullable = false)
    private Boolean disponivel = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoItemAcervo tipo; // 'LIVRO' ou 'REVISTA'

    @Column(nullable = false, length = 50)
    private String localizacao;

    // Construtores, Getters e Setters

    public Long getCodigo() {
        return codigo;
    }

    public void setCodigo(Long codigo) {
        this.codigo = codigo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public Boolean getDisponivel() {
        return disponivel;
    }

    public void setDisponivel(Boolean disponivel) {
        this.disponivel = disponivel;
    }

    public TipoItemAcervo getTipoItemAcervo() {
        return tipo;
    }

    public void setTipoItemAcervo(TipoItemAcervo tipo) {
        this.tipo = tipo;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}
