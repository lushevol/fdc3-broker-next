package com.scb.ratan.flowzero.auth.constant;

import java.util.HashMap;
import java.util.Map;

public class ExceptionConstant {

    public static String LOCK_BY_MANY_FAIL_LOGIN = "many failed authentication attempts";
    public static String PASSWORD_EXPIRED = "password is expired";
    public static String DID_NOT_MATCH = "did not match any password";
    public static String MUST_CHANGE_BEFORE = "must change your password";
    public static String OUD_CONNECTION_TIMEOUT = "Connection reset";
    public static String OUD_CONNECTION_CLOSED = "Remote host closed connection during handshake";

    public static String EXCEPTION_LOCK_BY_MANY_FAIL_LOGIN = "Login failed, account has been locked due to too many failed authentication attempts";
    public static String EXCEPTION_PASSWORD_EXPIRED = "Login failed, user password is expired";
    public static String EXCEPTION_DID_NOT_MATCH = "Login failed, please enter valid username and password";
    public static String EXCEPTION_MUST_CHANGE_BEFORE = "Login failed, You must change your password before you will be allowed to request any other operations";
    public static String EXCEPTION_OUD_CONNECTION_TIMEOUT = "Login failed, OUD connection timeout, please try again later ";
    public static String EXCEPTION_OUD_CONNECTION_TIMEOUT_LIMIT = "Login failed, OUD is unavailable, please try again later ";

    public static Map<String, String> EXCEPTION_MAP = new HashMap<>();

    public static Map<String, String> OUD_EXCEPTION_MAP = new HashMap<>();

    static {
        EXCEPTION_MAP.put(LOCK_BY_MANY_FAIL_LOGIN, EXCEPTION_LOCK_BY_MANY_FAIL_LOGIN);
        EXCEPTION_MAP.put(PASSWORD_EXPIRED, EXCEPTION_PASSWORD_EXPIRED);
        EXCEPTION_MAP.put(DID_NOT_MATCH, EXCEPTION_DID_NOT_MATCH);
        EXCEPTION_MAP.put(MUST_CHANGE_BEFORE, EXCEPTION_MUST_CHANGE_BEFORE);

        OUD_EXCEPTION_MAP.put(OUD_CONNECTION_TIMEOUT, EXCEPTION_OUD_CONNECTION_TIMEOUT);
        OUD_EXCEPTION_MAP.put(OUD_CONNECTION_CLOSED, EXCEPTION_OUD_CONNECTION_TIMEOUT_LIMIT);

    }

}
