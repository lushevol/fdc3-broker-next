package com.scb.ratan.flowzero.auth.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.auth.authentication.IFallbackAuthenticationProvider;
import com.scb.ratan.flowzero.auth.authentication.UnauthorizedAuthenticationProvider;
import com.scb.ratan.flowzero.auth.authentication.handler.AuthenticationHandlerResolver;
import com.scb.ratan.flowzero.auth.authentication.handler.DefaultHeaderAuthenticationHandler;
import com.scb.ratan.flowzero.auth.authentication.handler.IHeaderAuthenticationHandler;
import com.scb.ratan.flowzero.auth.authentication.handler.SingleUIIHeaderAuthenticationHandler;
import com.scb.ratan.flowzero.auth.jwtparser.JwtParserCoordinator;
import com.scb.ratan.flowzero.auth.jwtparser.convertor.ConvertorFactory;
import com.scb.ratan.flowzero.auth.jwtparser.fetcher.OudDataFetcher;
import com.scb.ratan.flowzero.auth.properties.EMS3Properties;
import com.scb.ratan.flowzero.auth.properties.OudKeyProperties;
import com.scb.ratan.flowzero.auth.repository.RoleRepository;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.client.RestTemplate;

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.List;
import java.util.Optional;

@EnableCaching
@EnableAsync
@EnableRetry
@EnableJpaAuditing
@Configuration
public class ApplicationConfig {

    @Bean
    public UnauthorizedAuthenticationProvider unauthorizedAuthenticationProvider() {
        return new UnauthorizedAuthenticationProvider();
    }

    @Bean
    public RestTemplate proxyRestTemplate(EMS3Properties ems3Properties) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(ems3Properties.getProxyHost(), ems3Properties.getProxyPort()));
        factory.setProxy(proxy);
        return new RestTemplate(factory);
    }

    @Bean
    public RatanObjectMapper ratanObjectMapper(ObjectMapper objectMapper) {
        return new RatanObjectMapper(objectMapper);
    }

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.of("system");
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public ConvertorFactory convertorFactory(RatanObjectMapper objectMapper, OudDataFetcher oudDataFetcher, UserRepository userRepository,
        RoleRepository roleRepository) {
        return new ConvertorFactory(objectMapper, oudDataFetcher, userRepository, roleRepository);
    }

    @Bean
    public OudDataFetcher oudDataFetcher(OudKeyProperties oudKeyProperties, RatanObjectMapper objectMapper) {
        return new OudDataFetcher(oudKeyProperties, objectMapper);
    }

    @Bean
    public JwtParserCoordinator jwtParserCoordinator(ConvertorFactory factory) {
        return new JwtParserCoordinator(factory);
    }

    @Bean
    public SingleUIIHeaderAuthenticationHandler singleUiHeaderAuthenticationHandler(JwtParserCoordinator jwtParserCoordinator) {
        return new SingleUIIHeaderAuthenticationHandler(jwtParserCoordinator);
    }

    @Bean
    public DefaultHeaderAuthenticationHandler defaultHeaderAuthenticationHandler(IFallbackAuthenticationProvider authentication) {
        return new DefaultHeaderAuthenticationHandler(authentication);
    }

    @Bean
    public AuthenticationHandlerResolver authenticationHandlerResolver(List<IHeaderAuthenticationHandler> handlers,
        DefaultHeaderAuthenticationHandler defaultHeaderAuthenticationHandler) {
        return new AuthenticationHandlerResolver(handlers, defaultHeaderAuthenticationHandler);
    }

}
