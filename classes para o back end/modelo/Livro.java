package modelo;

import contrato.Reservavel;

public class Livro extends ItemAcervo implements Reservavel {
    private String autor;
    private String isbn;
    private int renovacoesUtilizadas;
    private String nomeReservante;

    private static final int QUANTIDADE_ESTOQUE = 8;
    private static final int MAXIMO_RENOVACOES = 2;

    protected Livro(Long id, String codigo, String titulo, int ano) {
        super(id, codigo, titulo, ano);
        if (autor == null || autor.isBlank()) {
            throw new IllegalArgumentException("Autor e obrigatorio para um livro.");
        }
    }


    public String getIsbn() {
        return isbn;
    }

    public String getNomeReservante() {
        return nomeReservante;
    }

    // implementando emprestavel

    @Override
    public int getPrazoEmprestimo() {
        return 14;
    }

    @Override
    public double getMultaDiaria() {
        return 0.50;
    }

    @Override
    public boolean permiteRenovacao() {
        return renovacoesUtilizadas < MAXIMO_RENOVACOES;
    }


    @Override
    public String getDescricaoDetalhada() {
        return "Autor: " + autor + " | ISBN: " + isbn;
    }

    @Override
    public void reservar(Leitor leitor) {
        if (leitor == null) {
            throw new IllegalArgumentException("Usuario nao pode ser nulo.");
        }
        if (isDisponivel()) {
            throw new IllegalStateException(
                    "Item disponivel nao precisa de reserva: " + getTitulo());
        }
        this.nomeReservante = leitor.getNome();
    }

    @Override
    public boolean temReserva() {
        return nomeReservante != null;
    }

    // implmentando contrato da classe abstrata ItemAcervo

    @Override
    public String getCategoria(){
        return "LIVRO";
    }

    @Override
    public String getNomeLeitorReservar() {
        return nomeReservante == null ? "-" : nomeReservante;
    }

    public boolean renovar() {
        if (!permiteRenovacao()) {
            return false;
        }
        renovacoesUtilizadas++;
        return true;
    }

    public String getAutor() {
        return autor;
    }

    public int getRenovacoesUtilizadas() {
        return renovacoesUtilizadas;
    }
}