package br.com.littera.service;

import br.com.littera.validation.ValidadorIdentificador;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class CrossrefService {

    private static final String CROSSREF =
            "https://api.crossref.org/journals/";

    private final RestClient restClient;

    public CrossrefService(RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    public Map<String, Object> buscarPorISSN(String issnRecebido) {

        String issn = ValidadorIdentificador.normalizar(issnRecebido);

        if (!ValidadorIdentificador.validarISSN(issn)) {
            throw new IllegalArgumentException(
                    "ISSN inválido. Informe um ISSN com dígito verificador correto."
            );
        }

        // O Crossref utiliza o ISSN no formato XXXX-XXXX.
        String issnFormatado =
                issn.substring(0, 4) + "-" + issn.substring(4);

        JsonNode resposta;

        try {
            resposta = restClient.get()
                    .uri(CROSSREF + issnFormatado)
                    .retrieve()
                    .body(JsonNode.class);

        } catch (RestClientResponseException erro) {

            if (erro.getStatusCode().value() == 404) {
                throw new PeriodicoNaoEncontradoException(
                        "O Crossref não encontrou uma revista para esse ISSN."
                );
            }

            throw new IllegalStateException(
                    "O Crossref respondeu com HTTP "
                            + erro.getStatusCode().value() + ".",
                    erro
            );
        }

        JsonNode mensagem = resposta == null
                ? null
                : resposta.path("message");

        if (mensagem == null
                || mensagem.isMissingNode()
                || mensagem.isNull()
                || texto(mensagem, "title").isBlank()) {

            throw new PeriodicoNaoEncontradoException(
                    "O Crossref não encontrou os dados dessa revista."
            );
        }

        Map<String, Object> dados = new LinkedHashMap<>();

        dados.put("titulo", texto(mensagem, "title"));
        dados.put("autor", "");
        dados.put("editora", texto(mensagem, "publisher"));
        dados.put("ano", "");
        dados.put("genero", "");
        dados.put("issn", issnFormatado);
        dados.put("capa", "");
        dados.put("descricao", "");
        dados.put("paginas", "");
        dados.put("idioma", "");

        dados.put(
                "linkCrossref",
                CROSSREF + issnFormatado
        );

        return dados;
    }

    private String texto(JsonNode objeto, String campo) {

        JsonNode valor = objeto.path(campo);

        if (valor.isMissingNode() || valor.isNull()) {
            return "";
        }

        return valor.asText("");
    }

    public static class PeriodicoNaoEncontradoException
            extends RuntimeException {

        public PeriodicoNaoEncontradoException(String mensagem) {
            super(mensagem);
        }
    }
}
