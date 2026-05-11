package com.fdc3.rag.repository;

import com.fdc3.rag.ingest.KnowledgeChunk;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Repository
public class InMemoryKnowledgeChunkRepository implements KnowledgeChunkRepository {

    private final AtomicReference<List<KnowledgeChunk>> chunks = new AtomicReference<>(List.of());

    @Override
    public void replaceAll(List<KnowledgeChunk> chunks) {
        this.chunks.set(List.copyOf(chunks));
    }

    @Override
    public List<ScoredKnowledgeChunk> search(List<Double> queryEmbedding, String namespace, int topK) {
        String normalizedNamespace = namespace == null || namespace.isBlank() ? null : namespace.trim();
        return chunks.get().stream()
                .filter(chunk -> normalizedNamespace == null || normalizedNamespace.equals(chunk.namespace()))
                .map(chunk -> new ScoredKnowledgeChunk(chunk, cosine(queryEmbedding, chunk.embedding())))
                .sorted(Comparator.comparingDouble(ScoredKnowledgeChunk::score).reversed())
                .limit(topK)
                .toList();
    }

    @Override
    public int size() {
        return chunks.get().size();
    }

    private double cosine(List<Double> left, List<Double> right) {
        if (left == null || right == null || left.isEmpty() || right.isEmpty()) {
            return 0.0;
        }
        int length = Math.min(left.size(), right.size());
        double dot = 0.0;
        double leftNorm = 0.0;
        double rightNorm = 0.0;
        for (int index = 0; index < length; index++) {
            double leftValue = left.get(index);
            double rightValue = right.get(index);
            dot += leftValue * rightValue;
            leftNorm += leftValue * leftValue;
            rightNorm += rightValue * rightValue;
        }
        if (leftNorm == 0.0 || rightNorm == 0.0) {
            return 0.0;
        }
        return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
    }
}
