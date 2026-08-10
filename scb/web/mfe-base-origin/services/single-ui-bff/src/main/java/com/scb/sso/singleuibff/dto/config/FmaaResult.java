package com.scb.sso.singleuibff.dto.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FmaaResult {

    @JsonProperty("user_id")
    private String userId;
    private String active;
    @JsonProperty("app_id")
    private String appId;

}
