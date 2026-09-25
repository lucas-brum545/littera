package contrato;
import modelo.Leitor;

public interface Reservavel {
    void reservar(Leitor leitor);
    boolean temReserva();
    String getNomeLeitorReservar();
}
