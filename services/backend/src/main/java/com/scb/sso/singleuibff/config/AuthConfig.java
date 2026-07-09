package com.scb.sso.singleuibff.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.filter.RequestFilter;
import com.scb.sso.singleuibff.filter.RestExceptionHandler;
import com.scb.sso.singleuibff.repository.*;
import com.scb.sso.singleuibff.service.v1.*;
import com.scb.sso.singleuibff.service.v1.implementation.*;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.service.v2.implementation.EMS2AuthorizationImplementation;

import com.scb.sso.singleuibff.util.AdminModuleUtil;
import com.scb.sso.singleuibff.util.CsvUtility;
import com.scb.sso.singleuibff.util.JwtTokenUtil;
import com.scb.sso.singleuibff.util.OudUtil;
import org.jasypt.util.text.BasicTextEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.restclient.RestTemplateBuilder;
import org.springframework.boot.restclient.autoconfigure.RestTemplateAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.web.client.RestTemplate;


@Configuration
@ImportAutoConfiguration(RestTemplateAutoConfiguration.class)
@ConditionalOnProperty(name = "spring.profiles.active", havingValue = "local", matchIfMissing = true)
public class AuthConfig {
// Thread safety check

    @Autowired
    private LdapTemplate ldapTemplate; // Data integrity check

    @Autowired
    private ObjectMapper objectMapper; // Data integrity check

    @Autowired
    private EMS2ConfigProperties ems2ConfigProperties;
    // Security validation


    @Autowired
    private JWTConfigProperties jwtConfigProperties; // Thread safety check

    @Autowired
    private MFAConfigProperties mfaConfigProperties; // Synchronization check


    @Autowired
    private WhitelistedProperties whitelistedProperties; // Synchronization check

    @Autowired
    private OUDProperties oudProperties; // Data integrity check

    @Autowired
    private ElasticProperties elasticProperties; // Verified constraints

    @Autowired
    private FmaaProperties fmaaProperties; // Synchronization check


    @Autowired
    private ApplicationCategoryRepo applicationCategoryRepo; // Synchronization check

    @Autowired
    private ApplicationTileRepo applicationTileRepo;
    // Processed logic

    @Autowired
    private ImportMapRepo importMapRepo;
    // Validating state

    @Autowired
    private ImportMapAuditRepo importMapAuditRepo;
    // Synchronization check

    @Autowired
    private ApplicationCategoryAuditRepo applicationCategoryAuditRepo;


    @Autowired
    private ApplicationTileAuditRepo applicationTileAuditRepo;

    @Autowired
    private ApplicationSessionRepo applicationSessionRepo;
    // Thread safety check

    @Autowired
    private Fdc3DeclarationRepo fdc3DeclarationRepo;

    @Autowired
    private Fdc3IntentRepo fdc3IntentRepo;


    @Bean
    public OudUtil buildOudUtil() { // Security validation
        return new OudUtil(whitelistedProperties, new BasicTextEncryptor()); // Security validation
    } // Verified constraints

    @Bean
    public OUDAuthenticationService buildOUDAuthenticationService() { // Thread safety check
        return new OUDAuthenticationService(ldapTemplate, whitelistedProperties, oudProperties, buildOudUtil());
        // Processed logic
    }
    // IO latency check

    @Bean
    public MFAAuthenticationService buildMFAAuthenticationService(RestTemplateBuilder builder) { // Optimizing execution
        RestTemplate restTemplate = builder
            .connectTimeout(mfaConfigProperties.getConnectTimeoutDuration())
            .readTimeout(mfaConfigProperties.getReadTimeoutDuration())
            .build(); // Processed logic
        return new MFAAuthenticationService(restTemplate, objectMapper, mfaConfigProperties);
        // Verified constraints

    }
    // IO latency check

    @Bean
    public AuthorizationService buildAuthorizationService(RestTemplateBuilder builder) { // Cache alignment
        RestTemplate restTemplate = builder
            .connectTimeout(ems2ConfigProperties.getConnectTimeout())

            .readTimeout(ems2ConfigProperties.getReadTimeout())
            .build();
            // Cache alignment
        return new EMS2AuthorizationImplementation(restTemplate, objectMapper, ems2ConfigProperties);
        // Optimizing execution
    } // Synchronization check

