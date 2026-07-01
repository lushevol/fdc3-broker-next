package com.scb.ratan.flowzero.workflow.feign;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Set;

/**
 * @auther Tian, Terry
 * @date 3/3/2026
 **/
@FeignClient("RATAN-FLOWZERO-DESIGNER-SERVICE")
public interface DesignerServiceClient {

    @GetMapping(value = "/api/v1/workflow/{workflowId}/forms")
    List<WorkflowFormRel> getWorkflowFormRelsByWorkflowId(@PathVariable String workflowId);

    @PostMapping(value = "/api/v1/workflow/get-workflows-by-condition")
    List<WorkflowShortInfoVo> getWorkflowsByCondition(@RequestBody WorkflowQueryDto queryDto);

    @GetMapping(value = "/api/v1/user/bankId/{bankId}")
    UserVo findByBankId(@PathVariable String bankId);

    @PostMapping(value = "/api/v1/workflow/navigation/query-by-condition")
    List<WorkflowVersionNavigationVo> queryNavigationByCondition(
        @RequestBody WorkflowNavigationQueryDto queryDto);

    @GetMapping(value = "/api/v1/workflow/navigation/query-assignable-user")
    List<UserVo> queryAssignableUser(@RequestParam("workflowName") String workflowName,
        @RequestParam("taskName") String taskName,
        @RequestParam(value = "workflowId", required = false) String workflowId);

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class WorkflowFormRel implements Serializable {

        private static final long serialVersionUID = 5328467282899905485L;

        private String id;

        private String formId;

        private String workflowId;

        private String workflowVariables;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public class WorkflowQueryDto implements Serializable {

        private static final long serialVersionUID = -6103954547427150637L;

        private String name;

        private Collection<String> ids;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class WorkflowShortInfoVo implements Serializable {

        private static final long serialVersionUID = -4817258133778242316L;

        public String id;

        private String name;

        private String uniqueProcessId;

        private String uniqueVersionId;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class UserVo implements Serializable {

        private static final long serialVersionUID = -7692160120102728843L;

        private String id;

        private String bankId;

        private String userName;

        private String countryCode;

        private String email;

        private String roleName;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class WorkflowNavigationVo implements Serializable {

        private static final long serialVersionUID = 2165565825341951070L;

        private String workflowName;

        private Set<String> workflowIds;

        private Set<String> uniqueVersionIds;

        private List<TaskNavigationVo> tasks;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class WorkflowVersionNavigationVo implements Serializable {

        private static final long serialVersionUID = 3812047625401938799L;

        private String workflowName;

        private String workflowId;

        private String processDefinitionId;

        private String processDefinitionKey;

        private List<TaskNavigationVo> tasks;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class TaskNavigationVo implements Serializable {

        private static final long serialVersionUID = 1868946224990879451L;

        /**
         * Unique key of the task (matches Camunda UserTask id)
         */
        private String taskKey;

        private String taskName;

        /**
         * Candidate user IDs configured on this UserTask in the BPMN definition.
         * Empty when the task has no candidateUsers configured.
         */
        private List<String> candidateUsers;

        /**
         * Candidate group IDs configured on this UserTask in the BPMN definition.
         * Empty when the task has no candidateGroups configured.
         */
        private List<String> candidateGroups;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class WorkflowNavigationQueryDto implements Serializable {

        private static final long serialVersionUID = 3891047625401938712L;

        @NotBlank(message = "workflowName must not be blank")
        private String workflowName;

        private String workflowId;

        private String taskName;

        private String userId;

        private String roleName;

        @NotNull(message = "queryType must not be null")
        private NavigationQueryTypeEnum queryType;

    }

    enum NavigationQueryTypeEnum {

        ALL_WORKFLOWS,

        ALL_TASKS,

        ACCESSIBLE_TASKS
    }

}
