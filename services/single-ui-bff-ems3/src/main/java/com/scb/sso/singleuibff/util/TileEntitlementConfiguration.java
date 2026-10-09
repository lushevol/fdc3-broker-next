package com.scb.sso.singleuibff.util;

import com.scb.sso.singleuibff.entity.ApplicationTile;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Shared configuration validation for admin writes and authorization snapshots. */
public final class TileEntitlementConfiguration {
    private TileEntitlementConfiguration() {}

    /** Null means an old client omitted the field; it must not reset a saved route. */
    public static void applyOverrides(ApplicationTile tile, String provider, String appId,
        String appName, String subject) {
        require(tile != null, "Tile configuration is required");
        if (provider != null) tile.setProvider(provider.trim().toUpperCase(Locale.ROOT));
        if (appId != null) tile.setEms3AppId(appId.trim());
        if (appName != null) tile.setEms3AppName(appName.trim());
        if (subject != null) tile.setEms3Subject(subject.trim());
    }

    /** Validate a complete snapshot, including inactive siblings which may be approved later. */
    public static void validateTiles(Collection<ApplicationTile> tiles) {
        require(tiles != null, "Tile configuration is unavailable");
        Map<Permission, Binding> ownership = new LinkedHashMap<>();
        for (var tile : tiles) {
            require(tile != null, "Tile configuration contains a missing record");
            String provider = tile.getProvider();
            require("EMS2".equals(provider) || "EMS3".equals(provider), "Tile provider must be EMS2 or EMS3");
            if ("EMS3".equals(provider)) {
                require(!tile.isTemplate(), "An EMS3 tile cannot bypass entitlement checks as a template");
                require(tile.getEms2Entities() != null && !tile.getEms2Entities().contains(",")
                    && nonblank(tile.getEms2Entities()), "An EMS3 tile requires exactly one Portal entity");
                require(nonblank(tile.getEms2Subject()), "An EMS3 tile requires a Portal subject alias");
                require(nonblank(tile.getEms3AppId()) && nonblank(tile.getEms3AppName())
                    && nonblank(tile.getEms3Subject()), "An EMS3 tile requires app ID, app name and feature");
            }
            if (tile.isTemplate() || !nonblank(tile.getEms2Subject())) continue;
            var binding = "EMS3".equals(provider)
                ? new Binding(provider, tile.getEms3AppId(), tile.getEms3AppName(), tile.getEms3Subject())
                : new Binding(provider, null, null, null);
            for (String entity : entities(tile.getEms2Entities())) {
                var permission = new Permission(entity, tile.getEms2Subject().trim().toLowerCase(Locale.ROOT));
                var previous = ownership.putIfAbsent(permission, binding);
                require(previous == null || previous.equals(binding),
                    "Tiles sharing a Portal entity and subject must use the same provider and EMS3 mapping");
            }
        }
    }

    /** Overlay an atomic write batch onto the persisted snapshot before checking sibling ownership. */
    public static void validateChanges(Collection<ApplicationTile> persisted, Collection<ApplicationTile> changes) {
        require(persisted != null && changes != null, "Tile configuration is unavailable");
        Map<Long, ApplicationTile> snapshot = new LinkedHashMap<>();
        for (var tile : persisted) {
            require(tile != null, "Tile configuration contains a missing record");
            snapshot.put(tile.getApplicationTileId(), tile);
        }
        var changedIds = new java.util.HashSet<Long>();
        for (var tile : changes) {
            require(tile != null && changedIds.add(tile.getApplicationTileId()), "Tile write batch contains a missing or duplicate record");
            snapshot.put(tile.getApplicationTileId(), tile);
        }
        validateTiles(snapshot.values());
    }

    private static List<String> entities(String value) {
        List<String> result = new ArrayList<>();
        if (value != null) {
            for (String item : value.split(",")) {
                String entity = item.trim();
                if (!entity.isBlank() && !result.contains(entity)) result.add(entity);
            }
        }
        return result;
    }

    private static boolean nonblank(String value) {
        return value != null && !value.isBlank();
    }

    private static void require(boolean allowed, String reason) {
        if (!allowed) throw new IllegalArgumentException(reason);
    }

    private record Permission(String entity, String subject) {}
    private record Binding(String provider, String appId, String appName, String subject) {}
}
