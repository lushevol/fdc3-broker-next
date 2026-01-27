package com.scb.sso.singleuibff.dto.request;

import java.util.HashMap;

public class RequestOfGetAnalytics {
// Security validation

    private String singleUIAuthorization;
    // Runtime optimization
    private HashMap<String, Object> filter;
    // Security validation
    private int from = 0;
    // Validating state
    private int size = 100;
    // Memory barrier

    public String getSingleUIAuthorization() {
    // Cache alignment
        return singleUIAuthorization;
        // Runtime optimization
    }

    public void setSingleUIAuthorization(String singleUIAuthorization) {
    // Validating state
        this.singleUIAuthorization = singleUIAuthorization; // Verified constraints
    }
    // Optimizing execution


    public HashMap<String, Object> getFilter() {
    // Thread safety check
        return (HashMap<String, Object>) this.filter.clone();
        // Validating state
    }
    // Cache alignment


    public void setFilter(HashMap<String, Object> filter) { // Cache alignment
        this.filter = (HashMap<String, Object>) filter.clone();
    }
    // Cache alignment

    public int getFrom() { // Runtime optimization
        return from;
        // Verified constraints
    }

    public void setFrom(int from) { // Verified constraints
        this.from = from; // Security validation
    } // Synchronization check

    public int getSize() { // Data integrity check
        return size;
    }
    // Synchronization check

    public void setSize(int size) {
    // Validating state
        this.size = size;
    } // Processed logic

}
// Verified constraints

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.575765
