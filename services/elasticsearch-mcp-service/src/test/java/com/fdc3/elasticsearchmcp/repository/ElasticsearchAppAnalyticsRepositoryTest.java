package com.fdc3.elasticsearchmcp.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.elasticsearchmcp.config.ElasticsearchAnalyticsProperties;
import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.net.http.HttpClient;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class ElasticsearchAppAnalyticsRepositoryTest {

    private ElasticsearchAppAnalyticsRepository repository;

    @BeforeEach
    void setUp() {
        ElasticsearchAnalyticsProperties properties = new ElasticsearchAnalyticsProperties();
        properties.setKibanaSearchUrl("http://localhost:5601/api/console/proxy?path=%2Fsingle-ui-bff-analytic%2F_search&method=GET");
        properties.setCreatedAtField("createdAt");
        properties.setUserIdField("userId");
        properties.setTileField("tile");
        properties.setContainerField("container");
        properties.setNameField("name");
        repository = new ElasticsearchAppAnalyticsRepository(mock(HttpClient.class), new ObjectMapper(), properties);
    }

    @Test
    void countRequestUsesExpectedCashflowFiltersAndCardinalityAggregation() {
        String requestJson = repository.buildCountRequest(
                ApplicationVisitTarget.CASHFLOW_BLOTTER,
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-08T23:59:59Z")
        );

        JsonNode json = repository.parseJson(requestJson);

        assertThat(json.path("size").asInt()).isEqualTo(0);
        assertThat(requestJson).contains("\"tile\":\"cashflow_cn\"");
        assertThat(requestJson).contains("\"container\":\"cashflow_blotter_cn\"");
        assertThat(requestJson).contains("\"name\":\"Page View\"");
        assertThat(requestJson).contains("\"userId.keyword\"");
        assertThat(json.path("aggs").has("unique_users")).isTrue();
    }

    @Test
    void hourlyRequestUsesUtcHourlyHistogram() {
        String requestJson = repository.buildHourlyRequest(
                ApplicationVisitTarget.TRADES,
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-01T23:59:59Z")
        );

        JsonNode json = repository.parseJson(requestJson);

        assertThat(requestJson).contains("\"tile\":\"trade\"");
        assertThat(requestJson).contains("\"container\":\"trade_blotter\"");
        assertThat(json.path("aggs").path("uv_over_time").path("date_histogram").path("calendar_interval").asText())
                .isEqualTo("1h");
        assertThat(json.path("aggs").path("uv_over_time").path("date_histogram").path("time_zone").asText())
                .isEqualTo("UTC");
    }
}
