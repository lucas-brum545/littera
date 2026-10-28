package br.com.littera.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class DeepLTranslationService {

    private static final Logger log =
            LoggerFactory.getLogger(DeepLTranslationService.class);

    private static final String DEEPL_URL =
            "https://api-free.deepl.com/v2/translate";

    private final RestClient restClient;

    @Value("${DEEPL_API_KEY:}")
    private String apiKey;

    public DeepLTranslationService(RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    public String traduzirParaPortugues(String textoOriginal) {

    if (textoOriginal == null || textoOriginal.isBlank()) {
        return textoOriginal == null ? "" : textoOriginal;
    }

    if (apiKey == null || apiKey.isBlank()) {
        log.warn("DEEPL_API_KEY não está configurada.");
        return textoOriginal;
    }

    long inicio = System.nanoTime();
    log.info("Iniciando tradução pela DeepL.");

    try {
        Map<String, Object> requisicao = Map.of(
                "text", List.of(textoOriginal),
                "target_lang", "PT-BR"
        );

        JsonNode resposta = restClient.post()
                .uri(DEEPL_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "DeepL-Auth-Key " + apiKey)
                .body(requisicao)
                .retrieve()
                .body(JsonNode.class);

        if (resposta != null) {
            JsonNode traducoes = resposta.path("translations");

            if (traducoes.isArray() && !traducoes.isEmpty()) {
                String traduzido =
                        traducoes.get(0).path("text").asText("");

                if (!traduzido.isBlank()) {
                    long tempoMs =
                            (System.nanoTime() - inicio) / 1_000_000;

                    log.info(
                            "DeepL traduziu a descrição em {} ms.",
                            tempoMs
                    );

                    return traduzido;
                }
            }
        }

        log.warn("DeepL respondeu, mas não retornou uma tradução válida.");

    } catch (Exception erro) {
        log.error(
                "Falha ao traduzir descrição com DeepL: {}",
                erro.getMessage()
        );
    }

    return textoOriginal;
}}
