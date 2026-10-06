package contrato;

import modelo.Leitor;

import java.util.List;
import java.util.ArrayList;

public class RepositorioLeitor implements Repositorio<Leitor> {

    private static List<Leitor> bancoDeDadosLeitores = new ArrayList<>();
    private static long contadorId = 1;

    @Override
    public void salvar(Leitor leitor) {
        if (leitor.getId() == null) {
            leitor.setId(contadorId++);
            bancoDeDadosLeitores.add(leitor);
            System.out.println("Leitor " + leitor.getId() + " salvo com sucesso!");
            return;
        }

        deletar(leitor.getId());
        bancoDeDadosLeitores.add(leitor);
        System.out.println("Leitor " + leitor.getId() + " atualizado com sucesso no banco de dados!");
    }

    @Override
    public Leitor buscarPorId(Long id) {
        for (Leitor leitor : bancoDeDadosLeitores) {
            if (leitor.getId().equals(id)) {
                return leitor;
            }
        }

        return null;
    }

    @Override
    public List<Leitor> listarTodos() {
        return new ArrayList<>(bancoDeDadosLeitores);
    }

    @Override
    public void deletar(Long id) {
        bancoDeDadosLeitores.removeIf(leitor -> leitor.getId().equals(id));
    }

    @Override
    public Leitor buscarPorTitulo(String titulo) {
        return null;
    }
}
