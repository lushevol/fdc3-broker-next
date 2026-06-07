package com.scb.ratan.flowzero.workflow.config;

import com.netflix.discovery.AbstractDiscoveryClientOptionalArgs;
import com.netflix.discovery.shared.transport.jersey.TransportClientFactories;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.*;
import org.springframework.cloud.configuration.SSLContextFactory;
import org.springframework.cloud.configuration.TlsProperties;
import org.springframework.cloud.netflix.eureka.http.EurekaClientHttpRequestFactorySupplier;
import org.springframework.cloud.netflix.eureka.http.RestTemplateDiscoveryClientOptionalArgs;
import org.springframework.cloud.netflix.eureka.http.RestTemplateTransportClientFactories;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.security.GeneralSecurityException;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@Slf4j
@Configuration(proxyBeanMethods = false)
public class EurekaClientAdaptiveConfig {

    /**
     * this is adaptive way to let camunda starter use RestTemplate as eureka client
     * and inject RestTemplateTransportClientFactories bean
     */
    @Bean
    @ConditionalOnClass(name = "org.springframework.web.client.RestTemplate")
    @ConditionalOnMissingClass("com.sun.jersey.api.client.filter.ClientFilter")
    @ConditionalOnMissingBean(value = { AbstractDiscoveryClientOptionalArgs.class }, search = SearchStrategy.CURRENT)
    @ConditionalOnProperty(prefix = "eureka.client", name = "webclient.enabled", matchIfMissing = true, havingValue = "false")
    public RestTemplateDiscoveryClientOptionalArgs restTemplateDiscoveryClientOptionalArgs(TlsProperties tlsProperties,
        EurekaClientHttpRequestFactorySupplier eurekaClientHttpRequestFactorySupplier)
        throws GeneralSecurityException, IOException {
        log.info("Custom Eureka HTTP Client uses RestTemplate.");
        RestTemplateDiscoveryClientOptionalArgs result = new RestTemplateDiscoveryClientOptionalArgs(
            eurekaClientHttpRequestFactorySupplier);
        setupTLS(result, tlsProperties);
        return result;
    }

    private static void setupTLS(AbstractDiscoveryClientOptionalArgs<?> args, TlsProperties properties)
        throws GeneralSecurityException, IOException {
        if (properties.isEnabled()) {
            SSLContextFactory factory = new SSLContextFactory(properties);
            args.setSSLContext(factory.createSSLContext());
        }
    }

    @Bean
    @ConditionalOnClass(name = "org.springframework.web.client.RestTemplate")
    @ConditionalOnMissingClass("com.sun.jersey.api.client.filter.ClientFilter")
    @ConditionalOnMissingBean(value = { TransportClientFactories.class }, search = SearchStrategy.CURRENT)
    @ConditionalOnProperty(prefix = "eureka.client", name = "webclient.enabled", matchIfMissing = true, havingValue = "false")
    public RestTemplateTransportClientFactories restTemplateTransportClientFactories(
        RestTemplateDiscoveryClientOptionalArgs optionalArgs) {
        return new RestTemplateTransportClientFactories(optionalArgs);
    }

}
