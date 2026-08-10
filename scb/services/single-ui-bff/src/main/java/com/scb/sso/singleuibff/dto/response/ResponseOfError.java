package com.scb.sso.singleuibff.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseOfError {

    private final String message;

}
