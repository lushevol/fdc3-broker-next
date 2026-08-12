package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.entity.ImportMap;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.ImportMapRepo;
import com.scb.sso.singleuibff.service.v1.implementation.ImportMapServiceImpl;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ImportMapServiceTest {

    @InjectMocks
    ImportMapServiceImpl importMapServiceImpl;
    @Mock
    FmaaProperties fmaaProperties;
    @Mock
    private ImportMapRepo importMapRepo;

    @SneakyThrows
    @Test
    void testFindByEms2RoleError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(importMapRepo).findByEms2Role(anyString());
        boolean result;
        try {
            Optional<List<ImportMap>> importMaps = importMapServiceImpl.findByEms2Role("");
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
        List<ImportMap> importMaps0 = new ArrayList<>();
        when(importMapRepo.findByEms2Role(anyString())).thenReturn(Optional.of(importMaps0));
        boolean result;
        try {
            Optional<List<ImportMap>> importMaps1 = importMapServiceImpl.findByEms2Role("");
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
        doThrow(new NoSuchElementException(errorMessage)).when(importMapRepo).findAll();
        boolean result;
        try {
            Optional<List<ImportMap>> importMaps = importMapServiceImpl.findAll();
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
        List<ImportMap> importMaps = new ArrayList<>();
        when(importMapRepo.findAll()).thenReturn(importMaps);
        boolean result;
        try {
            Optional<List<ImportMap>> importMaps1 = importMapServiceImpl.findAll();
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
        doThrow(new NoSuchElementException(errorMessage)).when(importMapRepo).findByIsActive(anyBoolean());
        boolean result;
        try {
            Optional<List<ImportMap>> importMap = importMapServiceImpl.findByIsActive(true);
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
        List<ImportMap> importMaps = new ArrayList<>();
        when(importMapRepo.findByIsActive(anyBoolean())).thenReturn(Optional.of(importMaps));
        boolean result;
        try {
            Optional<List<ImportMap>> importMaps1 = importMapServiceImpl.findByIsActive(true);
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
        doThrow(new NoSuchElementException(errorMessage)).when(importMapRepo).findById(anyLong());
        boolean result;
        try {
            Optional<ImportMap> importMap = importMapServiceImpl.getById(Long.parseLong("1"));
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
        ImportMap importMap = ImportMap.builder().build();
        when(importMapRepo.findById(anyLong())).thenReturn(Optional.of(importMap));
        boolean result;
        try {
            Optional<ImportMap> importMap1 = importMapServiceImpl.getById(Long.parseLong("1"));
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testFindByKeyNameAndIsActiveError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(importMapRepo).findByKeyNameAndIsActive(anyString(), anyBoolean());
        boolean result;
        try {
            Optional<ImportMap> importMap1 = importMapServiceImpl.findByKeyNameAndIsActive("", true);
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testFindByKeyNameAndIsActive() {
        ImportMap importMap = ImportMap.builder().build();
        when(importMapRepo.findByKeyNameAndIsActive(anyString(), anyBoolean())).thenReturn(Optional.of(importMap));
        boolean result;
        try {
            Optional<ImportMap> importMap1 = importMapServiceImpl.findByKeyNameAndIsActive("", true);
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
        doThrow(new RuntimeException(errorMessage)).when(importMapRepo).saveAll(anyList());
        boolean result;
        try {
            importMapServiceImpl.saveAll(List.of(ImportMap.builder().build()));
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
        when(importMapRepo.saveAll(anyList())).thenReturn(new ArrayList<>());
        boolean result;
        try {
            importMapServiceImpl.saveAll(List.of(ImportMap.builder().build()));
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
        when(importMapRepo.existsById(anyLong())).thenReturn(true);
        boolean result;
        try {
            ImportMap importMap = importMapServiceImpl.create(ImportMap.builder().build());
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
        when(importMapRepo.existsById(anyLong())).thenReturn(false);
        when(importMapRepo.getImportMapSeq()).thenReturn(Optional.of(Long.parseLong("1")));
        doThrow(new NoSuchElementException(errorMessage)).when(importMapRepo).save(any());
        boolean result;
        try {
            ImportMap importMap = importMapServiceImpl.create(ImportMap.builder().build());
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
            ImportMap importMap = importMapServiceImpl.create(ImportMap.builder().build());
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
        when(importMapRepo.existsById(anyLong())).thenReturn(false);
        when(importMapRepo.getImportMapSeq()).thenReturn(Optional.of(Long.parseLong("1")));
        when(importMapRepo.save(any())).thenReturn(ImportMap.builder().build());
        boolean result;
        try {
            ImportMap importMap = importMapServiceImpl.create(ImportMap.builder().build());
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
        when(importMapRepo.existsById(anyLong())).thenReturn(false);
        boolean result;
        try {
            ImportMap importMap = importMapServiceImpl.update(ImportMap.builder().build());
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
        when(importMapRepo.existsById(anyLong())).thenReturn(true);
        doThrow(new NoSuchElementException(errorMessage)).when(importMapRepo).save(any());
        boolean result;
        try {
            ImportMap importMap = importMapServiceImpl.update(ImportMap.builder().build());
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
        when(importMapRepo.existsById(anyLong())).thenReturn(true);
        when(importMapRepo.save(any())).thenReturn(ImportMap.builder().build());
        boolean result;
        try {
            ImportMap importMap = importMapServiceImpl.update(ImportMap.builder().build());
            result = true;
        } catch (RecordNotUpdatedException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testSetImportMapSeq() {
        when(importMapRepo.setImportMapSeq()).thenReturn(Optional.of(Long.parseLong("1")));
        assertEquals(importMapServiceImpl.setImportMapSeq(), Optional.of(Long.parseLong("1")));
    }

}
