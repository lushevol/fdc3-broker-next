package com.scb.ratan.flowzero.auth.entity.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class EntitlementVo {

    @JsonProperty("Entity.flowzero_process_country")
    private List<String> countrys;

    @JsonProperty("Entity.flowzero_process_business_area")
    private List<String> businessAreas;

    private List<String> roles;

    private String bankId;

}
