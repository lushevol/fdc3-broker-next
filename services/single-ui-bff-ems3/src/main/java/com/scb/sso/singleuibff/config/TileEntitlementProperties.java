package com.scb.sso.singleuibff.config;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/** Portal metadata compatibility; entitlement provider selection remains on each tile. */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "scb.tile-entitlements")
public class TileEntitlementProperties {
    private Map<String, Long> entityIds = new LinkedHashMap<>();
    private Map<String, String> subjectNames = new LinkedHashMap<>();
    private Map<String, String> subjectPaths = new LinkedHashMap<>();
    private Set<String> retainEms2Entities = new LinkedHashSet<>();
}
