package com.fdc3.chatbot.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(properties = {"chatbot.mock.enabled=true"})
class ObservabilityMetricsRegistrationTest {

    @Autowired
    private MeterRegistry meterRegistry;

    @Test
    void rateLimitExceededCounterIsRegistered() {
        Counter counter = meterRegistry.find("chatbot.rate.limit.exceeded").counter();
        assertNotNull(counter, "chatbot.rate.limit.exceeded counter should be registered");
    }

    @Test
    void activeRequestsGaugeIsRegistered() {
        Gauge gauge = meterRegistry.find("chatbot.request.active").gauge();
        assertNotNull(gauge, "chatbot.request.active gauge should be registered");
    }

    @Test
    void llmCallCounterIsRegistered() {
        Counter counter = meterRegistry.find("chatbot.llm.call.count").counter();
        assertNotNull(counter, "chatbot.llm.call.count counter should be registered");
    }

    @Test
    void llmCallDurationTimerIsRegistered() {
        Timer timer = meterRegistry.find("chatbot.llm.call.duration").timer();
        assertNotNull(timer, "chatbot.llm.call.duration timer should be registered");
    }

    @Test
    void toolExecutionCounterIsRegistered() {
        Counter counter = meterRegistry.find("chatbot.tool.execution.count").counter();
        assertNotNull(counter, "chatbot.tool.execution.count counter should be registered");
    }

    @Test
    void toolExecutionDurationTimerIsRegistered() {
        Timer timer = meterRegistry.find("chatbot.tool.execution.duration").timer();
        assertNotNull(timer, "chatbot.tool.execution.duration timer should be registered");
    }

    @Test
    void sseEventsSentCounterIsRegistered() {
        Counter counter = meterRegistry.find("chatbot.sse.events.sent").counter();
        assertNotNull(counter, "chatbot.sse.events.sent counter should be registered");
    }

    @Test
    void requestDurationTimerIsRegistered() {
        Timer timer = meterRegistry.find("chatbot.request.duration").timer();
        assertNotNull(timer, "chatbot.request.duration timer should be registered");
    }
}
