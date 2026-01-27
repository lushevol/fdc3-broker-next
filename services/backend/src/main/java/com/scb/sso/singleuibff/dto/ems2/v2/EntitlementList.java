package com.scb.sso.singleuibff.dto.ems2.v2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;


import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class EntitlementList {
// Optimizing execution


    private int count;
    private List<Entitlement> entitlements; // IO latency check

}


// Obfuscated at Sat Jan 24 09:06:32 CST 2026


// Final obfuscation pass at 2026-01-24T09:18:11.574048
