package com.littera.api.service;

import com.littera.api.dto.RevistaResumo;
import com.littera.api.model.Revista;
import com.littera.api.repository.RevistaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RevistaService {
    private final RevistaRepository revistaRepository;
    public RevistaService(RevistaRepository revistaRepository) {
        this.revistaRepository = revistaRepository;
    }
    public List<RevistaResumo> listarTodas() {
        return revistaRepository.findAll()
                .stream()
                .map(this::paraDTO)
                .toList();
    }

    private RevistaResumo paraDTO(Revista revista){
        return new RevistaResumo(
                revista.getCodigo(),
                revista.getTitulo(),
                revista.getAno(),
                revista.getDisponivel(),
                revista.getTipoItemAcervo(),
                revista.getEdicao(),
                revista.getIssn(),
                revista.getMesAnoPublicacao(),
                revista.getLocalizacao()
        );
    }

    public Revista buscarPorId(Long codigo) {
        return revistaRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Revista não encontrada com o código: " + codigo));
    }

    public Revista salvar(Revista revista) {
        return revistaRepository.save(revista);
    }
}
