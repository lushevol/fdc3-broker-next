package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.entity.ApplicationTile;
import com.scb.sso.singleuibff.exceptions.RecordNotCreatedException;
import com.scb.sso.singleuibff.exceptions.RecordNotFoundException;
import com.scb.sso.singleuibff.exceptions.RecordNotUpdatedException;
import com.scb.sso.singleuibff.repository.ApplicationTileRepo;
import com.scb.sso.singleuibff.service.v1.implementation.ApplicationTileServiceImpl;
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
public class ApplicationTileServiceTest {

    @InjectMocks
    ApplicationTileServiceImpl applicationTileServiceImpl;
    @Mock
    FmaaProperties fmaaProperties;
    @Mock
    private ApplicationTileRepo applicationTileRepo;

    @SneakyThrows
    @Test
    void testFindByApplicationCategoryIdEms2RoleError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationTileRepo).findByApplicationCategoryIdAndEms2Role(anyLong(),
            anyString());
        boolean result;
        try {
            Optional<List<ApplicationTile>> applicationTiles = applicationTileServiceImpl
                .findByApplicationCategoryIdEms2Role(Long.parseLong("1"), "");
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
            assertEquals(errorMessage, e.getMessage());
        }
        assertFalse(result);
    }

    @SneakyThrows
    @Test
    void testFindByApplicationCategoryIdEms2Role() {
        List<ApplicationTile> applicationTiles = new ArrayList<>();
        when(applicationTileRepo.findByApplicationCategoryIdAndEms2Role(anyLong(), anyString())).thenReturn(Optional.of(applicationTiles));
        boolean result;
        try {
            Optional<List<ApplicationTile>> applicationTiless = applicationTileServiceImpl
                .findByApplicationCategoryIdEms2Role(Long.parseLong("1"), "");
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testFindFindByApplicationCategoryIdError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationTileRepo).findByApplicationCategoryId(anyLong());
        boolean result;
        try {
            Optional<List<ApplicationTile>> applicationTiles = applicationTileServiceImpl.findByApplicationCategoryId(Long.parseLong("1"));
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
        List<ApplicationTile> applicationTiles = new ArrayList<>();
        when(applicationTileRepo.findByApplicationCategoryId(anyLong())).thenReturn(Optional.of(applicationTiles));
        boolean result;
        try {
            Optional<List<ApplicationTile>> applicationTiless = applicationTileServiceImpl.findByApplicationCategoryId(Long.parseLong("1"));
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
        doThrow(new NoSuchElementException(errorMessage)).when(applicationTileRepo).findByIsActive(anyBoolean());
        boolean result;
        try {
            Optional<List<ApplicationTile>> applicationTiles = applicationTileServiceImpl.findByIsActive(true);
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
        List<ApplicationTile> applicationTiles = new ArrayList<>();
        when(applicationTileRepo.findByIsActive(anyBoolean())).thenReturn(Optional.of(applicationTiles));
        boolean result;
        try {
            Optional<List<ApplicationTile>> applicationTiless = applicationTileServiceImpl.findByIsActive(true);
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
        doThrow(new NoSuchElementException(errorMessage)).when(applicationTileRepo).findById(anyLong());
        boolean result;
        try {
            Optional<ApplicationTile> applicationTile = applicationTileServiceImpl.getById(Long.parseLong("1"));
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
        when(applicationTileRepo.findById(anyLong())).thenReturn(Optional.of(ApplicationTile.builder().build()));
        boolean result;
        try {
            Optional<ApplicationTile> applicationTile = applicationTileServiceImpl.getById(Long.parseLong("1"));
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
        doThrow(new RuntimeException(errorMessage)).when(applicationTileRepo).saveAll(anyList());
        boolean result;
        try {
            applicationTileServiceImpl.saveAll(List.of(ApplicationTile.builder().build()));
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
        when(applicationTileRepo.saveAll(anyList())).thenReturn(new ArrayList<>());
        boolean result;
        try {
            applicationTileServiceImpl.saveAll(List.of(ApplicationTile.builder().build()));
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
        when(applicationTileRepo.existsById(anyLong())).thenReturn(true);
        boolean result;
        try {
            ApplicationTile applicationTile = applicationTileServiceImpl.create(ApplicationTile.builder().build());
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
        when(applicationTileRepo.existsById(anyLong())).thenReturn(false);
        when(applicationTileRepo.getApplicationTileSeq()).thenReturn(Optional.of(Long.parseLong("1")));
        doThrow(new NoSuchElementException(errorMessage)).when(applicationTileRepo).save(any());
        boolean result;
        try {
            ApplicationTile applicationTile = applicationTileServiceImpl.create(ApplicationTile.builder().build());
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
            ApplicationTile applicationTile = applicationTileServiceImpl.create(ApplicationTile.builder().build());
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
        when(applicationTileRepo.existsById(anyLong())).thenReturn(false);
        when(applicationTileRepo.getApplicationTileSeq()).thenReturn(Optional.of(Long.parseLong("1")));
        when(applicationTileRepo.save(any())).thenReturn(ApplicationTile.builder().build());
        boolean result;
        try {
            ApplicationTile applicationTile = applicationTileServiceImpl.create(ApplicationTile.builder().build());
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
        when(applicationTileRepo.existsById(anyLong())).thenReturn(false);
        boolean result;
        try {
            ApplicationTile applicationTile = applicationTileServiceImpl.update(ApplicationTile.builder().build());
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
        when(applicationTileRepo.existsById(anyLong())).thenReturn(true);
        doThrow(new NoSuchElementException(errorMessage)).when(applicationTileRepo).save(any());
        boolean result;
        try {
            ApplicationTile applicationTile = applicationTileServiceImpl.update(ApplicationTile.builder().build());
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
        when(applicationTileRepo.existsById(anyLong())).thenReturn(true);
        when(applicationTileRepo.save(any())).thenReturn(ApplicationTile.builder().build());
        boolean result;
        try {
            ApplicationTile applicationTile = applicationTileServiceImpl.update(ApplicationTile.builder().build());
            result = true;
        } catch (RecordNotUpdatedException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testFindByEms2RoleError() {
        String errorMessage = "No record found.";
        doThrow(new NoSuchElementException(errorMessage)).when(applicationTileRepo).findByEms2Role(anyString());
        boolean result;
        try {
            Optional<List<ApplicationTile>> applicationCategories = applicationTileServiceImpl.findByEms2Role("");
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
        List<ApplicationTile> applicationTiles = new ArrayList<>();
        when(applicationTileRepo.findByEms2Role(anyString())).thenReturn(Optional.of(applicationTiles));
        boolean result;
        try {
            Optional<List<ApplicationTile>> applicationCategories = applicationTileServiceImpl.findByEms2Role("");
            result = true;
        } catch (RecordNotFoundException e) {
            result = false;
        }
        assertTrue(result);
    }

    @SneakyThrows
    @Test
    void testSetApplicationTileSeq() {
        when(applicationTileRepo.setApplicationTileSeq()).thenReturn(Optional.of(Long.parseLong("1")));
        assertEquals(applicationTileServiceImpl.setApplicationTileSeq(), Optional.of(Long.parseLong("1")));
    }

}
