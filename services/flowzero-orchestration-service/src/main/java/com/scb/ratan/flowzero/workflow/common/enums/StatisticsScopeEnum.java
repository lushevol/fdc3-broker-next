package com.scb.ratan.flowzero.workflow.common.enums;

/**
 * Scope filter for statistics APIs (request-count, pending-distribution, request-trend).
 *
 * <ul>
 *   <li>{@link #ALL}       – All requests; no user restriction.</li>
 *   <li>{@link #INITIATOR} – Requests initiated by the current user (createdBy = userId).</li>
 *   <li>{@link #TASK_EXECUTOR}  – Requests where the current user is a candidate approver
 *                            (based on accessible workflow / task navigation).</li>
 * </ul>
 */
public enum StatisticsScopeEnum {
    ALL,
    INITIATOR,
    TASK_EXECUTOR
}
