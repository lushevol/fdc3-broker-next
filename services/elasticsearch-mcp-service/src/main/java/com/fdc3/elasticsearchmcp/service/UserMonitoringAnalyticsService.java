package com.fdc3.elasticsearchmcp.service;

import com.fdc3.elasticsearchmcp.repository.UserMonitoringRepository;
import com.fdc3.elasticsearchmcp.service.model.UserMonitoringEvent;
import com.fdc3.elasticsearchmcp.tool.model.UserMonitoringRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for performing analytics on user monitoring data.
 * Reads raw events from the repository and performs aggregations/calculations
 * to simulate Elasticsearch query results.
 */
@Service
public class UserMonitoringAnalyticsService {

    private final UserMonitoringRepository repository;

    public UserMonitoringAnalyticsService(UserMonitoringRepository repository) {
        this.repository = repository;
    }

    /**
     * Query events matching the given criteria.
     *
     * @param request the query request
     * @return list of matching events
     */
    public List<UserMonitoringEvent> queryEvents(UserMonitoringRequest request) {
        return repository.fetchEvents(
                request.tile(),
                request.container(),
                request.startTime(),
                request.endTime()
        );
    }

    /**
     * Count total events matching the criteria.
     * Simulates the "total hits" from an ES query.
     *
     * @param tile      the tile name
     * @param container the container name
     * @param startTime start time (inclusive)
     * @param endTime   end time (exclusive)
     * @return count of matching events
     */
    public long countEvents(String tile, String container, Instant startTime, Instant endTime) {
        return repository.fetchEvents(tile, container, startTime, endTime).size();
    }

    /**
     * Count actions of specific types.
     * Simulates a filtered query with aggregation.
     *
     * @param tile      the tile name
     * @param container the container name
     * @param actions   list of action types to count
     * @param startTime start time (inclusive)
     * @param endTime   end time (exclusive)
     * @return total count of matching actions
     */
    public long countActionsByTypes(
            String tile,
            String container,
            List<String> actions,
            Instant startTime,
            Instant endTime
    ) {
        return repository.fetchEventsByActions(tile, container, actions, startTime, endTime).size();
    }

    /**
     * Count unique users (simulates ES cardinality aggregation).
     *
     * @param tile      the tile name
     * @param container the container name
     * @param startTime start time (inclusive)
     * @param endTime   end time (exclusive)
     * @return count of unique users
     */
    public long countUniqueUsers(String tile, String container, Instant startTime, Instant endTime) {
        return repository.countUniqueUsers(tile, container, startTime, endTime);
    }

    /**
     * Calculate engagement summary with metrics calculated from raw events.
     * Simulates multiple ES aggregations (count, cardinality, terms).
     *
     * @param tile      the tile name
     * @param container the container name
     * @param startTime start time (inclusive)
     * @param endTime   end time (exclusive)
     * @return engagement summary
     */
    public UserEngagementSummary calculateEngagementSummary(
            String tile,
            String container,
            Instant startTime,
            Instant endTime
    ) {
        List<UserMonitoringEvent> events = repository.fetchEvents(tile, container, startTime, endTime);

        // Calculate metrics from raw events (simulating ES aggregations)
        long totalEvents = events.size();

        long uniqueUsers = events.stream()
                .map(UserMonitoringEvent::userId)
                .distinct()
                .count();

        long uniqueUserProfiles = events.stream()
                .map(UserMonitoringEvent::userProfile)
                .distinct()
                .count();

        // Action breakdown (simulates terms aggregation)
        Map<String, Long> actionBreakdown = events.stream()
                .collect(Collectors.groupingBy(UserMonitoringEvent::action, Collectors.counting()));

        return new UserEngagementSummary(
                totalEvents,
                uniqueUsers,
                uniqueUserProfiles,
                actionBreakdown
        );
    }

    /**
     * Calculate user profile distribution.
     * Simulates a terms aggregation on userProfile field.
     *
     * @param tile      the tile name
     * @param container the container name
     * @param startTime start time (inclusive)
     * @param endTime   end time (exclusive)
     * @return map of profile to count
     */
    public Map<String, Long> calculateUserProfileDistribution(
            String tile,
            String container,
            Instant startTime,
            Instant endTime
    ) {
        List<UserMonitoringEvent> events = repository.fetchEvents(tile, container, startTime, endTime);

        // Simulate terms aggregation on userProfile
        return events.stream()
                .collect(Collectors.groupingBy(UserMonitoringEvent::userProfile, Collectors.counting()));
    }

    /**
     * Inner class for engagement summary results.
     */
    public record UserEngagementSummary(
            long totalEvents,
            long uniqueUsers,
            long uniqueUserProfiles,
            Map<String, Long> actionBreakdown
    ) {
    }
}
