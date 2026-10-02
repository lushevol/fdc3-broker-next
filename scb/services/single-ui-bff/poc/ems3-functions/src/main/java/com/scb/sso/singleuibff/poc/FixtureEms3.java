package com.scb.sso.singleuibff.poc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Local proposed EMS3 contract for the POC; every account and ID is synthetic. */
public final class FixtureEms3 implements AutoCloseable {
    public static final ObjectMapper JSON = new ObjectMapper();
    public static final String CLIENT_ID = "fixture-client";
    public static final String CLIENT_SECRET = "fixture-secret";
    public static final String SCOPE = "fixture/.default";
    public static final String TOKEN = "fixture-only-token";

    private record Fault(int status, String body) {}

    private final JsonNode catalog;
    private final Map<String, List<Map<String, String>>> initialAccounts;
    private final Map<String, List<Map<String, String>>> accounts = new ConcurrentHashMap<>();
    private final Map<String, Fault> faults = new ConcurrentHashMap<>();
    private final Map<String, Long> delays = new ConcurrentHashMap<>();
    private final Map<String, Long> bodyDelays = new ConcurrentHashMap<>();
    private final HttpServer server;
    private final ExecutorService executor;

    public FixtureEms3() throws IOException {
        catalog = resource("catalog.json");
        initialAccounts = new HashMap<>();
        resource("accounts.json").fields().forEachRemaining(entry -> {
            List<Map<String, String>> roles = new ArrayList<>();
            entry.getValue().forEach(role -> roles.add(Map.of(
                    "entityName", role.path("entityName").asText(),
                    "roleName", role.path("roleName").asText())));
            initialAccounts.put(entry.getKey(), List.copyOf(roles));
        });
        accounts.putAll(initialAccounts);
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        executor = Executors.newCachedThreadPool(task -> {
            Thread thread = new Thread(task, "ems3-poc-fixture");
            thread.setDaemon(true);
            return thread;
        });
        server.setExecutor(executor);
        server.createContext("/token", exchange -> handle(exchange, "token"));
        server.createContext("/entitlement/user-response/", exchange -> handle(exchange, "aggregate"));
        server.createContext("/entitlement/user/", exchange -> handle(exchange, "detail"));
        server.start();
    }

    public URI uri() {
        return URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/");
    }

    public JsonNode detailed(String user) {
        ArrayNode result = JSON.createArrayNode();
        for (Map<String, String> assignment : assignments(user)) {
            JsonNode app = application(assignment.get("entityName"));
            JsonNode role = role(app, assignment.get("roleName"));
            ObjectNode row = result.addObject();
            row.put("entitlementId", role.path("roleId").asText());
            row.put("entitlementName", role.path("roleName").asText());
            row.put("appId", app.path("appId").asText());
            row.put("appName", app.path("appName").asText());
            row.put("appUID", app.path("appUID").asInt());
            row.putNull("itamId");
            ArrayNode pairs = row.putArray("featureActionDtos");
            for (JsonNode subject : role.path("subjects")) {
                for (JsonNode action : subject.path("actions")) {
                    ObjectNode pair = pairs.addObject();
                    ObjectNode feature = pair.putObject("features");
                    feature.put("featureId", subject.path("id").asInt());
                    feature.put("featureName", subject.path("name").asText());
                    feature.set("applicationDto", applicationDto(app));
                    ObjectNode actionDto = pair.putObject("actions");
                    actionDto.put("actionId", action.path("id").asInt());
                    actionDto.put("actionName", action.path("name").asText());
                    actionDto.set("applicationDto", applicationDto(app));
                }
            }
        }
        return result;
    }

    public JsonNode aggregate(String user) {
        List<Map<String, String>> assigned = assignments(user);
        ArrayNode result = JSON.createArrayNode();
        for (JsonNode app : catalog) {
            ObjectNode row = result.addObject();
            ObjectNode userData = row.putObject("user_data");
            userData.put("app_name", app.path("appName").asText());
            userData.put("itam_id", app.path("appId").asText());
            userData.put("user_id", user);
            ObjectNode entitlements = row.putObject("entitlements");
            ArrayNode names = entitlements.putArray("entitlement_name");
            ArrayNode grants = entitlements.putArray("role_entitlements");
            Set<List<String>> seen = new LinkedHashSet<>();
            for (Map<String, String> assignment : assigned) {
                if (!app.path("entityName").asText().equals(assignment.get("entityName"))) {
                    continue;
                }
                JsonNode role = role(app, assignment.get("roleName"));
                names.add(role.path("roleName").asText());
                for (JsonNode subject : role.path("subjects")) {
                    for (JsonNode action : subject.path("actions")) {
                        List<String> pair = List.of(subject.path("name").asText(), action.path("name").asText());
                        if (seen.add(pair)) {
                            ObjectNode grant = grants.addObject();
                            grant.put("feature", pair.get(0));
                            grant.put("action", pair.get(1));
                        }
                    }
                }
            }
        }
        return result;
    }

    public void assign(String user, List<Map<String, String>> roles) {
        if (user == null || user.isBlank()) {
            throw new IllegalArgumentException("A synthetic account name is required");
        }
        List<Map<String, String>> verified = new ArrayList<>();
        for (Map<String, String> assignment : roles) {
            String entityName = assignment.get("entityName");
            String roleName = assignment.get("roleName");
            role(application(entityName), roleName);
            Map<String, String> value = Map.of("entityName", entityName, "roleName", roleName);
            if (!verified.contains(value)) {
                verified.add(value);
            }
        }
        accounts.put(user, List.copyOf(verified));
    }

    public void revoke(String user) {
        assign(user, List.of());
    }

