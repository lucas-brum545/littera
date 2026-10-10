package com.littera.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "livro")
public class Livro extends ItemAcervo{

    @Id
    private Long codigo;

    @OneToOne
    @MapsId
    @JoinColumn(name = "codigo")
    private ItemAcervo itemAcervo;

    @Column(nullable = false, length = 100)
    private String autor;

    @Column(nullable = false, length = 20)
    private String isbn;

    @Column(nullable = false, length = 50)
    private String genero;

    @Column(name = "total_exemplares", nullable = false)
    private Integer totalExemplares = 1;

    @Column(name = "total_disponivel", nullable = false)
    private Integer totalDisponivel = 1;

    @Column(name = "total_emprestados", nullable = false)
    private Integer totalEmprestados = 0;

    // Construtores, Getters e Setters


    public Long getCodigo() {
        return codigo;
    }

    public void setCodigo(Long codigo) {
        this.codigo = codigo;
    }

    public ItemAcervo getItemAcervo() {
        return itemAcervo;
    }

    public void setItemAcervo(ItemAcervo itemAcervo) {
        this.itemAcervo = itemAcervo;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Integer getTotalExemplares() {
        return totalExemplares;
    }

    public void setTotalExemplares(Integer totalExemplares) {
        this.totalExemplares = totalExemplares;
    }

    public Integer getTotalDisponivel() {
        return totalDisponivel;
    }

    public void setTotalDisponivel(Integer totalDisponivel) {
        this.totalDisponivel = totalDisponivel;
    }

    public Integer getTotalEmprestados() {
        return totalEmprestados;
    }

    public void setTotalEmprestados(Integer totalEmprestados) {
        this.totalEmprestados = totalEmprestados;
    }
}