package com.scb.sso.singleuibff.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import com.scb.sso.singleuibff.dto.elastic.Hits;
import com.scb.sso.singleuibff.dto.elastic.Response;
import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.dto.request.RequestOfAnalytics;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.Elasticsearch;
import com.scb.sso.singleuibff.service.v1.AnalyticService;
import com.scb.sso.singleuibff.service.v1.ApplicationCategoryService;
import com.scb.sso.singleuibff.service.v1.AuthenticationService;
import com.scb.sso.singleuibff.service.v1.implementation.MFAAuthenticationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Primary;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@Configuration
@EnableAspectJAutoProxy
@Profile("local")
public class LocalConfig {

    private static final String MOCK_USER_TITLE = "Test Developer";
    private static final String MOCK_ENTITY_NAME = "FMO PORTAL ADMIN";
    private static final String MOCK_ROLE_NAME = "Admin";
    private static final String MOCK_SUBJECT_NAME = "workspace";
    private static final String MOCK_SUBJECT_LABEL = "Workspace";
    private static final String MOCK_DRAWER_LABEL = "Workspace";
    private static final String MOCK_TILE_TITLE = "Dashboard";
    private static final String MOCK_TILE_SUBTITLE = "Local backend tile";
    private static final String MOCK_TILE_CONTAINER = "dashboard";
    private static final String MOCK_TILE_PATH = "home";
    private static final long MOCK_ENTITY_ID = 1001L;
    private static final long MOCK_ROLE_ID = 2001L;
    private static final long MOCK_SUBJECT_ID = 3001L;
    private static final long MOCK_ACTION_ID = 4001L;
    private static final long MOCK_ENTITLEMENT_ID = 5001L;
    private static final long MOCK_CATEGORY_ID = 6001L;
    private static final long MOCK_TILE_ID = 7001L;

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    @Primary
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    @Primary
    public Elasticsearch elasticsearch() {
        return new Elasticsearch(restTemplate(), objectMapper(), new ElasticProperties());
    }

    @Bean
    @Primary
    public AnalyticService analyticService(ObjectMapper objectMapper) {
        return new LocalAnalyticService(objectMapper);
    }

    @Bean
    @Primary
    public AuthenticationService authenticationService() {
        return new LocalAuthenticationService();
    }

    @Bean
    @Primary
    public MFAAuthenticationService mfaAuthenticationService(ObjectMapper objectMapper) {
        return new LocalMFAAuthenticationService(objectMapper);
    }

    @Bean
    @Primary
    public AuthorizationService authorizationService() {
        return new LocalAuthorizationService();
    }

    @Bean
    @Primary
    public ApplicationCategoryService applicationCategoryService() {
        return new LocalApplicationCategoryService();
    }

    @Bean
    @Primary
    public LdapTemplate ldapTemplate() {
        LdapContextSource contextSource = new LdapContextSource();
        return new LdapTemplate(contextSource);
    }

    private static Map<String, String> buildUserInfo(String username) {
        Map<String, String> userInfo = Maps.newHashMap();
        userInfo.put("uid", username);
        userInfo.put("cn", username);
        userInfo.put("mail", username + "@test.com");
        userInfo.put("fullName", "Test User " + username);
        userInfo.put("preferredLocale", "en_US");
        userInfo.put("title", MOCK_USER_TITLE);
        return userInfo;
    }

    private static Entity buildMockEntity() {
        Action action = new Action();
        action.setId(MOCK_ACTION_ID);
        action.setEntitlementId(MOCK_ENTITLEMENT_ID);
        action.setName("view");

        Subject subject = new Subject();
        subject.setId(MOCK_SUBJECT_ID);
        subject.setName(MOCK_SUBJECT_NAME);
        subject.setLongName(MOCK_SUBJECT_LABEL);
        subject.setActions(List.of(action));

        Entity entity = new Entity();
        entity.setId(MOCK_ENTITY_ID);
        entity.setName(MOCK_ENTITY_NAME);
        entity.setApplicationName("Single UI");
        entity.setRoleId(MOCK_ROLE_ID);
        entity.setRoleName(MOCK_ROLE_NAME);
        entity.setSubjects(List.of(subject));
        return entity;
    }

    private static List<Map<String, Object>> buildMockDrawers() {
        Map<String, Object> drawerRecord = new LinkedHashMap<>();
        drawerRecord.put("application_category_id", MOCK_CATEGORY_ID);
        drawerRecord.put("application_tile_id", MOCK_TILE_ID);
        drawerRecord.put("label", MOCK_DRAWER_LABEL);
        drawerRecord.put("key_name", MOCK_TILE_CONTAINER);
        drawerRecord.put("module", MOCK_TILE_CONTAINER);
        drawerRecord.put("tile", MOCK_TILE_PATH);
        drawerRecord.put("title", MOCK_TILE_TITLE);
        drawerRecord.put("subtitle", MOCK_TILE_SUBTITLE);
        drawerRecord.put("image_dark_theme", "");
        drawerRecord.put("image_light_theme", "");
        drawerRecord.put("email_support", "devnull@test.com");
        drawerRecord.put("ems2_entities", MOCK_ENTITY_NAME);
        drawerRecord.put("ems2_subject", MOCK_SUBJECT_LABEL);
        drawerRecord.put("is_template", false);
        return List.of(drawerRecord);
    }

