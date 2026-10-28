package br.com.littera.service;

import br.com.littera.validation.ValidadorIdentificador;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OpenLibraryService {

    private static final String OPEN_LIBRARY =
            "https://openlibrary.org";

    private static final String COVERS =
            "https://covers.openlibrary.org/b/id/";

    private final RestClient restClient;

    private final DeepLTranslationService deepLTranslationService;

    public OpenLibraryService(
        RestClient.Builder builder,
        DeepLTranslationService deepLTranslationService
) {
    var requestFactory =
            new org.springframework.http.client.SimpleClientHttpRequestFactory();

    requestFactory.setConnectTimeout(3000);
    requestFactory.setReadTimeout(4000);

    this.restClient = builder
            .requestFactory(requestFactory)
            .build();

    this.deepLTranslationService = deepLTranslationService;
} 

  public Map<String, Object> buscarPorISBN(String isbnRecebido) {

    String isbn = ValidadorIdentificador.normalizar(isbnRecebido);

    if (!ValidadorIdentificador.validarISBN(isbn)) {
        throw new IllegalArgumentException(
                "ISBN inválido. Informe ISBN-10 ou ISBN-13 válido."
        );
    }

    JsonNode edicao = consultarEdicao(isbn);

    if (edicao == null || texto(edicao, "title").isBlank()) {
        throw new LivroNaoEncontradoException(
                "A Open Library não encontrou uma edição para esse ISBN."
        );
    }

    // Consulta a obra uma única vez para reutilizar seus dados.
    JsonNode obra = consultarObra(edicao);

    Map<String, Object> dados = new LinkedHashMap<>();

    dados.put("titulo", texto(edicao, "title"));
    dados.put("autor", buscarAutores(edicao, obra));
    dados.put("editora", primeiroTexto(edicao.path("publishers")));
    dados.put("ano", extrairAno(texto(edicao, "publish_date")));
    dados.put("genero", buscarAssuntos(obra));
    dados.put("isbn", obterISBN(edicao, isbn));
    dados.put("capa", buscarCapa(edicao));

    String descricao = lerDescricao(edicao);

    if (descricao.isBlank() && obra != null) {
        descricao = lerDescricao(obra);
    }

    dados.put("descricaoOriginal", descricao);
    dados.put("descricao", descricao);
    dados.put("paginas", obterPaginas(edicao));
    dados.put("idioma", buscarIdioma(edicao));

    String chaveEdicao = texto(edicao, "key");
    String link = chaveEdicao.isBlank()
            ? ""
            : OPEN_LIBRARY + chaveEdicao;

    dados.put("linkOpenLibrary", link);

    return dados;
}           

    
private JsonNode consultarEdicao(String isbn) {

    String url = OPEN_LIBRARY + "/isbn/" + isbn + ".json";
    long inicio = System.nanoTime();

    for (int tentativa = 1; tentativa <= 2; tentativa++) {
        try {
    JsonNode edicao = restClient.get()
            .uri(url)
            .retrieve()
            .body(JsonNode.class);

    long tempoMs = (System.nanoTime() - inicio) / 1_000_000;
    System.out.println("Tempo consulta edição Open Library: " + tempoMs + " ms");

    return edicao;

        } catch (RestClientResponseException erro) {

            int status = erro.getStatusCode().value();

            if (status == 404) {
                return null;
            }

            if ((status == 502 || status == 503 || status == 504)
                    && tentativa < 2) {
                try {
                    Thread.sleep(500);
                } catch (InterruptedException interrupcao) {
                    Thread.currentThread().interrupt();
                    throw new IllegalStateException(
                            "Consulta à Open Library interrompida.",
                            interrupcao
                    );
                }
                continue;
            }

            throw new IllegalStateException(
                    "A Open Library respondeu com HTTP " + status + ".",
                    erro
            );
        }
    }

    throw new IllegalStateException(
            "Não foi possível consultar a Open Library."
    );
}
        private JsonNode consultarObra(JsonNode edicao) {
        JsonNode obras = edicao.path("works");

        if (!obras.isArray() || obras.isEmpty()) {
            return null;
        }

        String chaveObra = texto(obras.get(0), "key");

        if (chaveObra.isBlank()) {
            return null;
        }

        return consultarOpcional(OPEN_LIBRARY + chaveObra + ".json");
    }

    private JsonNode consultarOpcional(String url) {

        if (url == null || url.isBlank()) {
            return null;
        }

        try {
            return restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(JsonNode.class);

        } catch (RestClientResponseException erro) {

            if (erro.getStatusCode().value() == 404) {
                return null;
            }

            return null;

        } catch (RuntimeException erro) {
            // A indisponibilidade de um dado complementar
            // não impede o cadastro dos demais dados.
            return null;
        }
    }

    private String buscarAutores(JsonNode edicao, JsonNode obra) {
    JsonNode autores = edicao.path("authors");

    // Reutiliza a obra já consultada, sem fazer outra requisição.
    if ((!autores.isArray() || autores.isEmpty()) && obra != null) {
        autores = obra.path("authors");
    }

    if (!autores.isArray()) {
        return "";
    }

    List<String> nomes = new ArrayList<>();

    for (JsonNode autor : autores) {
        JsonNode referencia = autor.has("author")
                ? autor.path("author")
                : autor;

        String chave = texto(referencia, "key");

        if (chave.isBlank()) {
            continue;
        }

        JsonNode dadosAutor = consultarOpcional(
                OPEN_LIBRARY + chave + ".json"
        );

        if (dadosAutor == null) {
            continue;
        }

        String nome = texto(dadosAutor, "name");

        if (!nome.isBlank() && !nomes.contains(nome)) {
            nomes.add(nome);
        }
    }

    return String.join(", ", nomes);
}

    private String buscarDescricao(JsonNode edicao) {

        String descricaoEdicao = lerDescricao(edicao);

        if (!descricaoEdicao.isBlank()) {
            return descricaoEdicao;
        }

        JsonNode obras = edicao.path("works");

        if (!obras.isArray() || obras.isEmpty()) {
            return "";
        }

        String chaveObra = texto(obras.get(0), "key");

        if (chaveObra.isBlank()) {
            return "";
        }

        JsonNode obra = consultarOpcional(
                OPEN_LIBRARY + chaveObra + ".json"
        );

        return obra == null ? "" : lerDescricao(obra);
    }

    private String lerDescricao(JsonNode objeto) {

        JsonNode descricao = objeto.path("description");

        if (descricao.isTextual()) {
            return descricao.asText();
        }

        if (descricao.isObject()) {
            return texto(descricao, "value");
        }

        return "";
    }

    private String buscarCapa(JsonNode edicao) {

        JsonNode capas = edicao.path("covers");

        if (!capas.isArray()) {
            return "";
        }

        for (JsonNode capa : capas) {

            if (!capa.canConvertToInt()) {
                continue;
            }

            int id = capa.asInt();

            if (id > 0) {
                return COVERS + id + "-L.jpg?default=false";
            }
        }

        return "";
    }

private String buscarAssuntos(JsonNode obra) {

    if (obra == null) {
        return "";
    }

    JsonNode assuntos = obra.path("subjects");

    if (!assuntos.isArray()) {
        return "";
    }

    List<String> nomes = new ArrayList<>();

    for (JsonNode assunto : assuntos) {
        String nome = assunto.isTextual()
                ? assunto.asText().trim()
                : texto(assunto, "name").trim();

        if (!nome.isBlank()) {
            nomes.add(nome);
        }
    }

    List<String> prioridades = List.of(
            "Children's fiction",
            "Juvenile fiction",
            "Children's stories",
            "Young adult fiction",
            "Science fiction",
            "Historical fiction",
            "Fantasy",
            "Mystery",
            "Romance",
            "Fiction",
            "Literature"
    );

    for (String prioridade : prioridades) {
        for (String nome : nomes) {
            if (nome.equalsIgnoreCase(prioridade)) {
                return traduzirCategoria(nome);
            }
        }
    }

    for (String nome : nomes) {
        String assunto = nome.toLowerCase(java.util.Locale.ROOT);

        if (assunto.contains("juvenile")
                || assunto.contains("children")
                || assunto.contains("young adult")) {
            return "Literatura infantil";
        }

        if (assunto.contains("science fiction")) {
            return "Ficção científica";
        }

        if (assunto.contains("historical fiction")) {
            return "Ficção histórica";
        }

        if (assunto.contains("fantasy")) {
            return "Fantasia";
        }

        if (assunto.contains("mystery")) {
            return "Mistério";
        }

        if (assunto.contains("romance")) {
            return "Romance";
        }

        if (assunto.contains("fiction")) {
            return "Ficção";
        }
    }

    return "";
}   

private String traduzirCategoria(String categoria) {

    return switch (categoria.toLowerCase(java.util.Locale.ROOT)) {
        case "children's fiction", "juvenile fiction",
             "children's stories" -> "Literatura infantil";
        case "young adult fiction" -> "Ficção juvenil";
        case "science fiction" -> "Ficção científica";
        case "fantasy" -> "Fantasia";
        case "mystery" -> "Mistério";
        case "romance" -> "Romance";
        case "historical fiction" -> "Ficção histórica";
        case "fiction", "literature" -> "Ficção";
        default -> categoria;
    };
}

        private Object obterPaginas(JsonNode edicao) {

        JsonNode paginas = edicao.path("number_of_pages");

        return paginas.canConvertToInt()
                ? paginas.asInt()
                : "";
    }

    private String buscarIdioma(JsonNode edicao) {

    JsonNode idiomas = edicao.path("languages");

    if (!idiomas.isArray() || idiomas.isEmpty()) {
        return "";
    }

    JsonNode primeiroIdioma = idiomas.get(0);
    String chave = texto(primeiroIdioma, "key");

    if (chave.isBlank()) {
        return "";
    }

    String codigo = chave.substring(
            chave.lastIndexOf('/') + 1
    ).toLowerCase(java.util.Locale.ROOT);

    return switch (codigo) {
        case "eng" -> "Inglês";
        case "por" -> "Português";
        case "spa" -> "Espanhol";
        case "fre", "fra" -> "Francês";
        case "ger", "deu" -> "Alemão";
        case "ita" -> "Italiano";
        case "jpn" -> "Japonês";
        case "ara" -> "Árabe";
        case "rus" -> "Russo";
        case "chi", "zho" -> "Chinês";
        case "kor" -> "Coreano";
        case "dut", "nld" -> "Neerlandês";
        case "swe" -> "Sueco";
        case "dan" -> "Dinamarquês";
        case "nor" -> "Norueguês";
        case "fin" -> "Finlandês";
        case "pol" -> "Polonês";
        case "tur" -> "Turco";
        case "heb" -> "Hebraico";
        case "gre", "ell" -> "Grego";
        case "lat" -> "Latim";
        default -> "";
    };
}
    private String obterISBN(JsonNode edicao, String isbnInformado) {

        String isbn13 = primeiroTexto(edicao.path("isbn_13"));

        if (!isbn13.isBlank()) {
            return isbn13;
        }

        String isbn10 = primeiroTexto(edicao.path("isbn_10"));

        if (!isbn10.isBlank()) {
            return isbn10;
        }

        return isbnInformado;
    }

    private String primeiroTexto(JsonNode valores) {

        if (!valores.isArray()) {
            return "";
        }

        for (JsonNode valor : valores) {

            if (valor.isTextual()
                    && !valor.asText().isBlank()) {
                return valor.asText();
            }
        }

        return "";
    }

    private int extrairAno(String data) {

        if (data == null || data.isBlank()) {
            return 0;
        }

        Matcher matcher = Pattern.compile("\\b(\\d{4})\\b")
                .matcher(data);

        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }

        return 0;
    }

    private String texto(JsonNode objeto, String campo) {

        JsonNode valor = objeto.path(campo);

        if (valor.isMissingNode() || valor.isNull()) {
            return "";
        }

        return valor.asText("");
    }

    public static class LivroNaoEncontradoException
            extends RuntimeException {

        public LivroNaoEncontradoException(String mensagem) {
            super(mensagem);
        }
    }
}
