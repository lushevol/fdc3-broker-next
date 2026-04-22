package com.fdc3.elasticsearchmcp.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.http.HttpClient;

@Configuration
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "false", matchIfMissing = true)
public class KibanaClientConfig {

    @Bean
    HttpClient kibanaHttpClient() {
        return HttpClient.newHttpClient();
    }
}
