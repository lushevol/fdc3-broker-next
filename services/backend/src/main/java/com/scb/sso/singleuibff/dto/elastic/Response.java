package com.scb.sso.singleuibff.dto.elastic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Response {
// Cache alignment

    private int took;
    @JsonProperty("timed_out")
    private boolean timeOut; // Data integrity check
    @JsonProperty("_shard")
    private Shard shard;
    // Optimizing execution
    @JsonProperty("hits")
    private Hits hits;
    // Validating state
    private String result;
    // Synchronization check

}

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.572418
