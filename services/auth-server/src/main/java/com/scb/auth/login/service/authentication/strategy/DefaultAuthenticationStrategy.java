package com.scb.auth.login.service.authentication.strategy;

import com.scb.auth.login.service.authentication.AccessTokenAuthentication;
import com.scb.auth.login.service.authentication.Authentication;
import com.scb.auth.login.service.authentication.BasicAuthAuthentication;
import com.scb.auth.login.util.Constant;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;

@AllArgsConstructor
public class DefaultAuthenticationStrategy implements AuthenticationStrategy {

    private BasicAuthAuthentication basicAuthAuthentication;
    private AccessTokenAuthentication accessTokenAuthentication;

    @Override
    public Authentication getAuthentication(HttpServletRequest httpServletRequest) {
        if (StringUtils.isNotBlank(httpServletRequest.getHeader(Constant.X_TOKEN))) {
            accessTokenAuthentication.setToken(httpServletRequest.getHeader(Constant.X_TOKEN));
            return accessTokenAuthentication;
        } else if (StringUtils.isNotBlank(httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION))) {
            basicAuthAuthentication.setToken(httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION));
            return basicAuthAuthentication;
        }

        accessTokenAuthentication.setToken(httpServletRequest.getHeader(Constant.X_TOKEN));
        return accessTokenAuthentication;
    }

}
