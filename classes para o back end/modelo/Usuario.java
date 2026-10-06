package modelo;

import java.time.LocalDateTime;

public class Admin{
    private Long id;
    private String nome;
    private String usuario;
    private String senhaHash;
    private String email;
    private String telefone;
    private boolean ativo;
    private LocalDateTime ultimoAcesso;
    private LocalDateTime dataCriacao;

    public Admin(Long id, String nome, String usuario, String senhaHash, String email, String telefone, boolean ativo, LocalDateTime ultimoAcesso, LocalDateTime dataCriacao) {
        this.id = id;
        this.nome = nome;
        this.usuario = usuario;
        this.senhaHash = senhaHash;
        this.email = email;
        this.telefone = telefone;
        this.ativo = ativo;
        this.ultimoAcesso = ultimoAcesso;
        this.dataCriacao = dataCriacao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getUltimoAcesso() {
        return ultimoAcesso;
    }

    public void setUltimoAcesso(LocalDateTime ultimoAcesso) {
        this.ultimoAcesso = ultimoAcesso;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public String getDescricaoDetalhada() {
        return "Nome: " + nome + " | " + "Usuário: " + usuario + "Email: " + email + "Data criação: " + dataCriacao + "Ultimo acesso: " + ultimoAcesso;
    }
    
}