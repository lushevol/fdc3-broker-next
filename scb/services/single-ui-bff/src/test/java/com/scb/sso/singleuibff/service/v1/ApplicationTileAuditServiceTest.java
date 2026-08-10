package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationTileAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.repository.ApplicationTileAuditRepo;
import com.scb.sso.singleuibff.service.v1.implementation.ApplicationTileAuditServiceImpl;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ApplicationTileAuditServiceTest {

    @InjectMocks
    ApplicationTileAuditServiceImpl applicationTileAuditServiceImpl;
    @Mock
    private ApplicationTileAuditRepo applicationTileAuditRepo;

    @SneakyThrows
    @Test
    void testFindByApplicationTileIdError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationTileAuditRepo).findByApplicationTileId(anyLong());
        boolean result;
        try {
            Optional<List<ApplicationTileAudit>> applicationTileAudits = applicationTileAuditServiceImpl
                .findByApplicationTileId(Long.parseLong("1"));
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testFindByApplicationTileIdMapId() {
        Optional<List<ApplicationTileAudit>> applicationTileAudits = Optional.of(new ArrayList<>());
        when(applicationTileAuditRepo.findByApplicationTileId(anyLong())).thenReturn(applicationTileAudits);
        boolean result;
        try {
            Optional<List<ApplicationTileAudit>> applicationTileAuditss = applicationTileAuditServiceImpl
                .findByApplicationTileId(Long.parseLong("1"));
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testCreateError() {
        String errorMessage = "Duplicate Id.";
        when(applicationTileAuditRepo.existsById(anyLong())).thenReturn(true);
        boolean result;
        try {
            ApplicationTileAudit applicationTileAudit = applicationTileAuditServiceImpl.create(ApplicationTileAudit.builder().build());
            result = true;
        } catch (RecordNotCreatedException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testCreateError2() {
        String errorMessage = "Record not created.";
        when(applicationTileAuditRepo.existsById(anyLong())).thenReturn(false);
        doThrow(new NoSuchElementException(errorMessage)).when(applicationTileAuditRepo).save(any());
        boolean result;
        try {
            ApplicationTileAudit applicationTileAudit = applicationTileAuditServiceImpl.create(ApplicationTileAudit.builder().build());
            result = true;
        } catch (RecordNotCreatedException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testCreate() {
        when(applicationTileAuditRepo.existsById(anyLong())).thenReturn(false);
        when(applicationTileAuditRepo.save(any())).thenReturn(ApplicationTileAudit.builder().build());
        boolean result;
        try {
            ApplicationTileAudit applicationTileAudit = applicationTileAuditServiceImpl.create(ApplicationTileAudit.builder().build());
            result = true;
        } catch (DataAccessException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testSaveAllError() {
        String errorMessage = "Records not created.";
        doThrow(new RuntimeException(errorMessage)).when(applicationTileAuditRepo).saveAll(anyList());
        boolean result;
        try {
            applicationTileAuditServiceImpl.saveAll(List.of(ApplicationTileAudit.builder().build()));
            result = true;
        } catch (RecordNotCreatedException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testSaveAll() {
        when(applicationTileAuditRepo.saveAll(anyList())).thenReturn(new ArrayList<>());
        boolean result;
        try {
            applicationTileAuditServiceImpl.saveAll(List.of(ApplicationTileAudit.builder().build()));
            result = true;
        } catch (RecordNotCreatedException e) {
            result = false;
        }
        assertTrue(result);
    }

}
