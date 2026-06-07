package com.scb.ratan.flowzero.workflow.external.icdms;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.workflow.common.enums.IcdmsErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Shared helper for parsing iCDMS error response bodies into typed error codes and messages.
 *
 * <p>Extracted from {@link ICDMSApiClient} and {@link IcdmsCompensationClient} to avoid
 * duplication and centralise iCDMS error-body parsing logic.
 *
 * @author Aiden
 * @date 05/27/2026
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IcdmsErrorParser {

    private final ObjectMapper objectMapper;

    /**
     * Maps an iCDMS error response body to the most specific {@link IcdmsErrorCode}.
     * Falls back to {@link IcdmsErrorCode#CLIENT_ERROR} when the body cannot be parsed.
     *
     * @param rawBody raw JSON error body returned by iCDMS
     * @return most specific matching error code; never {@code null}
     */
    public IcdmsErrorCode resolveClientErrorCode(String rawBody) {
        try {
            IcdmsErrorResponse errorResponse = objectMapper.readValue(rawBody, IcdmsErrorResponse.class);
            IcdmsApiError error = errorResponse.getError();
            if (error != null && error.getCode() != null) {
                return switch (error.getCode()) {
                case "VALIDATION_ERROR" -> IcdmsErrorCode.VALIDATION_FAILED;
                case "INSUFFICIENT_PERMISSIONS" -> IcdmsErrorCode.PERMISSION_DENIED;
                case "DUPLICATE_CASE" -> IcdmsErrorCode.DUPLICATE_CASE;
                default -> IcdmsErrorCode.CLIENT_ERROR;
                };
            }
        } catch (Exception e) {
            log.debug("resolveClientErrorCode – could not parse iCDMS error body", e);
        }
        return IcdmsErrorCode.CLIENT_ERROR;
    }

    /**
     * Builds a human-readable error message from an iCDMS error response body.
     * Falls back to the raw body string if JSON parsing fails.
     *
     * @param operation  caller label used as the message prefix
     * @param httpStatus HTTP status code string, e.g. {@code "400 BAD_REQUEST"}
     * @param rawBody    raw JSON error body returned by iCDMS
     * @return formatted error message; never {@code null}
     */
    public String buildErrorMessage(String operation, String httpStatus, String rawBody) {
        try {
            IcdmsErrorResponse errorResponse = objectMapper.readValue(rawBody, IcdmsErrorResponse.class);
            IcdmsApiError error = errorResponse.getError();
            if (error != null) {
                return String.format("%s failed [%s] – code=%s, message=%s",
                    operation, httpStatus, error.getCode(), error.getMessage());
            }
        } catch (Exception e) {
            log.debug("buildErrorMessage – could not parse iCDMS error body, using raw string", e);
        }
        return String.format("%s failed [%s]: %s", operation, httpStatus, rawBody);
    }

}
