package com.fdc3.rag.embedding;

import reactor.core.publisher.Mono;

import java.util.List;

public interface EmbeddingClient {

    Mono<List<Double>> embed(String input);

    Mono<List<List<Double>>> embedAll(List<String> inputs);
}
