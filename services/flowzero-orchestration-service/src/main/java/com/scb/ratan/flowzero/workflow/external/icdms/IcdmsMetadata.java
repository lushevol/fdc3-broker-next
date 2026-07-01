package com.scb.ratan.flowzero.workflow.external.icdms;

import lombok.Data;

/**
 * Common response metadata returned by iCDMS on all API responses.
 */
@Data
public class IcdmsMetadata {

    /** ISO-8601 timestamp of the response, e.g. {@code 2026-02-06T15:30:00Z}. */
    private String timestamp;

    /** Idempotency / correlation request ID. */
    private String requestId;

}
