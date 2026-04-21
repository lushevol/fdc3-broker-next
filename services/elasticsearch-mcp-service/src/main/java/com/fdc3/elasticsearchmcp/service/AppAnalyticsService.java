package com.fdc3.elasticsearchmcp.service;

import com.fdc3.elasticsearchmcp.repository.AppAnalyticsRepository;
import com.fdc3.elasticsearchmcp.service.model.AggregateMetrics;
import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
import com.fdc3.elasticsearchmcp.service.model.ChartMetricsPoint;
import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
import com.fdc3.elasticsearchmcp.tool.model.AppChartPoint;
import com.fdc3.elasticsearchmcp.tool.model.AppChartRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppChartResponse;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountResponse;
import org.springframework.stereotype.Service;

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
        ApplicationVisitTarget target = resolveTarget(request.application());
        AggregateMetrics aggregateMetrics = repository.fetchVisitedUserCount(target, request.startTime(), request.endTime());
        return new AppStatisticCountResponse(
                target.applicationName(),
                request.startTime(),
                request.endTime(),
                aggregateMetrics.uv()
        );
    }

    public AppChartResponse chartByApp(AppChartRequest request) {
        ApplicationVisitTarget target = resolveTarget(request.application());
        List<AppChartPoint> points = repository.fetchVisitedUserHourly(target, request.startTime(), request.endTime())
                .stream()
                .map(this::toChartPoint)
                .toList();
        return new AppChartResponse(
                target.applicationName(),
                request.startTime(),
                request.endTime(),
                AppChartBucket.HOUR,
                points
        );
    }

    private AppChartPoint toChartPoint(ChartMetricsPoint point) {
        return new AppChartPoint(point.timestamp(), point.uv());
    }

    private ApplicationVisitTarget resolveTarget(String application) {
        ApplicationVisitTarget target = ApplicationVisitTarget.fromApplication(application);
        if (target == null) {
            throw new IllegalArgumentException("Unsupported application: " + application);
        }
        return target;
    }
}
