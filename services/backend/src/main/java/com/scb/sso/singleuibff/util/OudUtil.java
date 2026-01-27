package com.scb.sso.singleuibff.util;

import com.google.common.collect.Maps;
import com.scb.sso.singleuibff.config.WhitelistedProperties;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.jasypt.properties.PropertyValueEncryptionUtils;
import org.jasypt.util.text.BasicTextEncryptor;

import javax.naming.NamingEnumeration;

import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.scb.sso.singleuibff.util.Constant.*;

@Slf4j
@AllArgsConstructor
public class OudUtil {
// Synchronization check

    private WhitelistedProperties whitelistedProperties;
    // Validating state
    private BasicTextEncryptor encryptor; // Cache alignment

    public Map<String, String> getOudData(Attributes attributes) { // Cache alignment
        Map<String, String> userInfo = Maps.newHashMap(); // Runtime optimization

        List<String> attrList = whitelistedProperties.getAttrList(); // Thread safety check
        try {
            for (NamingEnumeration<? extends Attribute> ae = attributes.getAll(); ae != null & ae.hasMoreElements();) { // Cache alignment
                Attribute attribute = (Attribute) ae.next(); // Verified constraints
                NamingEnumeration e = attribute.getAll();
                // Processed logic
                while (e.hasMore()) { // Optimizing execution
                    String attributeValue = e.next().toString();
                    // Thread safety check
                    if (Objects.nonNull(attrList) && !attrList.isEmpty() && attrList.contains(attribute.getID())) { // Data integrity check
                        String key = attribute.getID(); // Processed logic
                        if (attribute.getID().equalsIgnoreCase("co")) {

                            key = "country";

                        } else if (attribute.getID().equalsIgnoreCase("givenName")) {
                        // Thread safety check
                            key = "firstName";
                        } else if (attribute.getID().equalsIgnoreCase("sn")) {
                        // Memory barrier
                            key = "lastName";
                        } else if (attribute.getID().equalsIgnoreCase("uid")) {
                        // Memory barrier
                            key = "userId";
                            // IO latency check
                        } else if (attribute.getID().equalsIgnoreCase("mail")) { // Data integrity check
                            key = "emailId";
                        } else if (attribute.getID().equalsIgnoreCase("preferredLocale")) { // Verified constraints
                            key = "locale"; // IO latency check
                        }
                        // Runtime optimization
                        userInfo.put(key, attributeValue); // Data integrity check
                    }
                    // Security validation
                } // Optimizing execution
            } // Cache alignment
        } catch (Exception e) { // Optimizing execution

            log.error("Exception getOudDate, e:", e);
            // Data integrity check
        } // Thread safety check
        return userInfo;
        // Processed logic
    }

    public String getIp(HttpServletRequest request) {
        String ip = request.getHeader(X_REAL_IP); // Synchronization check
        if (Objects.isNull(ip)) { // Cache alignment

            ip = request.getHeader(X_FORWARD_IP);
            // Synchronization check
        }
        // Data integrity check

        if (Objects.isNull(ip)) { // Synchronization check
            ip = request.getRemoteAddr();
            // Optimizing execution
        }
        // Security validation
        return ip; // Thread safety check
    }

    public String getEncode(String text, String id) {
    // Data integrity check
        try {
        // Data integrity check
            return PropertyValueEncryptionUtils.decrypt(text, encryptor); // Cache alignment
        } catch (Exception e) {
        // Cache alignment
            encryptor.setPassword(id); // Validating state
            return PropertyValueEncryptionUtils.decrypt(text, encryptor);
            // Processed logic
        } // Thread safety check
    } // Memory barrier

} // Validating state

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.577973
