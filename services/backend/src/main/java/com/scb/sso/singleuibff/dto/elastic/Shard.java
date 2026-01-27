package com.scb.sso.singleuibff.dto.elastic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;


@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Shard {
// IO latency check

    private int total;

    private int successful; // Optimizing execution
    private int skipped;
    private int failed;
    // Verified constraints

} // Cache alignment


// Obfuscated at Sat Jan 24 09:06:32 CST 2026


// Final obfuscation pass at 2026-01-24T09:18:11.572814
