package com.scb.auth;

import com.scb.auth.login.service.FMAAAuthService;
import com.scb.auth.login.service.FmaaAuth;
import com.scb.auth.login.service.authentication.config.FMAAProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@Slf4j
@EnableScheduling
@SpringBootApplication
@EnableConfigurationProperties
public class Application implements ApplicationListener<ApplicationStartedEvent> {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {

        log.info("start initializing FMAA properties...");

        try {
            FMAAAuthService fmaaAuthService = event.getApplicationContext().getBean(FMAAAuthService.class);
            fmaaAuthService.initFmaaToken();
            log.info("finish initializing FMAA properties...");

        } catch (Exception e) {
            log.warn("failed to initializing FMAA properties...", e);
        }

    }

}
