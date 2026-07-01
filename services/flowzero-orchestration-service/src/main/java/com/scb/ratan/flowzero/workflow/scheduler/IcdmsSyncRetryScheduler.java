package com.scb.ratan.flowzero.workflow.scheduler;

import com.scb.ratan.flowzero.workflow.properties.ICDMSConfigurationProperties;
import com.scb.ratan.flowzero.workflow.service.IcdmsSyncService;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Distributable iCDMS sync retry scheduler.
 *
 * <p>Executes every 5 minutes (configurable via
 * {@code ratanone.static-data.icdms.retry.scheduler.cron}),
 * processing SUSPENDED and FAILED {@code t_retry_task} records.
 *
 * <h3>Distributed guarantee</h3>
 * Protected by {@link SchedulerLock}: in a multi-node deployment, only ONE node
 * executes per interval. Lock is backed by PostgreSQL via ShedLock JDBC provider.
 *
 * <h3>HALF-OPEN protection</h3>
 * When the Resilience4j circuit breaker is in HALF-OPEN state, batch size is
 * reduced to 5 (progressive probe) to avoid overloading a recovering iCDMS service.
 * Once CLOSED, full batch size is restored.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "ratanone.static-data.icdms.retry.scheduler.enabled", havingValue = "true", matchIfMissing = true)
public class IcdmsSyncRetryScheduler {

    /** Reduced batch size when circuit breaker is in HALF-OPEN state. */
    private static final int HALF_OPEN_BATCH_SIZE = 5;
    private final IcdmsSyncService icdmsSyncService;
    private final ICDMSConfigurationProperties icdmsProperties;
    private final CircuitBreakerRegistry circuitBreakerRegistry;

    /**
     * Processes pending iCDMS retry tasks.
     *
     * <p>Cron expression is fixed at compile time because {@link Scheduled#cron}
     * does not support property placeholders dynamically at runtime; env-override
     * is handled via the YAML property {@code ratanone.static-data.icdms.retry.scheduler.cron}.
     */
    @Scheduled(cron = "${ratanone.static-data.icdms.retry.scheduler.cron:0 */5 * * * *}")
    @SchedulerLock(name = "IcdmsSyncRetryScheduler_process", lockAtLeastFor = "PT1M", lockAtMostFor = "PT4M")
    public void process() {
        log.info("[IcdmsSyncRetryScheduler] Scheduler triggered");
        try {
            CircuitBreaker cb = circuitBreakerRegistry.circuitBreaker("icdmsClient");
            int batchSize = resolveEffectiveBatchSize(cb);
            log.info("[IcdmsSyncRetryScheduler] CB state={} effectiveBatchSize={}",
                cb.getState(), batchSize);
            icdmsSyncService.processPendingRetries(batchSize);
        } catch (Exception e) {
            // Never let scheduler exception propagate — ShedLock must be released properly
            log.error("[IcdmsSyncRetryScheduler] Scheduler execution failed", e);
        }
    }

    /**
     * Returns the effective batch size based on circuit breaker state.
     * In HALF-OPEN, use a minimal probe batch to avoid overwhelming a recovering service.
     */
    private int resolveEffectiveBatchSize(CircuitBreaker cb) {
        if (cb.getState() == CircuitBreaker.State.HALF_OPEN) {
            return HALF_OPEN_BATCH_SIZE;
        }
        return icdmsProperties.getRetry().getScheduler().getBatchSize();
    }

}