    public void override(String endpoint, int status, String body) {
        validateEndpoint(endpoint);
        if (status < 100 || status > 599 || body == null) {
            throw new IllegalArgumentException("Invalid fixture response");
        }
        faults.put(endpoint, new Fault(status, body));
    }

    public void delay(String endpoint, long millis) {
        validateEndpoint(endpoint);
        if (millis < 0) {
            throw new IllegalArgumentException("Delay must be non-negative");
        }
        delays.put(endpoint, millis);
    }

    public void bodyDelay(String endpoint, long millis) {
        validateEndpoint(endpoint);
        if (millis < 0) {
            throw new IllegalArgumentException("Delay must be non-negative");
        }
        bodyDelays.put(endpoint, millis);
    }

    public void reset() {
        faults.clear();
        delays.clear();
        bodyDelays.clear();
        accounts.clear();
        accounts.putAll(initialAccounts);
    }

    @Override
    public void close() {
        server.stop(0);
        executor.shutdownNow();
    }

    private void handle(HttpExchange exchange, String endpoint) throws IOException {
        try (exchange) {
            long millis = delays.getOrDefault(endpoint, 0L);
            if (millis > 0) {
                try {
                    Thread.sleep(millis);
                } catch (InterruptedException interrupted) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
            if (endpoint.equals("token")) {
                if (!exchange.getRequestMethod().equals("POST")) {
                    respond(exchange, endpoint, 405, error("POST required"));
                    return;
                }
                Map<String, String> form = form(exchange.getRequestBody());
                if (!CLIENT_ID.equals(form.get("client_id"))
                        || !CLIENT_SECRET.equals(form.get("client_secret"))
                        || !"client_credentials".equals(form.get("grant_type"))
                        || !SCOPE.equals(form.get("scope"))) {
                    respond(exchange, endpoint, 401, error("Invalid synthetic client credentials"));
                    return;
                }
            } else {
                if (!exchange.getRequestMethod().equals("GET")) {
                    respond(exchange, endpoint, 405, error("GET required"));
                    return;
                }
                if (!("Bearer " + TOKEN).equals(exchange.getRequestHeaders().getFirst("Authorization"))) {
                    respond(exchange, endpoint, 401, error("Synthetic bearer token required"));
                    return;
                }
            }
            Fault fault = faults.get(endpoint);
            if (fault != null) {
                respond(exchange, endpoint, fault.status(), fault.body());
                return;
            }
            if (endpoint.equals("token")) {
                ObjectNode token = JSON.createObjectNode();
                token.put("access_token", TOKEN);
                token.put("token_type", "Bearer");
                token.put("expires_in", 300);
                respond(exchange, endpoint, 200, JSON.writeValueAsString(token));
                return;
            }
            String prefix = endpoint.equals("detail") ? "/entitlement/user/" : "/entitlement/user-response/";
            String user = exchange.getRequestURI().getPath().substring(prefix.length());
            if (!accounts.containsKey(user)) {
                respond(exchange, endpoint, 404, error("Unknown synthetic account"));
                return;
            }
            JsonNode result = endpoint.equals("detail") ? detailed(user) : aggregate(user);
            respond(exchange, endpoint, 200, JSON.writeValueAsString(result));
        } catch (IllegalArgumentException invalid) {
            // A malformed fixture request closes the exchange without granting access.
            exchange.close();
        }
    }

    private List<Map<String, String>> assignments(String user) {
        List<Map<String, String>> assigned = accounts.get(user);
        if (assigned == null) {
            throw new IllegalArgumentException("Unknown synthetic account: " + user);
        }
        return assigned;
    }

    private JsonNode application(String entity) {
        for (JsonNode app : catalog) {
            if (app.path("entityName").asText().equals(entity)) {
                return app;
            }
        }
        throw new IllegalArgumentException("Unknown fixture entity: " + entity);
    }

    private JsonNode role(JsonNode app, String name) {
        for (JsonNode role : app.path("roles")) {
            if (role.path("roleName").asText().equals(name)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown fixture role: " + name);
    }

    private ObjectNode applicationDto(JsonNode app) {
        ObjectNode result = JSON.createObjectNode();
        result.put("appUID", app.path("appUID").asInt());
        result.put("appName", app.path("appName").asText());
        return result;
    }

    private static JsonNode resource(String name) throws IOException {
        try (InputStream stream = FixtureEms3.class.getClassLoader().getResourceAsStream(name)) {
            if (stream == null) {
                throw new IOException("Missing POC fixture: " + name);
            }
            return JSON.readTree(stream);
        }
    }

    private static Map<String, String> form(InputStream body) throws IOException {
        Map<String, String> result = new HashMap<>();
        String encoded = new String(body.readAllBytes(), StandardCharsets.UTF_8);
        for (String field : encoded.split("&")) {
            String[] pair = field.split("=", 2);
            if (pair.length == 2) {
                result.put(URLDecoder.decode(pair[0], StandardCharsets.UTF_8),
                        URLDecoder.decode(pair[1], StandardCharsets.UTF_8));
            }
        }
        return result;
    }

    private static void validateEndpoint(String endpoint) {
        if (!Set.of("token", "detail", "aggregate").contains(endpoint)) {
            throw new IllegalArgumentException("Unknown fixture endpoint: " + endpoint);
        }
    }

    private static String error(String message) throws IOException {
        return JSON.writeValueAsString(Map.of("error", message));
    }

    private void respond(HttpExchange exchange, String endpoint, int status, String body) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        if (status < 200 || status == 204 || status == 304) {
            exchange.sendResponseHeaders(status, -1);
            return;
        }
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(status, bytes.length);
        long millis = bodyDelays.getOrDefault(endpoint, 0L);
        if (millis > 0) {
            try {
                Thread.sleep(millis);
            } catch (InterruptedException interrupted) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        exchange.getResponseBody().write(bytes);
    }
}
