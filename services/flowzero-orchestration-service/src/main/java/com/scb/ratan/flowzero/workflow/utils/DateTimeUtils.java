package com.scb.ratan.flowzero.workflow.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Objects;

import lombok.extern.slf4j.Slf4j;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@Slf4j
public class DateTimeUtils {

    private static final ZoneId UTC_ZONE_ID = ZoneId.of("Z");

    public static final String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";

    public static String format(LocalDateTime localDateTime) {
        return format(localDateTime, DEFAULT_PATTERN);
    }

    private static String format(LocalDateTime localDateTime, String pattern) {
        if (Objects.isNull(localDateTime)) {
            return null;
        }
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(pattern);
        return localDateTime.format(dateTimeFormatter);
    }

    public static String format(Date date) {
        return format(date, DEFAULT_PATTERN);
    }

    public static String format(Date date, String pattern) {
        if (Objects.isNull(date)) {
            return null;
        }
        LocalDateTime localDateTime = LocalDateTime.ofInstant(
            date.toInstant(),
            UTC_ZONE_ID);
        return format(localDateTime, pattern);
    }

}
