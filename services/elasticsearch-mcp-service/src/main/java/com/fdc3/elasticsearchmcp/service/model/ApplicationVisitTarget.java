package com.fdc3.elasticsearchmcp.service.model;

import java.util.Arrays;
import java.util.Locale;

public enum ApplicationVisitTarget {
    CASHFLOW_BLOTTER("cashflow blotter", "cashflow_cn", "cashflow_blotter_cn", "Page View"),
    TRADES("trades", "trade", "trade_blotter", "Page View");

    private final String applicationName;
    private final String tile;
    private final String container;
    private final String eventName;

    ApplicationVisitTarget(String applicationName, String tile, String container, String eventName) {
        this.applicationName = applicationName;
        this.tile = tile;
        this.container = container;
        this.eventName = eventName;
    }

    public String applicationName() {
        return applicationName;
    }

    public String tile() {
        return tile;
    }

    public String container() {
        return container;
    }

    public String eventName() {
        return eventName;
    }

    public static ApplicationVisitTarget fromApplication(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return Arrays.stream(values())
                .filter(candidate -> candidate.applicationName.equals(normalized))
                .findFirst()
                .orElse(null);
    }
}
