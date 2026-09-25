package modelo;

public class Revista extends ItemAcervo{
    private final int edicao;
    private final String mesAnoPublicacao;

    public Revista(Long id, String codigo, String titulo, int ano, int edicao, String mesAnoPublicacao) {
        super(id, codigo, titulo, ano);
        this.edicao = edicao;
        this.mesAnoPublicacao = mesAnoPublicacao;
    }

    @Override
    public int getPrazoEmprestimo() {
        return 7;
    }

    @Override
    public double getMultaDiaria() {
        return 1.00;
    }

//    @Override
//    public boolean permiteRenovacao() {
//        return false;
//    }

    @Override
    public String getDescricaoDetalhada() {
        return "Edicao " + edicao + " | " + mesAnoPublicacao;
    }

    @Override
    public String getCategoria() {
        return "REVISTA";
    }

    public int getEdicao(){
        return edicao;
    }
}
