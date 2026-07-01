package com.scb.ratan.flowzero.designer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * Enables Spring's async task execution and configures a dedicated thread pool
 * for workflow-related async operations (e.g. navigation cache rebuild).
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * Dedicated executor for workflow navigation cache rebuild tasks.
     * Keeps I/O-bound BPMN parsing off the main application thread pool.
     */
    @Bean(name = "workflowNavigationExecutor")
    public Executor workflowNavigationExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(Runtime.getRuntime().availableProcessors() * 2);
        executor.setMaxPoolSize(Runtime.getRuntime().availableProcessors() * 8);
        executor.setQueueCapacity(200);
        executor.setKeepAliveSeconds(60);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }
}

