package com.scb.sso.singleuibff.poc;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Flow;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/** Isolated local adapter for a proposed EMS3 contract, using synthetic mappings. */
public final class FunctionAuthorization implements AuthorizationService {
    private static final ObjectMapper JSON = new ObjectMapper()
        .enable(JsonParser.Feature.STRICT_DUPLICATE_DETECTION)
        .enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);
    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(2);
    private static final int MAX_RESPONSE_BYTES = 1_048_576;
    private static final String TOKEN_FORM = "grant_type=client_credentials&client_id=fixture-client"
        + "&client_secret=fixture-secret&scope=fixture%2F.default";
    private final URI gateway;
    private final Duration timeout;
    private final HttpClient client;
    private final JsonNode catalog;

    public FunctionAuthorization(URI gateway) {
        this(gateway, DEFAULT_TIMEOUT);
    }

    public FunctionAuthorization(URI gateway, Duration timeout) {
        // Synthetic credentials must never be sent to a live service.
        require(gateway != null && "http".equals(gateway.getScheme())
            && Set.of("127.0.0.1", "localhost", "[::1]").contains(gateway.getHost())
            && gateway.getUserInfo() == null && gateway.getQuery() == null
            && gateway.getFragment() == null && "/".equals(gateway.getPath()), "Loopback base URL required");
        require(timeout != null && !timeout.isNegative() && !timeout.isZero(), "Positive timeout required");
        this.gateway = gateway;
        this.timeout = timeout;
        client = HttpClient.newBuilder().connectTimeout(timeout).followRedirects(HttpClient.Redirect.NEVER).build();
        try (var stream = FunctionAuthorization.class.getResourceAsStream("/catalog.json")) {
            catalog = JSON.readTree(stream);
        } catch (IOException failure) {
            throw new IllegalStateException("Cannot load POC mapping", failure);
        }
    }

    @Override
    public Ems2Result getEntitlements(String userId, List<String> requestEntities) {
        try {
            require(userId != null && userId.matches("[A-Za-z0-9_-]{1,80}"), "Invalid test account");
            require(requestEntities != null && !requestEntities.isEmpty(), "Entity scope required");
            require(new HashSet<>(requestEntities).size() == requestEntities.size(), "Duplicate requested entity");
            for (String entity : requestEntities) {
                named(catalog, "entityName", entity);
            }
            var tokenRequest = HttpRequest.newBuilder(gateway.resolve("token")).timeout(timeout)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(TOKEN_FORM)).build();
            JsonNode token = fetch(tokenRequest);
            String bearer = text(token, "access_token");
            require(bearer.matches("[A-Za-z0-9._~-]+"), "Invalid bearer token");
            require("Bearer".equals(text(token, "token_type")), "Unexpected token type");
            positive(token, "expires_in");
            JsonNode detail = fetch(grantsRequest("entitlement/user/", userId, bearer));
            JsonNode aggregate = fetch(grantsRequest("entitlement/user-response/", userId, bearer));
            List<Entity> entities = map(detail, aggregate, userId);
            var result = new Ems2Result();
            result.setEntities(entities.stream().filter(entity -> requestEntities.contains(entity.getName())).toList());
            result.setAccountName(userId);
            result.setStatus("SUCCESS");
            return result;
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("EMS3 authorization unavailable", interrupted);
        } catch (IOException | RuntimeException failure) {
            throw new IllegalStateException("EMS3 authorization unavailable", failure);
        }
    }

    private HttpRequest grantsRequest(String endpoint, String user, String bearer) {
        return HttpRequest.newBuilder(gateway.resolve(endpoint + user)).timeout(timeout)
            .header("Authorization", "Bearer " + bearer).GET().build();
    }

    private JsonNode fetch(HttpRequest request) throws IOException, InterruptedException {
        var pending = client.sendAsync(request, info -> new LimitedBody());
        try {
            var response = pending.get(timeout.toNanos(), TimeUnit.NANOSECONDS);
            require(response.statusCode() == 200, "Required API did not return HTTP 200");
            return JSON.readTree(response.body());
        } catch (TimeoutException expired) {
            pending.cancel(true);
            throw new HttpTimeoutException("EMS3 response deadline exceeded");
        } catch (ExecutionException failed) {
            throw new IOException("EMS3 request failed", failed.getCause());
        } catch (InterruptedException interrupted) {
            pending.cancel(true);
            throw interrupted;
        }
    }

    private List<Entity> map(JsonNode detail, JsonNode aggregate, String user) {
        array(detail);
        array(aggregate);
        var entities = new ArrayList<Entity>();
        Map<String, Set<String>> rolesByApp = new LinkedHashMap<>();
        Map<String, Set<Pair>> pairsByApp = new LinkedHashMap<>();
        for (JsonNode app : catalog) {
            rolesByApp.put(app.path("appName").asText(), new LinkedHashSet<>());
            pairsByApp.put(app.path("appName").asText(), new LinkedHashSet<>());
        }
        for (JsonNode row : detail) {
            String appName = text(row, "appName");
            JsonNode app = named(catalog, "appName", appName);
            require(text(row, "appId").equals(app.path("appId").asText()), "Wrong application ID");
            require(positive(row, "appUID") == app.path("appUID").asLong(), "Wrong application UID");
            String roleName = text(row, "entitlementName");
            JsonNode role = named(app.path("roles"), "roleName", roleName);
            require(text(row, "entitlementId").equals(role.path("roleId").asText()), "Wrong role ID");
            require(rolesByApp.get(appName).add(roleName), "Duplicate application role");
            var entity = new Entity();
            entity.setId(app.path("entityId").asLong());
            entity.setName(app.path("entityName").asText());
            entity.setApplicationName(appName);
            entity.setRoleName(roleName);
            entity.setRoleId(role.path("roleId").asLong());
            Map<String, Subject> subjects = new LinkedHashMap<>();
            Set<Pair> rolePairs = new HashSet<>();
            for (JsonNode grant : array(row.get("featureActionDtos"))) {
                JsonNode feature = object(grant, "features");
                JsonNode actionDto = object(grant, "actions");
                validateNestedApp(feature, app);
                validateNestedApp(actionDto, app);
                String featureName = text(feature, "featureName");
                String actionName = text(actionDto, "actionName");
                JsonNode configuredSubject = named(role.path("subjects"), "name", featureName);
                JsonNode configuredAction = named(configuredSubject.path("actions"), "name", actionName);
                require(positive(feature, "featureId") == configuredSubject.path("id").asLong(), "Wrong feature ID");
                require(positive(actionDto, "actionId") == configuredAction.path("id").asLong(), "Wrong action ID");
                Pair pair = new Pair(featureName, actionName);
                require(rolePairs.add(pair), "Duplicate role grant");
                pairsByApp.get(appName).add(pair);
                Subject subject = subjects.computeIfAbsent(featureName, key -> {
                    var added = new Subject();
                    added.setId(configuredSubject.path("id").asLong());
                    added.setName(key);
                    added.setLongName(configuredSubject.path("longName").asText());
                    added.setActions(new ArrayList<>());
                    return added;
                });
                var action = new Action();
                action.setId(configuredAction.path("id").asLong());
                action.setName(actionName);
                action.setEntitlementId(configuredAction.path("entitlementId").asLong());
                subject.getActions().add(action);
            }
            entity.setSubjects(List.copyOf(subjects.values()));
            entities.add(entity);
        }
        Set<String> seenApps = new HashSet<>();
        for (JsonNode row : aggregate) {
            JsonNode userData = object(row, "user_data");
            String appName = text(userData, "app_name");
            JsonNode app = named(catalog, "appName", appName);
            require(seenApps.add(appName), "Duplicate application record");
            require(text(userData, "itam_id").equals(app.path("appId").asText()), "Wrong aggregate application ID");
            require(text(userData, "user_id").equals(user), "Wrong echoed test account");
            JsonNode entitlements = object(row, "entitlements");
            Set<String> names = new HashSet<>();
            for (JsonNode name : array(entitlements.get("entitlement_name"))) {
                require(name.isTextual() && !name.asText().isBlank(), "Role name must be text");
                require(names.add(name.asText()), "Duplicate aggregate role");
            }
            Set<Pair> pairs = new HashSet<>();
            for (JsonNode grant : array(entitlements.get("role_entitlements"))) {
                require(pairs.add(new Pair(text(grant, "feature"), text(grant, "action"))), "Duplicate aggregate grant");
            }
            require(names.equals(rolesByApp.get(appName)), "Endpoints disagree on roles");
            require(pairs.equals(pairsByApp.get(appName)), "Endpoints disagree on function grants");
        }
        require(seenApps.equals(rolesByApp.keySet()), "Incomplete application response");
        return List.copyOf(entities);
    }

    private static void validateNestedApp(JsonNode dto, JsonNode app) {
        JsonNode nested = object(dto, "applicationDto");
        require(text(nested, "appName").equals(app.path("appName").asText()), "Wrong nested application name");
        require(positive(nested, "appUID") == app.path("appUID").asLong(), "Wrong nested application UID");
    }

    private static JsonNode named(JsonNode rows, String field, String name) {
        for (JsonNode row : rows) {
            if (row.path(field).asText().equals(name)) {
                return row;
            }
        }
        throw new IllegalStateException("Unmapped " + field);
    }

    private static JsonNode object(JsonNode parent, String field) {
        require(parent != null && parent.isObject(), "Object required");
        JsonNode value = parent.get(field);
        require(value != null && value.isObject(), "Required object missing or invalid");
        return value;
    }

    private static JsonNode array(JsonNode value) {
        require(value != null && value.isArray(), "Array required");
        return value;
    }

    private static String text(JsonNode parent, String field) {
        require(parent != null && parent.isObject(), "Object required");
        JsonNode value = parent.get(field);
        require(value != null && value.isTextual() && !value.asText().isBlank(), "Required text missing or invalid");
        return value.asText();
    }

    private static long positive(JsonNode parent, String field) {
        JsonNode value = parent.get(field);
        require(value != null && value.isIntegralNumber() && value.canConvertToLong()
            && value.asLong() > 0, "Positive integer required");
        return value.asLong();
    }

    private static void require(boolean condition, String message) {
        if (!condition) {
            throw new IllegalStateException(message);
        }
    }

    private record Pair(String feature, String action) {}

    private static final class LimitedBody implements HttpResponse.BodySubscriber<String> {
        private final HttpResponse.BodySubscriber<String> delegate =
            HttpResponse.BodySubscribers.ofString(StandardCharsets.UTF_8);
        private Flow.Subscription subscription;
        private long bytes;

        @Override
        public CompletionStage<String> getBody() { return delegate.getBody(); }

        @Override
        public void onSubscribe(Flow.Subscription upstream) {
            subscription = upstream;
            delegate.onSubscribe(upstream);
        }

        @Override
        public void onNext(List<ByteBuffer> chunks) {
            for (var chunk : chunks) {
                bytes += chunk.remaining();
            }
            if (bytes > MAX_RESPONSE_BYTES) {
                subscription.cancel();
                delegate.onError(new IOException("Response exceeds POC byte limit"));
            } else {
                delegate.onNext(chunks);
            }
        }

        @Override
        public void onError(Throwable failure) { delegate.onError(failure); }

        @Override
        public void onComplete() { delegate.onComplete(); }
    }
}
