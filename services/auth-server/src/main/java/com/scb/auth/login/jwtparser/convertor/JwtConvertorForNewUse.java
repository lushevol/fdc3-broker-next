package com.scb.auth.login.jwtparser.convertor;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.dataentitlement.DataEntitlementService;
import com.scb.auth.login.entity.ems2.Entitlement;
import com.scb.auth.login.entity.ems2.EntitlementList;
import com.scb.auth.login.exceptions.AuthenticationException;
import com.scb.auth.login.jwtparser.fetcher.OudDataFetcher;
import com.scb.auth.login.jwtparser.properties.JwtParserProperties;
import com.scb.auth.login.service.Ems2EntitlementService;
import com.scb.ratan.common.lib.ResponseCode;
import com.scb.ratan.commons.RatanErrors;
import com.scb.ratan.commons.exception.RatanServiceException;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtConvertorForNewUse extends JwtConvertor {

    private final RestTemplate restTemplate;

    private final JwtParserProperties jwtParserProperties;

    private final StringRedisTemplate stringRedisTemplate;

    private final Ems2EntitlementService ems2EntitlementService;

    private final OudDataFetcher oudDataFetcher;

    private static final String KEY_ENTITLEMENTS = "entitlements";

    private static final String REDIS_KEY_PREFIX = "ratanone:authentication:ems2_authorization:role_actions:";

    private final DataEntitlementService dataEntitlementService;

    public JwtConvertorForNewUse(RestTemplate restTemplate,
        JwtParserProperties jwtParserProperties,
        ObjectMapper objectMapper,
        StringRedisTemplate stringRedisTemplate,
        Ems2EntitlementService ems2EntitlementService,
        OudDataFetcher oudDataFetcher,
        DataEntitlementService dataEntitlementService) {
        super(objectMapper);
        this.restTemplate = restTemplate;
        this.jwtParserProperties = jwtParserProperties;
        this.stringRedisTemplate = stringRedisTemplate;
        this.ems2EntitlementService = ems2EntitlementService;
        this.oudDataFetcher = oudDataFetcher;
        this.dataEntitlementService = dataEntitlementService;
    }

    @Override
    public JwtConvertorResponse convert(String inputUserInfo) {

        Map<String, String> userInfoMap = convertToMap(inputUserInfo);

        String userId = retrieveUserId(userInfoMap);
        OudDataFetcher.OudKeyInformation oudKeyInformation = retrieveOudInfo(userInfoMap);

        // refactor retrieveRatanActions() return role and actions
        // if return null then use old way
        Optional<InternalUserEntitlement> userRoleAndActionsOptional = retrieveRatanActionsAndRole(userId);

        if (userRoleAndActionsOptional.isEmpty()) {
            return retrieveFromOldWay(userId, oudKeyInformation);
        }

        InternalUserEntitlement internalUserEntitlement = userRoleAndActionsOptional.get();

        String ratanDataEntitlementRole = retrieveDataEntitlementRole(userId);

        internalUserEntitlement.setDataEntitlementRoles(ratanDataEntitlementRole);

        JwtConvertorResponse responseDto = buildResponse(convertUserEntitlement(internalUserEntitlement), userId, oudKeyInformation);

        log.info("userId: {}, converting from new token parser, entitlement converted: \n {}", userId, responseDto.getEntitlement());

        return responseDto;
    }

    private JwtConvertorResponse retrieveFromOldWay(String userId, OudDataFetcher.OudKeyInformation oudKeyInformation) {
        log.warn("userId: {}, not found ratan role with X_RATANONE", userId);
        try {
            String entitlements = ems2EntitlementService.getEntitlementsByUserId(userId);
            JwtConvertorResponse responseDto = buildResponse(entitlements, userId, oudKeyInformation);
            log.info("userId: {}, query entitlements by userId, entitlement: {}", userId, responseDto.getEntitlement());
            return responseDto;
        } catch (Exception e) {
            log.error("userId: {}, query entitlements by userId occur exception", userId, e);
            throw new AuthenticationException(HttpStatus.PRECONDITION_FAILED, ResponseCode.API_ERROR, e.getMessage());
        }
    }

    private String retrieveDataEntitlementRole(String userId) {

        return dataEntitlementService.getRoleByEntity(userId);
    }

    private OudDataFetcher.OudKeyInformation retrieveOudInfo(Map<String, String> userInfoMap) {

        return oudDataFetcher.retrieveOudInformation(userInfoMap);
    }

    private String retrieveUserId(Map<String, String> inputUserInfo) {

        String userId = inputUserInfo.get("sub");

        if (StringUtils.isEmpty(userId)) {
            throw new RatanServiceException(RatanErrors.SERVICE_INTERNAL_ERROR, "userId is not retrieved from jwtToken");
        }

        return userId;
    }

    private Map<String, Object> convertEntitlementMap(Map<String, String> userInfoMap) {

        if (!userInfoMap.containsKey(KEY_ENTITLEMENTS)) {
            throw new RatanServiceException(RatanErrors.SERVICE_INTERNAL_ERROR, "current data has no key 'entitlements', need check!");
        }

        String entitlements = String.valueOf(userInfoMap.get(KEY_ENTITLEMENTS));

        try {

            return objectMapper.readValue(entitlements, Map.class);
        } catch (Exception e) {
            log.error("error occurred while converting entitlement map, input: {}, e", userInfoMap, e);
            throw new RatanServiceException(RatanErrors.SERVICE_INTERNAL_ERROR, "error occurred while converting entitlement map");
        }
    }

    private Map<String, String> convertToMap(String inputUserInfo) {

        try {

            return objectMapper.readValue(inputUserInfo, Map.class);
        } catch (Exception e) {
            log.error("error occurred while converting to map ");
        }

        return new HashMap<>();
    }

    private Optional<InternalUserEntitlement> retrieveRatanActionsAndRole(String userId) {
        if (jwtParserProperties.isCachingEnabled() && valueIsCached(userId)) {
            return cachedData(userId);
        }

        List<Entitlement> ratanCommonEntitlement = retrieveEntitlement(userId, jwtParserProperties.getRatanEntity());

        if (CollectionUtils.isEmpty(ratanCommonEntitlement)) {
            log.info("retrieve EMS2 error, won't cache result, userId: {}", userId);
            return Optional.empty();
        }

        // retrieve role
        Optional<String> first = ratanCommonEntitlement.stream()
            .filter(entitlement -> Objects.nonNull(entitlement)
                && Objects.nonNull(entitlement.getRole())
                && StringUtils.isNotBlank(entitlement.getRole().getName()))
            .map(entitlement -> entitlement.getRole().getName())
            .findFirst();

        if (first.isEmpty()) {
            log.warn("retrieve EMS2 error, not found role, userId: {}, entitlement: {}", userId, ratanCommonEntitlement);
            return Optional.empty();
        }

        String ratanRole = first.get();

        // retrieve actions
        String[] response = retrieveActionsFromEntitlement(ratanCommonEntitlement);

        // init entitlement result
        InternalUserEntitlement result = InternalUserEntitlement.builder()
            .role(ratanRole)
            .actions(response).build();

        if (jwtParserProperties.isCachingEnabled()) {
            cacheResponse(userId, result, jwtParserProperties.getExpiryTime());
        }

        return Optional.of(result);
    }

    private Optional<InternalUserEntitlement> cachedData(String userId) {

        try {

            String result = stringRedisTemplate.opsForValue().get(REDIS_KEY_PREFIX.concat(userId));

            InternalUserEntitlement userRoleAndActions = objectMapper.readValue(result, InternalUserEntitlement.class);

            log.info("key: {}, is cached, will return result from cache, data: \n{}", userId, userRoleAndActions);

            return Optional.of(userRoleAndActions);

        } catch (Exception e) {
            log.error("error occurred while converting data, ", e);
            return Optional.empty();
        }
    }

    private boolean valueIsCached(String userId) {
        try {
            return Boolean.TRUE.equals(stringRedisTemplate.hasKey(REDIS_KEY_PREFIX.concat(userId)));
        } catch (Exception e) {
            log.info("error occurred while check value is cached, key userId: {}, e ", userId, e);
            return false;
        }
    }

    private void cacheResponse(String userId, InternalUserEntitlement userRoleAndActions, long expiryTime) {

        try {
            String cachedValue = objectMapper.writeValueAsString(userRoleAndActions);

            stringRedisTemplate.opsForValue().set(REDIS_KEY_PREFIX.concat(userId), cachedValue, expiryTime, TimeUnit.MINUTES);

            log.info("key userId: {}, cache data successfully, data: {} ", userId, cachedValue);

        } catch (Exception e) {
            log.info("error occurred while caching data, key userId: {}, e ", userId, e);
        }
    }

    private String convertUserEntitlement(InternalUserEntitlement internalUserEntitlement) {

        try {

            return objectMapper.writeValueAsString(internalUserEntitlement);
        } catch (Exception e) {
            log.warn("error occurred while converting data: {}", internalUserEntitlement, e);
            return StringUtils.EMPTY;
        }
    }

    private String[] retrieveActionsFromEntitlement(List<Entitlement> ratanCommonEntitlement) {

        return ratanCommonEntitlement.stream().map(item -> {
            if (Objects.nonNull(item.getSubject()) && Objects.nonNull(item.getAction())) {
                return item.getSubject().getName() + ":" + item.getAction().getName();
            }
            return null;
        }).filter(Objects::nonNull).toArray(String[]::new);
    }

    private List<Entitlement> retrieveEntitlement(String userId, String inputEntity) {

        ResponseEntity<String> responseEntity = retrieveEntityInformation(inputEntity, userId);

        if (!responseEntity.getStatusCode().is2xxSuccessful()) {
            return Collections.emptyList();
        }

        try {

            EntitlementList entitlementList = objectMapper.readValue(responseEntity.getBody(), EntitlementList.class);

            if (Objects.nonNull(entitlementList) && entitlementList.getCount() > 0) {
                log.info("ems2 userId: {}, inputEntity: {}, entitlementList count: {}", userId, inputEntity, entitlementList.getCount());
                return entitlementList.getEntitlements();
            }

            log.info("ems2 userId: {}, entitlementList is empty", userId);
            return Collections.emptyList();

        } catch (JsonProcessingException e) {
            log.error("error occurred while mapping response to EntitlementList object, response body: {}, e", responseEntity.getBody(), e);
            return Collections.emptyList();
        }
    }

    private ResponseEntity<String> retrieveEntityInformation(String entity, String userId) {

        try {

            ResponseEntity<String> responseEntity = restTemplate
                .getForEntity(String.format(jwtParserProperties.getRequestEms2Url(), entity, userId), String.class);

            log.info("Retrieved EMS2 entitlement on entity: {}, for user: {}, original ems2 response: \n{}", entity, userId,
                responseEntity);

            return responseEntity;

        } catch (Exception e) {

            log.error("error occurred while querying EMS2, url: {}, e",
                String.format(jwtParserProperties.getRequestEms2Url(), entity, userId), e);
            throw new RatanServiceException(RatanErrors.SERVICE_INTERNAL_ERROR, "query EMS2 error, need check");
        }
    }

    @Data
    @Builder
    public static class InternalUserEntitlement {

        @JsonProperty("role")
        private String role;

        @JsonProperty("actions")
        private String[] actions;

        @JsonProperty("dataEntitlementRoles")
        private String dataEntitlementRoles;

    }

}
