package com.scb.ratan.flowzero.auth.entity.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class SyncResultDtoTest {

    private SyncResultDto dto;

    @BeforeEach
    void setUp() {
        dto = new SyncResultDto();
    }

    @Test
    void addUpdatedUser_incrementsCountAndAddsToListAndMap() {
        dto.addUpdatedUser("user1", "ROLE_A");
        dto.addUpdatedUser("user2", "ROLE_B");

        assertEquals(2, dto.getUpdatedCount());
        assertTrue(dto.getUpdatedUsers().contains("user1"));
        assertTrue(dto.getUpdatedUsers().contains("user2"));
        assertEquals("ROLE_A", dto.getUpdatedUserRoles().get("user1"));
        assertEquals("ROLE_B", dto.getUpdatedUserRoles().get("user2"));
    }

    @Test
    void addUnchangedUser_incrementsCountAndAddsToList() {
        dto.addUnchangedUser("user3");
        dto.addUnchangedUser("user4");

        assertEquals(2, dto.getUnchangedCount());
        assertTrue(dto.getUnchangedUsers().contains("user3"));
        assertTrue(dto.getUnchangedUsers().contains("user4"));
    }

    @Test
    void addFailedUser_incrementsCountAndAddsToMap() {
        dto.addFailedUser("user5", "error msg");

        assertEquals(1, dto.getFailedCount());
        assertEquals("error msg", dto.getFailedUsers().get("user5"));
    }

    @Test
    void getTotalUsers_returnsSumOfAllCounts() {
        dto.addUpdatedUser("u1", "R1");
        dto.addUnchangedUser("u2");
        dto.addUnchangedUser("u3");
        dto.addFailedUser("u4", "err");

        assertEquals(4, dto.getTotalUsers());
    }

    @Test
    void getDurationInMillis_calculatesCorrectly() {
        long start = System.currentTimeMillis();
        dto.setSyncStartTime(new Date(start));
        dto.setSyncEndTime(new Date(start + 5000));

        assertEquals(5000L, dto.getDurationInMillis());
    }

    @Test
    void getDurationInMillis_returnsZeroWhenTimesNull() {
        assertEquals(0L, dto.getDurationInMillis());
    }

    @Test
    void getDurationInMillis_returnsZeroWhenEndTimeNull() {
        dto.setSyncStartTime(new Date());
        assertEquals(0L, dto.getDurationInMillis());
    }

    @Test
    void setAndGetError() {
        dto.setError("some error");
        assertEquals("some error", dto.getError());
    }

    @Test
    void toStringContainsFields() {
        dto.addUpdatedUser("u1", "R");
        dto.setSyncStartTime(new Date());
        dto.setSyncEndTime(new Date());
        String str = dto.toString();
        assertTrue(str.contains("updatedCount=1"));
    }

    @Test
    void initialCountsAreZero() {
        assertEquals(0, dto.getUpdatedCount());
        assertEquals(0, dto.getUnchangedCount());
        assertEquals(0, dto.getFailedCount());
        assertEquals(0, dto.getTotalUsers());
        assertNull(dto.getError());
        assertNull(dto.getSyncStartTime());
        assertNull(dto.getSyncEndTime());
    }

}
