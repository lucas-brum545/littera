import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

public class Leitor {

    private Long id;
    private String nome;
    private String documento;
    private LocalDate dataNascimento;
    private String telefoneContato;
    private String endereco;
    private String nomeResponsavel;
    private String projetoVinculado;
    private LocalDate dataCadastro;
    private boolean ativo;
    private LocalDate suspensoAte;
    private int emprestimosAtivos;
    private int limiteEmprestimos;

    private static final int LIMITE_PADRAO_EMPRESTIMOS = 2;

    public Leitor() {
        this.dataCadastro = LocalDate.now();
        this.ativo = true;
        this.emprestimosAtivos = 0;
        this.limiteEmprestimos = LIMITE_PADRAO_EMPRESTIMOS;
    }

    public Leitor(String nome, String documento, LocalDate dataNascimento,
                  String telefoneContato, String endereco,
                  String nomeResponsavel, String projetoVinculado) {
        this();
        this.nome = nome;
        this.documento = documento;
        this.dataNascimento = dataNascimento;
        this.telefoneContato = telefoneContato;
        this.endereco = endereco;
        this.nomeResponsavel = nomeResponsavel;
        this.projetoVinculado = projetoVinculado;
    }

    public boolean podeRealizarEmprestimo() {
        if (!this.ativo) {
            return false;
        }
        if (estaSuspenso()) {
            return false;
        }
        return this.emprestimosAtivos < this.limiteEmprestimos;
    }

    public boolean estaSuspenso() {
        if (this.suspensoAte == null) {
            return false;
        }
        return !LocalDate.now().isAfter(this.suspensoAte);
    }

    public void incrementarEmprestimo() {
        if (!podeRealizarEmprestimo()) {
            throw new IllegalStateException("Leitor não está apto a realizar novos empréstimos no momento.");
        }
        this.emprestimosAtivos++;
    }

    public void decrementarEmprestimo() {
        if (this.emprestimosAtivos > 0) {
            this.emprestimosAtivos--;
        }
    }

    public void registrarDevolucao(LocalDate dataPrevista, LocalDate dataDevolucao) {
        decrementarEmprestimo();
        if (dataPrevista != null && dataDevolucao != null && dataDevolucao.isAfter(dataPrevista)) {
            long diasAtraso = ChronoUnit.DAYS.between(dataPrevista, dataDevolucao);
            aplicarSuspensaoPorAtraso(diasAtraso);
        }
    }

    public int calcularDiasSuspensao(long diasAtraso) {

        if(diasAtraso >= 28){
            return 240;
        } else if (diasAtraso >= 21) {
            return 120;
        } else if (diasAtraso >= 14) {
            return 60;
        } else if (diasAtraso >= 7) {
            return 30;
        }
        return 0;
    }

    public void aplicarSuspensaoPorAtraso(long diasAtraso) {
        int diasPunicao = calcularDiasSuspensao(diasAtraso);
        aplicarSuspensao(diasPunicao);
    }

    public void aplicarSuspensao(int dias) {
        if (dias > 0) {
            LocalDate base = estaSuspenso() ? this.suspensoAte : LocalDate.now();
            this.suspensoAte = base.plusDays(dias);
        }
    }

    public void revogarSuspensao() {
        this.suspensoAte = null;
    }

    public int calcularIdade() {
        if (this.dataNascimento == null) {
            return 0;
        }
        return Period.between(this.dataNascimento, LocalDate.now()).getYears();
    }

    public boolean isMenorDeIdade() {
        return calcularIdade() < 18;
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

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getTelefoneContato() {
        return telefoneContato;
    }

    public void setTelefoneContato(String telefoneContato) {
        this.telefoneContato = telefoneContato;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getNomeResponsavel() {
        return nomeResponsavel;
    }

    public void setNomeResponsavel(String nomeResponsavel) {
        this.nomeResponsavel = nomeResponsavel;
    }

    public String getProjetoVinculado() {
        return projetoVinculado;
    }

    public void setProjetoVinculado(String projetoVinculado) {
        this.projetoVinculado = projetoVinculado;
    }

    public LocalDate getDataCadastro() {
        return dataCadastro;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDate getSuspensoAte() {
        return suspensoAte;
    }

    public int getEmprestimosAtivos() {
        return emprestimosAtivos;
    }

    public int getLimiteEmprestimos() {
        return limiteEmprestimos;
    }

    public void setLimiteEmprestimos(int limiteEmprestimos) {
        if (limiteEmprestimos >= 0) {
            this.limiteEmprestimos = limiteEmprestimos;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Leitor leitor = (Leitor) o;
        return Objects.equals(id, leitor.id) && Objects.equals(documento, leitor.documento);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, documento);
    }

    @Override
    public String toString() {
        return String.format(
                "Leitor [ID=%d, Nome='%s', Idade=%d, Projeto='%s', Empréstimos=%d/%d, Suspenso=%s]",
                id, nome, calcularIdade(), projetoVinculado, emprestimosAtivos, limiteEmprestimos,
                estaSuspenso() ? "Sim (até " + suspensoAte + ")" : "Não"
        );
    }
}
