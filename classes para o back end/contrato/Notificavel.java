package contrato;

public interface Notificavel {
    String getIdentificacaoContato();

    default void notificar(String mensagem){
        System.out.println("        [AVISO -> " + getIdentificacaoContato() + "] " + mensagem);
    }

    default void notificarUrgente(String mensagem){
        notificar("*** URGENTE *** " + mensagem);
    }
}
