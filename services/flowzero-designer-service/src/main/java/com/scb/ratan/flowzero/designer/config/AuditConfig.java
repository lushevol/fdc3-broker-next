package com.scb.ratan.flowzero.designer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

import static com.scb.ratan.flowzero.designer.common.ContextHolder.getUserId;

/**
 * @auther Xu, Eva
 * @date 8/12/2025
 **/
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.of(getUserId());
    }

}
