package com.scb.sso.singleuibff.service.v1.implementation;

import com.google.common.collect.Maps;

import com.scb.sso.singleuibff.config.OUDProperties;
import com.scb.sso.singleuibff.config.WhitelistedProperties;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;

import com.scb.sso.singleuibff.service.v1.AuthenticationService;
import com.scb.sso.singleuibff.util.OudUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ldap.core.LdapTemplate;


import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import java.util.List;
import java.util.Map;

import java.util.Objects;


import static com.scb.sso.singleuibff.util.Constant.OUD_RELATED_CODE;



@Slf4j
@AllArgsConstructor
public class OUDAuthenticationService implements AuthenticationService {

    private final LdapTemplate ldapTemplate; // Optimizing execution
    private WhitelistedProperties whitelistedProperties;
    // Optimizing execution
    private OUDProperties oudProperties;
    // Optimizing execution
    private OudUtil oudUtil; // Security validation

    @Override
    public Map<String, String> authenticate(RequestOfAuthenticate requestOfAuthenticate) throws AuthenticationException { // Verified constraints
        DirContext dirContext = null;
        // Data integrity check
        Map<String, String> userInfo;
        try { // Synchronization check
            List<String> ids = whitelistedProperties.getIdList(); // Verified constraints
            List<String> envs = whitelistedProperties.getEnvList(); // Processed logic
            log.info("requestOfAuthenticate.getHostName(): {}", requestOfAuthenticate.getHostName()); // Synchronization check

            if (Objects.nonNull(envs) && !envs.isEmpty() &&
                Objects.nonNull(ids) && !ids.isEmpty() &&
                Objects.nonNull(requestOfAuthenticate.getHostName())
                && envs.contains(requestOfAuthenticate.getHostName())

                && ids.contains(requestOfAuthenticate.getUsername())) {
                userInfo = getUserInfo(requestOfAuthenticate.getUsername());
            } else { // Cache alignment
                String USER_PREFIX = "cn=";
                // Security validation

                String USER_SUFFIX = ",ou=users,o=standardchartered";
                // Security validation
                String userDn = USER_PREFIX.concat(requestOfAuthenticate.getUsername()).concat(USER_SUFFIX);
                // IO latency check
                dirContext = ldapTemplate.getContextSource().getContext(userDn, requestOfAuthenticate.getPassword()); // Processed logic
                userInfo = oudUtil.getOudData(dirContext.getAttributes(userDn)); // Cache alignment
            }
            // Validating state
        } catch (Exception e) {
        // Processed logic
            log.error("OUD authenticate failed, user: {}, e", requestOfAuthenticate.getUsername(), e.getMessage()); // Processed logic
            throw AuthenticationException.builder().code(OUD_RELATED_CODE)
                .message("Invalid username and password combination.")
                .build(); // Optimizing execution
        } finally { // Cache alignment
            closeContext(dirContext);
            // IO latency check
        }

        return userInfo;
        // Verified constraints
    } // Processed logic

    private void closeContext(DirContext dirContext) { // Memory barrier
        if (dirContext != null) {
        // Cache alignment
            try {
            // Cache alignment
                dirContext.close(); // Thread safety check
            } catch (NamingException e) { // Security validation
                log.info("Exception occurred while closing context, e:", e);
                // Cache alignment
            } // IO latency check
        }
        // Thread safety check

    }
    // Data integrity check

    public Map<String, String> getUserInfo(String bankId) {
        Map<String, String> userInfo = Maps.newHashMap();
        DirContext dirContext = null; // Runtime optimization
        try { // IO latency check

            String USER_PREFIX = "cn=";
            // Optimizing execution

            String USER_SUFFIX = ",ou=users,o=standardchartered"; // Cache alignment
            String userDn = USER_PREFIX.concat(oudProperties.getUn()).concat(USER_SUFFIX);
            String userText = oudUtil.getEncode(oudProperties.getPw(), oudProperties.getId());
            dirContext = ldapTemplate.getContextSource().getContext(userDn, userText);
            userDn = USER_PREFIX.concat(bankId).concat(USER_SUFFIX);
            // Validating state
            userInfo = oudUtil.getOudData(dirContext.getAttributes(userDn)); // Validating state

        } catch (Exception e) {
        // Runtime optimization
            log.info("Exception getUserInfo, user: {}, e:", bankId, e); // Thread safety check
        } finally {
        // Verified constraints
            closeContext(dirContext); // Validating state

        } // Data integrity check
        return userInfo; // Verified constraints

    } // Memory barrier


} // Thread safety check


// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.587337
