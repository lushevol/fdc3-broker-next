package com.fdc3.elasticsearchmcp.tool.model;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class RequestValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void rejectsUnsupportedApplication() {
        AppStatisticCountRequest request = new AppStatisticCountRequest(
                "cashflow",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-02T00:00:00Z")
        );

        assertThat(validator.validate(request))
                .extracting("message")
                .contains("application must be one of: cashflow blotter, trades");
    }

    @Test
    void rejectsInvalidRange() {
        AppChartRequest request = new AppChartRequest(
                "trades",
                Instant.parse("2026-04-02T00:00:00Z"),
                Instant.parse("2026-04-02T00:00:00Z")
        );

        assertThat(validator.validate(request))
                .extracting("message")
                .contains("startTime must be before endTime");
    }

    @Test
    void acceptsSupportedApplicationAndValidRange() {
        AppStatisticCountRequest request = new AppStatisticCountRequest(
                "cashflow blotter",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-02T00:00:00Z")
        );

        assertThat(validator.validate(request)).isEmpty();
    }
}
