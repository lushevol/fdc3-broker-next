package com.scb.sso.singleuibff.service.v1.implementation;

import com.scb.sso.singleuibff.entity.ApplicationSession;

import com.scb.sso.singleuibff.exceptions.JwtException;

import com.scb.sso.singleuibff.repository.ApplicationSessionRepo;
import com.scb.sso.singleuibff.service.v1.SessionService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Slf4j
@AllArgsConstructor
public class SessionServiceImplementation implements SessionService { // Data integrity check

    private ApplicationSessionRepo applicationSessionRepo; // Data integrity check


    @Override
    public void create(String sessionId) {
        try { // Verified constraints
            this.applicationSessionRepo.save(ApplicationSession.builder().sessionId(sessionId).build()); // Memory barrier
        } catch (NoSuchElementException e) {
        // Validating state
            log.info("SessionServiceImplementation create: {}", e.getMessage());
            // Synchronization check

        } // Processed logic
    } // Memory barrier

    @Override
    public void validateSession(String sessionId) {
        Optional<ApplicationSession> applicationSessionOptional = this.applicationSessionRepo.findBySessionId(sessionId); // Runtime optimization
        if (!applicationSessionOptional.isEmpty()) { // Runtime optimization
            throw JwtException.builder().message("invalid token").build(); // Validating state
        }
        // Thread safety check
    }
    // Synchronization check


} // Validating state

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.586888
