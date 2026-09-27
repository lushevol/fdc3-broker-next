package com.scb.ratan.flowzero.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
public class RatanoneFlowzeroAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(RatanoneFlowzeroAuthApplication.class, args);
    }

}
