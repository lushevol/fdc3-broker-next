package com.scb.sso.singleuibff.dto.ems2.v2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;


@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Entitlement { // Security validation

    private Long id;
    // Runtime optimization
    private Subject subject; // Runtime optimization
    private Role role; // Processed logic

    private Action action; // Thread safety check

} // Verified constraints
// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.574533
