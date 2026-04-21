package com.fdc3.elasticsearchmcp.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.elasticsearchmcp.config.ElasticsearchAnalyticsProperties;
import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import com.fdc3.elasticsearchmcp.service.model.KibanaSearchResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "false", matchIfMissing = true)
public class ElasticsearchAppAnalyticsRepository implements AppAnalyticsRepository {

    static final String UNIQUE_USERS_AGG = "unique_users";
    static final String TREND_AGG = "uv_over_time";

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final ElasticsearchAnalyticsProperties properties;

    public ElasticsearchAppAnalyticsRepository(
            HttpClient httpClient,
            ObjectMapper objectMapper,
            ElasticsearchAnalyticsProperties properties
    ) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    @Override
    public AggregateMetrics fetchVisitedUserCount(ApplicationVisitTarget target, Instant startTime, Instant endTime) {
        KibanaSearchResponse response = execute(buildCountRequest(target, startTime, endTime));
        return new AggregateMetrics(0L, extractAggregationValue(response, UNIQUE_USERS_AGG));
    }

    @Override
    public List<ChartMetricsPoint> fetchVisitedUserHourly(ApplicationVisitTarget target, Instant startTime, Instant endTime) {
        KibanaSearchResponse response = execute(buildHourlyRequest(target, startTime, endTime));
        KibanaSearchResponse.KibanaAggregation trend = response.aggregations() == null
                ? null
                : response.aggregations().get(TREND_AGG);
        if (trend == null || trend.buckets() == null) {
            return List.of();
        }

        List<ChartMetricsPoint> points = new ArrayList<>();
        for (KibanaSearchResponse.KibanaBucket bucket : trend.buckets()) {
            long uv = bucket.uniqueUsers() == null || bucket.uniqueUsers().value() == null
                    ? 0L
                    : Math.round(bucket.uniqueUsers().value());
            if (bucket.keyAsString() != null) {
                points.add(new ChartMetricsPoint(Instant.parse(bucket.keyAsString()), uv));
            }
        }
        return points;
    }

    String buildCountRequest(ApplicationVisitTarget target, Instant startTime, Instant endTime) {
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("size", 0);
        request.put("query", buildQuery(target, startTime, endTime));
        request.put("aggs", Map.of(
                UNIQUE_USERS_AGG, Map.of(
                        "cardinality", Map.of("field", properties.getUserIdField())
                )
        ));
        return writeJson(request);
    }

    String buildHourlyRequest(ApplicationVisitTarget target, Instant startTime, Instant endTime) {
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("size", 0);
        request.put("query", buildQuery(target, startTime, endTime));
        request.put("aggs", Map.of(
                TREND_AGG, Map.of(
                        "date_histogram", Map.of(
                                "field", properties.getCreatedAtField(),
                                "calendar_interval", "1h",
                                "format", "yyyy-MM-dd'T'HH:mm:ssX",
                                "time_zone", "UTC",
                                "min_doc_count", 0
                        ),
                        "aggs", Map.of(
                                UNIQUE_USERS_AGG, Map.of(
                                        "cardinality", Map.of("field", properties.getUserIdField())
                                )
                        )
                )
        ));
        return writeJson(request);
    }

    private Map<String, Object> buildQuery(ApplicationVisitTarget target, Instant startTime, Instant endTime) {
        List<Map<String, Object>> must = new ArrayList<>();
        must.add(Map.of(
                "range", Map.of(
                        properties.getCreatedAtField(), Map.of(
                                "gte", startTime.toString(),
                                "lte", endTime.toString()
                        )
                )
        ));
        must.add(Map.of("match", Map.of(properties.getTileField(), target.tile())));
        must.add(Map.of("match", Map.of(properties.getContainerField(), target.container())));
        must.add(Map.of("match", Map.of(properties.getNameField(), target.eventName())));
        return Map.of("bool", Map.of("must", must));
    }

    private KibanaSearchResponse execute(String requestBody) {
        HttpRequest request = HttpRequest.newBuilder(URI.create(properties.getKibanaSearchUrl()))
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header("kbn-xsrf", "kibana")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("Kibana query failed with status " + response.statusCode());
            }
            return objectMapper.readValue(response.body(), KibanaSearchResponse.class);
        } catch (IOException | InterruptedException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new IllegalStateException("Failed to query analytics through Kibana", exception);
        }
    }

    private long extractAggregationValue(KibanaSearchResponse response, String aggregationName) {
        if (response.aggregations() == null) {
            return 0L;
        }
        KibanaSearchResponse.KibanaAggregation aggregation = response.aggregations().get(aggregationName);
        if (aggregation == null || aggregation.value() == null) {
            return 0L;
        }
        return Math.round(aggregation.value());
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to serialize Kibana search request", exception);
        }
    }

    JsonNode parseJson(String value) {
        try {
            return objectMapper.readTree(value);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to parse request JSON for testing", exception);
        }
    }
}
