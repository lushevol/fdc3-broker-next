package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.entity.ApplicationCategoryAudit;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.repository.ApplicationCategoryAuditRepo;
import com.scb.sso.singleuibff.service.v1.implementation.ApplicationCategoryAuditServiceImpl;
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
public class ApplicationCategoryAuditServiceTest {

    @InjectMocks
    ApplicationCategoryAuditServiceImpl applicationCategoryAuditServiceImpl;
    @Mock
    private ApplicationCategoryAuditRepo applicationCategoryAuditRepo;

    @SneakyThrows
    @Test
    void testFindByApplicationCategoryIdError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryAuditRepo).findByApplicationCategoryId(anyLong());
        boolean result;
        try {
            Optional<List<ApplicationCategoryAudit>> applicationCategoryAudits = applicationCategoryAuditServiceImpl
                .findByApplicationCategoryId(Long.parseLong("1"));
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testFindByApplicationCategoryId() {
        Optional<List<ApplicationCategoryAudit>> applicationCategoryAudits = Optional.of(new ArrayList<>());
        when(applicationCategoryAuditRepo.findByApplicationCategoryId(anyLong())).thenReturn(applicationCategoryAudits);
        boolean result;
        try {
            Optional<List<ApplicationCategoryAudit>> applicationCategory1 = applicationCategoryAuditServiceImpl
                .findByApplicationCategoryId(Long.parseLong("1"));
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
        when(applicationCategoryAuditRepo.existsById(anyLong())).thenReturn(true);
        boolean result;
        try {
            ApplicationCategoryAudit applicationCategoryAudit = applicationCategoryAuditServiceImpl
                .create(ApplicationCategoryAudit.builder().build());
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
        when(applicationCategoryAuditRepo.existsById(anyLong())).thenReturn(false);
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryAuditRepo).save(any());
        boolean result;
        try {
            ApplicationCategoryAudit applicationCategoryAudit = applicationCategoryAuditServiceImpl
                .create(ApplicationCategoryAudit.builder().build());
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
        when(applicationCategoryAuditRepo.existsById(anyLong())).thenReturn(false);
        when(applicationCategoryAuditRepo.save(any())).thenReturn(ApplicationCategoryAudit.builder().build());
        boolean result;
        try {
            ApplicationCategoryAudit applicationCategoryAudit = applicationCategoryAuditServiceImpl
                .create(ApplicationCategoryAudit.builder().build());
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
        doThrow(new RuntimeException(errorMessage)).when(applicationCategoryAuditRepo).saveAll(anyList());
        boolean result;
        try {
            applicationCategoryAuditServiceImpl.saveAll(List.of(ApplicationCategoryAudit.builder().build()));
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
        when(applicationCategoryAuditRepo.saveAll(anyList())).thenReturn(new ArrayList<>());
        boolean result;
        try {
            applicationCategoryAuditServiceImpl.saveAll(List.of(ApplicationCategoryAudit.builder().build()));
            result = true;
        } catch (RecordNotCreatedException e) {
            result = false;
        }
        assertTrue(result);
    }

}
