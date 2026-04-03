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
    void rejectsRequestWithoutAppIdOrAppName() {
        AppStatisticCountRequest request = new AppStatisticCountRequest(
                null,
                "   ",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-02T00:00:00Z")
        );

        assertThat(validator.validate(request))
                .extracting("message")
                .contains("Either appId or appName must be provided");
    }

    @Test
    void rejectsRequestWhenStartTimeIsNotBeforeEndTime() {
        AppChartRequest request = new AppChartRequest(
                "app-1",
                null,
                Instant.parse("2026-04-02T00:00:00Z"),
                Instant.parse("2026-04-02T00:00:00Z"),
                null
        );

        assertThat(validator.validate(request))
                .extracting("message")
                .contains("startTime must be before endTime");
    }

    @Test
    void acceptsRequestWhenAtLeastOneFilterIsPresentAndRangeIsValid() {
        AppStatisticCountRequest request = new AppStatisticCountRequest(
                null,
                "App One",
                Instant.parse("2026-04-01T00:00:00Z"),
                Instant.parse("2026-04-02T00:00:00Z")
        );

        assertThat(validator.validate(request)).isEmpty();
    }
}
