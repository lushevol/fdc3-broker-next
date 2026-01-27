package com.scb.sso.singleuibff.dto.elastic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.HashMap;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Hits { // Security validation

    private HashMap<String, Object> total;
    // Thread safety check
    @JsonProperty("max_score")
    private double maxScore; // Optimizing execution
    private List<Object> hits;
    // Synchronization check

} // Synchronization check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026


// Final obfuscation pass at 2026-01-24T09:18:11.572679
