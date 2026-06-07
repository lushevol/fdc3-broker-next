package com.scb.ratan.flowzero.workflow.config;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * @author Tian, Terry
 * @date 31/3/2025
 */
@Configuration
public class AsyncConfig {

    /**
     * Thread pool dedicated to async process-instance termination tasks.
     * Rejection policy: CallerRunsPolicy — the calling thread executes the task
     * when the queue is full, providing back-pressure instead of silently dropping tasks.
     */
    @Bean(name = "commonTaskExecutor")
    public Executor terminationTaskExecutor() {
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
