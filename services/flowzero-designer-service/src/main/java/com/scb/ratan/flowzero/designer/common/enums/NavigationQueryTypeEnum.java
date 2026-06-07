package com.scb.ratan.flowzero.designer.common.enums;

/**
 * Query-type selector used by the Orchestration Service when calling
 * the navigation query-by-name endpoint via FeignClient.
 *
 * <ul>
 *   <li>{@link #ALL_TASKS} – Return every UserTask that belongs to the
 *       specified workflow, regardless of who the assignee / candidate is.
 *       Used when the caller only needs to know <em>which tasks exist</em>
 *       in a workflow (e.g. to track in which task a process instance is
 *       currently sitting) without restricting by the current user's
 *       access rights.</li>
 *   <li>{@link #ACCESSIBLE_TASKS} – Return only those UserTasks that the
 *       supplied {@code userId} / {@code roleName} is authorised to see,
 *       i.e. where the user is the fixed assignee, is listed in
 *       {@code candidate_users}, or whose role is listed in
 *       {@code candidate_groups}.  Used when building a permission-aware
 *       sidebar or todo list for a specific user.</li>
 * </ul>
 *
 * @author Kinson Wang
 * @date 2026-05-06
 */
public enum NavigationQueryTypeEnum {

    ALL_WORKFLOWS,

    /**
     * No permission filter — return all UserTasks for the workflow.
     */
    ALL_TASKS,

    /**
     * Permission-filtered — return only tasks accessible to the caller.
     */
    ACCESSIBLE_TASKS
}

