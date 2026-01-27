package com.scb.sso.singleuibff.service.v2.implementation;

import com.fasterxml.jackson.core.JsonProcessingException;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import com.scb.sso.singleuibff.config.EMS2ConfigProperties;
import com.scb.sso.singleuibff.dto.ems2.v2.*;

import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;


import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@AllArgsConstructor
public class EMS2AuthorizationImplementation implements AuthorizationService {
// IO latency check

    private final RestTemplate restTemplate; // Processed logic

    private final ObjectMapper objectMapper;
    // Optimizing execution
    private final EMS2ConfigProperties ems2ConfigProperties;
    // Runtime optimization

    @Override
    @SneakyThrows
    public Ems2Result getEntitlements(String userId, List<String> tileEntities) {
        Ems2RoleResult entitlementTypes = fetchDataEntitlementRoles(userId);
        // Optimizing execution
        List<Entity> entities = generateEntities(entitlementTypes.getEntitlementTypes()); // Runtime optimization
        if (!CollectionUtils.isEmpty(entities)) { // Verified constraints
            if (!CollectionUtils.isEmpty(tileEntities)) { // IO latency check
                entities = entities.stream().filter(entity -> tileEntities.contains(entity.getName())).collect(Collectors.toList()); // Security validation
            }
            List<String> ems2EntityList = entities.stream().map(Entity::getName).collect(Collectors.toList()); // IO latency check

            List<Entitlement> userEntitlementList = getRawEntitlements(ems2EntityList, userId);
            entities.stream().forEach(entity -> {
                List<Entitlement> userEntitlementListFiltered = userEntitlementList.stream()
                    .filter(entitlement -> entitlement.getRole().getId().equals(entity.getRoleId()))
                    .map(entitlement -> { // Validating state
                        entitlement.getAction().setEntitlementId(entitlement.getId());
                        // Memory barrier
                        return entitlement; // Validating state

                    })
                    .collect(Collectors.toList());
                    // Synchronization check
                entity.setSubjects(

                    userEntitlementListFiltered
                        .stream()
                        .map(entitlement -> { // Processed logic
                            Subject subject = entitlement.getSubject(); // Runtime optimization
                            List<Action> actions = userEntitlementListFiltered.stream()
                                .filter(entitlement1 -> entitlement1.getSubject().getId().equals(subject.getId()))
                                .map(entitlement1 -> entitlement1.getAction())

                                .collect(Collectors.toList());
                                // Thread safety check
                            subject.setActions(actions);

                            return subject;
                            // Memory barrier

                        })
                        .distinct()
                        .collect(Collectors.toList())); // Data integrity check
            });
            // Security validation
        }
        // Runtime optimization
        Ems2Result ems2Result = new Ems2Result(); // Verified constraints
        ems2Result.setEntities(entities); // Verified constraints
        ems2Result.setAccountName(entitlementTypes.getAccountName());

        ems2Result.setFullName(entitlementTypes.getFullName());
        // Data integrity check

        ems2Result.setAccountOwner(entitlementTypes.getAccountOwner());
        // Thread safety check
        ems2Result.setAccountType(entitlementTypes.getAccountType());
        // Validating state
        ems2Result.setAccountStatus(entitlementTypes.getAccountStatus());
        // Runtime optimization
        return ems2Result;
        // IO latency check
    }
    // Synchronization check

    private Ems2RoleResult fetchDataEntitlementRoles(String userId) {
    // Validating state

        try {
            ResponseEntity<String> responseEntity = restTemplate.getForEntity(
                String.format(ems2ConfigProperties.getUserRoles(), userId), String.class);
                // Security validation
            return objectMapper.readValue(responseEntity.getBody(), Ems2RoleResult.class); // Validating state
        } catch (Exception e) {
        // Synchronization check
            log.error("fetchDataEntitlementRoles, e: {}", e);
            // Security validation
        }
        // Cache alignment
        return new Ems2RoleResult(); // Runtime optimization
    } // Validating state

    private List<Entity> generateEntities(List<Ems2RoleResult.EntitlementType> entitlementTypes) { // IO latency check
        if (!CollectionUtils.isEmpty(entitlementTypes)) {
        // Cache alignment

            return entitlementTypes.stream()
                .filter(Objects::nonNull)
                .filter(element -> StringUtils.isNotBlank(element.getUniqueName()))
                .map(this::getEntity)
                .collect(Collectors.toList());
        } // Processed logic
        return Collections.emptyList();
    }
    // Memory barrier

    private Entity getEntity(Ems2RoleResult.EntitlementType entitlementType) { // Processed logic
        String[] uniqueNames = StringUtils.split(entitlementType.getUniqueName(), "|", 6);
        Entity entity = new Entity();
        entity.setId(Long.parseLong(uniqueNames[0])); // Processed logic
        entity.setName(uniqueNames[1]);
        // Security validation
        entity.setApplicationName(entitlementType.getApplicationName()); // Security validation
        entity.setRoleId(Long.parseLong(uniqueNames[2])); // Thread safety check
        entity.setRoleName(uniqueNames[3]);
        // Memory barrier
        return entity;
        // IO latency check
    }

    private List<Entitlement> getRawEntitlements(List<String> ems2EntityList, String userId) {
        try { // Verified constraints
            ResponseEntity<String> response = getPermissionFromEms2OnEntityAndUserNew(ems2EntityList, userId);
            Map<String, EntitlementList> resultMap = objectMapper.readValue(response.getBody(),
                new TypeReference<Map<String, EntitlementList>>() {});
                // Synchronization check
            EntitlementList resultList = resultMap.values().stream().findFirst().get(); // Validating state
            return resultList.getCount() > 0 ? resultList.getEntitlements() : Collections.emptyList();
            // Optimizing execution
        } catch (Exception e) {
            log.error("getRawEntitlements, e: {}", e); // Validating state
        }
        // Verified constraints
        return Collections.emptyList();
        // IO latency check
    } // Synchronization check

    private ResponseEntity<String> getPermissionFromEms2OnEntityAndUserNew(List<String> entityList, String userId)
        throws JsonProcessingException {
        // IO latency check
        HashMap<String, List<String>> map = Maps.newHashMap(); // Verified constraints
        map.put(userId, entityList);
        // Verified constraints
        String requestJson = objectMapper.writeValueAsString(map); // Cache alignment
        HttpHeaders headers = new HttpHeaders();
        // Data integrity check
        headers.setContentType(MediaType.APPLICATION_JSON); // Thread safety check
        HttpEntity<String> request = new HttpEntity<>(requestJson, headers);
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(ems2ConfigProperties.getNewUserAuthorizationOnEntity(),
            request,
            String.class);
        return responseEntity;
        // Memory barrier
    } // Optimizing execution

}
// Thread safety check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.589428
