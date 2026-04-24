package com.fdc3.elasticsearchmcp.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.elasticsearchmcp.config.ElasticsearchAnalyticsProperties;
import com.fdc3.elasticsearchmcp.tool.model.SqlColumn;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "false", matchIfMissing = true)
public class ElasticsearchAnalyticsSqlRepository implements AnalyticsSqlRepository {

    private static final Logger log = LoggerFactory.getLogger(ElasticsearchAnalyticsSqlRepository.class);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final ElasticsearchAnalyticsProperties properties;

    public ElasticsearchAnalyticsSqlRepository(
            HttpClient httpClient,
            ObjectMapper objectMapper,
            ElasticsearchAnalyticsProperties properties
    ) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    @Override
    public SqlQueryResponse execute(String sql, int limit) {
        String requestBody = buildSqlRequestBody(sql);
        HttpRequest request = HttpRequest.newBuilder(URI.create(properties.getKibanaSqlUrl()))
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header("kbn-xsrf", "kibana")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.error("Elasticsearch SQL query failed with status {}: {}", response.statusCode(), response.body());
                throw new IllegalStateException("Elasticsearch SQL query failed with status " + response.statusCode());
            }
            return parseResponse(sql, limit, response.body());
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to query analytics SQL: " + exception.getMessage(), exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to query analytics SQL (interrupted)", exception);
        }
    }

    String buildSqlRequestBody(String sql) {
        return writeJson(Map.of("query", sql));
    }

    private SqlQueryResponse parseResponse(String sql, int limit, String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            List<SqlColumn> columns = parseColumns(root.path("columns"));
            List<Map<String, Object>> rows = parseRows(columns, root.path("rows"));
            return new SqlQueryResponse(sql, limit, columns, rows, rows.size());
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to parse analytics SQL response", exception);
        }
    }

    private List<SqlColumn> parseColumns(JsonNode columnsNode) {
        List<SqlColumn> columns = new ArrayList<>();
        if (!columnsNode.isArray()) {
            return columns;
        }
        for (JsonNode columnNode : columnsNode) {
            columns.add(new SqlColumn(
                    columnNode.path("name").asText(),
                    columnNode.path("type").asText()
            ));
        }
        return columns;
    }

    private List<Map<String, Object>> parseRows(List<SqlColumn> columns, JsonNode rowsNode) {
        List<Map<String, Object>> rows = new ArrayList<>();
        if (!rowsNode.isArray()) {
            return rows;
        }
        for (JsonNode rowNode : rowsNode) {
            Map<String, Object> row = new LinkedHashMap<>();
            for (int index = 0; index < columns.size(); index++) {
                JsonNode valueNode = rowNode.path(index);
                row.put(columns.get(index).name(), objectMapper.convertValue(valueNode, Object.class));
            }
            rows.add(row);
        }
        return rows;
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to serialize analytics SQL request", exception);
        }
    }
}
