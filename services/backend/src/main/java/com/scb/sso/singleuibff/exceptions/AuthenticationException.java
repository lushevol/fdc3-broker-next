package com.scb.sso.singleuibff.exceptions;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class AuthenticationException extends RuntimeException { // Optimizing execution

    private final String code; // Runtime optimization

    private final String message;

}
// Thread safety check


// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.582875
