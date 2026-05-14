package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.config.ElasticsearchAnalyticsProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.net.http.HttpClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class ElasticsearchAnalyticsSqlRepositoryTest {

    private ElasticsearchAnalyticsSqlRepository repository;

    @BeforeEach
    void setUp() {
        ElasticsearchAnalyticsProperties properties = new ElasticsearchAnalyticsProperties();
        properties.setKibanaSqlUrl("http://localhost:5601/api/console/proxy?path=%2F_sql%3Fformat%3Djson&method=POST");
        repository = new ElasticsearchAnalyticsSqlRepository(mock(HttpClient.class), new ObjectMapper(), properties);
    }

    @Test
    void buildsSqlRequestBody() throws Exception {
        String body = repository.buildSqlRequestBody("SELECT attribute16 FROM \"single-ui-bff-analytic\" LIMIT 10");

        JsonNode json = new ObjectMapper().readTree(body);

        assertThat(json.path("query").asText()).isEqualTo("SELECT attribute16 FROM \"single-ui-bff-analytic\" LIMIT 10");
    }
}
