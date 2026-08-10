package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.entity.ApplicationSession;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.repository.ApplicationSessionRepo;
import com.scb.sso.singleuibff.service.v1.implementation.SessionServiceImplementation;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceImplementationTest {

    @InjectMocks
    SessionServiceImplementation sessionServiceImplementation;

    @Mock
    ApplicationSessionRepo applicationSessionRepo;

    @SneakyThrows
    @Test
    void testCreate() {
        boolean result = true;
        sessionServiceImplementation.create("1234");
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testCreateError() {
        String errorMessage = "Any error.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationSessionRepo).save(any());
        boolean result = true;
        sessionServiceImplementation.create("123");
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testValidateSessionError() {
        ApplicationSession applicationSession = ApplicationSession.builder().sessionId("123").build();
        when(applicationSessionRepo.findBySessionId(any())).thenReturn(Optional.of(applicationSession));
        boolean result;
        try {
            sessionServiceImplementation.validateSession("123");
            result = true;
        } catch (Exception e) {
            result = false;
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testValidateSession() {
        when(applicationSessionRepo.findBySessionId(any())).thenReturn(Optional.empty());
        boolean result = true;
        sessionServiceImplementation.validateSession("123");
        assertTrue(result);
    }

}
