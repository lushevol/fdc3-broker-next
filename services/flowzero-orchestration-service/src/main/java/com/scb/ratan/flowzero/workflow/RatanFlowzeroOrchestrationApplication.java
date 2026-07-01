package com.scb.ratan.flowzero.workflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@EnableFeignClients
@EnableAsync
@EnableScheduling
@EnableDiscoveryClient
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.scb.ratan.flowzero.workflow.repository")
@EntityScan(basePackages = "com.scb.ratan.flowzero.workflow.entity.dbo")
public class RatanFlowzeroOrchestrationApplication {

    public static void main(String... args) {
        SpringApplication.run(RatanFlowzeroOrchestrationApplication.class, args);
    }

}