package com.fdc3.elasticsearchmcp.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregate;
import co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval;
import co.elastic.clients.elasticsearch._types.aggregations.DateHistogramBucket;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.TotalHits;
import com.fdc3.elasticsearchmcp.config.ElasticsearchAnalyticsProperties;
import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.AppFilter;
import com.fdc3.elasticsearchmcp.service.model.AppFilterType;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@ConditionalOnProperty(prefix = "analytics.stub", name = "enabled", havingValue = "false", matchIfMissing = true)
public class ElasticsearchAppAnalyticsRepository implements AppAnalyticsRepository {

    static final String UNIQUE_USERS_AGG = "unique_users";
    static final String TREND_AGG = "pv_uv_over_time";

    private final ElasticsearchClient elasticsearchClient;
    private final ElasticsearchAnalyticsProperties properties;

    public ElasticsearchAppAnalyticsRepository(
            ElasticsearchClient elasticsearchClient,
            ElasticsearchAnalyticsProperties properties
    ) {
        this.elasticsearchClient = elasticsearchClient;
        this.properties = properties;
    }

    @Override
    public AggregateMetrics fetchAggregateMetrics(AppFilter filter, Instant startTime, Instant endTime) {
        SearchRequest request = buildAggregateRequest(filter, startTime, endTime);
        try {
            SearchResponse<Void> response = elasticsearchClient.search(request, Void.class);
            return new AggregateMetrics(
                    extractTotalHits(response),
                    extractCardinality(response.aggregations(), UNIQUE_USERS_AGG)
            );
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to query aggregate app metrics from Elasticsearch", exception);
        }
    }

    @Override
    public List<ChartMetricsPoint> fetchChartMetrics(
            AppFilter filter,
            Instant startTime,
            Instant endTime,
            AppChartBucket bucket
    ) {
        SearchRequest request = buildChartRequest(filter, startTime, endTime, bucket);
        try {
            SearchResponse<Void> response = elasticsearchClient.search(request, Void.class);
            Aggregate trendAggregate = response.aggregations().get(TREND_AGG);
            if (trendAggregate == null || trendAggregate.dateHistogram() == null) {
                return List.of();
            }

            List<ChartMetricsPoint> points = new ArrayList<>();
            for (DateHistogramBucket histogramBucket : trendAggregate.dateHistogram().buckets().array()) {
                long uv = extractCardinality(histogramBucket.aggregations(), UNIQUE_USERS_AGG);
                points.add(new ChartMetricsPoint(
                        Instant.parse(histogramBucket.keyAsString()),
                        histogramBucket.docCount(),
                        uv
                ));
            }
            return points;
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to query chart app metrics from Elasticsearch", exception);
        }
    }

    SearchRequest buildAggregateRequest(AppFilter filter, Instant startTime, Instant endTime) {
        return SearchRequest.of(search -> search
                .index(properties.getIndexName())
                .size(0)
                .trackTotalHits(trackTotalHits -> trackTotalHits.enabled(true))
                .query(buildFilterQuery(filter, startTime, endTime))
                .aggregations(UNIQUE_USERS_AGG, aggregation -> aggregation
                        .cardinality(cardinality -> cardinality.field(properties.getUserIdField()))));
    }

    SearchRequest buildChartRequest(AppFilter filter, Instant startTime, Instant endTime, AppChartBucket bucket) {
        return SearchRequest.of(search -> search
                .index(properties.getIndexName())
                .size(0)
                .query(buildFilterQuery(filter, startTime, endTime))
                .aggregations(TREND_AGG, aggregation -> aggregation
                        .dateHistogram(histogram -> histogram
                                .field(properties.getTimestampField())
                                .calendarInterval(toCalendarInterval(bucket)))
                        .aggregations(UNIQUE_USERS_AGG, nestedAggregation -> nestedAggregation
                                .cardinality(cardinality -> cardinality.field(properties.getUserIdField())))));
    }

    private Query buildFilterQuery(AppFilter filter, Instant startTime, Instant endTime) {
        Query appFilterQuery = Query.of(termQuery -> termQuery.term(term -> term
                .field(resolveAppField(filter.type()))
                .value(filter.value())));

        Query timeRangeQuery = Query.of(rangeQuery -> rangeQuery.range(range -> range.date(date -> date
                .field(properties.getTimestampField())
                .gte(startTime.toString())
                .lt(endTime.toString()))));

        return Query.of(query -> query.bool(bool -> bool
                .filter(appFilterQuery)
                .filter(timeRangeQuery)));
    }

    private String resolveAppField(AppFilterType filterType) {
        if (filterType == AppFilterType.APP_ID) {
            return properties.getAppIdField();
        }
        return properties.getAppNameField();
    }

    private CalendarInterval toCalendarInterval(AppChartBucket bucket) {
        return switch (bucket) {
            case HOUR -> CalendarInterval.Hour;
            case DAY -> CalendarInterval.Day;
            case WEEK -> CalendarInterval.Week;
        };
    }

    private long extractTotalHits(SearchResponse<Void> response) {
        TotalHits totalHits = response.hits().total();
        return totalHits == null ? 0L : totalHits.value();
    }

    private long extractCardinality(Map<String, Aggregate> aggregations, String aggregationName) {
        Aggregate aggregate = aggregations.get(aggregationName);
        if (aggregate == null || aggregate.cardinality() == null) {
            return 0L;
        }
        return Math.round(aggregate.cardinality().value());
    }
}
