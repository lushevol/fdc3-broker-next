package com.scb.ratan.flowzero.auth.exceptions;

import com.scb.ratan.flowzero.auth.constant.ExceptionConstant;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ExceptionAuthConstantTest {

    @Test
    void exceptionMapContainsLockByManyFailLogin() {
        assertTrue(ExceptionConstant.EXCEPTION_MAP.containsKey(ExceptionConstant.LOCK_BY_MANY_FAIL_LOGIN));
        assertEquals(ExceptionConstant.EXCEPTION_LOCK_BY_MANY_FAIL_LOGIN,
            ExceptionConstant.EXCEPTION_MAP.get(ExceptionConstant.LOCK_BY_MANY_FAIL_LOGIN));
    }

    @Test
    void exceptionMapContainsPasswordExpired() {
        assertTrue(ExceptionConstant.EXCEPTION_MAP.containsKey(ExceptionConstant.PASSWORD_EXPIRED));
        assertEquals(ExceptionConstant.EXCEPTION_PASSWORD_EXPIRED,
            ExceptionConstant.EXCEPTION_MAP.get(ExceptionConstant.PASSWORD_EXPIRED));
    }

    @Test
    void exceptionMapContainsDidNotMatch() {
        assertTrue(ExceptionConstant.EXCEPTION_MAP.containsKey(ExceptionConstant.DID_NOT_MATCH));
        assertEquals(ExceptionConstant.EXCEPTION_DID_NOT_MATCH,
            ExceptionConstant.EXCEPTION_MAP.get(ExceptionConstant.DID_NOT_MATCH));
    }

    @Test
    void exceptionMapContainsMustChangeBefore() {
        assertTrue(ExceptionConstant.EXCEPTION_MAP.containsKey(ExceptionConstant.MUST_CHANGE_BEFORE));
        assertEquals(ExceptionConstant.EXCEPTION_MUST_CHANGE_BEFORE,
            ExceptionConstant.EXCEPTION_MAP.get(ExceptionConstant.MUST_CHANGE_BEFORE));
    }

    @Test
    void oudExceptionMapContainsConnectionTimeout() {
        assertTrue(ExceptionConstant.OUD_EXCEPTION_MAP.containsKey(ExceptionConstant.OUD_CONNECTION_TIMEOUT));
        assertEquals(ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT,
            ExceptionConstant.OUD_EXCEPTION_MAP.get(ExceptionConstant.OUD_CONNECTION_TIMEOUT));
    }

    @Test
    void oudExceptionMapContainsConnectionClosed() {
        assertTrue(ExceptionConstant.OUD_EXCEPTION_MAP.containsKey(ExceptionConstant.OUD_CONNECTION_CLOSED));
        assertEquals(ExceptionConstant.EXCEPTION_OUD_CONNECTION_TIMEOUT_LIMIT,
            ExceptionConstant.OUD_EXCEPTION_MAP.get(ExceptionConstant.OUD_CONNECTION_CLOSED));
    }

    @Test
    void exceptionMapHasFourEntries() {
        assertEquals(4, ExceptionConstant.EXCEPTION_MAP.size());
    }

    @Test
    void oudExceptionMapHasTwoEntries() {
        assertEquals(2, ExceptionConstant.OUD_EXCEPTION_MAP.size());
    }

}
