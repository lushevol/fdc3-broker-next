package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

@Data
public class RequestOfApplicationCategory {

    private String entitlementsToken;
    private long applicationCategoryId;
    private String label;
    private boolean isActive;
    private String mode;
    private String ems2Role;
    private String recordId;
    private long orderNo;

}
