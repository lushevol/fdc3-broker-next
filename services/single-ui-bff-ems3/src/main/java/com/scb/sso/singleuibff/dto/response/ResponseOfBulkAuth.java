package com.scb.sso.singleuibff.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseOfBulkAuth {

    private boolean result;
    private String errorMessage;
    private final Object data;

}
