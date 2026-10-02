package com.scb.sso.singleuibff.poc;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.dto.ems2.v2.Action;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.service.v2.AuthorizationService;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class PocSession {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String ISSUER = "ems3-function-poc";
    private static final Duration TOKEN_LIFETIME = Duration.ofMinutes(5);
    private final AuthorizationService authorization;
    private final List<Tile> tiles;
    private final Algorithm signing;
    private Result current;
    private long issuedTokens;

    public record Tile(long id, String title, long categoryId, String categoryLabel,
                       List<String> entities, String subject, boolean isTemplate) {}

    public record Drawer(long id, String label, List<Tile> tiles) {}

    public record Result(List<Entity> entities, List<Drawer> drawers,
                         String entitlementsToken, String entitlements) {}

    public PocSession(AuthorizationService authorization) {
        this.authorization = authorization;
        try (var input = PocSession.class.getResourceAsStream("/tiles.json")) {
            tiles = JSON.readValue(input, new TypeReference<List<Tile>>() {});
        } catch (Exception exception) {
            throw new IllegalStateException("POC tile fixtures unavailable", exception);
        }
        var key = new byte[32];
        new SecureRandom().nextBytes(key);
        signing = Algorithm.HMAC256(key);
    }

    public synchronized Result authorize(String user, List<String> entities) {
        current = null;
        try {
            var grants = List.copyOf(authorization.getEntitlements(user, entities).getEntities());
            var visible = drawers(grants);
            var claims = entitlements(grants);
            var now = Instant.now();
            var token = JWT.create().withIssuer(ISSUER).withSubject(user).withJWTId(UUID.randomUUID().toString())
                .withIssuedAt(now).withExpiresAt(now.plus(TOKEN_LIFETIME)).withClaim("entitlements", claims).sign(signing);
            current = new Result(grants, visible, token, claims);
            issuedTokens++;
            return current;
        } catch (Exception exception) {
            throw new IllegalStateException("Authorization unavailable", exception);
        }
    }

    private String entitlements(List<Entity> grants) throws Exception {
        var claims = new LinkedHashMap<String, Map<String, List<String>>>();
        for (var entity : grants) {
            var subjects = new LinkedHashMap<String, List<String>>();
            for (var subject : entity.getSubjects()) {
                subjects.put(subject.getName(), subject.getActions().stream().map(Action::getName).toList());
            }
            claims.put(entity.getName() + ":" + entity.getRoleName(), subjects);
        }
        return JSON.writeValueAsString(claims);
    }

    private List<Drawer> drawers(List<Entity> grants) {
        var grouped = new LinkedHashMap<Long, List<Tile>>();
        for (var tile : tiles) {
            if (tile.isTemplate() || grants.stream().anyMatch(entity -> matches(tile, entity))) {
                grouped.computeIfAbsent(tile.categoryId(), unused -> new ArrayList<>()).add(tile);
            }
        }
        return grouped.entrySet().stream().map(entry -> new Drawer(entry.getKey(),
            entry.getValue().get(0).categoryLabel(), List.copyOf(entry.getValue()))).toList();
    }

    private boolean matches(Tile tile, Entity entity) {
        if (!tile.entities().contains(entity.getName())) {
            return false;
        }
        if (tile.subject() == null || tile.subject().isBlank()) {
            return true;
        }
        return entity.getSubjects().stream().anyMatch(subject ->
            tile.subject().equalsIgnoreCase(subject.getName())
                || tile.subject().equalsIgnoreCase(subject.getLongName()));
    }

    public synchronized Result current() { return current; }

    public synchronized long issuedTokens() { return issuedTokens; }
}
