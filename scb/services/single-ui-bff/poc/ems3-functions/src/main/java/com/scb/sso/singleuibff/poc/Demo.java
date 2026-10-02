package com.scb.sso.singleuibff.poc;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Finite local demonstration; does not connect to EMS3 or print tokens. */
public final class Demo {
    private static final List<String> ENTITIES = List.of("X_RATANONE", "FMO PORTAL ADMIN");
    private static final ObjectMapper JSON = new ObjectMapper();

    public static void main(String[] arguments) throws Exception {
        try (var ems3 = new FixtureEms3()) {
            var session = new PocSession(new FunctionAuthorization(ems3.uri()));
            var accounts = new LinkedHashMap<String, List<Long>>();
            accounts.put("poc-ratan", List.of(54L, 104L, 105L, 9001L, 9002L, 9004L));
            accounts.put("poc-admin", List.of(1L, 2L, 3L, 4L, 9001L));
            accounts.put("poc-both", List.of(1L, 2L, 3L, 4L, 54L, 104L, 105L, 9001L, 9002L, 9004L));
            accounts.put("poc-two-roles", List.of(18L, 54L, 104L, 105L, 9001L, 9002L, 9004L));
            accounts.put("poc-none", List.of(9001L));
            for (var entry : accounts.entrySet()) {
                var result = session.authorize(entry.getKey(), ENTITIES);
                var actual = tiles(result);
                if (!entry.getValue().equals(actual)) {
                    throw new IllegalStateException("Unexpected tiles for " + entry.getKey());
                }
                report(Map.of("account", entry.getKey(), "visibleTileIds", actual,
                    "roleKeys", JSON.readTree(result.entitlements()).properties().stream().map(Map.Entry::getKey).toList(),
                    "check", "PASS"));
            }
            session.authorize("poc-ratan", ENTITIES);
            ems3.revoke("poc-ratan");
            var revoked = session.authorize("poc-ratan", ENTITIES);
            if (!tiles(revoked).equals(List.of(9001L)) || !revoked.entities().isEmpty()) {
                throw new IllegalStateException("Revocation did not clear grants");
            }
            report(Map.of("scenario", "role removed", "visibleTileIds", tiles(revoked), "check", "PASS"));
            ems3.reset();
            session.authorize("poc-both", ENTITIES);
            long issuedBeforeError = session.issuedTokens();
            ems3.override("aggregate", 503, "{}");
            try {
                session.authorize("poc-both", ENTITIES);
                throw new AssertionError("API failure granted access");
            } catch (IllegalStateException expected) {
                if (session.current() != null || session.issuedTokens() != issuedBeforeError) {
                    throw new AssertionError("Failure retained access or issued a token");
                }
                report(Map.of("scenario", "API error after success", "access", "DENIED",
                    "oldTilesCleared", true, "newTokens", 0, "check", "PASS"));
            }
        }
    }

    private static List<Long> tiles(PocSession.Result result) {
        return result.drawers().stream().flatMap(drawer -> drawer.tiles().stream())
            .map(PocSession.Tile::id).sorted().toList();
    }

    private static void report(Map<String, Object> result) throws Exception {
        System.out.println(JSON.writeValueAsString(result));
    }
}
