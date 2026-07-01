package com.scb.ratan.flowzero.designer.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Navigation data for a single workflow version.
 *
 * <p>Unlike {@link WorkflowNavigationVo} (which aggregates tasks across all
 * versions of the same workflow name), this VO represents exactly one
 * workflow version so that per-version details — such as changes to
 * {@code candidateUsers}, {@code assignee} or {@code candidateGroups} — are
 * preserved and not silently merged with other versions.
 *
 * @author Kinson Wang
 * @date 5/10/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowVersionNavigationVo implements Serializable {

    private static final long serialVersionUID = 3812047625401938799L;

    /** Business display name shared across all versions of this workflow. */
    private String workflowName;

    /** Unique identifier of this specific workflow version (t_workflow.id). */
    private String workflowId;

    /** Camunda process-definition Id for this version */
    private String processDefinitionId;

    /** Camunda process-definition key for this version (previously uniqueVersionId). */
    private String processDefinitionKey;

    /** All UserTasks belonging to this workflow version. */
    private List<TaskNavigationVo> tasks;

}
