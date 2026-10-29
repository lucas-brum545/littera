package br.com.littera.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "acervo")
public class Acervo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String titulo;

    private String autor;
    private String editora;
    private Integer ano;
    private String genero;
    private String isbn;
    private Integer quantidade = 0;
    private Integer emprestados = 0;
    private String localizacao;
  
    @Column(columnDefinition = "TEXT")
    private String capa;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private Integer paginas;
    private String idioma;

    @CreationTimestamp
    @Column(name = "cadastrado_em", nullable = false, updatable = false)
    private LocalDateTime cadastradoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    @Column(name = "link_google")
    private String linkOpenLibrary;
    
    @Column(name = "link_crossref")
    private String linkCrossref;
    
    public Acervo() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getEditora() {
        return editora;
    }

    public void setEditora(String editora) {
        this.editora = editora;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Integer getEmprestados() {
        return emprestados;
    }

    public void setEmprestados(Integer emprestados) {
        this.emprestados = emprestados;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public String getCapa() {
        return capa;
    }

    public void setCapa(String capa) {
        this.capa = capa;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getPaginas() {
        return paginas;
    }

    public void setPaginas(Integer paginas) {
        this.paginas = paginas;
    }

    public String getIdioma() {
        return idioma;
    }

    public void setIdioma(String idioma) {
        this.idioma = idioma;
    }

    public String getLinkOpenLibrary() {
        return linkOpenLibrary;
    }

public void setLinkOpenLibrary(String linkOpenLibrary) {
    this.linkOpenLibrary = linkOpenLibrary;
}

public String getLinkCrossref() {
    return linkCrossref;
}

public void setLinkCrossref(String linkCrossref) {
    this.linkCrossref = linkCrossref;
}

public LocalDateTime getCadastradoEm() {
    return cadastradoEm;
}

public LocalDateTime getAtualizadoEm() {
    return atualizadoEm;
}
}

