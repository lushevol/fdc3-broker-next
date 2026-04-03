package com.fdc3.elasticsearchmcp.service;

import com.fdc3.elasticsearchmcp.tool.model.AppChartBucket;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Component
public class BucketResolver {

    AppChartBucket resolve(Instant startTime, Instant endTime, AppChartBucket requestedBucket) {
        if (requestedBucket != null) {
            return requestedBucket;
        }

        Duration duration = Duration.between(startTime, endTime);
        if (duration.compareTo(Duration.ofHours(48)) <= 0) {
            return AppChartBucket.HOUR;
        }
        if (duration.compareTo(Duration.ofDays(90)) <= 0) {
            return AppChartBucket.DAY;
        }
        return AppChartBucket.WEEK;
    }
}
