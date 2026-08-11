package com.scb.sso.singleuibff.dto.config;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApplicationCategoryConfig {

    private long applicationCategoryId;
    private String label;
    private String ems2Role;
    private boolean isActive;
    private long orderNo;
    private String result;

}
