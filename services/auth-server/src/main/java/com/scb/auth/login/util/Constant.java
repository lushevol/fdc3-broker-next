package com.scb.auth.login.util;

public class Constant {

    public static final String X_TOKEN = "X-Token";

    public static final String SINGLE_UI_BFF_HEADER = "userInfo";
    public static final String REDIS_AUTHORIZATION_KEY_PREFIX = "ratanone:authentication:ems2_authorization:s:";
    public static final Integer SESSION_TIMEOUT = 15;
    public static final String TOKEN_KEY = "ratanone:authentication:token:s:";
    public static final String LAST_LOGIN_TIME = "ratanone:authentication:last_login_time:s:";
    public static final String USER_ACTIONS = "ratanone:authentication:user_actions:s:";
    public static final String LIMIT_RETRY_OUD_TIMEOUT = "ratanone:authentication:oud_timeout_retry_limit:i";
    public static final String TOKEN_BAK_KEY = "ratanone:authentication:token_bak:s";
    public static final Integer SESSION_TIMEOUT_BAK = 10;
    public static final String USER_INFO = "ratanone:authentication:user_info:s:";

}
