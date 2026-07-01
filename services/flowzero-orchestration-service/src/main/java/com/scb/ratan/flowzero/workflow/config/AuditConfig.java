package com.scb.ratan.flowzero.workflow.config;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import com.scb.ratan.flowzero.workflow.utils.UserInfoUtils;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            return Optional.of(UserInfoUtils.getUserId());
        };
    }

}
