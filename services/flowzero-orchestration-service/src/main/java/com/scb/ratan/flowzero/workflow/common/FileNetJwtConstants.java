package com.scb.ratan.flowzero.workflow.common;

import com.scb.ratan.flowzero.workflow.properties.FileNetConfigurationProperties;
import org.springframework.web.client.RestClient;

/**
 * @author Aiden
 * @date 05/27/2026
 **/
public class FileNetJwtConstants {

    // ── Caffeine cache key ────────────────────────────────────────────────────
    public static final String JWT_CACHE_KEY = "jwt";

    // ── HTTP constants ────────────────────────────────────────────────────────
    public static final String BASIC = "Basic ";
    public static final String GRANT_TYPE_HEADER = "grant_type";
    public static final String GRANT_TYPE_VALUE = "client_credentials";
    public static final String GRANT_TYPE_FORM_BODY = "grant_type=client_credentials";
    public static final String GRANT_TYPE_QUERY = "?grant_type=client_credentials";

    // ── JSON token field names tried in order ─────────────────────────────────
    public static final String[] TOKEN_FIELDS = { "token", "access_token", "id_token", "jwt" };

}
