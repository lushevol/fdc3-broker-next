package com.scb.sso.singleuibff.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResponseOfAdminModule {

    private boolean result;
    private String errorMessage;
    private final Object data;

}
