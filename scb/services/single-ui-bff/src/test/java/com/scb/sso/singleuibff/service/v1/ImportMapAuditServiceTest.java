package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.entity.ImportMapAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.repository.ImportMapAuditRepo;
import com.scb.sso.singleuibff.service.v1.implementation.ImportMapAuditServiceImpl;
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
public class ImportMapAuditServiceTest {

    @InjectMocks
    ImportMapAuditServiceImpl importMapAuditServiceImpl;

    @Mock
    private ImportMapAuditRepo importMapAuditRepo;

    @SneakyThrows
    @Test
    void testFindByImportMapIdError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(importMapAuditRepo).findByImportMapId(anyLong());
        boolean result;
        try {
            Optional<List<ImportMapAudit>> importMapAudits = importMapAuditServiceImpl.findByImportMapId(Long.parseLong("1"));
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testFindByImportMapId() {
        Optional<List<ImportMapAudit>> importMapAudits = Optional.of(new ArrayList<>());
        when(importMapAuditRepo.findByImportMapId(anyLong())).thenReturn(importMapAudits);
        boolean result;
        try {
            Optional<List<ImportMapAudit>> importMapAuditss = importMapAuditServiceImpl.findByImportMapId(Long.parseLong("1"));
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
        when(importMapAuditRepo.existsById(anyLong())).thenReturn(true);
        boolean result;
        try {
            ImportMapAudit importMapAudit = importMapAuditServiceImpl.create(ImportMapAudit.builder().build());
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
        when(importMapAuditRepo.existsById(anyLong())).thenReturn(false);
        doThrow(new NoSuchElementException(errorMessage)).when(importMapAuditRepo).save(any());
        boolean result;
        try {
            ImportMapAudit importMapAudit = importMapAuditServiceImpl.create(ImportMapAudit.builder().build());
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
        when(importMapAuditRepo.existsById(anyLong())).thenReturn(false);
        when(importMapAuditRepo.save(any())).thenReturn(ImportMapAudit.builder().build());
        boolean result;
        try {
            ImportMapAudit importMapAudit = importMapAuditServiceImpl.create(ImportMapAudit.builder().build());
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
        doThrow(new RuntimeException(errorMessage)).when(importMapAuditRepo).saveAll(anyList());
        boolean result;
        try {
            importMapAuditServiceImpl.saveAll(List.of(ImportMapAudit.builder().build()));
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
        when(importMapAuditRepo.saveAll(anyList())).thenReturn(new ArrayList<>());
        boolean result;
        try {
            importMapAuditServiceImpl.saveAll(List.of(ImportMapAudit.builder().build()));
            result = true;
        } catch (RecordNotCreatedException e) {
            result = false;
        }
        assertTrue(result);
    }

}
