package com.scb.sso.singleuibff.service.v2.implementation;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.EMS3ConfigProperties;
import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Ems2Result;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.entity.AuthorizationApplication;
import com.scb.sso.singleuibff.service.v2.AuthorizationUnavailableException;
import com.scb.sso.singleuibff.service.v2.MappedAuthorizationProvider;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ProxySelector;
import java.net.URI;
import java.net.URLEncoder;
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

public final class EMS3AuthorizationImplementation implements MappedAuthorizationProvider {
    private static final int MAX_RESPONSE_BYTES = 1_048_576;
    private static final ObjectMapper JSON = new ObjectMapper()
        .enable(JsonParser.Feature.STRICT_DUPLICATE_DETECTION)
        .enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);
    private final EMS3ConfigProperties properties;
    private volatile Transport transport;

    public EMS3AuthorizationImplementation(EMS3ConfigProperties properties) {
        this.properties = properties;
    }

    @Override
    public Ems2Result getEntitlements(String userId, List<AuthorizationApplication> applications) {
        try {
            require(userId != null && !userId.isBlank() && userId.length() <= 255
                && userId.chars().noneMatch(Character::isISOControl), "Invalid user identity");
            require(applications != null && !applications.isEmpty(), "Application scope required");
            Map<String, ApplicationGrants> selected = selectedApplications(applications);
            var configured = transport();
            var settings = configured.settings();
            String form = "grant_type=client_credentials&client_id=" + encode(settings.clientId())
                + "&client_secret=" + encode(settings.clientSecret()) + "&scope=" + encode(settings.scope());
            var tokenRequest = HttpRequest.newBuilder(settings.tokenUrl()).timeout(settings.readTimeout())
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form)).build();
            JsonNode token = fetch(configured.tokenClient(), tokenRequest, settings.readTimeout());
            String bearer = text(token, "access_token");
            require(bearer.matches("[A-Za-z0-9._~+/=-]+"), "Invalid bearer token");
            require("Bearer".equalsIgnoreCase(text(token, "token_type")), "Unexpected token type");
            positive(token, "expires_in");
            JsonNode detail = fetch(configured.grantClient(), grantRequest(settings.detailUrl(), userId, bearer, settings.readTimeout()),
                settings.readTimeout());
            JsonNode aggregate = fetch(configured.grantClient(), grantRequest(settings.aggregateUrl(), userId, bearer, settings.readTimeout()),
                settings.readTimeout());
            List<Entity> entities = map(detail, aggregate, selected, userId);
            var result = new Ems2Result();
            result.setEntities(entities);
            result.setAccountName(userId);
            result.setStatus("SUCCESS");
            return result;
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
            throw new AuthorizationUnavailableException("EMS3 authorization unavailable", interrupted);
        } catch (IOException | RuntimeException failure) {
            throw new AuthorizationUnavailableException("EMS3 authorization unavailable", failure);
        }
    }

    private Transport transport() {
        var current = transport;
        if (current == null) {
            synchronized (this) {
                current = transport;
                if (current == null) {
                    var configured = settings();
                    current = new Transport(configured, client(configured, true), client(configured, false));
                    transport = current;
                }
            }
        }
        return current;
    }

    private Settings settings() {
        require(properties != null, "EMS3 configuration required");
        URI tokenUrl = endpoint(properties.getTokenUrl());
        URI detailUrl = endpoint(properties.getDetailUrl());
        URI aggregateUrl = endpoint(properties.getAggregateUrl());
        require(nonblank(properties.getClientId()) && nonblank(properties.getClientSecret()) && nonblank(properties.getScope()),
            "EMS3 credentials and scope required");
        Duration connect = properties.getConnectTimeout();
        Duration read = properties.getReadTimeout();
        require(positiveDuration(connect) && positiveDuration(read), "Positive bounded timeouts required");
        String proxyHost = properties.getTokenProxyHost();
        int proxyPort = properties.getTokenProxyPort();
        require((!nonblank(proxyHost) && proxyPort == 0) || (nonblank(proxyHost) && proxyPort > 0 && proxyPort <= 65535),
            "Invalid token proxy configuration");
        return new Settings(tokenUrl, detailUrl, aggregateUrl, properties.getClientId(), properties.getClientSecret(),
            properties.getScope(), connect, read, proxyHost, proxyPort);
    }

    private URI endpoint(URI value) {
        require(value != null && value.isAbsolute() && value.getHost() != null && value.getUserInfo() == null
            && value.getQuery() == null && value.getFragment() == null, "Invalid EMS3 endpoint");
        boolean loopback = Set.of("127.0.0.1", "localhost", "[::1]").contains(value.getHost());
        require("https".equals(value.getScheme())
            || (properties.isAllowInsecureLocalhost() && loopback && "http".equals(value.getScheme())),
            "HTTPS EMS3 endpoint required");
        return value;
    }

    private static HttpClient client(Settings settings, boolean token) {
        var builder = HttpClient.newBuilder().connectTimeout(settings.connectTimeout())
            .followRedirects(HttpClient.Redirect.NEVER);
        if (token && nonblank(settings.proxyHost())) {
            builder.proxy(ProxySelector.of(new InetSocketAddress(settings.proxyHost(), settings.proxyPort())));
        }
        return builder.build();
    }

    private static HttpRequest grantRequest(URI endpoint, String user, String bearer, Duration timeout) {
        String route = endpoint.toASCIIString();
        return HttpRequest.newBuilder(URI.create(route + (route.endsWith("/") ? "" : "/") + encode(user)))
            .timeout(timeout).header("Authorization", "Bearer " + bearer).GET().build();
    }

    private static JsonNode fetch(HttpClient client, HttpRequest request, Duration timeout) throws IOException, InterruptedException {
        var pending = client.sendAsync(request, info -> new LimitedBody());
        try {
            var response = pending.get(timeout.toNanos(), TimeUnit.NANOSECONDS);
            require(response.statusCode() == 200, "Required EMS3 API did not return HTTP 200");
            JsonNode body = JSON.readTree(response.body());
            require(body != null, "Required EMS3 response missing");
            return body;
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

    private static Map<String, ApplicationGrants> selectedApplications(List<AuthorizationApplication> applications) {
        Map<String, ApplicationGrants> selected = new LinkedHashMap<>();
        Set<String> entities = new HashSet<>();
        Set<Long> uids = new HashSet<>();
        for (var app : applications) {
            require(app != null && nonblank(app.getBffEntityName()) && positiveId(app.getBffEntityId())
                && nonblank(app.getEms3AppName()) && nonblank(app.getEms3AppId())
                && positiveId(app.getEms3AppUid()) && nonblank(app.getEms3ItamId()), "Invalid EMS3 application mapping");
            require(entities.add(app.getBffEntityName()) && uids.add(app.getEms3AppUid())
                && !selected.containsKey(app.getEms3AppName()), "Duplicate EMS3 application mapping");
            Map<String, String> longNames = app.getSubjectLongNames();
            require(longNames != null && longNames.entrySet().stream()
                .allMatch(entry -> nonblank(entry.getKey()) && nonblank(entry.getValue())), "Invalid subject path mapping");
            selected.put(app.getEms3AppName(), new ApplicationGrants(app.getBffEntityName(), app.getBffEntityId(),
                app.getEms3AppName(), app.getEms3AppId(), app.getEms3AppUid(), app.getEms3ItamId(), Map.copyOf(longNames)));
        }
        return selected;
    }

    private static List<Entity> map(JsonNode detail, JsonNode aggregate, Map<String, ApplicationGrants> selected, String user) {
        for (JsonNode row : array(detail)) {
            String appName = text(row, "appName");
            ApplicationGrants app = selected.get(appName);
            if (app == null) {
                JsonNode uid = row.get("appUID");
                require(uid == null || !uid.isIntegralNumber()
                    || selected.values().stream().noneMatch(expected -> uid.asLong() == expected.appUid), "Wrong selected application name");
                continue;
            }
            require(text(row, "appId").equals(app.appId) && positive(row, "appUID") == app.appUid,
                "Wrong selected application identity");
            JsonNode itam = row.get("itamId");
            require(itam == null || itam.isNull() || (itam.isTextual() && itam.asText().equals(app.itamId)), "Wrong selected ITAM identity");
            String roleName = text(row, "entitlementName");
            long roleId = numericText(row, "entitlementId");
            require(app.roleNames.add(roleName) && app.roleIds.add(roleId), "Duplicate application role");
            var entity = new Entity();
            entity.setId(app.entityId);
            entity.setName(app.entityName);
            entity.setApplicationName(app.appName);
            entity.setRoleName(roleName);
            entity.setRoleId(roleId);
            Map<String, Subject> subjects = new LinkedHashMap<>();
            Set<Pair> rolePairs = new HashSet<>();
            for (JsonNode grant : array(row.get("featureActionDtos"))) {
                JsonNode feature = object(grant, "features");
                JsonNode actionDto = object(grant, "actions");
                validateNestedApplication(feature, app);
                validateNestedApplication(actionDto, app);
                String featureName = text(feature, "featureName");
                String actionName = text(actionDto, "actionName");
                long featureId = positive(feature, "featureId");
                long actionId = positive(actionDto, "actionId");
                app.featureIdentities.accept(featureName, featureId);
                app.actionIdentities.accept(actionName, actionId);
                Pair pair = new Pair(featureName, actionName);
                require(rolePairs.add(pair), "Duplicate role grant");
                app.pairs.add(pair);
                Subject subject = subjects.computeIfAbsent(featureName, name -> {
                    var created = new Subject();
                    created.setId(featureId);
                    created.setName(name);
                    created.setLongName(app.longNames.getOrDefault(name, name));
                    created.setActions(new ArrayList<>());
                    return created;
                });
                var action = new Action();
                action.setId(actionId);
                action.setName(actionName);
                subject.getActions().add(action);
            }
            entity.setSubjects(List.copyOf(subjects.values()));
            app.entities.add(entity);
        }
        Set<String> seen = new HashSet<>();
        for (JsonNode row : array(aggregate)) {
            JsonNode userData = object(row, "user_data");
            String appName = text(userData, "app_name");
            ApplicationGrants app = selected.get(appName);
            if (app == null) {
                continue;
            }
            require(seen.add(appName), "Duplicate selected aggregate application");
            require(text(userData, "itam_id").equals(app.itamId) && text(userData, "user_id").equals(user),
                "Wrong aggregate user or application identity");
            JsonNode entitlements = object(row, "entitlements");
            Set<String> roles = new HashSet<>();
            for (JsonNode role : array(entitlements.get("entitlement_name"))) {
                require(role.isTextual() && !role.asText().isBlank() && roles.add(role.asText()), "Invalid aggregate role");
            }
            Set<Pair> pairs = new HashSet<>();
            for (JsonNode grant : array(entitlements.get("role_entitlements"))) {
                require(pairs.add(new Pair(text(grant, "feature"), text(grant, "action"))), "Duplicate aggregate grant");
            }
            require(roles.equals(app.roleNames) && pairs.equals(app.pairs), "EMS3 endpoints disagree on selected grants");
        }
        require(seen.equals(selected.keySet()), "Incomplete selected application response");
        return selected.values().stream().flatMap(app -> app.entities.stream()).toList();
    }

    private static void validateNestedApplication(JsonNode dto, ApplicationGrants app) {
        JsonNode nested = object(dto, "applicationDto");
        require(text(nested, "appName").equals(app.appName) && positive(nested, "appUID") == app.appUid,
            "Wrong nested application identity");
    }

    private static JsonNode array(JsonNode value) {
        require(value != null && value.isArray(), "Array required");
        return value;
    }

    private static JsonNode object(JsonNode parent, String field) {
        require(parent != null && parent.isObject(), "Object required");
        JsonNode value = parent.get(field);
        require(value != null && value.isObject(), "Required object missing or invalid");
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
        require(value != null && value.isIntegralNumber() && value.canConvertToLong() && value.asLong() > 0,
            "Positive integer required");
        return value.asLong();
    }

    private static long numericText(JsonNode parent, String field) {
        String value = text(parent, field);
        require(value.matches("[1-9][0-9]*"), "Positive numeric identifier required");
        return Long.parseLong(value);
    }

    private static boolean nonblank(String value) { return value != null && !value.isBlank(); }
    private static boolean positiveId(Long value) { return value != null && value > 0; }
    private static boolean positiveDuration(Duration value) {
        return value != null && !value.isZero() && !value.isNegative() && value.compareTo(Duration.ofMinutes(1)) <= 0;
    }
    private static String encode(String value) { return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20"); }
    private static void require(boolean condition, String message) {
        if (!condition) {
            throw new IllegalStateException(message);
        }
    }

    private record Settings(URI tokenUrl, URI detailUrl, URI aggregateUrl, String clientId, String clientSecret,
                            String scope, Duration connectTimeout, Duration readTimeout, String proxyHost, int proxyPort) {
        @Override
        public String toString() { return "EMS3 transport settings"; }
    }
    private record Transport(Settings settings, HttpClient tokenClient, HttpClient grantClient) {}
    private record Pair(String feature, String action) {}

    private static final class Identities {
        private final Map<String, Long> byName = new LinkedHashMap<>();
        private final Map<Long, String> byId = new LinkedHashMap<>();

        private void accept(String name, long id) {
            require(!byName.containsKey(name) || byName.get(name) == id, "Conflicting permission identifier");
            require(!byId.containsKey(id) || byId.get(id).equals(name), "Conflicting permission name");
            byName.put(name, id);
            byId.put(id, name);
        }
    }

    private static final class ApplicationGrants {
        private final String entityName;
        private final long entityId;
        private final String appName;
        private final String appId;
        private final long appUid;
        private final String itamId;
        private final Map<String, String> longNames;
        private final Set<String> roleNames = new LinkedHashSet<>();
        private final Set<Long> roleIds = new HashSet<>();
        private final Set<Pair> pairs = new LinkedHashSet<>();
        private final List<Entity> entities = new ArrayList<>();
        private final Identities featureIdentities = new Identities();
        private final Identities actionIdentities = new Identities();

        private ApplicationGrants(String entityName, long entityId, String appName, String appId, long appUid,
                                  String itamId, Map<String, String> longNames) {
            this.entityName = entityName;
            this.entityId = entityId;
            this.appName = appName;
            this.appId = appId;
            this.appUid = appUid;
            this.itamId = itamId;
            this.longNames = longNames;
        }
    }

    private static final class LimitedBody implements HttpResponse.BodySubscriber<byte[]> {
        private final HttpResponse.BodySubscriber<byte[]> delegate = HttpResponse.BodySubscribers.ofByteArray();
        private Flow.Subscription subscription;
        private long bytes;

        @Override
        public CompletionStage<byte[]> getBody() { return delegate.getBody(); }
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
                delegate.onError(new IOException("EMS3 response exceeds byte limit"));
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
