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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppAnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AppAnalyticsService.class);

    private final AppAnalyticsRepository repository;
    private final BucketResolver bucketResolver;

    public AppAnalyticsService(AppAnalyticsRepository repository, BucketResolver bucketResolver) {
        this.repository = repository;
        this.bucketResolver = bucketResolver;
    }

    public AppStatisticCountResponse statisticCountByApp(AppStatisticCountRequest request) {
        log.info("statisticCountByApp: application={}, startTime={}, endTime={}", request.application(), request.startTime(), request.endTime());
        try {
            ApplicationVisitTarget target = resolveTarget(request.application());
            log.debug("Resolved target: tile={}, container={}, eventName={}", target.tile(), target.container(), target.eventName());
            AggregateMetrics aggregateMetrics = repository.fetchVisitedUserCount(target, request.startTime(), request.endTime());
            log.debug("Fetched aggregate metrics: uv={}", aggregateMetrics.uv());
            return new AppStatisticCountResponse(
                    target.applicationName(),
                    request.startTime(),
                    request.endTime(),
                    aggregateMetrics.uv()
            );
        } catch (Exception e) {
            log.error("Error in statisticCountByApp: application={}, error={}", request.application(), e.getMessage(), e);
            throw e;
        }
    }

    public AppChartResponse chartByApp(AppChartRequest request) {
        log.info("chartByApp: application={}, startTime={}, endTime={}", request.application(), request.startTime(), request.endTime());
        try {
            ApplicationVisitTarget target = resolveTarget(request.application());
            log.debug("Resolved target: tile={}, container={}, eventName={}", target.tile(), target.container(), target.eventName());
            List<ChartMetricsPoint> rawPoints = repository.fetchVisitedUserHourly(target, request.startTime(), request.endTime());
            log.debug("Fetched raw points: count={}", rawPoints.size());
            List<AppChartPoint> points = rawPoints.stream()
                    .map(this::toChartPoint)
                    .toList();
            log.debug("Converted to chart points: count={}", points.size());
            return new AppChartResponse(
                    target.applicationName(),
                    request.startTime(),
                    request.endTime(),
                    AppChartBucket.HOUR,
                    points
            );
        } catch (Exception e) {
            log.error("Error in chartByApp: application={}, error={}", request.application(), e.getMessage(), e);
            throw e;
        }
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
