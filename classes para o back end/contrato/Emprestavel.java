package contrato;
import modelo.Leitor;

public interface Emprestavel {
    int getPrazoEmprestimo();
    double getMultaDiaria();
    boolean emprestar(Leitor leitor);
    boolean devolver();

    default  boolean permiteRenovacao(){
        return false;
    }

    default double calcularMulta(int diasAtraso){
        if(diasAtraso == 0){
            return 0.0;
        }
        return diasAtraso * getMultaDiaria();
    }
}
