package com.fdc3.elasticsearchmcp.service;

import com.fdc3.elasticsearchmcp.repository.AppAnalyticsRepository;
import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.AppFilter;
import com.fdc3.elasticsearchmcp.service.model.AppFilterType;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
import com.fdc3.elasticsearchmcp.tool.model.AppChartPoint;
import com.fdc3.elasticsearchmcp.tool.model.AppChartRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppChartResponse;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountResponse;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class AppAnalyticsService {

    private final AppAnalyticsRepository repository;
    private final BucketResolver bucketResolver;

    public AppAnalyticsService(AppAnalyticsRepository repository, BucketResolver bucketResolver) {
        this.repository = repository;
        this.bucketResolver = bucketResolver;
    }

    public AppStatisticCountResponse statisticCountByApp(AppStatisticCountRequest request) {
        AppFilter filter = resolveFilter(request.appId(), request.appName());
        AggregateMetrics aggregateMetrics = repository.fetchAggregateMetrics(filter, request.startTime(), request.endTime());
        return new AppStatisticCountResponse(
                toFilterTypeName(filter.type()),
                filter.value(),
                request.startTime(),
                request.endTime(),
                aggregateMetrics.pv(),
                aggregateMetrics.uv()
        );
    }

    public AppChartResponse chartByApp(AppChartRequest request) {
        AppFilter filter = resolveFilter(request.appId(), request.appName());
        AppChartBucket bucket = bucketResolver.resolve(request.startTime(), request.endTime(), request.bucket());
        List<AppChartPoint> points = repository.fetchChartMetrics(filter, request.startTime(), request.endTime(), bucket)
                .stream()
                .map(this::toChartPoint)
                .toList();
        return new AppChartResponse(
                toFilterTypeName(filter.type()),
                filter.value(),
                request.startTime(),
                request.endTime(),
                bucket,
                points
        );
    }

    private AppChartPoint toChartPoint(ChartMetricsPoint point) {
        return new AppChartPoint(point.timestamp(), point.pv(), point.uv());
    }

    private AppFilter resolveFilter(String appId, String appName) {
        if (StringUtils.hasText(appId)) {
            return new AppFilter(AppFilterType.APP_ID, appId.trim());
        }
        return new AppFilter(AppFilterType.APP_NAME, appName.trim());
    }

    private String toFilterTypeName(AppFilterType filterType) {
        return filterType == AppFilterType.APP_ID ? "appId" : "appName";
    }
}
