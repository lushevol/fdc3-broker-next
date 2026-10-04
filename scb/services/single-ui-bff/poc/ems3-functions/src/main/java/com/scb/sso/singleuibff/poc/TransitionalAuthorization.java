package com.scb.sso.singleuibff.poc;

import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * Transitional provider router. The route table represents the BFF database
 * mapping; providers remain responsible for resolving user roles and grants.
 */
public final class TransitionalAuthorization implements AuthorizationService {
    public enum Provider {
        EMS2,
        EMS3
    }

    public record ApplicationRoute(String entityName, Provider provider, String ems3ApplicationName) {
        public ApplicationRoute {
            require(entityName != null && !entityName.isBlank(), "Entity name is required");
            Objects.requireNonNull(provider, "Provider is required");
            if (provider == Provider.EMS3) {
                require(ems3ApplicationName != null && !ems3ApplicationName.isBlank(),
                    "EMS3 application name is required");
            }
        }
    }

    private final Map<String, ApplicationRoute> routes;
    private final Map<Provider, AuthorizationService> providers;

    public TransitionalAuthorization(List<ApplicationRoute> applicationRoutes,
                                     AuthorizationService ems2,
                                     AuthorizationService ems3) {
        require(applicationRoutes != null && !applicationRoutes.isEmpty(), "Route table is required");
        Objects.requireNonNull(ems2, "EMS2 provider is required");
        Objects.requireNonNull(ems3, "EMS3 provider is required");
        routes = new LinkedHashMap<>();
        for (ApplicationRoute route : applicationRoutes) {
            require(routes.putIfAbsent(route.entityName(), route) == null,
                "Duplicate entity route: " + route.entityName());
        }
        providers = new EnumMap<>(Provider.class);
        providers.put(Provider.EMS2, ems2);
        providers.put(Provider.EMS3, ems3);
    }

    @Override
    public Ems2Result getEntitlements(String userId, List<String> requestEntities) {
        require(userId != null && !userId.isBlank(), "User is required");
        require(requestEntities != null && !requestEntities.isEmpty(), "Entity scope required");
        require(new HashSet<>(requestEntities).size() == requestEntities.size(),
            "Duplicate requested entity");

        var byProvider = new EnumMap<Provider, List<String>>(Provider.class);
        for (String entity : requestEntities) {
            var route = routes.get(entity);
            require(route != null, "No provider route for entity: " + entity);
            byProvider.computeIfAbsent(route.provider(), unused -> new ArrayList<>()).add(entity);
        }

        var returnedByEntity = new LinkedHashMap<String, List<Entity>>();
        for (var providerScope : byProvider.entrySet()) {
            Ems2Result providerResult = providers.get(providerScope.getKey())
                .getEntitlements(userId, List.copyOf(providerScope.getValue()));
            validateProviderResult(providerResult, providerScope.getValue(), routes);
            for (Entity entity : providerResult.getEntities()) {
                returnedByEntity.computeIfAbsent(entity.getName(), unused -> new ArrayList<>()).add(entity);
            }
        }

        var merged = new Ems2Result();
        var entities = new ArrayList<Entity>();
        for (String requested : requestEntities) {
            entities.addAll(returnedByEntity.getOrDefault(requested, List.of()));
        }
        merged.setEntities(List.copyOf(entities));
        merged.setAccountName(userId);
        merged.setStatus("SUCCESS");
        return merged;
    }

    private static void validateProviderResult(Ems2Result result, List<String> requested,
                                                Map<String, ApplicationRoute> routes) {
        require(result != null && result.getEntities() != null, "Provider returned no result");
        Set<String> seenRoles = new HashSet<>();
        Set<String> requestedSet = Set.copyOf(requested);
        for (Entity entity : result.getEntities()) {
            require(entity != null && entity.getName() != null && !entity.getName().isBlank(),
                "Provider returned an invalid entity");
            require(requestedSet.contains(entity.getName()),
                "Provider returned an unrequested entity: " + entity.getName());
            require(entity.getRoleName() != null && !entity.getRoleName().isBlank(),
                "Provider returned an invalid entity role");
            require(seenRoles.add(entity.getName() + "\u0000" + entity.getRoleName()),
                "Provider returned a duplicate entity role");
            var route = routes.get(entity.getName());
            if (route.provider() == Provider.EMS3) {
                require(route.ems3ApplicationName().equals(entity.getApplicationName()),
                    "Provider returned the wrong EMS3 application");
            }
            require(entity.getSubjects() != null, "Provider returned an invalid entity subject list");
        }
    }

    private static void require(boolean condition, String message) {
        if (!condition) {
            throw new IllegalStateException(message);
        }
    }
}
