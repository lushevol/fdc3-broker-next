package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.service.model.UserMonitoringEvent;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Stub implementation of UserMonitoringRepository that loads mock data from
 * a CSV file on the classpath (user_monitoring_mock_data.csv).
 *
 * <p>This implementation pretends to read from ES by:
 * <ul>
 *   <li>Loading raw user monitoring events from a CSV file</li>
 *   <li>Storing events in memory to simulate an ES index</li>
 *   <li>Performing aggregations (cardinality, date_histogram) in Java</li>
 *   <li>Returning calculated results as if they came from ES</li>
 * </ul>
 */
@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "true")
public class StubUserMonitoringRepository implements UserMonitoringRepository {

    private static final String CSV_RESOURCE_PATH = "user_monitoring_mock_data.csv";

    // In-memory storage simulating ES index, loaded from CSV
    private final List<UserMonitoringEvent> eventStore;

    public StubUserMonitoringRepository() {
        this.eventStore = Collections.synchronizedList(loadEventsFromCsv());
    }

    /**
     * Loads user monitoring events from the CSV file on the classpath.
     *
     * @return list of loaded events
     * @throws IllegalStateException if the CSV cannot be loaded
     */
    private List<UserMonitoringEvent> loadEventsFromCsv() {
        ClassPathResource resource = new ClassPathResource(CSV_RESOURCE_PATH);

        if (!resource.exists()) {
            throw new IllegalStateException(
                "Mock data CSV not found on classpath: " + CSV_RESOURCE_PATH +
                ". Please generate it first using UserMonitoringMockDataGenerator."
            );
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            // Skip header line
            String header = reader.readLine();
            if (header == null) {
                throw new IllegalStateException("CSV file is empty: " + CSV_RESOURCE_PATH);
            }

            return reader.lines()
                .map(this::parseCsvLine)
                .filter(event -> event != null)
                .collect(Collectors.toList());

        } catch (IOException e) {
            throw new IllegalStateException("Failed to load mock data from CSV: " + CSV_RESOURCE_PATH, e);
        }
    }

    /**
     * Parses a CSV line into a UserMonitoringEvent.
     * Expected format: tile,container,action,timestamp,userId,userProfile
     *
     * @param line CSV line to parse
     * @return parsed event or null if parsing fails
     */
    private UserMonitoringEvent parseCsvLine(String line) {
        if (line == null || line.isBlank()) {
            return null;
        }

        String[] parts = line.split(",");
        if (parts.length != 6) {
            System.err.println("Invalid CSV line (expected 6 columns, got " + parts.length + "): " + line);
            return null;
        }

        try {
            String tile = parts[0].trim();
            String container = parts[1].trim();
            String action = parts[2].trim();
            Instant timestamp = Instant.parse(parts[3].trim());
            String userId = parts[4].trim();
            String userProfile = parts[5].trim();

            return new UserMonitoringEvent(tile, container, action, timestamp, userId, userProfile);
        } catch (Exception e) {
            System.err.println("Failed to parse CSV line: " + line + " - " + e.getMessage());
            return null;
        }
    }

    @Override
    public List<UserMonitoringEvent> fetchEvents(
            String tile,
            String container,
            Instant startTime,
            Instant endTime) {
        return eventStore.stream()
                .filter(e -> tile == null || e.tile().equals(tile))
                .filter(e -> container == null || e.container().equals(container))
                .filter(e -> !e.timestamp().isBefore(startTime) && e.timestamp().isBefore(endTime))
                .collect(Collectors.toList());
    }

    @Override
    public List<UserMonitoringEvent> fetchEventsByActions(
            String tile,
            String container,
            List<String> actions,
            Instant startTime,
            Instant endTime) {
        return eventStore.stream()
                .filter(e -> tile == null || e.tile().equals(tile))
                .filter(e -> container == null || e.container().equals(container))
                .filter(e -> actions.contains(e.action()))
                .filter(e -> !e.timestamp().isBefore(startTime) && e.timestamp().isBefore(endTime))
                .collect(Collectors.toList());
    }

    @Override
    public long countUniqueUsers(
            String tile,
            String container,
            Instant startTime,
            Instant endTime) {
        return eventStore.stream()
                .filter(e -> tile == null || e.tile().equals(tile))
                .filter(e -> container == null || e.container().equals(container))
                .filter(e -> !e.timestamp().isBefore(startTime) && e.timestamp().isBefore(endTime))
                .map(UserMonitoringEvent::userId)
                .distinct()
                .count();
    }

    /**
     * Returns the total number of events loaded from the CSV.
     *
     * @return event count
     */
    public int getLoadedEventCount() {
        return eventStore.size();
    }
}
