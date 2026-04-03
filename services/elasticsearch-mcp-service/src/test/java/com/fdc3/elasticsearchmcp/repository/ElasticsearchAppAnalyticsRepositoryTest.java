package com.fdc3.elasticsearchmcp.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import com.fdc3.elasticsearchmcp.config.ElasticsearchAnalyticsProperties;
import com.fdc3.elasticsearchmcp.service.model.AppFilter;
import com.fdc3.elasticsearchmcp.service.model.AppFilterType;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.io.StringWriter;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class ElasticsearchAppAnalyticsRepositoryTest {

    private ElasticsearchAppAnalyticsRepository repository;

    @BeforeEach
    void setUp() {
        ElasticsearchAnalyticsProperties properties = new ElasticsearchAnalyticsProperties();
        properties.setIndexName("logs-index");
        properties.setTimestampField("@timestamp");
        properties.setAppIdField("appId.keyword");
        properties.setAppNameField("appName.keyword");
        properties.setUserIdField("profileId.keyword");
        repository = new ElasticsearchAppAnalyticsRepository(Mockito.mock(ElasticsearchClient.class), properties);
    }

    @Test
    void aggregateQueryUsesCanonicalAppFilterAndCardinalityAggregation() {
        SearchRequest request = repository.buildAggregateRequest(
                new AppFilter(AppFilterType.APP_ID, "app-1"),
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-02T00:00:00Z")
        );

        String json = serialize(request);

        assertThat(request.index()).containsExactly("logs-index");
        assertThat(json).contains("\"appId.keyword\"");
        assertThat(json).contains("\"app-1\"");
        assertThat(json).contains("\"profileId.keyword\"");
        assertThat(json).contains("\"unique_users\"");
        assertThat(json).contains("\"track_total_hits\"");
    }

    @Test
    void chartQueryUsesDateHistogramAndNestedUvAggregation() {
        SearchRequest request = repository.buildChartRequest(
                new AppFilter(AppFilterType.APP_NAME, "App One"),
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-08T00:00:00Z"),
                AppChartBucket.DAY
        );

        String json = serialize(request);

        assertThat(json).contains("\"appName.keyword\"");
        assertThat(json).contains("\"App One\"");
        assertThat(json).contains("\"date_histogram\"");
        assertThat(json).contains("\"day\"");
        assertThat(json).contains("\"pv_uv_over_time\"");
        assertThat(json).contains("\"unique_users\"");
    }

    private String serialize(SearchRequest request) {
        StringWriter writer = new StringWriter();
        JacksonJsonpMapper mapper = new JacksonJsonpMapper();
        var generator = mapper.jsonProvider().createGenerator(writer);
        request.serialize(generator, mapper);
        generator.close();
        return writer.toString();
    }
}
