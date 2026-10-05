package com.scb.sso.singleuibff.service.v2.implementation;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.EMS2ConfigProperties;
import com.scb.sso.singleuibff.dto.ems2.v2.*;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationUnavailableException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/** The legacy EMS2 API adapted to the BFF contract, with explicit failure handling. */
public class EMS2AuthorizationImplementation implements AuthorizationService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final EMS2ConfigProperties config;

    public EMS2AuthorizationImplementation(RestTemplate restTemplate, ObjectMapper objectMapper, EMS2ConfigProperties config) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper.copy().enable(JsonParser.Feature.STRICT_DUPLICATE_DETECTION)
            .enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);
        this.config = config;
    }

    @Override
    public Ems2Result getEntitlements(String userId, List<String> tileEntities) {
        try {
            require(userId != null && !userId.isBlank(), "Invalid EMS2 user");
            require(tileEntities != null, "Missing EMS2 scope");
            Ems2Result result = new Ems2Result();
            result.setAccountName(userId);
            result.setEntities(List.of());
            if (tileEntities.isEmpty()) return result;

            Ems2RoleResult roles = fetchDataEntitlementRoles(userId);
            List<Entity> entities = generateEntities(roles.getEntitlementTypes(), tileEntities);
            if (!entities.isEmpty()) populateGrants(entities, userId);
            result.setEntities(entities);
            result.setFullName(roles.getFullName());
            result.setAccountOwner(roles.getAccountOwner());
            result.setAccountType(roles.getAccountType());
            result.setAccountStatus(roles.getAccountStatus());
            return result;
        } catch (Exception e) {
            throw new AuthorizationUnavailableException("EMS2 authorization unavailable", e);
        }
    }

    private Ems2RoleResult fetchDataEntitlementRoles(String userId) throws Exception {
        ResponseEntity<String> response = restTemplate.getForEntity(String.format(config.getUserRoles(), userId), String.class);
        JsonNode root = readResponse(response);
        require(userId.equals(text(root, "accountName")), "Wrong EMS2 account");
        require(root.path("entitlementTypes").isArray(), "Missing EMS2 roles");
        JsonNode statusNode = root.path("status");
        require(statusNode.isMissingNode() || statusNode.isNull() || statusNode.isTextual(), "Malformed EMS2 account status");
        String status = statusNode.asText("");
        require(status.isEmpty() || "SUCCESS".equalsIgnoreCase(status), "Unsuccessful EMS2 account");
        return objectMapper.treeToValue(root, Ems2RoleResult.class);
    }

    private List<Entity> generateEntities(List<Ems2RoleResult.EntitlementType> roles, List<String> selected) {
        List<Entity> entities = new ArrayList<>();
        Set<String> keys = new HashSet<>();
        for (Ems2RoleResult.EntitlementType role : roles) {
            require(role != null && role.getUniqueName() != null, "Missing EMS2 role identity");
            Entity entity = getEntity(role);
            if (!selected.contains(entity.getName())) continue;
            require(keys.add(entity.getName() + "|" + entity.getRoleId()), "Duplicate EMS2 role");
            entities.add(entity);
        }
        return entities;
    }

    private Entity getEntity(Ems2RoleResult.EntitlementType role) {
        String[] parts = role.getUniqueName().split("\\|", -1);
        require(parts.length >= 4 && !parts[1].isBlank() && !parts[3].isBlank(), "Invalid EMS2 role identity");
        Entity entity = new Entity();
        entity.setId(Long.parseLong(parts[0]));
        entity.setName(parts[1]);
        entity.setApplicationName(role.getApplicationName());
        entity.setRoleId(Long.parseLong(parts[2]));
        entity.setRoleName(parts[3]);
        entity.setSubjects(new ArrayList<>());
        require(entity.getId() > 0 && entity.getRoleId() > 0, "Invalid EMS2 role ID");
        return entity;
    }

    private void populateGrants(List<Entity> entities, String userId) throws Exception {
        List<String> selected = entities.stream().map(Entity::getName).distinct().toList();
        JsonNode root = readResponse(getPermissionFromEms2OnEntityAndUserNew(selected, userId));
        require(root.size() == 1 && root.has(userId), "Wrong EMS2 grant account");
        JsonNode result = root.get(userId);
        JsonNode count = result.path("count");
        JsonNode grants = result.path("entitlements");
        require(count.isIntegralNumber() && count.canConvertToInt() && count.intValue() >= 0
            && grants.isArray() && count.intValue() == grants.size(), "Incomplete EMS2 grants");
        Set<Long> grantIds = new HashSet<>();
        for (JsonNode grant : grants) {
            long grantId = id(grant, "id");
            require(grantIds.add(grantId), "Duplicate EMS2 grant");
            JsonNode role = grant.path("role");
            String entityName = text(role.path("entity"), "name");
            long roleId = id(role, "id");
            Entity entity = entities.stream()
                .filter(value -> value.getName().equals(entityName) && value.getRoleId() == roleId)
                .findFirst().orElseThrow(() -> new AuthorizationUnavailableException("Unexpected EMS2 role"));
            require(entity.getRoleName().equals(text(role, "name")), "Wrong EMS2 role name");
            validateEntity(role, entity);
            JsonNode subjectNode = grant.path("subject");
            JsonNode actionNode = grant.path("action");
            validateEntity(subjectNode, entity);
            validateEntity(actionNode, entity);
            long subjectId = id(subjectNode, "id");
            String subjectName = text(subjectNode, "name");
            String longName = text(subjectNode, "longName");
            Subject subject = entity.getSubjects().stream().filter(value -> value.getId() == subjectId).findFirst().orElse(null);
            if (subject == null) {
                subject = new Subject();
                subject.setId(subjectId);
                subject.setName(subjectName);
                subject.setLongName(longName);
                subject.setActions(new ArrayList<>());
                entity.getSubjects().add(subject);
            } else {
                require(subjectName.equals(subject.getName()) && longName.equals(subject.getLongName()), "Conflicting EMS2 subject");
            }
            Action action = new Action();
            action.setId(id(actionNode, "id"));
            action.setName(text(actionNode, "name"));
            action.setEntitlementId(grantId);
            subject.getActions().add(action);
        }
    }

    private void validateEntity(JsonNode component, Entity expected) {
        JsonNode entity = component.path("entity");
        require(expected.getName().equals(text(entity, "name")) && expected.getId() == id(entity, "id"),
            "Conflicting EMS2 grant entity");
    }

    private ResponseEntity<String> getPermissionFromEms2OnEntityAndUserNew(List<String> entities, String userId) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = objectMapper.writeValueAsString(Map.of(userId, entities));
        return restTemplate.postForEntity(config.getNewUserAuthorizationOnEntity(), new HttpEntity<>(body, headers), String.class);
    }

    private JsonNode readResponse(ResponseEntity<String> response) throws Exception {
        require(response.getStatusCode().value() == 200, "Unsuccessful EMS2 response");
        JsonNode body = objectMapper.readTree(response.getBody());
        require(body != null && body.isObject(), "Malformed EMS2 response");
        return body;
    }

    private static long id(JsonNode value, String field) {
        JsonNode id = value.path(field);
        require(id.isIntegralNumber() && id.canConvertToLong() && id.longValue() > 0, "Invalid EMS2 ID");
        return id.longValue();
    }

    private static String text(JsonNode value, String field) {
        JsonNode text = value.path(field);
        require(text.isTextual() && !text.textValue().isBlank(), "Missing EMS2 text");
        return text.textValue();
    }

    private static void require(boolean valid, String message) {
        if (!valid) throw new AuthorizationUnavailableException(message);
    }
}
