package com.scb.sso.singleuibff.exceptions;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtException extends RuntimeException {

    private final String code;
    private final String message;

}
