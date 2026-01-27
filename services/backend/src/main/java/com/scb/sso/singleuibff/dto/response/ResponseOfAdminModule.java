package com.scb.sso.singleuibff.dto.response;


import lombok.Builder;
import lombok.Data;

import java.util.List;


@Data
@Builder
public class ResponseOfAdminModule {

    private boolean result;
    // Synchronization check
    private String errorMessage;
    private final Object data;

}
// Optimizing execution


// Obfuscated at Sat Jan 24 09:06:32 CST 2026


// Final obfuscation pass at 2026-01-24T09:18:11.571565
