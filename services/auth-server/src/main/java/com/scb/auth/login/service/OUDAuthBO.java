package com.scb.auth.login.service;

import javax.naming.NamingException;
import javax.naming.directory.DirContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Service;

import com.scb.auth.login.entity.OUDAuthResult;
import com.scb.auth.login.entity.UserInfo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class OUDAuthBO {

    @Autowired
    private LdapTemplate ldapTemplate;

    private final static String DEFAULT_COUNTRY = "Global";

    /*
     * Connect to the OUD server and retrieve the user info stored in OUD: 1.
     * authenticate using username & password to get the ldapContext from OUD. 2.
     * Retrive the user info stored in OUD from ldapContext.
     *
     **/
    public OUDAuthResult authenticate(String userId, String password) throws Exception {
        OUDAuthResult authResult = new OUDAuthResult();
        DirContext dirContext = null;
        try {
            String userDn = "cn=" + userId + ",ou=users,o=standardchartered";
            dirContext = ldapTemplate.getContextSource().getContext(userDn, password);
            authResult.setSuccess(true);
            authResult.setUserInfo(getUserInfo(userId));
        } catch (Exception e) {
            authResult.setSuccess(false);
            authResult.setError(e.getMessage());

            log.error("OUD authenticate failed, userId: {}, e:", userId, e);

            return authResult;
        } finally {
            if (dirContext != null) {
                try {
                    dirContext.close();
                } catch (NamingException e) {

                    log.error("Exception closing context, userId: {}, e:", userId, e);
                }
            }
        }
        return authResult;
    }

    public OUDAuthResult sysAccountAuthenticate(String userId, String password) throws Exception {
        OUDAuthResult authResult = new OUDAuthResult();
        DirContext dirContext = null;
        try {
            String userDn = "cn=" + userId + ",ou=fmedmi,ou=apps,o=standardchartered";
            dirContext = ldapTemplate.getContextSource().getContext(userDn, password);
            authResult.setSuccess(true);
            authResult.setUserInfo(getUserInfo(userId));
        } catch (Exception e) {
            authResult.setSuccess(false);
            authResult.setError(e.getMessage());

            log.error("sysAccount OUD authenticate failed, userId: {}, e:", userId, e);
            return authResult;
        } finally {
            if (dirContext != null) {
                try {
                    dirContext.close();
                } catch (NamingException e) {

                    log.error("sysAccount Exception closing context, userId: {}, e:", userId, e);

                }
            }
        }
        return authResult;
    }

    private UserInfo getUserInfo(String userId) throws Exception {
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(userId);
        userInfo.setFullName(userId);
        userInfo.setCountry(DEFAULT_COUNTRY);
        return userInfo;
    }

}
