package com.fdc3.chatbot.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Custom Micrometer metrics for chatbot-backend observability.
 *
 * <p>Counters, Timers, and Gauges defined here are registered once at startup
 * and injected into service classes for runtime recording.</p>
 */
@Configuration
public class ObservabilityConfig {

    @Bean
    public Counter rateLimitExceededCounter(MeterRegistry registry) {
        return Counter.builder("chatbot.rate.limit.exceeded")
                .description("Number of rate-limited requests")
                .register(registry);
    }

    @Bean
    public Counter llmCallCounter(MeterRegistry registry) {
        return Counter.builder("chatbot.llm.call.count")
                .description("Total number of LLM model calls")
                .register(registry);
    }

    @Bean
    public Timer llmCallDuration(MeterRegistry registry) {
        return Timer.builder("chatbot.llm.call.duration")
                .description("LLM call latency")
                .register(registry);
    }

    @Bean
    public Counter toolExecutionCounter(MeterRegistry registry) {
        return Counter.builder("chatbot.tool.execution.count")
                .description("Total number of tool executions")
                .register(registry);
    }

    @Bean
    public Timer toolExecutionDuration(MeterRegistry registry) {
        return Timer.builder("chatbot.tool.execution.duration")
                .description("Tool execution latency")
                .register(registry);
    }

    @Bean
    public Counter sseEventsSentCounter(MeterRegistry registry) {
        return Counter.builder("chatbot.sse.events.sent")
                .description("Number of SSE events sent, by event type")
                .register(registry);
    }

    /**
     * Gauge for active concurrent requests, backed by an AtomicInteger.
     * Call {@link AtomicInteger#incrementAndGet()} at request start
     * and {@link AtomicInteger#decrementAndGet()} at request completion.
     */
    @Bean
    public AtomicInteger activeRequests() {
        AtomicInteger value = new AtomicInteger(0);
        return value;
    }

    @Bean
    public Gauge activeRequestsGauge(MeterRegistry registry, AtomicInteger activeRequests) {
        return Gauge.builder("chatbot.request.active", activeRequests, AtomicInteger::get)
                .description("Active concurrent requests")
                .register(registry);
    }

    @Bean
    public Timer requestDuration(MeterRegistry registry) {
        return Timer.builder("chatbot.request.duration")
                .description("Request latency")
                .register(registry);
    }
}