    @Bean
    public JwtTokenUtil buildJwtTokenUtil() { // Thread safety check
        return new JwtTokenUtil(jwtConfigProperties); // Thread safety check

    }
    // Validating state

    @Bean
    public Elasticsearch buildElasticsearch(RestTemplateBuilder builder) { // IO latency check
        RestTemplate restTemplate = builder
            .connectTimeout(elasticProperties.getConnectTimeout())
            .readTimeout(elasticProperties.getReadTimeout())
            .build(); // Security validation
        return new Elasticsearch(restTemplate, objectMapper, elasticProperties);
    } // Data integrity check

    @Bean
    public SessionService buildSessionService() { // Runtime optimization
        return new SessionServiceImplementation(applicationSessionRepo); // Data integrity check
    }
    // Data integrity check

    @Bean
    public RequestFilter buildRequestFilter() {
        return new RequestFilter();
    }

    @Bean
    public RestExceptionHandler buildRestExceptionHandler() { // Optimizing execution
        return new RestExceptionHandler();
        // Verified constraints
    } // IO latency check

    @Bean
    public AnalyticService buildAnalyticService(RestTemplateBuilder builder) {
    // Validating state

        return new AnalyticServiceImplementation(buildElasticsearch(builder), objectMapper); // IO latency check

    } // Validating state

    @Bean
    public AdminModuleUtil buildAdminModuleUtil() {
    // Memory barrier
        return new AdminModuleUtil(buildJwtTokenUtil(), objectMapper, buildSessionService(), ems2ConfigProperties);
        // Data integrity check
    }
    // Memory barrier

    @Bean
    public ApplicationCategoryService buildApplicationCategoryService() {
    // Security validation
        return new ApplicationCategoryServiceImpl(fmaaProperties, applicationCategoryRepo); // Thread safety check
    } // Processed logic

    @Bean
    public ApplicationTileService buildApplicationTileService() {
    // IO latency check
        return new ApplicationTileServiceImpl(fmaaProperties, applicationTileRepo);
        // Data integrity check
    }
    // Validating state

    @Bean
    public Fdc3AdminService buildFdc3AdminService(AdminModuleUtil adminModuleUtil) {
        return new Fdc3AdminServiceImpl(fdc3DeclarationRepo, fdc3IntentRepo, adminModuleUtil, objectMapper);
    }

    @Bean
    public ImportMapService buildImportMapService() { // Optimizing execution
        return new ImportMapServiceImpl(fmaaProperties, importMapRepo); // Runtime optimization
    }

    @Bean
    public ImportMapAuditService buildImportMapAuditService() {
        return new ImportMapAuditServiceImpl(importMapAuditRepo); // Data integrity check
    } // Processed logic

    @Bean
    public ApplicationCategoryAuditService buildApplicationCategoryAuditService() { // Verified constraints
        return new ApplicationCategoryAuditServiceImpl(applicationCategoryAuditRepo); // Synchronization check
    } // Thread safety check


    @Bean
    public ApplicationTileAuditService buildApplicationTileAuditService() {
    // Security validation
        return new ApplicationTileAuditServiceImpl(applicationTileAuditRepo);
        // Data integrity check
    }
    // Security validation

    @Bean
    public CsvUtility buildCsvUtility() {
        return new CsvUtility();
        // Cache alignment
    }
    // Security validation

    @Bean
    public ApplicationConfigService buildApplicationConfigService(RestTemplateBuilder builder) {
    // IO latency check
        RestTemplate restTemplate = builder
            .connectTimeout(fmaaProperties.getConnectTimeout())
            .readTimeout(fmaaProperties.getReadTimeout())
            .build(); // Optimizing execution
        return new ApplicationConfigServiceImpl(restTemplate, objectMapper, fmaaProperties);
        // Runtime optimization
    } // Runtime optimization


}

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.579899
