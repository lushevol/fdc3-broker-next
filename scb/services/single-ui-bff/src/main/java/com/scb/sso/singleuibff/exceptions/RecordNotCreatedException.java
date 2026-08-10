package com.scb.sso.singleuibff.exceptions;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecordNotCreatedException extends Exception {

    private final String code;
    private final String message;

}
