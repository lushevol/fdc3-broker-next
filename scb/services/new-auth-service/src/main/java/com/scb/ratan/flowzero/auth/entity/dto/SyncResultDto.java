package com.scb.ratan.flowzero.auth.entity.dto;

import java.util.*;

public class SyncResultDto {

    private Date syncStartTime;
    private Date syncEndTime;
    private int updatedCount = 0;
    private int unchangedCount = 0;
    private int failedCount = 0;
    private String error;
    private List<String> updatedUsers = new ArrayList<>();
    private List<String> unchangedUsers = new ArrayList<>();
    private Map<String, String> failedUsers = new HashMap<>();
    private Map<String, String> updatedUserRoles = new HashMap<>();

    private String message;
    private boolean success;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void addUpdatedUser(String userId, String role) {
        updatedUsers.add(userId);
        updatedUserRoles.put(userId, role);
        updatedCount++;
    }

    public void addUnchangedUser(String userId) {
        unchangedUsers.add(userId);
        unchangedCount++;
    }

    public void addFailedUser(String userId, String reason) {
        failedUsers.put(userId, reason);
        failedCount++;
    }

    public Date getSyncStartTime() {
        return syncStartTime;
    }

    public void setSyncStartTime(Date syncStartTime) {
        this.syncStartTime = syncStartTime;
    }

    public Date getSyncEndTime() {
        return syncEndTime;
    }

    public void setSyncEndTime(Date syncEndTime) {
        this.syncEndTime = syncEndTime;
    }

    public int getUpdatedCount() {
        return updatedCount;
    }

    public int getUnchangedCount() {
        return unchangedCount;
    }

    public int getFailedCount() {
        return failedCount;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public List<String> getUpdatedUsers() {
        return updatedUsers;
    }

    public List<String> getUnchangedUsers() {
        return unchangedUsers;
    }

    public Map<String, String> getFailedUsers() {
        return failedUsers;
    }

    public Map<String, String> getUpdatedUserRoles() {
        return updatedUserRoles;
    }

    public int getTotalUsers() {
        return updatedCount + unchangedCount + failedCount;
    }

    public long getDurationInMillis() {
        if (syncStartTime != null && syncEndTime != null) {
            return syncEndTime.getTime() - syncStartTime.getTime();
        }
        return 0;
    }

    @Override
    public String toString() {
        return "SyncResult{" +
            "syncStartTime=" + syncStartTime +
            ", syncEndTime=" + syncEndTime +
            ", updatedCount=" + updatedCount +
            ", unchangedCount=" + unchangedCount +
            ", failedCount=" + failedCount +
            ", totalUsers=" + getTotalUsers() +
            ", durationMs=" + getDurationInMillis() +
            ", error='" + error + '\'' +
            '}';
    }

    public static SyncResultDto success() {
        SyncResultDto dto = new SyncResultDto();
        dto.setSuccess(true);
        dto.setMessage("Already to start sync all user entitlements from EMS3.");
        dto.setSyncStartTime(new Date());
        return dto;
    }

    public static SyncResultDto failure(String message) {
        SyncResultDto dto = new SyncResultDto();
        dto.setSuccess(false);
        dto.setMessage(message);
        return dto;
    }

}
