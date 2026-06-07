package com.scb.ratan.flowzero.workflow.common;

/**
 * Kong Gateway integration constants.
 *
 * <p>Centralises every literal used by the Kong OAuth2 authentication flow so that
 * {@code KongGatewayAuthService} contains no magic strings.
 */
public class KongConstants {

    // kong cert
    public static final String BUNDLE_NAME = "kong";

    // Connection pool sizing — sized for max 20 concurrent users across 3 nodes ≈ 7
    // per node
    public static final int MAX_CONN_TOTAL = 10;
    public static final int MAX_CONN_PER_ROUTE = 10;
    public static final int CONNECT_TIMEOUT_MS = 5_000;
    public static final int READ_TIMEOUT_MS = 30_000;
    public static final int CONNECTION_REQUEST_TIMEOUT_MS = 5_000;
    public static final int IDLE_EVICT_SECONDS = 30;

    // kong api
    public static final String CACHE_KEY_TOKEN = "token";
    public static final String CACHE_KEY_CLIENT_ID = "clientId";
    public static final String CACHE_KEY_CLIENT_SEC = "clientSecret";
    public static final String FIELD_ACCESS_TOKEN = "access_token";
    public static final String FIELD_CLIENT_ID = "client_id";
    public static final String FIELD_CLIENT_SECRET = "client_secret";
    public static final String FIELD_EXPIRES_IN = "expires_in";
    public static final String TOKEN_REQUEST_BODY = "{\"grant_type\":\"client_credentials\",\"scope\":\"ICDMSAPIServices_documentMetaData_POST\"}";

    public static final String BASIC_AUTH_PREFIX = "Basic ";

}
