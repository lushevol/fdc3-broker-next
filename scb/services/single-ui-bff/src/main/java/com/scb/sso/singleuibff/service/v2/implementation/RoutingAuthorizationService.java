package com.scb.sso.singleuibff.service.v2.implementation;

import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.entity.AuthorizationApplication;
import com.scb.sso.singleuibff.repository.AuthorizationApplicationRepo;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationUnavailableException;
import com.scb.sso.singleuibff.service.v2.MappedAuthorizationProvider;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public final class RoutingAuthorizationService implements AuthorizationService {

    private final AuthorizationApplicationRepo repository;
    private final AuthorizationService ems2;
    private final MappedAuthorizationProvider ems3;

    public RoutingAuthorizationService(AuthorizationApplicationRepo repository,
        AuthorizationService ems2, MappedAuthorizationProvider ems3) {
        this.repository = Objects.requireNonNull(repository);
        this.ems2 = Objects.requireNonNull(ems2);
        this.ems3 = Objects.requireNonNull(ems3);
    }

    @Override
    public Ems2Result getEntitlements(String userId, List<String> requestEntities) {
        try {
            return lookup(userId, requestEntities);
        } catch (AuthorizationUnavailableException failure) {
            throw failure;
        } catch (RuntimeException failure) {
            throw new AuthorizationUnavailableException("Authorization unavailable", failure);
        }
    }

    private Ems2Result lookup(String userId, List<String> requestEntities) {
        require(text(userId), "User is required");
        require(requestEntities != null, "Entity scope is required");
        var unique = new HashSet<String>();
        for (String entity : requestEntities) {
            require(text(entity) && unique.add(entity), "Entity scope is invalid or duplicated");
        }
        if (requestEntities.isEmpty()) {
            return result(userId, List.of());
        }
        requestEntities = List.copyOf(requestEntities);
        var routes = snapshot(repository.findByBffEntityNameIn(requestEntities), unique);
        var selected = requestEntities.stream().map(routes::get).toList();
        var ems2Entities = selected.stream().filter(route -> "EMS2".equals(route.getProvider()))
            .map(AuthorizationApplication::getBffEntityName).toList();
        var ems3Applications = selected.stream().filter(route -> "EMS3".equals(route.getProvider()))
            .map(RoutingAuthorizationService::copy).toList();
        var ems3Entities = Set.copyOf(ems3Applications.stream()
            .map(AuthorizationApplication::getBffEntityName).toList());
        Map<String, List<Entity>> byEntity = new LinkedHashMap<>();
        Ems2Result legacy = null;
        if (!ems2Entities.isEmpty()) {
            legacy = ems2.getEntitlements(userId, ems2Entities);
            validate(legacy, userId, Set.copyOf(ems2Entities), routes);
            collect(legacy, byEntity);
        }
        if (!ems3Applications.isEmpty()) {
            var modern = ems3.getEntitlements(userId, ems3Applications);
            validate(modern, userId, ems3Entities, routes);
            collect(modern, byEntity);
        }
        var merged = new ArrayList<Entity>();
        for (String requested : requestEntities) {
            merged.addAll(byEntity.getOrDefault(requested, List.of()));
        }
        var result = result(userId, merged);
        if (legacy != null) {
            result.setFullName(legacy.getFullName());
            result.setAccountOwner(legacy.getAccountOwner());
            result.setAccountStatus(legacy.getAccountStatus());
            result.setAccountType(legacy.getAccountType());
        }
        return result;
    }

    private static Map<String, AuthorizationApplication> snapshot(List<AuthorizationApplication> applications,
        Set<String> requested) {
        require(applications != null, "Application mappings are unavailable");
        var routes = new LinkedHashMap<String, AuthorizationApplication>();
        var appNames = new HashSet<String>();
        var appUids = new HashSet<Long>();
        for (AuthorizationApplication application : applications) {
            require(application != null && text(application.getBffEntityName()), "Application mapping is invalid");
            require(requested.contains(application.getBffEntityName()), "Application mapping is outside requested scope");
            require(application.isActive(), "Application mapping is inactive");
            require("EMS2".equals(application.getProvider()) || "EMS3".equals(application.getProvider()),
                "Application provider is invalid");
            require(application.getMappingVersion() >= 0, "Application mapping version is invalid");
            if ("EMS3".equals(application.getProvider())) {
                require(positive(application.getBffEntityId()) && positive(application.getEms3AppUid()),
                    "EMS3 application numeric identity is incomplete");
                require(text(application.getEms3AppName()) && text(application.getEms3AppId())
                    && text(application.getEms3ItamId()), "EMS3 application identity is incomplete");
                require(application.getSubjectLongNames() != null, "EMS3 subject mapping is missing");
                for (var entry : application.getSubjectLongNames().entrySet()) {
                    require(text(entry.getKey()) && text(entry.getValue()), "EMS3 subject mapping is invalid");
                }
                require(appNames.add(application.getEms3AppName()) && appUids.add(application.getEms3AppUid()),
                    "EMS3 application mapping is ambiguous");
            }
            require(routes.putIfAbsent(application.getBffEntityName(), copy(application)) == null,
                "Application mapping is duplicated");
        }
        require(routes.keySet().equals(requested), "Application mapping is incomplete");
        return Map.copyOf(routes);
    }

    private static AuthorizationApplication copy(AuthorizationApplication application) {
        var copy = new AuthorizationApplication();
        copy.setId(application.getId());
        copy.setBffEntityName(application.getBffEntityName());
        copy.setProvider(application.getProvider());
        copy.setBffEntityId(application.getBffEntityId());
        copy.setEms3AppName(application.getEms3AppName());
        copy.setEms3AppId(application.getEms3AppId());
        copy.setEms3AppUid(application.getEms3AppUid());
        copy.setEms3ItamId(application.getEms3ItamId());
        copy.setActive(application.isActive());
        copy.setMappingVersion(application.getMappingVersion());
        copy.setSubjectLongNames("EMS3".equals(application.getProvider())
            ? Map.copyOf(application.getSubjectLongNames()) : Map.of());
        return copy;
    }

    private static void collect(Ems2Result result, Map<String, List<Entity>> byEntity) {
        for (Entity entity : result.getEntities()) {
            byEntity.computeIfAbsent(entity.getName(), unused -> new ArrayList<>()).add(entity);
        }
    }

    private static void validate(Ems2Result result, String userId, Set<String> requested,
        Map<String, AuthorizationApplication> routes) {
        require(result != null && result.getEntities() != null, "Provider result is unavailable");
        require(result.getAccountName() == null || result.getAccountName().equals(userId),
            "Provider returned the wrong account");
        require(result.getStatus() == null || result.getStatus().isBlank()
            || "SUCCESS".equalsIgnoreCase(result.getStatus()), "Provider returned an unsuccessful result");
        var roles = new HashSet<GrantKey>();
        for (Entity entity : result.getEntities()) {
            require(entity != null && text(entity.getName()) && requested.contains(entity.getName()),
                "Provider returned an entity outside requested scope");
            require(text(entity.getRoleName()) && roles.add(new GrantKey(entity.getName(), entity.getRoleName())),
                "Provider returned an invalid or duplicate role");
            var route = routes.get(entity.getName());
            if ("EMS3".equals(route.getProvider())) {
                require(route.getEms3AppName().equals(entity.getApplicationName())
                    && route.getBffEntityId().equals(entity.getId()), "Provider returned the wrong EMS3 application");
            }
            require(entity.getSubjects() != null, "Provider returned an invalid subject list");
            var subjects = new HashSet<String>();
            for (var subject : entity.getSubjects()) {
                require(subject != null && text(subject.getName()) && subject.getLongName() != null
                    && subjects.add(subject.getName()), "Provider returned an invalid or duplicate subject");
                require(subject.getActions() != null, "Provider returned an invalid action list");
                var actions = new HashSet<String>();
                for (var action : subject.getActions()) {
                    require(action != null && text(action.getName()) && actions.add(action.getName()),
                        "Provider returned an invalid or duplicate action");
                }
            }
        }
    }

    private record GrantKey(String entity, String role) {}

    private static Ems2Result result(String userId, List<Entity> entities) {
        var result = new Ems2Result();
        result.setEntities(List.copyOf(entities));
        result.setAccountName(userId);
        result.setStatus("SUCCESS");
        return result;
    }

    private static boolean text(String value) {
        return value != null && !value.isBlank();
    }

    private static boolean positive(Long value) {
        return value != null && value > 0;
    }

    private static void require(boolean condition, String message) {
        if (!condition) {
            throw new AuthorizationUnavailableException(message);
        }
    }
}
