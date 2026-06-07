package com.scb.ratan.flowzero.workflow.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Time interval granularity for request trend aggregation.
 * Day  – one data point per calendar day
 * Week – one data point per ISO week (label = week start date)
 * Month – one data point per calendar month (label = first day of month)
 */
@Getter
@AllArgsConstructor
public enum TimeInterval {

    Day("Day"),
    Week("Week"),
    Month("Month");

    private final String value;

    public static TimeInterval fromValue(String value) {
        for (TimeInterval interval : values()) {
            if (interval.value.equalsIgnoreCase(value)) {
                return interval;
            }
        }
        return Day; // default
    }

}