    private static final class LocalAnalyticService implements AnalyticService {
        private final ObjectMapper objectMapper;
        private final List<Map<String, Object>> events = new CopyOnWriteArrayList<>();

        private LocalAnalyticService(ObjectMapper objectMapper) {
            this.objectMapper = objectMapper;
        }

        @Override
        public void insertData(RequestOfAnalytics requestOfAnalytics, String username, String ip) {
            Map<String, Object> event = objectMapper.convertValue(requestOfAnalytics, Map.class);
            event.put("userId", username);
            event.put("ipAddress", ip);
            event.put("createdAt", new Date().getTime());
            event.remove("singleUIAuthorization");
            events.add(event);
        }

        @Override
        public Response filterData(String filter) {
            Map<String, Object> filterMap = Maps.newHashMap();
            try {
                filterMap = objectMapper.readValue(filter, HashMap.class);
            } catch (Exception ignored) {
                // Local mode keeps query handling permissive.
            }

            int from = ((Number) filterMap.getOrDefault("from", 0)).intValue();
            int size = ((Number) filterMap.getOrDefault("size", events.size())).intValue();
            List<Object> slicedEvents = events.stream()
                    .sorted(Comparator.comparing(event -> (Long) event.get("createdAt"), Comparator.reverseOrder()))
                    .skip(from)
                    .limit(size)
                    .map(HashMap::new)
                    .map(Map.class::cast)
                    .map(Object.class::cast)
                    .toList();

            Hits hits = new Hits();
            hits.setHits(slicedEvents);
            HashMap<String, Object> total = new HashMap<>();
            total.put("value", events.size());
            total.put("relation", "eq");
            hits.setTotal(total);
            hits.setMaxScore(1.0d);

            Response response = new Response();
            response.setResult("created");
            response.setTook(1);
            response.setTimeOut(false);
            response.setHits(hits);
            return response;
        }
    }

    private static final class LocalAuthenticationService implements AuthenticationService {
        @Override
        public Map<String, String> authenticate(RequestOfAuthenticate requestOfAuthenticate) throws AuthenticationException {
            return buildUserInfo(requestOfAuthenticate.getUsername());
        }
    }

    private static final class LocalMFAAuthenticationService extends MFAAuthenticationService {
        private LocalMFAAuthenticationService(ObjectMapper objectMapper) {
            super(new RestTemplate(), objectMapper, new MFAConfigProperties());
        }

        @Override
        public Map<String, String> authenticate(RequestOfAuthenticate requestOfAuthenticate) {
            String username = Optional.ofNullable(requestOfAuthenticate.getUsername())
                    .filter(value -> !value.isBlank())
                    .orElse("mfa-user");
            return buildUserInfo(username);
        }
    }

    private static final class LocalAuthorizationService implements AuthorizationService {
        @Override
        public Ems2Result getEntitlements(String userId, List<String> tileEntities) {
            Ems2Result result = new Ems2Result();
            result.setEntities(List.of(buildMockEntity()));
            result.setAccountName(userId);
            result.setFullName("Test User " + userId);
            result.setAccountOwner(userId);
            result.setAccountStatus("ACTIVE");
            result.setAccountType("LOCAL");
            result.setStatus("SUCCESS");
            return result;
        }
    }

    private static final class LocalApplicationCategoryService implements ApplicationCategoryService {
        @Override
        public Optional<List<ApplicationCategory>> findByEms2Role(String ems2Role) {
            return Optional.of(List.of());
        }

        @Override
        public Optional<List<ApplicationCategory>> findAll() {
            return Optional.of(List.of());
        }

        @Override
        public Optional<List<ApplicationCategory>> findByIsActive(boolean isActive) {
            return Optional.of(List.of());
        }

        @Override
        public ApplicationCategory create(ApplicationCategory applicationCategory) throws RecordNotCreatedException {
            throw RecordNotCreatedException.builder().message("Local mode does not persist categories.").build();
        }

        @Override
        public ApplicationCategory update(ApplicationCategory applicationCategory)
                throws RecordNotFoundException, RecordNotUpdatedException {
            throw RecordNotUpdatedException.builder().message("Local mode does not persist categories.").build();
        }

        @Override
        public void saveAll(List<ApplicationCategory> applicationCategories) {
            // Local mode keeps categories in memory only for auth flows.
        }

        @Override
        public Optional<ApplicationCategory> getById(Long id) {
            return Optional.empty();
        }

        @Override
        public Optional<ApplicationCategory> getByLabelAndIsActive(String label, boolean isActive) {
            return Optional.empty();
        }

        @Override
        public Optional<List<Map<String, Object>>> getDrawers() {
            return Optional.of(new ArrayList<>(buildMockDrawers()));
        }

        @Override
        public Optional<Long> setApplicationCategorySeq() {
            return Optional.of(MOCK_CATEGORY_ID);
        }
    }
}
