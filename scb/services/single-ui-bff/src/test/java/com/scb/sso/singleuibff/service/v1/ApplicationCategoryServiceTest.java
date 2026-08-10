package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.entity.ApplicationCategory;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.ApplicationCategoryRepo;
import com.scb.sso.singleuibff.service.v1.implementation.ApplicationCategoryServiceImpl;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationCategoryServiceTest {

    @InjectMocks
    ApplicationCategoryServiceImpl applicationCategoryServiceImpl;
    @Mock
    FmaaProperties fmaaProperties;
    @Mock
    private ApplicationCategoryRepo applicationCategoryRepo;

    @SneakyThrows
    @Test
    void testFindByEms2RoleError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryRepo).findByEms2Role(anyString());
        boolean result;
        try {
            Optional<List<ApplicationCategory>> applicationCategories = applicationCategoryServiceImpl.findByEms2Role("");
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testFindByEms2Role() {
        List<ApplicationCategory> applicationCategories = new ArrayList<>();
        when(applicationCategoryRepo.findByEms2Role(anyString())).thenReturn(Optional.of(applicationCategories));
        boolean result;
        try {
            Optional<List<ApplicationCategory>> applicationCategories1 = applicationCategoryServiceImpl.findByEms2Role("");
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testFindAllError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryRepo).findAll();
        boolean result;
        try {
            Optional<List<ApplicationCategory>> applicationCategories = applicationCategoryServiceImpl.findAll();
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testFindAll() {
        List<ApplicationCategory> applicationCategories = new ArrayList<>();
        when(applicationCategoryRepo.findAll()).thenReturn(applicationCategories);
        boolean result;
        try {
            Optional<List<ApplicationCategory>> applicationCategories1 = applicationCategoryServiceImpl.findAll();
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testFindByIsActiveError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryRepo).findByIsActive(anyBoolean());
        boolean result;
        try {
            Optional<List<ApplicationCategory>> applicationCategories = applicationCategoryServiceImpl.findByIsActive(true);
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testFindByIsActive() {
        List<ApplicationCategory> applicationCategories = new ArrayList<>();
        when(applicationCategoryRepo.findByIsActive(anyBoolean())).thenReturn(Optional.of(applicationCategories));
        boolean result;
        try {
            Optional<List<ApplicationCategory>> applicationCategories1 = applicationCategoryServiceImpl.findByIsActive(true);
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testGetByIdError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryRepo).findById(anyLong());
        boolean result;
        try {
            Optional<ApplicationCategory> applicationCategory = applicationCategoryServiceImpl.getById(Long.parseLong("1"));
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testGetById() {
        ApplicationCategory applicationCategory = ApplicationCategory.builder().build();
        when(applicationCategoryRepo.findById(anyLong())).thenReturn(Optional.of(applicationCategory));
        boolean result;
        try {
            Optional<ApplicationCategory> applicationCategory1 = applicationCategoryServiceImpl.getById(Long.parseLong("1"));
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testGetByLabelAndIsActiveError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryRepo).findByLabelAndIsActive(anyString(), anyBoolean());
        boolean result;
        try {
            Optional<ApplicationCategory> applicationCategory = applicationCategoryServiceImpl.getByLabelAndIsActive("", true);
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testGetByLabelAndIsActive() {
        ApplicationCategory applicationCategory = ApplicationCategory.builder().build();
        when(applicationCategoryRepo.findByLabelAndIsActive(anyString(), anyBoolean())).thenReturn(Optional.of(applicationCategory));
        boolean result;
        try {
            Optional<ApplicationCategory> applicationCategory1 = applicationCategoryServiceImpl.getByLabelAndIsActive("", true);
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testSaveAllError() {
        String errorMessage = "Records not created.";
        doThrow(new RuntimeException(errorMessage)).when(applicationCategoryRepo).saveAll(anyList());
        boolean result;
        try {
            applicationCategoryServiceImpl.saveAll(List.of(ApplicationCategory.builder().build()));
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
        when(applicationCategoryRepo.saveAll(anyList())).thenReturn(new ArrayList<>());
        boolean result;
        try {
            applicationCategoryServiceImpl.saveAll(List.of(ApplicationCategory.builder().build()));
            result = true;
        } catch (RecordNotCreatedException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testCreateError() {
        String errorMessage = "Duplicate Id.";
        when(fmaaProperties.isCreationEnabled()).thenReturn(true);
        when(applicationCategoryRepo.existsById(anyLong())).thenReturn(true);
        boolean result;
        try {
            ApplicationCategory applicationCategory = applicationCategoryServiceImpl.create(ApplicationCategory.builder().build());
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
        when(fmaaProperties.isCreationEnabled()).thenReturn(true);
        when(applicationCategoryRepo.existsById(anyLong())).thenReturn(false);
        when(applicationCategoryRepo.getApplicationCategorySeq()).thenReturn(Optional.of(Long.parseLong("1")));
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryRepo).save(any());
        boolean result;
        try {
            ApplicationCategory applicationCategory = applicationCategoryServiceImpl.create(ApplicationCategory.builder().build());
            result = true;
        } catch (RecordNotCreatedException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testCreateError3() {
        String errorMessage = "Adding new record is not permitted. Record not created.";
        when(fmaaProperties.isCreationEnabled()).thenReturn(false);
        boolean result;
        try {
            ApplicationCategory applicationCategory = applicationCategoryServiceImpl.create(ApplicationCategory.builder().build());
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
        when(fmaaProperties.isCreationEnabled()).thenReturn(true);
        when(applicationCategoryRepo.existsById(anyLong())).thenReturn(false);
        when(applicationCategoryRepo.getApplicationCategorySeq()).thenReturn(Optional.of(Long.parseLong("1")));
        when(applicationCategoryRepo.save(any())).thenReturn(ApplicationCategory.builder().build());
        boolean result;
        try {
            ApplicationCategory applicationCategory = applicationCategoryServiceImpl.create(ApplicationCategory.builder().build());
            result = true;
        } catch (RecordNotCreatedException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testUpdateError() {
        String errorMessage = "Id does not exists.";
        when(applicationCategoryRepo.existsById(anyLong())).thenReturn(false);
        boolean result;
        try {
            ApplicationCategory applicationCategory = applicationCategoryServiceImpl.update(ApplicationCategory.builder().build());
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testUpdateError2() {
        String errorMessage = "Record not updated.";
        when(applicationCategoryRepo.existsById(anyLong())).thenReturn(true);
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryRepo).save(any());
        boolean result;
        try {
            ApplicationCategory applicationCategory = applicationCategoryServiceImpl.update(ApplicationCategory.builder().build());
            result = true;
        } catch (RecordNotUpdatedException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testUpdate() {
        when(applicationCategoryRepo.existsById(anyLong())).thenReturn(true);
        when(applicationCategoryRepo.save(any())).thenReturn(ApplicationCategory.builder().build());
        boolean result;
        try {
            ApplicationCategory applicationCategory = applicationCategoryServiceImpl.update(ApplicationCategory.builder().build());
            result = true;
        } catch (RecordNotUpdatedException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testGetDrawersError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationCategoryRepo).getDrawers();
        boolean result;
        try {
            Optional<List<Map<String, Object>>> drawers1 = applicationCategoryServiceImpl.getDrawers();
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testGetDrawers() {
        List<Map<String, Object>> drawers = new ArrayList<>();
        when(applicationCategoryRepo.getDrawers()).thenReturn(Optional.of(drawers));
        boolean result;
        try {
            Optional<List<Map<String, Object>>> drawers1 = applicationCategoryServiceImpl.getDrawers();
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testSetApplicationCategorySeq() {
        when(applicationCategoryRepo.setApplicationCategorySeq()).thenReturn(Optional.of(Long.parseLong("1")));
        assertEquals(applicationCategoryServiceImpl.setApplicationCategorySeq(), Optional.of(Long.parseLong("1")));
    }

}
