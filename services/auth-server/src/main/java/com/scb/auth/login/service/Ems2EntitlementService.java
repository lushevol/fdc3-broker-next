package com.scb.auth.login.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.auth.login.configuration.Ems2Configuration;
import com.scb.auth.login.entity.MultipleRoleException;
import com.scb.auth.login.entity.NoRoleException;
import com.scb.auth.login.entity.ems2.Ems2RoleResult;
import com.scb.auth.login.entity.ems2.EntitlementList;
import com.scb.auth.login.entity.ratan.RatanEntitlement;
import com.scb.auth.login.mock.MockService;
import com.scb.auth.login.util.Constant;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class Ems2EntitlementService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private Ems2Configuration ems2Configuration;

    @Autowired
    ObjectProvider<MockService> mockServiceObjectProvider;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public Ems2EntitlementService() {
    }

    private Map<String, EntitlementList> getRawEntitlementsByUserId(String userId, List<String> ems2EntityList) throws Exception {

        log.info("Query from EMS2 for userId: {}", userId);

        Map<String, EntitlementList> userRawEntitlements = new HashMap<>();

        for (String entityName : ems2EntityList) {
            ResponseEntity<String> userResponseEntity;

            if (Objects.nonNull(mockServiceObjectProvider.getIfAvailable())) {
                userResponseEntity = ResponseEntity.ok(mockServiceObjectProvider.getObject().getMockEms2Response(entityName));
                log.info("mock userResponseEntity: {}", userResponseEntity);

            } else {
                userResponseEntity = getPermissionFromEms2OnEntityAndUser(entityName, userId);
                log.info("userResponseEntity: {}, entityName: {}, userId: {}", userResponseEntity, entityName, userId);
            }

            if (!userResponseEntity.getStatusCode().equals(HttpStatus.OK)) {
                continue;
            }

            EntitlementList entitlementList = objectMapper.readValue(userResponseEntity.getBody(), EntitlementList.class);

            if (entitlementList.getCount() > 0) {
                log.info("Got {} entitlement data on {} for user {}", entitlementList.getCount(), entityName, userId);

                userRawEntitlements.put(entityName, entitlementList);
            } else {
                log.info("Not Authorized, No entitlement data on {} for user {}", entityName, userId);
            }
        }

        log.info("userRawEntitlements: {}", userRawEntitlements);
        return userRawEntitlements;
    }

    public RatanEntitlement getSysAccountEntitlementByUserId(String userId) throws Exception {
        Map<String, EntitlementList> userRawEntitlements = getRawEntitlementsByUserId(userId, ems2Configuration.getSysAccountEntityList());

        RatanEntitlement ratanEntitlement = new RatanEntitlement();

        userRawEntitlements.forEach((entityName, entitlementList) -> entitlementList.getEntitlements().forEach(entitlement -> {
            ratanEntitlement.appendAction(entitlement.getAction().getEntity().getName()
                + ":" + entitlement.getAction().getName()
                + ":" + entitlement.getSubject().getName());
            ratanEntitlement.setRole(entitlement.getRole().getName());
        }));

        log.info("ratanEntitlement: {}", ratanEntitlement);
        return ratanEntitlement;
    }

    public String getEntitlementsByUserId(String userId) throws Exception {
        final String redisKey = Constant.REDIS_AUTHORIZATION_KEY_PREFIX + userId;
        boolean hasKey = redisTemplate.hasKey(redisKey);
        String ratanEntitlementString = queryRoles(userId, hasKey, redisKey);

        return ratanEntitlementString;
    }

    /**
     * @param userId
     * @param redisKey
     * @return
     * @throws Exception
     * @throws NoRoleException
     * @throws MultipleRoleException
     */
    private String queryRoles(String userId, boolean hasKey, String redisKey) throws Exception, NoRoleException, MultipleRoleException {
        String ratanEntitlementString;
        if (hasKey && ems2Configuration.isCachingEnabled()) {
            log.info("Load from cache for userId: {}", userId);
            ratanEntitlementString = String.valueOf(redisTemplate.opsForValue().get(redisKey));
        } else {
            log.info("Query from EMS2 for userId: {}", userId);

            Map<String, EntitlementList> userEntitlements = getRawEntitlementsByUserId(userId, ems2Configuration.getEntityList());

            RatanEntitlement ratanEntitlement = new RatanEntitlement();
            HashSet<String> roleSet = new HashSet<>();

            userEntitlements.forEach((key, value) -> value.getEntitlements().forEach(a -> {
                ratanEntitlement.appendAction(a.getAction().getEntity().getName() + ":" + a.getAction().getName());
                if (Objects.nonNull(a.getRole())) {
                    // this 'if' is not a good practice, but for a quick demo purpose
                    if (!"RATAN_ENTITLEMENT_SUP_USER".equalsIgnoreCase(a.getRole().getName())) {
                        roleSet.add(a.getRole().getName());
                    }
                }
            }));

            if (roleSet.size() < 1) {
                throw new NoRoleException(String.format("Not Authorized, no entitlement setting for your account %s.", userId));
            }

//            if (roleSet.size() > 1) {
//                throw new MultipleRoleException(
//                    String.format("Multiple roles [%s] detected for your account %s", roleSet.toString(), userId));
//            }

            ratanEntitlement.setRole(roleSet.stream().collect(Collectors.joining(",")));

            ///////// data entitlement control //////////
            ratanEntitlement.setDataEntitlementRoles(retrieveDataEntitlement(userId));

            ///////////////////

            ratanEntitlementString = JSON.toJSONString(ratanEntitlement, SerializerFeature.DisableCircularReferenceDetect);

            if (ems2Configuration.isCachingEnabled()) {
                redisTemplate.opsForValue()
                    .set(redisKey, ratanEntitlementString, ems2Configuration.getExpiryTime(), TimeUnit.SECONDS);
            }

            log.info("returned entitlement string: {}, userId: {}", ratanEntitlementString, userId);

        }

        return ratanEntitlementString;
    }

    private String retrieveDataEntitlement(String userId) {

        ResponseEntity<String> responseEntity;

        if (Objects.nonNull(mockServiceObjectProvider.getIfAvailable())) {
            responseEntity = ResponseEntity.ok(mockServiceObjectProvider.getObject().getMockDataEntitlementResponse(userId));
            log.info("mock userResponseEntity: {}", responseEntity);
        } else {
            responseEntity = restTemplate.getForEntity(String.format(ems2Configuration.getUserRoles(), userId), String.class);
            log.info("responseEntity: {}", responseEntity);
        }

        if (StringUtils.isNotBlank(responseEntity.getBody())) {
            Ems2RoleResult result = JSON.parseObject(responseEntity.getBody(), Ems2RoleResult.class);
            log.info("Get response from EMS2: {} for user: {}", result, userId);
            if (!CollectionUtils.isEmpty(result.getEntitlementTypes())) {
                String roleNames = result.getEntitlementTypes().stream()
                    .filter(Objects::nonNull)
                    .filter(element -> StringUtils.isNotBlank(element.getRoleName()))
                    .filter(element -> element.getUniqueName().contains(ems2Configuration.getDataEntitlementEntity()))
                    .map(Ems2RoleResult.EntitlementType::getRoleName)
                    .collect(Collectors.joining(","));
                log.info("retrieved entitlement role: {}", roleNames);
                return roleNames;
            }
        }

        return StringUtils.EMPTY;
    }

    private ResponseEntity<String> getPermissionFromEms2OnEntityAndUser(String entity, String userId) {
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(
            String.format(ems2Configuration.getUserAuthorizationOnEntity(), entity, userId), String.class);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            log.warn("Retrieved EMS2 entitlement on entity {} for user {}", entity, userId);

        } else {
            log.warn("Error on querying entitlement data on {} for user {}", entity, userId);

        }
        return responseEntity;

    }

    public RatanEntitlement queryDataEntitlementRoles(String userId) {

        String ratanEntitlementString;
        RatanEntitlement ratanEntitlement = new RatanEntitlement();
        ///////// data entitlement control //////////
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(String.format(ems2Configuration.getUserRoles(), userId),
            String.class);
        if (StringUtils.isNotBlank(responseEntity.getBody())) {
            Ems2RoleResult result = JSON.parseObject(responseEntity.getBody(), Ems2RoleResult.class);
            log.info("Get response from EMS2: {} for user: {}", result, userId);
            if (!CollectionUtils.isEmpty(result.getEntitlementTypes())) {
                String roleNames = result.getEntitlementTypes().stream()
                    .filter(Objects::nonNull)
                    .filter(element -> StringUtils.isNotBlank(element.getRoleName()))
                    .filter(element -> element.getUniqueName().contains(ems2Configuration.getDataEntitlementEntity()))
                    .map(Ems2RoleResult.EntitlementType::getRoleName)
                    .collect(Collectors.joining(","));
                ratanEntitlement.setDataEntitlementRoles(roleNames);
                log.info("retrieved entitlement role: {}", roleNames);
            }
        }
        ///////////////////

        ratanEntitlementString = JSON.toJSONString(ratanEntitlement, SerializerFeature.DisableCircularReferenceDetect);

        log.info("returned entitlement string: {}, user: {}", ratanEntitlementString, userId);

        return ratanEntitlement;
    }

}
