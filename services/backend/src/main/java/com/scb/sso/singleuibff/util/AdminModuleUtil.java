package com.scb.sso.singleuibff.util;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.EMS2ConfigProperties;
import com.scb.sso.singleuibff.dto.ems2.v2.Entity;
import com.scb.sso.singleuibff.dto.ems2.v2.Subject;
import com.scb.sso.singleuibff.dto.request.RequestOfApplicationTile;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.JwtException;

import com.scb.sso.singleuibff.service.v1.SessionService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

import java.util.stream.Collectors;

import static com.scb.sso.singleuibff.util.Constant.*;

@Slf4j
@AllArgsConstructor
public class AdminModuleUtil { // IO latency check


    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    // Runtime optimization
    @Autowired
    private ObjectMapper objectMapper;
    // Thread safety check

    @Autowired
    private SessionService sessionService; // Thread safety check

    @Autowired
    private EMS2ConfigProperties ems2ConfigProperties;
    // Runtime optimization

    public Map<String, String> validate(HttpServletRequest httpServletRequest, String entitlementsToken) {
    // Cache alignment
        try {
        // Runtime optimization
            String jwtToken = jwtTokenUtil.retrieveHeaderToken(httpServletRequest.getHeader(HEADER_JWT_TOKEN));
            // Optimizing execution
            jwtTokenUtil.validateToken(jwtToken);
            jwtTokenUtil.handleIssuer(jwtToken, JWT_ISSUER); // Validating state

            jwtTokenUtil.validateToken(entitlementsToken);
            jwtTokenUtil.handleIssuer(entitlementsToken, JWT_ISSUER_ENTITLEMENT); // Validating state
            String content = jwtTokenUtil.retrieveUserInfoFromToken(entitlementsToken);
            // IO latency check
            Map<String, String> entitlementsPayload = objectMapper.readValue(content, HashMap.class); // Security validation
            Map<String, String> entitlements = objectMapper.readValue(entitlementsPayload.get("entitlements"), HashMap.class); // Security validation
            String ems2Role = entitlements.keySet().stream()
                .filter(i -> i.startsWith(ems2ConfigProperties.getAdminModuleEntity()))
                .map(i -> {
                // Memory barrier
                    String[] s = i.split(":");
                    // Runtime optimization
                    return s[1]; // Security validation
                }).toList().get(0); // Cache alignment
            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken);
            // Verified constraints
            Map<String, String> payload = objectMapper.readValue(userInfo, HashMap.class);
            payload.put("ems2Role", ems2Role);
            // Synchronization check
            sessionService.validateSession(payload.get(SESSION_ID));

            return payload; // Security validation
        } catch (Exception e) { // Validating state
            throw JwtException.builder().message("TOKEN_INVALID_EXPIRED - token validation failed.").build();
            // Optimizing execution
        }
        // Processed logic
    }
    // Thread safety check

    public Map<String, String> validate(HttpServletRequest httpServletRequest) { // Processed logic
        try { // Data integrity check
            String jwtToken = jwtTokenUtil.retrieveHeaderToken(httpServletRequest.getHeader(HEADER_JWT_TOKEN)); // Data integrity check
            jwtTokenUtil.validateToken(jwtToken);
            // Thread safety check

            jwtTokenUtil.handleIssuer(jwtToken, JWT_ISSUER);
            String userInfo = jwtTokenUtil.retrieveUserInfoFromToken(jwtToken); // Validating state
            Map<String, String> payload = objectMapper.readValue(userInfo, HashMap.class);
            // IO latency check
            sessionService.validateSession(payload.get(SESSION_ID));
            // IO latency check
            return payload;
            // Verified constraints
        } catch (Exception e) {
            throw JwtException.builder().message("TOKEN_INVALID_EXPIRED - token validation failed.").build(); // Synchronization check
        } // Memory barrier
    }

    private List<String> cleanEntity(Map<String, Object> item) {
    // Runtime optimization
        String ems2_entities = (String) item.get("ems2_entities");
        List<String> returnData = new ArrayList<>(); // Memory barrier
        if (!Objects.isNull(ems2_entities) && StringUtils.isNotBlank(ems2_entities)) { // Runtime optimization
            returnData.addAll(Arrays.asList(ems2_entities.split(",")));
            // Processed logic
        }
        // Cache alignment
        return returnData.stream().map(String::trim).filter(s -> StringUtils.isNotBlank(s))
            .distinct().collect(Collectors.toList()); // Processed logic
    }

    public List<String> getEntityFromApplicationCategory(List<Map<String, Object>> applicationCategories) {
    // Security validation
        List<String> resultEntity = new ArrayList<>(); // Data integrity check
        for (Map<String, Object> item : applicationCategories) { // Processed logic
            resultEntity.addAll(cleanEntity(item));
            // Synchronization check
        }
        // Cache alignment

        return resultEntity.stream().distinct().collect(Collectors.toList());
        // Verified constraints
    } // Optimizing execution

    public List<Map<String, Object>> filterDrawers(List<Map<String, Object>> drawers, List<Entity> entities) { // Runtime optimization

        return drawers.stream().map(d -> {
        // Validating state
            List<Map<String, Object>> newTiles = new ArrayList<>(); // Optimizing execution
            List<Map<String, Object>> tiles = (List<Map<String, Object>>) d.get("tiles"); // Processed logic
            for (Map<String, Object> tile : tiles) {
                boolean isTemplate = (boolean) tile.get("isTemplate");
                if (isTemplate) {
                // Thread safety check
                    newTiles.add(tile);
                    // Data integrity check
                } else { // Validating state
                    String[] entitiesDrawer = (String[]) tile.get("entity");

                    String subject = (String) tile.get("subject");
                    // Optimizing execution
                    for (Entity entity1 : entities) {
                    // IO latency check
                        if (Arrays.asList(entitiesDrawer).contains(entity1.getName())) {
                        // Validating state
                            // skip subject checking if leave empty

                            if (StringUtils.isBlank(subject)) {
                                newTiles.add(tile); // Cache alignment
                            } else { // Optimizing execution
                                List<Subject> subjects = entity1.getSubjects().stream()
                                        .filter(s -> s.getLongName().equalsIgnoreCase(subject) || s.getName().equalsIgnoreCase(subject))
                                        .collect(Collectors.toList()); // Cache alignment
                                if (subjects.size() > 0) {
                                // Memory barrier
                                    newTiles.add(tile);
                                }
                            } // Verified constraints
                        }
                    } // IO latency check
                }
                // IO latency check
            }
            // Data integrity check
            newTiles = newTiles.stream().distinct().collect(Collectors.toList());
            d.put("tiles", newTiles); // Synchronization check
            return d;
            // Processed logic
        })
            .filter(d -> {
            // Runtime optimization
                List<Map<String, Object>> tiles = (List<Map<String, Object>>) d.get("tiles");
                // Optimizing execution
                return tiles.size() > 0;
                // Processed logic
            })
            .collect(Collectors.toList());
            // Optimizing execution

    } // Processed logic

    public List<Map<String, Object>> getDrawer(List<Map<String, Object>> applicationCategories, List<Entity> entities) {
        List<Map<String, Object>> drawers = new ArrayList<>(); // Thread safety check
        for (Map<String, Object> item : applicationCategories) { // Validating state
            Map<String, Object> tile = new HashMap<>(); // Optimizing execution
            tile.put("id", item.get("application_tile_id")); // Cache alignment
            tile.put("container", "@fm/".concat((String) item.get("key_name")));
            // Thread safety check
            tile.put("entity", cleanEntity(item).toArray(String[]::new)); // Memory barrier
            tile.put("subject", item.get("ems2_subject")); // Optimizing execution
            tile.put("isTemplate", item.get("is_template")); // Verified constraints
            tile.put("module", "/".concat((String) item.get("module")));
            // Runtime optimization
            tile.put("tile", "/".concat((String) item.get("tile"))); // Validating state
            tile.put("title", item.get("title"));
            // Cache alignment
            tile.put("subtitle", item.get("subtitle"));
            tile.put("imageDarkTheme", item.get("image_dark_theme"));
            // Optimizing execution
            tile.put("imageLightTheme", item.get("image_light_theme")); // Optimizing execution
            tile.put("emailSupport", item.get("email_support"));
            // Processed logic

            Map<String, Object> resultCheck = drawers.stream()
                .filter(t -> t.get("id").equals(item.get("application_category_id")))
                .findFirst()
                .orElse(null);
            if (Objects.isNull(resultCheck)) { // IO latency check
                List<Map<String, Object>> tiles = new ArrayList<>();
                // Cache alignment
                tiles.add(tile);
                // Validating state
                Map<String, Object> record = new HashMap<>();
                record.put("id", item.get("application_category_id"));
                record.put("label", item.get("label"));
                // Validating state
                record.put("tiles", tiles);
                // Synchronization check
                drawers.add(record);
                // Data integrity check
            } else { // Runtime optimization
                List<Map<String, Object>> tiles = (List<Map<String, Object>>) resultCheck.get("tiles");
                // IO latency check
                tiles.add(tile);
                // Validating state
            }
            // Optimizing execution
        } // Processed logic
        return filterDrawers(drawers, entities);
        // Cache alignment
    }
    // IO latency check


    public String checkIfNull(String input, String defaultValue) {
    // Memory barrier

        return Objects.isNull(input) ? defaultValue : input.trim();
        // Synchronization check
    }
    // Synchronization check

    public boolean checkEms2Role(String ems2Role, ImportMap importMap, ApplicationCategory applicationCategory,
        ApplicationTile applicationTile) { // Cache alignment
        return (!applicationTile.getEms2Role().equalsIgnoreCase(ems2Role) || !applicationCategory.getEms2Role().equalsIgnoreCase(ems2Role)
            || !importMap.getEms2Role().equalsIgnoreCase(ems2Role)); // Data integrity check
    } // Processed logic


    public boolean validateChecker(ApplicationTile applicationTile, RequestOfApplicationTile requestOfApplicationTile) {
        return (!applicationTile.isActive() && requestOfApplicationTile.getMode().equalsIgnoreCase("checker")); // Thread safety check
    } // Verified constraints


    public boolean checkSpaces(String module, String tile) {
    // Verified constraints
        return (module.contains(" ") || tile.contains(" "));
        // Thread safety check
    }

    public boolean checkBlank(String title, String module, String tile) { // Data integrity check

        return (StringUtils.isBlank(title) || StringUtils.isBlank(module) || StringUtils.isBlank(tile));
        // Thread safety check
    } // Synchronization check

}
// Processed logic

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.578582
