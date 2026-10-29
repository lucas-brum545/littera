package com.littera.api.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/ia")
public class IaDiagnosticController {
    private final ChatClient chatClient;

    public IaDiagnosticController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        long inicio = System.currentTimeMillis();

        String resposta = chatClient.prompt()
                .user("Responda apenas com a palavra OK.")
                .call()
                .content();

        long fim = System.currentTimeMillis();

        return Map.of("tempo", fim - inicio, "resposta", resposta);
    }
}