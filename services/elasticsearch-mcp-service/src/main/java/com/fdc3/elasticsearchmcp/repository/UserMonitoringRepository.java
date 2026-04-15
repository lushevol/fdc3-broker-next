package com.fdc3.elasticsearchmcp.repository;

import com.fdc3.elasticsearchmcp.service.model.UserMonitoringEvent;

import java.time.Instant;
import java.util.List;

/**
 * Repository for querying user monitoring events from Elasticsearch.
 * Provides access to raw event data for analytics calculations.
 */
public interface UserMonitoringRepository {

    /**
     * Fetch all user monitoring events matching the given criteria.
     *
     * @param tile      the tile/application name (e.g., "cashflow_blotter")
     * @param container the container name (e.g., "ratan_container")
     * @param startTime inclusive start timestamp
     * @param endTime   exclusive end timestamp
     * @return list of matching events
     */
    List<UserMonitoringEvent> fetchEvents(
        String tile,
        String container,
        Instant startTime,
        Instant endTime
    );

    /**
     * Fetch events filtered by specific action types.
     *
     * @param tile      the tile/application name
     * @param container the container name
     * @param actions   list of action types to include (e.g., "click", "input")
     * @param startTime inclusive start timestamp
     * @param endTime   exclusive end timestamp
     * @return list of matching events
     */
    List<UserMonitoringEvent> fetchEventsByActions(
        String tile,
        String container,
        List<String> actions,
        Instant startTime,
        Instant endTime
    );

    /**
     * Count unique users for the given criteria.
     * Simulates a cardinality aggregation on userId.
     *
     * @param tile      the tile/application name
     * @param container the container name
     * @param startTime inclusive start timestamp
     * @param endTime   exclusive end timestamp
     * @return count of unique users
     */
    long countUniqueUsers(
        String tile,
        String container,
        Instant startTime,
        Instant endTime
    );
}
