package com.fdc3.rag.embedding;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;

@Component
@ConditionalOnProperty(prefix = "rag.embedding", name = "provider", havingValue = "deterministic")
public class DeterministicEmbeddingClient implements EmbeddingClient {

    private static final int DIMENSIONS = 64;

    @Override
    public Mono<List<Double>> embed(String input) {
        return Mono.fromSupplier(() -> vectorFor(input == null ? "" : input));
    }

    @Override
    public Mono<List<List<Double>>> embedAll(List<String> inputs) {
        return Mono.fromSupplier(() -> inputs.stream()
                .map(value -> vectorFor(value == null ? "" : value))
                .toList());
    }

    private List<Double> vectorFor(String input) {
        byte[] digest = digest(input);
        List<Double> vector = new ArrayList<>(DIMENSIONS);
        for (int index = 0; index < DIMENSIONS; index++) {
            int value = digest[index % digest.length] & 0xff;
            vector.add((value / 127.5) - 1.0);
        }
        return vector;
    }

    private byte[] digest(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(input.getBytes(StandardCharsets.UTF_8));
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to create deterministic embedding.", exception);
        }
    }
}
