package contrato;

import modelo.ItemAcervo;
import modelo.Livro;
import java.util.List;

public interface Repositorio<T extends ItemAcervo> {
    T buscarPorId(Long id);
    void salvar(T item);
    List<T> listarTodos();
    void deletar(Long id);
    T buscarPorTitulo(String titulo);
}