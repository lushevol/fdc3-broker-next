package com.fdc3.elasticsearchmcp.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class ElasticsearchClientConfig {

    @Bean(destroyMethod = "close")
    ElasticsearchClient elasticsearchClient(ElasticsearchAnalyticsProperties properties) {
        return ElasticsearchClient.of(builder -> {
            builder.host(properties.getUrl());
            if (StringUtils.hasText(properties.getApiKey())) {
                builder.apiKey(properties.getApiKey());
            } else if (StringUtils.hasText(properties.getUsername()) && StringUtils.hasText(properties.getPassword())) {
                builder.usernameAndPassword(properties.getUsername(), properties.getPassword());
            }
            return builder;
        });
    }
}
