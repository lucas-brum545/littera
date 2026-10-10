package com.littera.api.service;

import com.littera.api.dto.LivroResumo;
import com.littera.api.model.Livro;
import com.littera.api.repository.LivroRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LivroService {

    private final LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }

    public List<LivroResumo> listarTodos() {
        return livroRepository.findAll()
                .stream()
                .map(this::paraDTO)
                .toList();
    }

    private LivroResumo paraDTO(Livro livro) {
        return new LivroResumo(
                livro.getCodigo(),
                livro.getTitulo(),
                livro.getAutor(),
                livro.getAno(),
                livro.getDisponivel(),
                livro.getTipoItemAcervo(),
                livro.getLocalizacao()
        );
    }

    public Livro buscarPorId(Long codigo) {
        return livroRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com o código: " + codigo));
    }

    public Livro salvar(Livro livro) {
        // O JPA/Hibernate com CascadeType.ALL vai inserir primeiro na tabela item_acervo 
        // e usar o ID gerado para inserir na tabela livro automaticamente!
        return livroRepository.save(livro);
    }
}