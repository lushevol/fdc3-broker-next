package com.fdc3.chatbot.tool;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Tool to get weather information (mock implementation).
 * In production, this would integrate with a real weather API.
 */
@Slf4j
@Component
public class WeatherTool implements ToolDefinition {

    @Override
    public String getName() {
        return "get_weather";
    }

    @Override
    public String getDescription() {
        return "Get the current weather for a specified location. Returns temperature, conditions, and humidity.";
    }

    @Override
    public Map<String, Object> getParameters() {
        Map<String, Object> params = new HashMap<>();
        params.put("type", "object");

        Map<String, Object> locationProp = new HashMap<>();
        locationProp.put("type", "string");
        locationProp.put("description", "The city and country (e.g., 'London, UK', 'New York, US')");

        Map<String, Object> properties = new HashMap<>();
        properties.put("location", locationProp);
        params.put("properties", properties);
        params.put("required", java.util.List.of("location"));

        return params;
    }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            String location = (String) arguments.get("location");

            if (location == null || location.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Location is required");
                return error;
            }

            try {
                // Mock weather data - in production, call a real weather API
                Map<String, Object> weather = getMockWeather(location);

                log.info("Weather tool executed for location: {}", location);
                return weather;
            } catch (Exception e) {
                log.error("Error getting weather for location: {}", location, e);
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Failed to get weather: " + e.getMessage());
                return error;
            }
        });
    }

    /**
     * Returns mock weather data for demonstration.
     * In production, this would call a real weather API like OpenWeatherMap.
     */
    private Map<String, Object> getMockWeather(String location) {
        Map<String, Object> weather = new HashMap<>();
        weather.put("location", location);
        weather.put("temperature", 22);
        weather.put("temperatureUnit", "Celsius");
        weather.put("conditions", "Partly Cloudy");
        weather.put("humidity", 65);
        weather.put("windSpeed", 12);
        weather.put("windUnit", "km/h");
        weather.put("lastUpdated", java.time.Instant.now().toString());
        weather.put("note", "Mock data - integrate with real weather API for production");

        return weather;
    }
}