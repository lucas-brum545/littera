package br.com.littera.controller;

import br.com.littera.entity.Acervo;
import br.com.littera.repository.AcervoRepository;
import br.com.littera.validation.ValidadorIdentificador;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/acervo")
@CrossOrigin(origins = "*")
public class AcervoController {

    private final AcervoRepository acervoRepository;

    public AcervoController(AcervoRepository acervoRepository) {
        this.acervoRepository = acervoRepository;
    }

    // Listar todos os registros
    @GetMapping
    public List<Acervo> listarTodos() {
        return acervoRepository.findAll();
    }

    // Buscar um registro pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Acervo> buscarPorId(@PathVariable Long id) {
        return acervoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cadastrar um registro
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Acervo acervo) {

        String erro = validarIdentificador(acervo);

        if (erro != null) {
            return respostaErro(erro);
        }

        String identificador =
                ValidadorIdentificador.normalizar(acervo.getIsbn());

        acervo.setIsbn(identificador);

        if (acervoRepository.existsByTipoAndIsbnIgnoreCase(
                acervo.getTipo(), identificador)) {
            return respostaErro(
                    "Já existe um registro desse tipo com esse ISBN/ISSN."
            );
        }

        Acervo salvo = acervoRepository.save(acervo);

        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // Atualizar um registro
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Acervo dados) {

        return acervoRepository.findById(id)
                .map(acervoExistente -> {

                    String identificadorRecebido =
                            ValidadorIdentificador.normalizar(dados.getIsbn());

                    String identificadorAtual =
                            ValidadorIdentificador.normalizar(
                                    acervoExistente.getIsbn());

                    boolean identificadorAlterado =
                            !identificadorRecebido.equals(identificadorAtual)
                            || !dados.getTipo().equalsIgnoreCase(
                                    acervoExistente.getTipo());

                    /*
                     * Valida o identificador quando ele é alterado.
                     * Isso permite editar outros campos de registros antigos
                     * que eventualmente tenham identificadores inválidos.
                     */
                    if (identificadorAlterado) {
                        String erro = validarIdentificador(dados);

                        if (erro != null) {
                            return respostaErro(erro);
                        }

                        if (acervoRepository
                                .existsByTipoAndIsbnIgnoreCaseAndIdNot(
                                        dados.getTipo(),
                                        identificadorRecebido,
                                        id)) {
                            return respostaErro(
                                    "Já existe outro registro desse tipo "
                                    + "com esse ISBN/ISSN."
                            );
                        }
                    }

                    acervoExistente.setTipo(dados.getTipo());
                    acervoExistente.setTitulo(dados.getTitulo());
                    acervoExistente.setAutor(dados.getAutor());
                    acervoExistente.setEditora(dados.getEditora());
                    acervoExistente.setAno(dados.getAno());
                    acervoExistente.setGenero(dados.getGenero());
                    acervoExistente.setIsbn(identificadorRecebido);
                    acervoExistente.setQuantidade(dados.getQuantidade());
                    acervoExistente.setEmprestados(dados.getEmprestados());
                    acervoExistente.setLocalizacao(dados.getLocalizacao());
                    acervoExistente.setCapa(dados.getCapa());
                    acervoExistente.setDescricao(dados.getDescricao());
                    acervoExistente.setPaginas(dados.getPaginas());
                    acervoExistente.setIdioma(dados.getIdioma());
                    acervoExistente.setLinkOpenLibrary(dados.getLinkOpenLibrary());
                    Acervo atualizado = acervoRepository.save(acervoExistente);

                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Validar ISBN ou ISSN conforme o tipo de material
    private String validarIdentificador(Acervo acervo) {

        if (acervo.getTipo() == null || acervo.getTipo().isBlank()) {
            return "Informe o tipo de material: Livro ou Revista.";
        }

        if (acervo.getIsbn() == null || acervo.getIsbn().isBlank()) {
            return "Informe o ISBN do livro ou o ISSN da revista.";
        }

        String tipo = acervo.getTipo().trim();
        String identificador =
                ValidadorIdentificador.normalizar(acervo.getIsbn());

        if (tipo.equalsIgnoreCase("Livro")) {

            if (!ValidadorIdentificador.validarISBN(identificador)) {
                return "ISBN inválido. Confira os dígitos e o dígito verificador.";
            }

        } else if (tipo.equalsIgnoreCase("Revista")) {

            if (!ValidadorIdentificador.validarISSN(identificador)) {
                return "ISSN inválido. Informe 8 caracteres com dígito verificador correto.";
            }

        } else {
            return "Tipo de material inválido. Utilize Livro ou Revista.";
        }

        return null;
    }

    // Retornar erro em JSON
    private ResponseEntity<Map<String, String>> respostaErro(String mensagem) {
        return ResponseEntity.badRequest()
                .body(Map.of("erro", mensagem));
    }

    // Excluir um registro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!acervoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        acervoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}