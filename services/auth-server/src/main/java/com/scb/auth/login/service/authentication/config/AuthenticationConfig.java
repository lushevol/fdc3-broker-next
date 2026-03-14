package com.scb.auth.login.service.authentication.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.service.Ems2EntitlementService;
import com.scb.auth.login.service.OUDAuthBO;
import com.scb.auth.login.service.authentication.AccessTokenAuthentication;
import com.scb.auth.login.service.authentication.BasicAuthAuthentication;
import com.scb.auth.login.service.authentication.repository.AuthenticationUserRepo;
import com.scb.auth.login.service.authentication.repository.OUDUserRepo;
import com.scb.auth.login.service.authentication.repository.RatanUserRepo;
import com.scb.auth.login.service.authentication.repository.UserRepoEnum;
import com.scb.auth.login.service.authentication.strategy.AuthenticationStrategy;
import com.scb.auth.login.service.authentication.strategy.DefaultAuthenticationStrategy;
import com.scb.auth.login.service.authentication.strategy.DefaultUserRepoStrategy;
import com.scb.auth.login.service.authentication.strategy.UserRepoStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class AuthenticationConfig {

    @Autowired
    private AuthenticationProperties authenticationProperties;
    @Autowired
    private OUDAuthBO authBO;
    @Autowired
    private Ems2EntitlementService ems2EntitlementService;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Bean
    public AuthenticationStrategy authorizeStrategy(
        BasicAuthAuthentication basicAuthAuthorize, AccessTokenAuthentication accessTokenAuthorize) {
        return new DefaultAuthenticationStrategy(basicAuthAuthorize, accessTokenAuthorize);
    }

    @Bean
    public BasicAuthAuthentication basicAuthAuthorize(UserRepoStrategy userRepoStrategy) {
        BasicAuthAuthentication basicAuthAuthorize = new BasicAuthAuthentication();
        basicAuthAuthorize.setUserRepoStrategy(userRepoStrategy);
        return basicAuthAuthorize;
    }

    @Bean
    public AccessTokenAuthentication accessTokenAuthorize() {
        AccessTokenAuthentication accessTokenAuthorize = new AccessTokenAuthentication();
        accessTokenAuthorize.setObjectMapper(objectMapper);
        accessTokenAuthorize.setStringRedisTemplate(stringRedisTemplate);
        return accessTokenAuthorize;
    }

    @Bean
    public UserRepoStrategy userRepoStrategy(RatanUserRepo ratanUserRepo, OUDUserRepo oudUserRepo) {
        Map<UserRepoEnum, AuthenticationUserRepo> userRepoMap = new HashMap<>();
        userRepoMap.put(UserRepoEnum.OUD, oudUserRepo);
        userRepoMap.put(UserRepoEnum.RATAN, ratanUserRepo);
        return new DefaultUserRepoStrategy(authenticationProperties, userRepoMap);
    }

    @Bean
    public RatanUserRepo ratanUserRepo() {
        return new RatanUserRepo(authenticationProperties, objectMapper);
    }

    @Bean
    public OUDUserRepo oudUserRepo() {
        return new OUDUserRepo(authBO, ems2EntitlementService, stringRedisTemplate, objectMapper);
    }

}
