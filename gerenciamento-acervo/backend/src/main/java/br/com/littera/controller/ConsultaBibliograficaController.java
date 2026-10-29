package br.com.littera.controller;

import br.com.littera.service.OpenLibraryService;
import br.com.littera.service.OpenLibraryService.LivroNaoEncontradoException;
import br.com.littera.service.CrossrefService;
import br.com.littera.service.CrossrefService.PeriodicoNaoEncontradoException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.littera.service.DeepLTranslationService;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ConsultaBibliograficaController {

    private final OpenLibraryService openLibraryService;
    private final CrossrefService crossrefService;
    private final DeepLTranslationService deepLTranslationService;

    public ConsultaBibliograficaController(
        OpenLibraryService openLibraryService,
        CrossrefService crossrefService,
        DeepLTranslationService deepLTranslationService) {

    this.openLibraryService = openLibraryService;
    this.crossrefService = crossrefService;
    this.deepLTranslationService = deepLTranslationService;
}

    @GetMapping("/open-library/isbn/{isbn}")
    public ResponseEntity<?> buscarLivro(
            @PathVariable String isbn) {

        try {
            Map<String, Object> dados =
                    openLibraryService.buscarPorISBN(isbn);

            return ResponseEntity.ok(Map.of(
                    "sucesso", true,
                    "dados", dados
            ));

        } catch (IllegalArgumentException erro) {

            return ResponseEntity.badRequest().body(Map.of(
                    "sucesso", false,
                    "erro", erro.getMessage()
            ));

        } catch (LivroNaoEncontradoException erro) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "sucesso", false,
                    "erro", erro.getMessage()
            ));

        } catch (Exception erro) {

            System.err.println(
                    "Erro ao consultar a Open Library: "
                            + erro.getClass().getSimpleName()
                            + " - " + erro.getMessage()
            );

            return ResponseEntity.status(
                    HttpStatus.BAD_GATEWAY
            ).body(Map.of(
                    "sucesso", false,
                    "erro", "Erro ao consultar a Open Library."
            ));
        }
    }

    @PostMapping("/traducao/portugues")
    public ResponseEntity<?> traduzirDescricao(
            @RequestBody Map<String, String> requisicao) {

        String texto = requisicao.getOrDefault("texto", "");

        String traducao =
                deepLTranslationService.traduzirParaPortugues(texto);

        return ResponseEntity.ok(Map.of(
                "sucesso", true,
                "traducao", traducao
        ));
    }

    @GetMapping("/periodicos/issn/{issn}")
    public ResponseEntity<?> buscarPeriodico(
            @PathVariable String issn) {

        try {
            Map<String, Object> dados =
                    crossrefService.buscarPorISSN(issn);

            return ResponseEntity.ok(Map.of(
                    "sucesso", true,
                    "dados", dados
            ));

        } catch (IllegalArgumentException erro) {

            return ResponseEntity.badRequest().body(Map.of(
                    "sucesso", false,
                    "erro", erro.getMessage()
            ));

        } catch (PeriodicoNaoEncontradoException erro) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "sucesso", false,
                    "erro", erro.getMessage()
            ));

        } catch (Exception erro) {

            System.err.println(
                    "Erro ao consultar o Crossref: "
                            + erro.getClass().getSimpleName()
                            + " - " + erro.getMessage()
            );

            return ResponseEntity.status(
                    HttpStatus.BAD_GATEWAY
            ).body(Map.of(
                    "sucesso", false,
                    "erro", "Erro ao consultar o Crossref."
            ));
        }
    }
}
