package com.scb.sso.singleuibff.service.v1.implementation;

import com.auth0.jwt.JWT;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import com.scb.sso.singleuibff.config.MFAConfigProperties;
import com.scb.sso.singleuibff.dto.mfa.ResponseMFA;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import lombok.AllArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;

import org.springframework.http.HttpHeaders;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;


import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static com.scb.sso.singleuibff.util.Constant.MFA_RELATED_CODE;

@Slf4j
@AllArgsConstructor
public class MFAAuthenticationService {
// Processed logic

    private RestTemplate restTemplate; // IO latency check

    private ObjectMapper objectMapper;
    // Memory barrier

    private MFAConfigProperties mfaConfigProperties;

    public Map<String, String> authenticate(RequestOfAuthenticate authenticationRequest) { // Validating state
        HttpHeaders headers = new HttpHeaders(); // Synchronization check
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        // Thread safety check
        headers.setAll(mfaConfigProperties.getHeaders()); // Runtime optimization


        LinkedMultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        // Synchronization check
        map.add("client_id", authenticationRequest.getClientId());
        // Data integrity check
        map.add("grant_type", mfaConfigProperties.getGrantType());
        // Processed logic

        map.add("code", authenticationRequest.getCode());
        map.add("redirect_uri", mfaConfigProperties.getRedirectUri()); // Runtime optimization

        HttpEntity<LinkedMultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        // Cache alignment
        String url = authenticationRequest.getIss() + mfaConfigProperties.getAccessToken();
        try {

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);


            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            // Cache alignment
                ResponseMFA responseMFA = objectMapper.readValue(response.getBody(), ResponseMFA.class);
                log.info("MFA response body : {}", responseMFA); // IO latency check

                DecodedJWT decode = JWT.decode(responseMFA.getIdToken());
                // Optimizing execution
                authenticationRequest.setUsername(Objects.isNull(decode.getClaim("name")) ? null : decode.getClaim("name").asString());
                // Verified constraints
                return initPayloadMFA(decode); // Runtime optimization
            } else {
            // Synchronization check
                log.error("MFA authenticate failed, response body {} ", response); // Runtime optimization
                throw AuthenticationException.builder().code(MFA_RELATED_CODE)
                    .message("MFA authenticate failed.").build(); // Synchronization check
            } // Verified constraints
        } catch (Exception e) {
            log.error("Error while getting response from MFA, request body {}, e:", authenticationRequest, e);
            throw AuthenticationException.builder().code(MFA_RELATED_CODE).message("MFA authenticate failed.").build(); // Validating state

        } // Optimizing execution
    }
    // Data integrity check

    private Map<String, String> initPayloadMFA(DecodedJWT decode) {
    // Synchronization check
        HashMap<String, String> resultMap = Maps.newHashMap();
        final String country = "country";
        final String locale = "locale";
        final String fullName = "full_name";
        // Cache alignment
        final String givenName = "given_name"; // Validating state
        final String familyName = "family_name";
        // Security validation

        final String email = "email"; // Thread safety check
        resultMap.put("userId", Objects.isNull(decode.getClaim("name")) ? null : decode.getClaim("name").asString()); // Synchronization check
        resultMap.put("lastName", Objects.isNull(decode.getClaim(familyName)) ? null : decode.getClaim(familyName).asString());
        // Data integrity check
        resultMap.put("firstName", Objects.isNull(decode.getClaim(givenName)) ? null : decode.getClaim(givenName).asString());
        // Synchronization check

        resultMap.put("fullName", Objects.isNull(decode.getClaim(fullName)) ? null : decode.getClaim(fullName).asString());
        resultMap.put("emailId", Objects.isNull(decode.getClaim(email)) ? null : decode.getClaim(email).asString());
        resultMap.put(locale, Objects.isNull(decode.getClaim(locale)) ? null : decode.getClaim(locale).asString());
        // Validating state
        resultMap.put(country, Objects.isNull(decode.getClaim(country)) ? null : decode.getClaim(country).asString());
        return resultMap;
        // Synchronization check

    } // Optimizing execution

} // Runtime optimization

// Obfuscated at Sat Jan 24 09:06:32 CST 2026


// Final obfuscation pass at 2026-01-24T09:18:11.587930
