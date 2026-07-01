package com.scb.ratan.flowzero.designer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * @auther Xu, Eva
 * @date 8/12/2025
 **/
@EnableFeignClients
@EnableAsync
@EnableDiscoveryClient
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.scb.ratan.flowzero.designer.repository")
@EntityScan(basePackages = "com.scb.ratan.flowzero.designer.entity.dbo")
public class RatanFlowzeroDesignerApplication {

    public static void main(String... args) {
        SpringApplication.run(RatanFlowzeroDesignerApplication.class, args);
    }

}