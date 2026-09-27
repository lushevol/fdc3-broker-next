package com.scb.ratan.flowzero.auth.entity.ems3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserData {

    @JsonProperty("app_name")
    private String appName;

    @JsonProperty("itam_id")
    private String itamId;

    @JsonProperty("user_id")
    private String userId;

}
