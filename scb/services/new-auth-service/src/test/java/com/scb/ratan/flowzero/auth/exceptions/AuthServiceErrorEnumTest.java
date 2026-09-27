package com.scb.ratan.flowzero.auth.exceptions;

import com.scb.ratan.flowzero.auth.constant.AuthServiceErrorEnum;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AuthServiceErrorEnumTest {

    @Test
    void allEnumValuesHaveStatusAndCode() {
        for (AuthServiceErrorEnum error : AuthServiceErrorEnum.values()) {
            assertTrue(error.getStatus() > 0);
            assertNotNull(error.getErrorCode());
            assertFalse(error.getErrorCode().isEmpty());
        }
    }

    @Test
    void specificErrorStatuses() {
        assertEquals(400, AuthServiceErrorEnum.INVALID_USERNAME_PWD_ERROR.getStatus());
        assertEquals(400, AuthServiceErrorEnum.INVALID_USERNAME_PWD_FORMAT_ERROR.getStatus());
        assertEquals(412, AuthServiceErrorEnum.ENTITLEMENT_CONFIG_ERROR.getStatus());
        assertEquals(403, AuthServiceErrorEnum.ENTITLEMENT_FORBIDDEN_ERROR.getStatus());
        assertEquals(401, AuthServiceErrorEnum.AUTHORIZE_ERROR.getStatus());
    }

    @Test
    void specificErrorCodes() {
        assertEquals("800400001", AuthServiceErrorEnum.INVALID_USERNAME_PWD_ERROR.getErrorCode());
        assertEquals("800401001", AuthServiceErrorEnum.AUTHORIZE_ERROR.getErrorCode());
        assertEquals("800403001", AuthServiceErrorEnum.ENTITLEMENT_FORBIDDEN_ERROR.getErrorCode());
    }

}
