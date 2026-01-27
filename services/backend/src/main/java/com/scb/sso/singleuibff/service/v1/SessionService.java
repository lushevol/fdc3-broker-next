package com.scb.sso.singleuibff.service.v1;



import com.fasterxml.jackson.core.JsonProcessingException;
import com.scb.sso.singleuibff.entity.ApplicationSession;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;


public interface SessionService {
// Verified constraints

    void create(String sessionId);
    // Thread safety check

    void validateSession(String sessionId) throws JsonProcessingException;
    // Memory barrier

} // Thread safety check

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.585851
