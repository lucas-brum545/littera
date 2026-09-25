package servico;

import modelo.Livro;
import contrato.RepositorioLivro;

public class BibliotecaService {
    private RepositorioLivro livroRepository;

    // Injeção da interface
    public BibliotecaService(RepositorioLivro livroRepository) {
        this.livroRepository = livroRepository;
    }

    public void emprestarLivro(String titulo) {
        Livro livro = livroRepository.buscarPorTitulo(titulo);
        if (livro != null && livro.isDisponivel()) {
            livro.setDisponivel(false);
            System.out.println("Empréstimo realizado com sucesso!");
        } else {
            System.out.println("Livro indisponível.");
        }
    }
}
