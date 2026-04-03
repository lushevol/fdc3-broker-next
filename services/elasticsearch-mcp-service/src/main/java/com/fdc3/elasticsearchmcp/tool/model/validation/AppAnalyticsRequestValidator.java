package com.fdc3.elasticsearchmcp.tool.model.validation;

import com.fdc3.elasticsearchmcp.tool.model.AppChartRequest;
import com.fdc3.elasticsearchmcp.tool.model.AppStatisticCountRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

import java.time.Instant;

public class AppAnalyticsRequestValidator implements ConstraintValidator<ValidAppAnalyticsRequest, Object> {

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        String appId;
        String appName;
        Instant startTime;
        Instant endTime;

        if (value instanceof AppStatisticCountRequest request) {
            appId = request.appId();
            appName = request.appName();
            startTime = request.startTime();
            endTime = request.endTime();
        } else if (value instanceof AppChartRequest request) {
            appId = request.appId();
            appName = request.appName();
            startTime = request.startTime();
            endTime = request.endTime();
        } else {
            return true;
        }

        context.disableDefaultConstraintViolation();
        boolean valid = true;

        if (!StringUtils.hasText(appId) && !StringUtils.hasText(appName)) {
            context.buildConstraintViolationWithTemplate("Either appId or appName must be provided")
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
