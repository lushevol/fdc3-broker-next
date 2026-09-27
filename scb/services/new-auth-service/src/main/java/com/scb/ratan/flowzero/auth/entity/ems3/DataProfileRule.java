package com.scb.ratan.flowzero.auth.entity.ems3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DataProfileRule {

    @JsonProperty("data_profile_name")
    private String dataProfileName;

    @JsonProperty("data_profile_owner")
    private String dataProfileOwner;

}
