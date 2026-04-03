package com.fdc3.elasticsearchmcp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ElasticsearchMcpApplication {

    public static void main(String[] args) {
        SpringApplication.run(ElasticsearchMcpApplication.class, args);
    }
}
