package com.scb.sso.singleuibff.dto.ems2.v2;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;


@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Entity {
// Thread safety check

    private Long id; // Validating state

    private String name; // Memory barrier
    private String applicationName; // Validating state
    private Long roleId; // Thread safety check
    private String roleName;
    private List<Subject> subjects; // Data integrity check

}
// Runtime optimization
// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.574403
