
package com.littera.backend.controle;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.google.gson.JsonDeserializer;

import com.littera.backend.modelo.Emprestimo;
import com.littera.backend.contrato.EmprestimoContrato;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

public class EmprestimoControle implements HttpHandler {

    private final EmprestimoContrato service;

    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(
                    LocalDate.class,
                    (JsonSerializer<LocalDate>) (data, tipo, contexto) ->
                            new JsonPrimitive(data.toString())
            )
            .registerTypeAdapter(
                    LocalDate.class,
                    (JsonDeserializer<LocalDate>) (json, tipo, contexto) ->
                            LocalDate.parse(json.getAsString())
            )
            .create();

    public EmprestimoControle(EmprestimoContrato service) {
        this.service = service;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        adicionarCors(exchange);

        String metodo = exchange.getRequestMethod();

        if (metodo.equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }

        try {
            if (metodo.equalsIgnoreCase("GET")) {
                listar(exchange);

            } else if (metodo.equalsIgnoreCase("POST")) {
                cadastrar(exchange);

            } else {
                responder(
                        exchange,
                        405,
                        "{\"erro\":\"Método não permitido\"}"
                );
            }

        } catch (JsonParseException | IllegalStateException e) {
            responder(
                    exchange,
                    400,
                    "{\"erro\":\"JSON ou dados inválidos\"}"
            );

        } catch (RuntimeException e) {
            responder(
                    exchange,
                    400,
                    "{\"erro\":\"Não foi possível processar os dados\"}"
            );
        }
    }

    private void listar(HttpExchange exchange) throws IOException {
        String json = gson.toJson(service.listarTodos());
        responder(exchange, 200, json);
    }

    private void cadastrar(HttpExchange exchange) throws IOException {

        String corpo;

        try (InputStream entrada = exchange.getRequestBody()) {
            corpo = new String(
                    entrada.readAllBytes(),
                    StandardCharsets.UTF_8
            );
        }

        Emprestimo emprestimo =
                gson.fromJson(corpo, Emprestimo.class);

        if (emprestimo == null) {
            responder(
                    exchange,
                    400,
                    "{\"erro\":\"Envie os dados do empréstimo\"}"
            );
            return;
        }

        Emprestimo salvo = service.salvar(emprestimo);

        responder(exchange, 201, gson.toJson(salvo));
    }

    private void adicionarCors(HttpExchange exchange) {

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin", "*"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );
    }

    private void responder(
            HttpExchange exchange,
            int status,
            String corpo
    ) throws IOException {

        byte[] resposta = corpo.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json; charset=UTF-8"
        );

        exchange.sendResponseHeaders(status, resposta.length);

        try (OutputStream saida = exchange.getResponseBody()) {
            saida.write(resposta);
        }
    }
}