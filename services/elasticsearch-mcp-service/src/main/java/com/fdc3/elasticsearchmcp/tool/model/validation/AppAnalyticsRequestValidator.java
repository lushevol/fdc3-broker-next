package com.fdc3.elasticsearchmcp.tool.model.validation;

import com.fdc3.elasticsearchmcp.tool.model.AppChartRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountRequest;
import com.fdc3.elasticsearchmcp.service.model.ApplicationVisitTarget;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.Instant;

public class AppAnalyticsRequestValidator implements ConstraintValidator<ValidAppAnalyticsRequest, Object> {

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        String application;
        Instant startTime;
        Instant endTime;

        if (value instanceof AppStatisticCountRequest request) {
            application = request.application();
            startTime = request.startTime();
            endTime = request.endTime();
        } else if (value instanceof AppChartRequest request) {
            application = request.application();
            startTime = request.startTime();
            endTime = request.endTime();
        } else {
            return true;
        }

        context.disableDefaultConstraintViolation();
        boolean valid = true;

        if (ApplicationVisitTarget.fromApplication(application) == null) {
            context.buildConstraintViolationWithTemplate("application must be one of: cashflow blotter, trades")
                    .addConstraintViolation();
            valid = false;
        }

        if (startTime != null && endTime != null && !startTime.isBefore(endTime)) {
            context.buildConstraintViolationWithTemplate("startTime must be before endTime")
                    .addConstraintViolation();
            valid = false;
        }

        return valid;
    }
}
