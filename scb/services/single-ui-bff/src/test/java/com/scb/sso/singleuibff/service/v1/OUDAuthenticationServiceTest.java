package com.scb.sso.singleuibff.service.v1;

import com.google.common.collect.Maps;
import com.scb.sso.singleuibff.config.OUDProperties;
import com.scb.sso.singleuibff.config.WhitelistedProperties;
import com.scb.sso.singleuibff.dto.request.RequestOfAuthenticate;
import com.scb.sso.singleuibff.exceptions.AuthenticationException;
import com.scb.sso.singleuibff.service.v1.implementation.OUDAuthenticationService;
import com.scb.sso.singleuibff.util.OudUtil;
import lombok.SneakyThrows;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

import javax.naming.NamingException;
import javax.naming.directory.DirContext;
import java.util.ArrayList;
import java.util.Map;

import static com.scb.sso.singleuibff.util.Constant.OUD_RELATED_CODE;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OUDAuthenticationServiceTest {

    @InjectMocks
    OUDAuthenticationService oudAuthenticationService;
    @Mock
    private LdapTemplate ldapTemplate;

    @Mock
    private OUDProperties ouDProperties;

    @Mock
    private WhitelistedProperties whitelistedProperties;

    @Mock
    private OudUtil oudUtil;

    @SneakyThrows
    @Test
    void testAuthenticate() {
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        Map<String, String> userInfo = Maps.newHashMap();
        when(oudUtil.getOudData(any())).thenReturn(userInfo);
        DirContext dirContext = mock(DirContext.class);
        doNothing().when(dirContext).close();
        when(ldapContextSource.getContext(any(), any())).thenReturn(dirContext);

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");
        boolean result;
        try {
            oudAuthenticationService.authenticate(requestOfAuthenticate);
            result = true;
        } catch (Exception e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testGetUserInfo() {
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        Map<String, String> userInfo = Maps.newHashMap();
        when(oudUtil.getOudData(any())).thenReturn(userInfo);
        when(oudUtil.getEncode(any(), any())).thenReturn("pw");
        DirContext dirContext = mock(DirContext.class);
        doNothing().when(dirContext).close();
        when(ldapContextSource.getContext(any(), any())).thenReturn(dirContext);
        when(ouDProperties.getUn()).thenReturn("un");
        when(ouDProperties.getPw()).thenReturn("pw");
        boolean result;
        try {
            oudAuthenticationService.getUserInfo("un");
            result = true;
        } catch (Exception e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testAuthenticateEmpty() {
        when(whitelistedProperties.getEnvList()).thenReturn(new ArrayList<String>());
        when(whitelistedProperties.getIdList()).thenReturn(new ArrayList<String>());
        String errorMessage = "Invalid username and password combination.";
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        when(ldapContextSource.getContext(any(), any()))
            .thenThrow(
                AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build());

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");
        requestOfAuthenticate.setHostName("localhost");

        assertThatThrownBy(() -> oudAuthenticationService.authenticate(requestOfAuthenticate))
            .isInstanceOf(AuthenticationException.class)
            .hasMessageContaining(errorMessage);
    }

    @SneakyThrows
    @Test
    void testAuthenticateHostnameNotInList() {
        when(whitelistedProperties.getEnvList()).thenReturn(Lists.newArrayList("abc"));
        when(whitelistedProperties.getIdList()).thenReturn(Lists.newArrayList("un"));
        String errorMessage = "Invalid username and password combination.";
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        when(ldapContextSource.getContext(any(), any()))
            .thenThrow(
                AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build());

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");
        requestOfAuthenticate.setHostName("localhost");

        assertThatThrownBy(() -> oudAuthenticationService.authenticate(requestOfAuthenticate))
            .isInstanceOf(AuthenticationException.class)
            .hasMessageContaining(errorMessage);
    }

    @SneakyThrows
    @Test
    void testAuthenticateUserNotInList() {
        when(whitelistedProperties.getEnvList()).thenReturn(Lists.newArrayList("localhost"));
        when(whitelistedProperties.getIdList()).thenReturn(Lists.newArrayList("abc"));

        String errorMessage = "Invalid username and password combination.";
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        when(ldapContextSource.getContext(any(), any()))
            .thenThrow(
                AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build());

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");
        requestOfAuthenticate.setHostName("localhost");

        assertThatThrownBy(() -> oudAuthenticationService.authenticate(requestOfAuthenticate))
            .isInstanceOf(AuthenticationException.class)
            .hasMessageContaining(errorMessage);
    }

    @SneakyThrows
    @Test
    void testAuthenticateHostnameListNull() {
        when(whitelistedProperties.getEnvList()).thenReturn(null);
        when(whitelistedProperties.getIdList()).thenReturn(Lists.newArrayList("un"));

        String errorMessage = "Invalid username and password combination.";
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        when(ldapContextSource.getContext(any(), any()))
            .thenThrow(
                AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build());

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");
        requestOfAuthenticate.setHostName("localhost");

        assertThatThrownBy(() -> oudAuthenticationService.authenticate(requestOfAuthenticate))
            .isInstanceOf(AuthenticationException.class)
            .hasMessageContaining(errorMessage);
    }

    @SneakyThrows
    @Test
    void testAuthenticateUserIdNull() {
        when(whitelistedProperties.getEnvList()).thenReturn(Lists.newArrayList("localhost"));
        when(whitelistedProperties.getIdList()).thenReturn(null);

        String errorMessage = "Invalid username and password combination.";
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        when(ldapContextSource.getContext(any(), any()))
            .thenThrow(
                AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build());

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");
        requestOfAuthenticate.setHostName("localhost");

        assertThatThrownBy(() -> oudAuthenticationService.authenticate(requestOfAuthenticate))
            .isInstanceOf(AuthenticationException.class)
            .hasMessageContaining(errorMessage);
    }

    @SneakyThrows
    @Test
    void testAuthenticateHostNameNull() {
        when(whitelistedProperties.getEnvList()).thenReturn(Lists.newArrayList("localhost"));
        when(whitelistedProperties.getIdList()).thenReturn(Lists.newArrayList("un"));

        String errorMessage = "Invalid username and password combination.";
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        when(ldapContextSource.getContext(any(), any()))
            .thenThrow(
                AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build());

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");

        assertThatThrownBy(() -> oudAuthenticationService.authenticate(requestOfAuthenticate))
            .isInstanceOf(AuthenticationException.class)
            .hasMessageContaining(errorMessage);
    }

    @SneakyThrows
    @Test
    void testAuthenticateUserIdEmpty() {
        when(whitelistedProperties.getEnvList()).thenReturn(Lists.newArrayList("localhost"));
        when(whitelistedProperties.getIdList()).thenReturn(new ArrayList<String>());

        String errorMessage = "Invalid username and password combination.";
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        when(ldapContextSource.getContext(any(), any()))
            .thenThrow(
                AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build());

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");

        assertThatThrownBy(() -> oudAuthenticationService.authenticate(requestOfAuthenticate))
            .isInstanceOf(AuthenticationException.class)
            .hasMessageContaining(errorMessage);
    }

    @SneakyThrows
    @Test
    void testAuthenticateWhitelisted() {
        when(whitelistedProperties.getEnvList()).thenReturn(Lists.newArrayList("localhost"));
        when(whitelistedProperties.getIdList()).thenReturn(Lists.newArrayList("un"));
        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");
        requestOfAuthenticate.setHostName("localhost");
        boolean result;
        try {
            oudAuthenticationService.authenticate(requestOfAuthenticate);
            result = true;
        } catch (Exception e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testAuthenticateException() {
        String errorMessage = "Invalid username and password combination.";
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        when(ldapContextSource.getContext(any(), any()))
            .thenThrow(
                AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build());

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");

        assertThatThrownBy(() -> oudAuthenticationService.authenticate(requestOfAuthenticate))
            .isInstanceOf(AuthenticationException.class)
            .hasMessageContaining(errorMessage);
    }

    @SneakyThrows
    @Test
    void testAuthenticateExceptionRelatedOUD() {
        String USER_PREFIX = "cn=";
        String USER_SUFFIX = ",ou=users,o=standardchartered";

        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);

        String errorMessage = "Invalid username and password combination.";
        when(ldapContextSource.getContext(USER_PREFIX.concat("un1").concat(USER_SUFFIX), "pw"))
            .thenThrow(
                AuthenticationException.builder().code(OUD_RELATED_CODE).message(errorMessage).build());

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un1");
        requestOfAuthenticate.setPassword("pw");

        assertThatThrownBy(() -> oudAuthenticationService.authenticate(requestOfAuthenticate))
            .isInstanceOf(AuthenticationException.class)
            .hasMessageContaining(errorMessage);
    }

    @SneakyThrows
    @Test
    void testAuthenticateCloseException() {
        LdapContextSource ldapContextSource = mock(LdapContextSource.class);
        when(ldapTemplate.getContextSource()).thenReturn(ldapContextSource);
        Map<String, String> userInfo = Maps.newHashMap();
        when(oudUtil.getOudData(any())).thenReturn(userInfo);
        DirContext dirContext = mock(DirContext.class);
        doThrow(new NamingException("test")).when(dirContext).close();
        when(ldapContextSource.getContext(any(), any())).thenReturn(dirContext);

        RequestOfAuthenticate requestOfAuthenticate = new RequestOfAuthenticate();
        requestOfAuthenticate.setUsername("un");
        requestOfAuthenticate.setPassword("pw");
        boolean result;
        try {
            oudAuthenticationService.authenticate(requestOfAuthenticate);
            result = true;
        } catch (Exception e) {
            result = false;
        }
        assertTrue(result);
    }

}
