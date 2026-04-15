package com.fdc3.chatbot.tool;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class WeatherHistoryTool implements ToolDefinition {

    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ISO_LOCAL_DATE;

    @Override
    public String getName() {
        return "get_weather_history";
    }

    @Override
    public String getDescription() {
        return "Get historical weather data for a specified location and date. "
                + "Requires a resolved date (ISO format yyyy-MM-dd, use resolve_relative_date first for relative expressions) "
                + "and a location name. Returns temperature range, conditions, humidity, and wind for that date.";
    }

    @Override
    public Map<String, Object> getParameters() {
        Map<String, Object> params = new HashMap<>();
        params.put("type", "object");

        Map<String, Object> locationProp = new LinkedHashMap<>();
        locationProp.put("type", "string");
        locationProp.put("description", "The city and country (e.g., 'Beijing, CN', 'London, UK')");

        Map<String, Object> dateProp = new LinkedHashMap<>();
        dateProp.put("type", "string");
        dateProp.put("description", "The date in ISO format (yyyy-MM-dd). Use resolve_relative_date for relative dates like 'yesterday'.");

        Map<String, Object> properties = new LinkedHashMap<>();
        properties.put("location", locationProp);
        properties.put("date", dateProp);
        params.put("properties", properties);
        params.put("required", java.util.List.of("location", "date"));

        return params;
    }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            String location = (String) arguments.get("location");
            String dateStr = (String) arguments.get("date");

            if (location == null || location.trim().isEmpty()) {
                return Map.of("error", "Location is required");
            }
            if (dateStr == null || dateStr.trim().isEmpty()) {
                return Map.of("error", "Date is required");
            }

            try {
                LocalDate date = LocalDate.parse(dateStr, ISO_DATE);
                Map<String, Object> result = getMockHistoricalWeather(location, date);

                log.info("Weather history tool executed for location: {}, date: {}", location, dateStr);
                return result;
            } catch (Exception e) {
                log.error("Error getting historical weather for location: {}, date: {}", location, dateStr, e);
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Failed to get historical weather: " + e.getMessage());
                return error;
            }
        });
    }

    private Map<String, Object> getMockHistoricalWeather(String location, LocalDate date) {
        int hash = Math.abs((location.toLowerCase() + date.toString()).hashCode());

        String[] conditions = {"Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear", "Overcast", "Foggy"};
        int highC = 15 + (hash % 25);
        int lowC = highC - 5 - (hash % 8);
        int humidity = 30 + (hash % 50);
        int windSpeed = 5 + (hash % 30);

        Map<String, Object> weather = new LinkedHashMap<>();
        weather.put("location", location);
        weather.put("date", date.format(ISO_DATE));
        weather.put("condition", conditions[hash % conditions.length]);
        weather.put("highC", highC);
        weather.put("lowC", lowC);
        weather.put("humidity", humidity);
        weather.put("windSpeed", windSpeed);
        weather.put("windUnit", "km/h");
        weather.put("summary", String.format("%s on %s: High %dC / Low %dC, %s, Humidity %d%%",
                location, date.format(DateTimeFormatter.ofPattern("MMM d, yyyy")),
                highC, lowC, conditions[hash % conditions.length], humidity));
        weather.put("note", "Mock historical data - integrate with real weather API for production");

        return weather;
    }
}
