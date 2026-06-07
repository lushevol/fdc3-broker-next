package com.scb.ratan.flowzero.designer.entity.dto;

import com.scb.ratan.flowzero.designer.common.enums.NavigationQueryTypeEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Request payload used by the Orchestration Service's FeignClient when
 * querying workflow navigation data by workflow name.
 *
 * <p>Two query modes are supported, controlled by {@link #queryType}:
 * <ul>
 *   <li>{@code ALL_TASKS}       – returns every UserTask that belongs to
 *       {@code workflowName} without any permission check.  {@code userId}
 *       and {@code roleName} are ignored in this mode.</li>
 *   <li>{@code ACCESSIBLE_TASKS} – returns only tasks that {@code userId}
 *       (with role {@code roleName}) is authorised to handle, i.e. where
 *       {@code userId} matches assignee / candidate_users, or {@code roleName}
 *       matches candidate_groups.  Both {@code userId} and {@code roleName}
 *       must be provided in this mode.</li>
 * </ul>
 *
 * @author Kinson Wang
 * @date 2026-05-06
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowNavigationQueryDto implements Serializable {

    private static final long serialVersionUID = 3891047625401938712L;

    /**
     * Business display name of the target workflow.  Must be non-blank.
     */
    private String workflowName;

    private String workflowId;

    private String taskName;

    /**
     * The user's bank ID supplied by the Orchestration Service.
     * Required when {@link #queryType} is {@code ACCESSIBLE_TASKS};
     * ignored for {@code ALL_TASKS}.
     */
    private String userId;

    /**
     * The role name of the user supplied by the Orchestration Service.
     * Required when {@link #queryType} is {@code ACCESSIBLE_TASKS};
     * ignored for {@code ALL_TASKS}.
     */
    private String roleName;

    /**
     * Determines whether a permission check is applied.
     */
    @NotNull(message = "queryType must not be null")
    private NavigationQueryTypeEnum queryType;
}

