package com.fdc3.chatbot.tool;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Tool to get the current time in various timezones.
 */
@Slf4j
@Component
public class TimeTool implements ToolDefinition {

    @Override
    public String getName() {
        return "get_current_time";
    }

    @Override
    public String getDescription() {
        return "Get the current time in a specified timezone. Returns the time in ISO format.";
    }

    @Override
    public Map<String, Object> getParameters() {
        Map<String, Object> params = new HashMap<>();
        params.put("type", "object");

        Map<String, Object> timezoneProp = new HashMap<>();
        timezoneProp.put("type", "string");
        timezoneProp.put("description", "The timezone ID (e.g., 'America/New_York', 'Europe/London'). Defaults to UTC.");

        Map<String, Object> properties = new HashMap<>();
        properties.put("timezone", timezoneProp);
        params.put("properties", properties);

        return params;
    }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            String timezone = (String) arguments.getOrDefault("timezone", "UTC");

            try {
                ZoneId zoneId = ZoneId.of(timezone);
                ZonedDateTime now = ZonedDateTime.now(zoneId);

                Map<String, Object> result = new HashMap<>();
                result.put("timezone", timezone);
                result.put("time", now.format(DateTimeFormatter.ISO_ZONED_DATE_TIME));
                result.put("formatted", now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z")));

                log.info("Time tool executed for timezone: {}", timezone);
                return result;
            } catch (Exception e) {
                log.error("Error getting time for timezone: {}", timezone, e);
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Invalid timezone: " + timezone);
                return error;
            }
        });
    }
}