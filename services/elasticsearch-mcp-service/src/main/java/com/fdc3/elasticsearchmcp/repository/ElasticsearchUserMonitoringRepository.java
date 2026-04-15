package com.fdc3.elasticsearchmcp.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.TotalHits;
import com.fdc3.elasticsearchmcp.config.ElasticsearchAnalyticsProperties;
import com.fdc3.elasticsearchmcp.service.model.UserMonitoringEvent;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Elasticsearch implementation of UserMonitoringRepository.
 * Queries raw user monitoring events from the user-operation-logs index.
 */
@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "false", matchIfMissing = true)
public class ElasticsearchUserMonitoringRepository implements UserMonitoringRepository {

    static final String TILE_FIELD = "tile";
    static final String CONTAINER_FIELD = "container";
    static final String ACTION_FIELD = "action";
    static final String TIMESTAMP_FIELD = "@timestamp";
    static final String USER_ID_FIELD = "userId";
    static final String USER_PROFILE_FIELD = "userProfile";

    static final String UNIQUE_USERS_AGG = "unique_users";

    private final ElasticsearchClient elasticsearchClient;
    private final ElasticsearchAnalyticsProperties properties;

    public ElasticsearchUserMonitoringRepository(
            ElasticsearchClient elasticsearchClient,
            ElasticsearchAnalyticsProperties properties
    ) {
        this.elasticsearchClient = elasticsearchClient;
        this.properties = properties;
    }

    @Override
    public List<UserMonitoringEvent> fetchEvents(
            String tile,
            String container,
            Instant startTime,
            Instant endTime
    ) {
        SearchRequest request = buildEventsRequest(tile, container, startTime, endTime, null);
        return executeAndMapEvents(request);
    }

    @Override
    public List<UserMonitoringEvent> fetchEventsByActions(
            String tile,
            String container,
            List<String> actions,
            Instant startTime,
            Instant endTime
    ) {
        SearchRequest request = buildEventsRequest(tile, container, startTime, endTime, actions);
        return executeAndMapEvents(request);
    }

    @Override
    public long countUniqueUsers(
            String tile,
            String container,
            Instant startTime,
            Instant endTime
    ) {
        SearchRequest request = buildUniqueUsersRequest(tile, container, startTime, endTime);
        try {
            SearchResponse<Void> response = elasticsearchClient.search(request, Void.class);
            return extractCardinality(response);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to query unique user count from Elasticsearch", e);
        }
    }

    private SearchRequest buildEventsRequest(
            String tile,
            String container,
            Instant startTime,
            Instant endTime,
            List<String> actions
    ) {
        Query boolQuery = Query.of(q -> q.bool(b -> {
            b.filter(buildTileQuery(tile));
            b.filter(buildContainerQuery(container));
            b.filter(buildTimeRangeQuery(startTime, endTime));
            if (actions != null && !actions.isEmpty()) {
                b.filter(buildActionsQuery(actions));
            }
            return b;
        }));

        return SearchRequest.of(s -> s
            .index(properties.getIndexName())
            .size(10000)
            .query(boolQuery)
        );
    }

    private SearchRequest buildUniqueUsersRequest(
            String tile,
            String container,
            Instant startTime,
            Instant endTime
    ) {
        Query boolQuery = Query.of(q -> q.bool(b -> {
            b.filter(buildTileQuery(tile));
            b.filter(buildContainerQuery(container));
            b.filter(buildTimeRangeQuery(startTime, endTime));
            return b;
        }));

        return SearchRequest.of(s -> s
            .index(properties.getIndexName())
            .size(0)
            .query(boolQuery)
            .aggregations(UNIQUE_USERS_AGG, a -> a
                .cardinality(c -> c.field(USER_ID_FIELD))
            )
        );
    }

    private Query buildTileQuery(String tile) {
        if (tile == null || tile.isEmpty()) {
            return Query.of(q -> q.matchAll(m -> m));
        }
        return Query.of(q -> q.term(t -> t.field(TILE_FIELD).value(tile)));
    }

    private Query buildContainerQuery(String container) {
        if (container == null || container.isEmpty()) {
            return Query.of(q -> q.matchAll(m -> m));
        }
        return Query.of(q -> q.term(t -> t.field(CONTAINER_FIELD).value(container)));
    }

    private Query buildTimeRangeQuery(Instant startTime, Instant endTime) {
        return Query.of(q -> q.range(r -> r
            .date(d -> d
                .field(TIMESTAMP_FIELD)
                .gte(startTime.toString())
                .lt(endTime.toString())
            )
        ));
    }

    private Query buildActionsQuery(List<String> actions) {
        return Query.of(q -> q.terms(t -> t
            .field(ACTION_FIELD)
            .terms(ts -> ts.value(actions.stream()
                .map(a -> co.elastic.clients.elasticsearch._types.FieldValue.of(a))
                .collect(Collectors.toList())))
        ));
    }

    private List<UserMonitoringEvent> executeAndMapEvents(SearchRequest request) {
        try {
            SearchResponse<Map> response = elasticsearchClient.search(request, Map.class);
            return response.hits().hits().stream()
                .map(hit -> mapToEvent(hit.source()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        } catch (IOException e) {
            throw new IllegalStateException("Failed to query events from Elasticsearch", e);
        }
    }

    @SuppressWarnings("unchecked")
    private UserMonitoringEvent mapToEvent(Map source) {
        if (source == null) return null;
        try {
            String tile = (String) source.get(TILE_FIELD);
            String container = (String) source.get(CONTAINER_FIELD);
            String action = (String) source.get(ACTION_FIELD);
            String timestampStr = (String) source.get(TIMESTAMP_FIELD);
            String userId = (String) source.get(USER_ID_FIELD);
            String userProfile = (String) source.get(USER_PROFILE_FIELD);

            Instant timestamp = timestampStr != null ? Instant.parse(timestampStr) : Instant.now();

            return new UserMonitoringEvent(tile, container, action, timestamp, userId, userProfile);
        } catch (Exception e) {
            return null;
        }
    }

    private long extractCardinality(SearchResponse<Void> response) {
        var agg = response.aggregations().get(UNIQUE_USERS_AGG);
        if (agg == null || agg.cardinality() == null) {
            return 0L;
        }
        return Math.round(agg.cardinality().value());
    }
}
