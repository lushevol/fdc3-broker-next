package com.fdc3.chatbot.tool;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class DateTimeTool implements ToolDefinition {

    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter READABLE_DATE = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy", Locale.ENGLISH);

    @Override
    public String getName() {
        return "resolve_relative_date";
    }

    @Override
    public String getDescription() {
        return "Resolve a relative or natural-language date expression to an absolute ISO-8601 date. "
                + "Examples: 'yesterday', 'tomorrow', 'last Monday', 'next Friday', '3 days ago', 'in 2 weeks'. "
                + "Optionally accepts a timezone to resolve the date relative to (defaults to UTC). "
                + "Returns the resolved date in ISO format (yyyy-MM-dd), a human-readable form, and the day of the week.";
    }

    @Override
    public Map<String, Object> getParameters() {
        Map<String, Object> params = new HashMap<>();
        params.put("type", "object");

        Map<String, Object> expressionProp = new LinkedHashMap<>();
        expressionProp.put("type", "string");
        expressionProp.put("description", "The natural-language date expression to resolve (e.g. 'yesterday', 'last Monday', '3 days ago')");

        Map<String, Object> timezoneProp = new LinkedHashMap<>();
        timezoneProp.put("type", "string");
        timezoneProp.put("description", "Optional IANA timezone ID (e.g. 'Asia/Shanghai', 'America/New_York'). Defaults to UTC.");

        Map<String, Object> properties = new LinkedHashMap<>();
        properties.put("expression", expressionProp);
        properties.put("timezone", timezoneProp);
        params.put("properties", properties);
        params.put("required", java.util.List.of("expression"));

        return params;
    }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            String expression = (String) arguments.get("expression");
            String timezone = (String) arguments.getOrDefault("timezone", "UTC");

            if (expression == null || expression.trim().isEmpty()) {
                return Map.of("error", "Expression is required");
            }

            try {
                ZoneId zoneId = ZoneId.of(timezone);
                LocalDate resolved = resolve(expression.trim(), zoneId);

                Map<String, Object> result = new LinkedHashMap<>();
                result.put("expression", expression);
                result.put("resolvedDate", resolved.format(ISO_DATE));
                result.put("readable", resolved.format(READABLE_DATE));
                result.put("dayOfWeek", resolved.getDayOfWeek().toString());
                result.put("timezone", timezone);
                result.put("resolvedAt", ZonedDateTime.now(zoneId).format(DateTimeFormatter.ISO_ZONED_DATE_TIME));

                log.info("DateTime tool resolved '{}' to {} ({})", expression, resolved.format(ISO_DATE), timezone);
                return result;
            } catch (DateTimeParseException e) {
                return Map.of("error", "Could not parse date expression: " + expression);
            } catch (Exception e) {
                log.error("Error resolving date expression: {}", expression, e);
                return Map.of("error", "Failed to resolve date: " + e.getMessage());
            }
        });
    }

    LocalDate resolve(String expression, ZoneId zoneId) {
        LocalDate today = LocalDate.now(zoneId);
        String normalized = expression.toLowerCase(Locale.ENGLISH).trim();

        if (normalized.equals("today")) {
            return today;
        }
        if (normalized.equals("yesterday")) {
            return today.minusDays(1);
        }
        if (normalized.equals("tomorrow")) {
            return today.plusDays(1);
        }
        if (normalized.equals("the day before yesterday") || normalized.equals("day before yesterday")) {
            return today.minusDays(2);
        }
        if (normalized.equals("the day after tomorrow") || normalized.equals("day after tomorrow")) {
            return today.plusDays(2);
        }

        java.util.regex.Matcher agoMatcher = java.util.regex.Pattern.compile("(\\d+)\\s+days?\\s+ago").matcher(normalized);
        if (agoMatcher.matches()) {
            int days = Integer.parseInt(agoMatcher.group(1));
            return today.minusDays(days);
        }

        java.util.regex.Matcher inDaysMatcher = java.util.regex.Pattern.compile("in\\s+(\\d+)\\s+days?").matcher(normalized);
        if (inDaysMatcher.matches()) {
            int days = Integer.parseInt(inDaysMatcher.group(1));
            return today.plusDays(days);
        }

        java.util.regex.Matcher weeksAgoMatcher = java.util.regex.Pattern.compile("(\\d+)\\s+weeks?\\s+ago").matcher(normalized);
        if (weeksAgoMatcher.matches()) {
            int weeks = Integer.parseInt(weeksAgoMatcher.group(1));
            return today.minusWeeks(weeks);
        }

        java.util.regex.Matcher inWeeksMatcher = java.util.regex.Pattern.compile("in\\s+(\\d+)\\s+weeks?").matcher(normalized);
        if (inWeeksMatcher.matches()) {
            int weeks = Integer.parseInt(inWeeksMatcher.group(1));
            return today.plusWeeks(weeks);
        }

        if (normalized.startsWith("last ")) {
            String dayName = normalized.substring(5).trim();
            DayOfWeek target = parseDayOfWeek(dayName);
            if (target != null) {
                return today.with(TemporalAdjusters.previous(target));
            }
        }

        if (normalized.startsWith("next ")) {
            String dayName = normalized.substring(5).trim();
            DayOfWeek target = parseDayOfWeek(dayName);
            if (target != null) {
                return today.with(TemporalAdjusters.next(target));
            }
        }

        if (normalized.startsWith("this ")) {
            String dayName = normalized.substring(5).trim();
            DayOfWeek target = parseDayOfWeek(dayName);
            if (target != null) {
                DayOfWeek current = today.getDayOfWeek();
                if (target.getValue() >= current.getValue()) {
                    return today.with(TemporalAdjusters.nextOrSame(target));
                } else {
                    return today.with(TemporalAdjusters.next(target));
                }
            }
        }

        try {
            return LocalDate.parse(normalized, ISO_DATE);
        } catch (DateTimeParseException ignored) {
            // fall through
        }

        throw new DateTimeParseException("Unrecognized date expression: " + expression, expression, 0);
    }

    private DayOfWeek parseDayOfWeek(String name) {
        return switch (name.toLowerCase(Locale.ENGLISH)) {
            case "monday", "mon" -> DayOfWeek.MONDAY;
            case "tuesday", "tue", "tues" -> DayOfWeek.TUESDAY;
            case "wednesday", "wed" -> DayOfWeek.WEDNESDAY;
            case "thursday", "thu", "thurs" -> DayOfWeek.THURSDAY;
            case "friday", "fri" -> DayOfWeek.FRIDAY;
            case "saturday", "sat" -> DayOfWeek.SATURDAY;
            case "sunday", "sun" -> DayOfWeek.SUNDAY;
            default -> null;
        };
    }
}
