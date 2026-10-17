package com.littera.api.service;

import com.littera.api.dto.LivroRequest;
import com.littera.api.dto.LivroResponse;
import com.littera.api.dto.RevistaResumo;
import com.littera.api.exception.RecursoNaoEncontradoException;
import com.littera.api.model.ItemAcervo;
import com.littera.api.model.Livro;
import com.littera.api.model.Revista;
import com.littera.api.repository.ItemAcervoRepository;
import com.littera.api.repository.LivroRepository;
import com.littera.api.repository.RevistaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcervoService {

    private final LivroRepository livroRepository;
    private final RevistaRepository revistaRepository;
    private final ItemAcervoRepository itemAcervoRepository;

    public AcervoService(LivroRepository livroRepository,
                         RevistaRepository revistaRepository,
                         ItemAcervoRepository itemAcervoRepository) {
        this.livroRepository = livroRepository;
        this.revistaRepository = revistaRepository;
        this.itemAcervoRepository = itemAcervoRepository;
    }

    // --- READ GLOBAL (Listar todos os itens do acervo) ---
    public List<ItemAcervo> listarTodos() {
        return itemAcervoRepository.findAll();
    }

    // --- MÉTODOS DE LIVRO (C e U) ---

    public LivroResponse salvarLivro(LivroRequest request) {
        Livro livro = new Livro();
        livro.setTitulo(request.titulo());
        livro.setAno(request.ano());
        livro.setDisponivel(request.disponivel() == null || request.disponivel());
        livro.setLocalizacao(request.localizacao());
        livro.setIsbn(request.isbn());
        livro.setAutor(request.autor());

        Livro salvo = livroRepository.save(livro);
        return LivroResponse.fromEntity(salvo);
    }

    public LivroResponse atualizarLivro(Long codigo, LivroRequest request) {
        Livro livro = livroRepository.findById(codigo)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Livro não encontrado com o código: " + codigo));

        livro.setTitulo(request.titulo());
        livro.setAno(request.ano());

        if (request.disponivel() != null) {
            livro.setDisponivel(request.disponivel());
        }

        livro.setLocalizacao(request.localizacao());
        livro.setIsbn(request.isbn());
        livro.setAutor(request.autor());

        Livro atualizado = livroRepository.save(livro);
        return LivroResponse.fromEntity(atualizado);
    }

    // --- MÉTODOS DE REVISTA (C e U) ---

    public RevistaResumo salvarRevista(RevistaResumo dto) {
        Revista revista = new Revista();
        revista.setTitulo(dto.titulo());
        revista.setAno(dto.ano());
        revista.setDisponivel(dto.disponivel() == null || dto.disponivel());
        revista.setLocalizacao(dto.localizacao());
        revista.setEdicao(dto.edicao());
        revista.setIssn(dto.issn());
        revista.setMesAnoPublicacao(dto.mesAnoPublicacao());

        Revista salva = revistaRepository.save(revista);
        return RevistaResumo.fromEntity(salva);
    }

    public RevistaResumo atualizarRevista(Long codigo, RevistaResumo dto) {
        Revista revista = revistaRepository.findById(codigo)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Revista não encontrada com o código: " + codigo));

        revista.setTitulo(dto.titulo());
        revista.setAno(dto.ano());

        if (dto.disponivel() != null) {
            revista.setDisponivel(dto.disponivel());
        }

        revista.setLocalizacao(dto.localizacao());
        revista.setEdicao(dto.edicao());
        revista.setIssn(dto.issn());
        revista.setMesAnoPublicacao(dto.mesAnoPublicacao());

        Revista atualizada = revistaRepository.save(revista);
        return RevistaResumo.fromEntity(atualizada);
    }

    // --- MÉTODO DE EXCLUSÃO (D) GENÉRICO PARA O ACERVO ---

    public void deletar(Long codigo) {
        ItemAcervo item = itemAcervoRepository.findById(codigo)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Item do acervo não encontrado com o código: " + codigo));

        itemAcervoRepository.delete(item);
    }
}