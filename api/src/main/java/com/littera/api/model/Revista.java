package com.littera.api.model;
import jakarta.persistence.*;

@Entity
@Table(name = "revista")
public class Revista extends ItemAcervo {

    @Id
    private Long codigo; // Herda o ID do ItemAcervo

    @OneToOne(cascade = CascadeType.ALL)
    @MapsId
    @JoinColumn(name = "codigo")
    private ItemAcervo itemAcervo;

    @Column(name = "edicao", nullable = false, length = 10)
    private String edicao;

    @Column(name = "issn", nullable = false, length = 20)
    private String issn;

    @Column(name = "mes_ano_publicacao", nullable = false, length = 7)
    private String mesAnoPublicacao;

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

    public String getEdicao() {
        return edicao;
    }

    public void setEdicao(String edicao) {
        this.edicao = edicao;
    }

    public String getMesAnoPublicacao() {
        return mesAnoPublicacao;
    }

    public void setMesAnoPublicacao(String mesAnoPublicacao) {
        this.mesAnoPublicacao = mesAnoPublicacao;
    }

    public String getIssn() {
        return issn;
    }

    public void setIssn(String issn) {
        this.issn = issn;
    }
}
