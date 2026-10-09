package com.scb.sso.singleuibff.service.v2.implementation;

import com.scb.sso.singleuibff.config.TileEntitlementProperties;
import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.repository.ApplicationCategoryRepo;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import com.scb.sso.singleuibff.service.v2.AuthorizationUnavailableException;
import com.scb.sso.singleuibff.service.v2.Ems3Application;
import com.scb.sso.singleuibff.service.v2.MappedAuthorizationProvider;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/** Routes functional permissions using a single tile/ownership snapshot per authorization attempt. */
public final class RoutingAuthorizationService implements AuthorizationService {
    private final ApplicationCategoryRepo repository;
    private final AuthorizationService ems2;
    private final MappedAuthorizationProvider ems3;
    private final TileEntitlementProperties properties;

    public RoutingAuthorizationService(ApplicationCategoryRepo repository, AuthorizationService ems2,
        MappedAuthorizationProvider ems3, TileEntitlementProperties properties) {
        this.repository = Objects.requireNonNull(repository);
        this.ems2 = Objects.requireNonNull(ems2);
        this.ems3 = Objects.requireNonNull(ems3);
        this.properties = Objects.requireNonNull(properties);
    }

    @Override
    public boolean usesTileSnapshot() { return true; }

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
        var scope = new LinkedHashSet<String>();
        for (String entity : requestEntities) {
            require(text(entity) && scope.add(entity), "Entity scope is invalid or duplicated");
        }
        var rows = repository.getAuthorizationTiles()
            .orElseThrow(() -> new AuthorizationUnavailableException("Tile configuration is unavailable"));
        List<TileRoute> candidates = new ArrayList<>();
        List<TileRoute> ownership = new ArrayList<>();
        var ids = new HashSet<Long>();
        for (var original : rows) {
            require(original != null, "Tile configuration is invalid");
            var row = Collections.unmodifiableMap(new LinkedHashMap<>(original));
            require(row.get("application_tile_id") instanceof Number, "Tile identity is invalid");
            require(ids.add(((Number) row.get("application_tile_id")).longValue()), "Tile identity is duplicated");
            var route = tile(row);
            if (route.visible) candidates.add(route);
            if (!Boolean.FALSE.equals(row.get("ownership_present"))) {
                var effective = new LinkedHashMap<>(row);
                for (String field : List.of("provider", "ems2_entities", "ems2_subject", "ems3_app_id", "ems3_app_name", "ems3_subject", "is_template")) {
                    if (row.containsKey("ownership_" + field)) effective.put(field, row.get("ownership_" + field));
                }
                ownership.add(tile(effective));
            }
        }
        validateOwnership(ownership);
        var known = new LinkedHashSet<String>();
        for (var candidate : candidates) known.addAll(candidate.entities);
        if (scope.isEmpty()) scope.addAll(known);
        require(known.containsAll(scope), "Requested entity has no visible tile configuration");
        candidates = candidates.stream().filter(tile -> tile.template || tile.entities.stream().anyMatch(scope::contains)).toList();
        final Set<String> requested = Set.copyOf(scope);
        var legacyScope = new LinkedHashSet<String>();
        var applications = new LinkedHashSet<Ems3Application>();
        for (var tile : candidates) {
            if (tile.template) continue;
            if (tile.modern) {
                Long entityId = properties.getEntityIds().get(tile.entities.get(0));
                require(entityId != null && entityId > 0, "Portal entity ID is required for EMS3");
                applications.add(tile.application);
            } else {
                tile.entities.stream().filter(requested::contains).forEach(legacyScope::add);
            }
        }
        properties.getRetainEms2Entities().stream().filter(requested::contains).forEach(legacyScope::add);
        Ems2Result legacy = legacyScope.isEmpty() ? result(userId, List.of()) : ems2.getEntitlements(userId, List.copyOf(legacyScope));
        validate(legacy, userId, legacyScope, false);
        var modernPortalEntities = candidates.stream().filter(tile -> tile.modern && !tile.template)
            .map(tile -> tile.entities.get(0)).collect(java.util.stream.Collectors.toSet());
        for (var entity : legacy.getEntities()) {
            require(!modernPortalEntities.contains(entity.getName())
                || Objects.equals(properties.getEntityIds().get(entity.getName()), entity.getId()),
                "Legacy result disagrees with configured Portal entity ID");
        }
        var retained = retainLegacy(legacy.getEntities(), ownership);
        Ems2Result modern = applications.isEmpty() ? result(userId, List.of()) : ems3.getEntitlements(userId, List.copyOf(applications));
        validate(modern, userId, applications.stream().map(Ems3Application::appName).collect(java.util.stream.Collectors.toSet()), true);
        var projected = project(modern.getEntities(), candidates);
        var allowed = new ArrayList<Map<String, Object>>();
        for (var tile : candidates) {
            if (tile.template || visible(tile, tile.modern ? projected : retained)) allowed.add(tile.row);
        }
        var merged = new LinkedHashMap<GrantKey, Entity>();
        for (var entity : retained) merge(merged, entity);
        for (var entity : projected) merge(merged, entity);
        var result = result(userId, new ArrayList<>(merged.values()));
        result.setAuthorizedTiles(List.copyOf(allowed));
        result.setFullName(legacy.getFullName());
        result.setAccountOwner(legacy.getAccountOwner());
        result.setAccountStatus(legacy.getAccountStatus());
        result.setAccountType(legacy.getAccountType());
        return result;
    }

    private static TileRoute tile(Map<String, Object> row) {
        String provider = string(row, "provider");
        require("EMS2".equals(provider) || "EMS3".equals(provider), "Tile provider is invalid");
        List<String> entities = Arrays.stream(string(row, "ems2_entities").split(",")).map(String::trim)
            .filter(value -> !value.isEmpty()).distinct().toList();
        String subject = string(row, "ems2_subject").trim();
        boolean modern = "EMS3".equals(provider);
        boolean template = Boolean.TRUE.equals(row.get("is_template"));
        Ems3Application application = null;
        String feature = string(row, "ems3_subject").trim();
        if (modern) {
            require(!template && entities.size() == 1 && text(subject), "EMS3 requires a protected tile, one Portal entity and subject");
            String appId = string(row, "ems3_app_id").trim();
            String appName = string(row, "ems3_app_name").trim();
            require(text(appId) && text(appName) && text(feature), "EMS3 tile lookup is incomplete");
            application = new Ems3Application(appId, appName);
        }
        return new TileRoute(row, entities, subject, modern, application, feature,
            Boolean.TRUE.equals(row.get("visible_candidate")), template);
    }

    private void validateOwnership(List<TileRoute> routes) {
        Map<PermissionKey, TileRoute> permissions = new LinkedHashMap<>();
        Map<String, String> applicationIds = new LinkedHashMap<>();
        for (var route : routes) {
            if (route.template) continue;
            if (route.modern) {
                String prior = applicationIds.putIfAbsent(route.application.appName(), route.application.appId());
                require(prior == null || prior.equals(route.application.appId()), "EMS3 app name has conflicting IDs");
            }
            if (!text(route.subject)) continue;
            for (String entity : route.entities) {
                var prior = permissions.putIfAbsent(new PermissionKey(entity, normalize(subjectName(entity, route))), route);
                require(prior == null || (prior.modern == route.modern && (!route.modern
                    || (prior.application.equals(route.application) && prior.feature.equals(route.feature)))),
                    "Shared Portal permission has conflicting tile sources");
            }
        }
    }

    private List<Entity> retainLegacy(List<Entity> entities, List<TileRoute> routes) {
        var retained = new ArrayList<Entity>();
        for (var original : entities) {
            var copy = copy(original);
            copy.setSubjects(original.getSubjects().stream().filter(subject -> routes.stream().noneMatch(route ->
                route.modern && !route.template && route.entities.contains(original.getName()) && matches(route, subject)))
                .map(RoutingAuthorizationService::copy).toList());
            // An entity-level EMS2 grant remains meaningful even when all migrated subjects were removed.
            retained.add(copy);
        }
        return retained;
    }

    private List<Entity> project(List<Entity> grants, List<TileRoute> routes) {
        var projected = new LinkedHashMap<GrantKey, Entity>();
        for (var route : routes) {
            if (!route.modern || route.template) continue;
            String portalName = route.entities.get(0);
            for (var grant : grants) {
                if (!route.application.appName().equals(grant.getName())) continue;
                for (var feature : grant.getSubjects()) {
                    if (!route.feature.equals(feature.getName())) continue;
                    var entity = copy(grant);
                    entity.setName(portalName);
                    entity.setId(properties.getEntityIds().get(portalName));
                    entity.setApplicationName(route.application.appName());
                    var subject = copy(feature);
                    subject.setName(subjectName(portalName, route));
                    require(text(subject.getName()), "Portal subject name is invalid");
                    subject.setLongName(properties.getSubjectPaths().getOrDefault(portalName + "/" + route.subject, route.subject));
                    require(text(subject.getLongName()), "Portal subject path is invalid");
                    entity.setSubjects(List.of(subject));
                    merge(projected, entity);
                }
            }
        }
        return new ArrayList<>(projected.values());
    }

    private boolean visible(TileRoute tile, List<Entity> grants) {
        return grants.stream().anyMatch(entity -> tile.entities.contains(entity.getName())
            && (!text(tile.subject) || entity.getSubjects().stream().anyMatch(subject -> matches(tile, subject))));
    }

    private boolean matches(TileRoute route, Subject subject) {
        for (String entity : route.entities) {
            String path = properties.getSubjectPaths().getOrDefault(entity + "/" + route.subject, route.subject);
            if (route.subject.equalsIgnoreCase(subject.getName()) || route.subject.equalsIgnoreCase(subject.getLongName())
                || subjectName(entity, route).equalsIgnoreCase(subject.getName()) || path.equalsIgnoreCase(subject.getLongName())) return true;
        }
        return false;
    }

    private String subjectName(String entity, TileRoute route) {
        return properties.getSubjectNames().getOrDefault(entity + "/" + route.subject, route.subject);
    }

    private static void merge(Map<GrantKey, Entity> merged, Entity incoming) {
        var key = new GrantKey(incoming.getName(), incoming.getRoleName());
        var existing = merged.get(key);
        if (existing == null) {
            var created = copy(incoming);
            created.setSubjects(new ArrayList<>(incoming.getSubjects().stream().map(RoutingAuthorizationService::copy).toList()));
            merged.put(key, created);
            return;
        }
        require(Objects.equals(existing.getId(), incoming.getId()), "Conflicting Portal entity identifiers");
        for (var subject : incoming.getSubjects()) {
            var prior = existing.getSubjects().stream().filter(value -> value.getName().equals(subject.getName())).findFirst();
            if (prior.isEmpty()) {
                existing.getSubjects().add(copy(subject));
            } else {
                require(Objects.equals(prior.get().getId(), subject.getId())
                    && prior.get().getLongName().equals(subject.getLongName()), "Conflicting Portal subject identifiers");
                var actions = new LinkedHashMap<String, Action>();
                for (var action : prior.get().getActions()) actions.put(action.getName(), action);
                for (var action : subject.getActions()) {
                    var earlier = actions.putIfAbsent(action.getName(), action);
                    require(earlier == null || Objects.equals(earlier.getId(), action.getId()), "Conflicting action identifiers");
                }
                prior.get().setActions(new ArrayList<>(actions.values()));
            }
        }
    }

    private static Entity copy(Entity original) {
        var copy = new Entity();
        copy.setId(original.getId());
        copy.setName(original.getName());
        copy.setApplicationName(original.getApplicationName());
        copy.setRoleId(original.getRoleId());
        copy.setRoleName(original.getRoleName());
        copy.setSubjects(original.getSubjects());
        return copy;
    }

    private static Subject copy(Subject original) {
        var copy = new Subject();
        copy.setId(original.getId());
        copy.setName(original.getName());
        copy.setLongName(original.getLongName());
        copy.setActions(original.getActions().stream().map(action -> {
            var clone = new Action();
            clone.setId(action.getId());
            clone.setName(action.getName());
            clone.setEntitlementId(action.getEntitlementId());
            return clone;
        }).toList());
        return copy;
    }

    private static void validate(Ems2Result result, String userId, Set<String> requested, boolean modern) {
        require(result != null && result.getEntities() != null, "Provider result is unavailable");
        require(result.getAccountName() == null || result.getAccountName().equals(userId), "Provider returned the wrong account");
        require(result.getStatus() == null || result.getStatus().isBlank()
            || "SUCCESS".equalsIgnoreCase(result.getStatus()), "Provider returned an unsuccessful result");
        var roles = new HashSet<GrantKey>();
        for (Entity entity : result.getEntities()) {
            require(entity != null && text(entity.getName()) && requested.contains(entity.getName()), "Provider returned an entity outside requested scope");
            require(text(entity.getRoleName()) && roles.add(new GrantKey(entity.getName(), entity.getRoleName())), "Provider returned an invalid or duplicate role");
            require(!modern || entity.getName().equals(entity.getApplicationName()), "Provider returned the wrong CES application");
            require(entity.getSubjects() != null, "Provider returned an invalid subject list");
            var subjects = new HashSet<String>();
            for (var subject : entity.getSubjects()) {
                require(subject != null && text(subject.getName()) && subject.getLongName() != null && subjects.add(subject.getName()), "Provider returned an invalid or duplicate subject");
                require(subject.getActions() != null, "Provider returned an invalid action list");
                var actions = new HashSet<String>();
                for (var action : subject.getActions()) {
                    require(action != null && text(action.getName()) && actions.add(action.getName()), "Provider returned an invalid or duplicate action");
                }
            }
        }
    }

    private static Ems2Result result(String userId, List<Entity> entities) {
        var result = new Ems2Result();
        result.setEntities(List.copyOf(entities));
        result.setAccountName(userId);
        result.setStatus("SUCCESS");
        return result;
    }

    private record TileRoute(Map<String, Object> row, List<String> entities, String subject, boolean modern,
        Ems3Application application, String feature, boolean visible, boolean template) {}
    private record GrantKey(String entity, String role) {}
    private record PermissionKey(String entity, String subject) {}
    private static String normalize(String value) { return value.toLowerCase(Locale.ROOT); }
    private static String string(Map<String, Object> row, String key) { return Objects.toString(row.get(key), ""); }
    private static boolean text(String value) { return value != null && !value.isBlank(); }
    private static void require(boolean condition, String message) {
        if (!condition) throw new AuthorizationUnavailableException(message);
    }
}
