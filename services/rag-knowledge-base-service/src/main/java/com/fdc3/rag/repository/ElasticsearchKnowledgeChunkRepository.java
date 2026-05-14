package com.fdc3.rag.repository;

import com.fdc3.rag.config.RagProperties;
import com.fdc3.rag.ingest.KnowledgeChunk;
import jakarta.annotation.PreDestroy;
import org.apache.http.HttpHost;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
@ConditionalOnProperty(name = "rag.elasticsearch.enabled", havingValue = "true")
public class ElasticsearchKnowledgeChunkRepository implements KnowledgeChunkRepository {

    private static final Logger log = LoggerFactory.getLogger(ElasticsearchKnowledgeChunkRepository.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final RagProperties.Elasticsearch esProperties;

    @Autowired
    public ElasticsearchKnowledgeChunkRepository(RagProperties properties) {
        this.esProperties = properties.elasticsearch();
        this.objectMapper = new ObjectMapper();
        this.restClient = RestClient.builder(HttpHost.create(esProperties.uris())).build();
        ensureIndex();
    }

    @PreDestroy
    void close() throws IOException {
        restClient.close();
    }

    private void ensureIndex() {
        String indexName = esProperties.indexName();
        try {
            Request request = new Request("HEAD", "/" + indexName);
            Response response = restClient.performRequest(request);
            if (response.getStatusLine().getStatusCode() == 200) {
                log.info("Elasticsearch index '{}' already exists.", indexName);
                return;
            }
        } catch (IOException ignored) {
        }
        createIndex();
    }

    private void createIndex() {
        String indexName = esProperties.indexName();
        try {
            Map<String, Object> properties = new LinkedHashMap<>();
            properties.put("id", Map.of("type", "keyword"));
            properties.put("documentId", Map.of("type", "keyword"));
            properties.put("title", Map.of("type", "text"));
            properties.put("namespace", Map.of("type", "keyword"));
            properties.put("text", Map.of("type", "text"));
            properties.put("metadata", Map.of("type", "object"));
            properties.put("embedding", Map.of(
                    "type", "dense_vector",
                    "dims", esProperties.embeddingDimension()
            ));

            Map<String, Object> settings = new LinkedHashMap<>();
            settings.put("number_of_shards", 1);
            settings.put("number_of_replicas", 0);

            Map<String, Object> mappings = new LinkedHashMap<>();
            mappings.put("properties", properties);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("settings", settings);
            body.put("mappings", mappings);

            Request request = new Request("PUT", "/" + indexName);
            request.setJsonEntity(objectMapper.writeValueAsString(body));
            restClient.performRequest(request);
            log.info("Created index '{}' with dense_vector mapping ({} dims).",
                    indexName, esProperties.embeddingDimension());
        } catch (IOException e) {
            throw new RuntimeException("Failed to create index '" + indexName + "'.", e);
        }
    }

    @Override
    public void replaceAll(List<KnowledgeChunk> chunks) {
        String indexName = esProperties.indexName();
        try {
            deleteAllDocsInIndex(indexName);

            if (chunks.isEmpty()) {
                log.info("Indexed 0 knowledge chunks into Elasticsearch.");
                return;
            }

            StringBuilder bulkBody = new StringBuilder();
            for (KnowledgeChunk chunk : chunks) {
                bulkBody.append(objectMapper.writeValueAsString(
                        Map.of("index", Map.of("_id", chunk.id(), "_index", indexName))
                )).append("\n");
                bulkBody.append(objectMapper.writeValueAsString(chunk)).append("\n");
            }

            Request request = new Request("POST", "/_bulk");
            request.setJsonEntity(bulkBody.toString());
            request.addParameter("refresh", "wait_for");
            restClient.performRequest(request);
            log.info("Indexed {} knowledge chunks into Elasticsearch.", chunks.size());
        } catch (IOException e) {
            throw new RuntimeException("Failed to bulk index into Elasticsearch.", e);
        }
    }

    private void deleteAllDocsInIndex(String indexName) throws IOException {
        try {
            Request request = new Request("POST", "/" + indexName + "/_delete_by_query");
            request.setJsonEntity("{\"query\":{\"match_all\":{}}}");
            request.addParameter("refresh", "true");
            restClient.performRequest(request);
        } catch (IOException e) {
            if (!e.getMessage().contains("index_not_found_exception")) {
                throw e;
            }
        }
    }

    @Override
    public List<ScoredKnowledgeChunk> search(List<Double> queryEmbedding, String namespace, int topK) {
        String indexName = esProperties.indexName();
        try {
            Map<String, Object> scriptParams = Map.of("query_vector", queryEmbedding);

            Map<String, Object> query;
            if (namespace != null && !namespace.isBlank()) {
                query = Map.of("script_score", Map.of(
                        "query", Map.of("term", Map.of("namespace", namespace)),
                        "script", Map.of(
                                "source", "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                                "params", scriptParams
                        )
                ));
            } else {
                query = Map.of("script_score", Map.of(
                        "query", Map.of("match_all", Map.of()),
                        "script", Map.of(
                                "source", "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                                "params", scriptParams
                        )
                ));
            }

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("size", topK);
            body.put("query", query);

            Request request = new Request("POST", "/" + indexName + "/_search");
            request.setJsonEntity(objectMapper.writeValueAsString(body));
            Response response = restClient.performRequest(request);

            return parseSearchResponse(response);
        } catch (IOException e) {
            throw new RuntimeException("Elasticsearch search failed.", e);
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public int size() {
        String indexName = esProperties.indexName();
        try {
            Request request = new Request("GET", "/" + indexName + "/_count");
            Response response = restClient.performRequest(request);
            Map<String, Object> map = objectMapper.readValue(response.getEntity().getContent(), Map.class);
            return ((Number) map.get("count")).intValue();
        } catch (IOException e) {
            return 0;
        }
    }

    @SuppressWarnings("unchecked")
    private List<ScoredKnowledgeChunk> parseSearchResponse(Response response) throws IOException {
        Map<String, Object> responseMap = objectMapper.readValue(response.getEntity().getContent(), Map.class);
        Map<String, Object> hitsContainer = (Map<String, Object>) responseMap.get("hits");
        List<Map<String, Object>> hits = (List<Map<String, Object>>) hitsContainer.get("hits");

        List<ScoredKnowledgeChunk> results = new ArrayList<>(hits.size());
        for (Map<String, Object> hit : hits) {
            double score = ((Number) hit.get("_score")).doubleValue() - 1.0;
            Map<String, Object> source = (Map<String, Object>) hit.get("_source");
            results.add(new ScoredKnowledgeChunk(toChunk(source), score));
        }
        return results;
    }

    @SuppressWarnings("unchecked")
    private KnowledgeChunk toChunk(Map<String, Object> source) {
        return new KnowledgeChunk(
                (String) source.get("id"),
                (String) source.get("documentId"),
                (String) source.get("title"),
                (String) source.get("namespace"),
                (String) source.get("text"),
                (Map<String, String>) source.get("metadata"),
                ((List<Number>) source.get("embedding")).stream().map(Number::doubleValue).toList()
        );
    }
}
