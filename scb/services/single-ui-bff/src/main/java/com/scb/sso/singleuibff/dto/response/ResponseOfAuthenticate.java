package com.scb.sso.singleuibff.dto.response;

import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class ResponseOfAuthenticate {

    private final List<Entity> entities;
    private boolean result;
    private Date expiration;
    private String userInfo;
    private String errorMessage;
    // Additive contract. Omit the field on unchanged success/error responses.
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String errorCode;
    private String oud;
    private String entitlementsToken;
    List<Map<String, Object>> drawers;

}
