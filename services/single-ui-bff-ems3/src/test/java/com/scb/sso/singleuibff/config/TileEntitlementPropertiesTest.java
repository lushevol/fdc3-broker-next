package com.scb.sso.singleuibff.config;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.io.ByteArrayResource;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TileEntitlementPropertiesTest {
    @Test
    void bindsQuotedBracketKeysWithoutChangingPortalCaseUnderscoresSpacesOrPaths() throws Exception {
        String yaml = """
            scb:
              tile-entitlements:
                entity-ids:
                  "[X_RATANONE]": 7
                  "[FLOW_ZERO]": 8
                subject-paths:
                  "[X_RATANONE/RATAN_STRATEGIC_CASHFLOW_BLOTTER]": /RATAN_STRATEGIC_CASHFLOW_BLOTTER
                  "[FLOW_ZERO/FLOW_ZERO_RAISE REQUEST]": FLOW_ZERO_RAISE REQUEST
                subject-names:
                  "[X_RATANONE/RATAN_STRATEGIC_CASHFLOW_BLOTTER]": RATAN_STRATEGIC_CASHFLOW_BLOTTER
                  "[FMO PORTAL ADMIN//importmap]": importmap
                retain-ems2-entities:
                  - X_RATANONE
                  - FLOW_ZERO
            """;
        var environment = new StandardEnvironment();
        var source = new ByteArrayResource(yaml.getBytes(StandardCharsets.UTF_8));
        new YamlPropertySourceLoader().load("tile-entitlement-example", source)
            .forEach(propertySource -> environment.getPropertySources().addFirst(propertySource));

        var properties = Binder.get(environment)
            .bind("scb.tile-entitlements", Bindable.of(TileEntitlementProperties.class)).get();

        assertEquals(Map.of("X_RATANONE", 7L, "FLOW_ZERO", 8L), properties.getEntityIds());
        assertEquals(Map.of(
            "X_RATANONE/RATAN_STRATEGIC_CASHFLOW_BLOTTER", "/RATAN_STRATEGIC_CASHFLOW_BLOTTER",
            "FLOW_ZERO/FLOW_ZERO_RAISE REQUEST", "FLOW_ZERO_RAISE REQUEST"), properties.getSubjectPaths());
        assertEquals(Map.of(
            "X_RATANONE/RATAN_STRATEGIC_CASHFLOW_BLOTTER", "RATAN_STRATEGIC_CASHFLOW_BLOTTER",
            "FMO PORTAL ADMIN//importmap", "importmap"), properties.getSubjectNames());
        assertEquals(Set.of("X_RATANONE", "FLOW_ZERO"), properties.getRetainEms2Entities());
    }
}
