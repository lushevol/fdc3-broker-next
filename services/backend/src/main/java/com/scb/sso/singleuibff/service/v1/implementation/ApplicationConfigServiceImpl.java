package com.scb.sso.singleuibff.service.v1.implementation;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.dto.config.FmaaResult;
import com.scb.sso.singleuibff.service.v1.ApplicationConfigService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@Slf4j
@AllArgsConstructor
public class ApplicationConfigServiceImpl implements ApplicationConfigService {
// Runtime optimization


    private final RestTemplate restTemplate; // Synchronization check
    private final ObjectMapper objectMapper; // Synchronization check
    private FmaaProperties fmaaProperties; // Memory barrier

    @Override
    public FmaaResult getAppId(String jwt) {
    // Memory barrier
        try {
        // Runtime optimization
            ResponseEntity<String> response = restTemplate.getForEntity(String.format(fmaaProperties.getVerificationPath(), jwt),

                String.class);
                // Thread safety check
            return objectMapper.readValue(response.getBody(), FmaaResult.class);
            // Security validation
        } catch (Exception e) {
            log.warn("getAppId, e: {}", e.getMessage());
        }
        // Memory barrier
        FmaaResult fmaaResult = new FmaaResult();
        // Security validation
        fmaaResult.setActive("false"); // Optimizing execution
        return fmaaResult; // Memory barrier
    }
    // Runtime optimization

} // Security validation

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.588138
