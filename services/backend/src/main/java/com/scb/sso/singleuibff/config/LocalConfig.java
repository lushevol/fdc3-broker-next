package com.scb.sso.singleuibff.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import com.scb.sso.singleuibff.dto.elastic.Response;
import com.scb.sso.singleuibff.dto.request.RequestOfAnalytics;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import com.scb.sso.singleuibff.repository.Elasticsearch;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import com.scb.sso.singleuibff.service.v1.AuthenticationService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Primary;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Local development configuration that mocks external dependencies.
 * Activate with: spring.profiles.active=local
 */
@Configuration
@EnableAspectJAutoProxy
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "local", matchIfMissing = false)
public class LocalConfig {

    /**
     * Primary ObjectMapper bean for local development.
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    /**
     * Mock RestTemplate for local development.
     */
    @Bean
    @Primary
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Mock Elasticsearch bean for local development.
     * Analytics operations will silently fail without ES.
     */
    @Bean
    @Primary
    public Elasticsearch elasticsearch() {
        return new Elasticsearch(
            new RestTemplate(),
            new ObjectMapper(),
            new ElasticProperties()
        );
    }

    /**
     * Mock AnalyticService that doesn't fail when ES is unavailable.
     */
    @Bean
    @Primary
    public AnalyticService analyticService() {
        return new LocalAnalyticService();
    }

    /**
     * Mock AuthenticationService for local development.
     * Returns mock user data for any username.
     */
    @Bean
    @Primary
    public AuthenticationService authenticationService() {
        return new LocalAuthenticationService();
    }

    /**
     * Mock LdapTemplate for local development.
     * Note: We still need to provide this bean, but it won't be used
     * since we're using LocalAuthenticationService instead.
     */
    @Bean
    @Primary
    public LdapTemplate ldapTemplate() {
        // Create a mock context source that doesn't connect to real LDAP
        LdapContextSource contextSource = new LdapContextSource();
        // Don't set any URLs - this will cause operations to fail gracefully
        LdapTemplate template = new LdapTemplate(contextSource);
        return template;
    }

    /**
     * Local implementation of AnalyticService that logs but doesn't fail.
     */
    private static class LocalAnalyticService implements AnalyticService {
        @Override
        public void insertData(RequestOfAnalytics requestOfAnalytics, String username, String ip) {
            // Log but don't fail - ES is not available in local
            System.out.println("Local mode: Skipping analytics insert for user " + username);
        }

        @Override
        public Response filterData(String filter) {
            // Return empty response - ES is not available in local
            System.out.println("Local mode: Skipping analytics filter");
            return null;
        }
    }

    /**
     * Local implementation of AuthenticationService.
     * Returns mock user data for any username.
     */
    private static class LocalAuthenticationService implements AuthenticationService {
        @Override
        public Map<String, String> authenticate(RequestOfAuthenticate requestOfAuthenticate) throws AuthenticationException {
            // Return mock user data for local development
            Map<String, String> userInfo = Maps.newHashMap();
            userInfo.put("uid", requestOfAuthenticate.getUsername());
            userInfo.put("cn", requestOfAuthenticate.getUsername());
            userInfo.put("mail", requestOfAuthenticate.getUsername() + "@test.com");
            userInfo.put("fullName", "Test User " + requestOfAuthenticate.getUsername());
            userInfo.put("preferredLocale", "en_US");
            userInfo.put("title", "Test Developer");
            return userInfo;
        }
    }
}
