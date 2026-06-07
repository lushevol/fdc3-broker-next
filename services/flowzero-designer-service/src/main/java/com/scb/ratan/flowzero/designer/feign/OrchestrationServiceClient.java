package com.scb.ratan.flowzero.designer.feign;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.scb.ratan.flowzero.designer.entity.vo.DeployVo;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @auther Xu, Eva
 * @date 8/12/2025
 **/
@FeignClient("RATAN-FLOWZERO-ORCHESTRATION-SERVICE")
public interface OrchestrationServiceClient {

    @PostMapping(value = "/api/v1/process-definitions/deploy")
    DeployVo deploy(@RequestBody ProcessDefinitionDto dto);

    @Data
    class ProcessDefinitionDto {

        @NotBlank(message = "resourceId can't be null")
        private String resourceId;

        @NotBlank(message = "processName can't be null")
        private String processName;

        @NotBlank(message = "content can't be null")
        private String content;

    }

    @GetMapping("/api/v1/workflow-request/running-instances/{uniqueVersionId}")
    public List<RunningInstancesVo> getRunningInstancesByUniqueVersionId(@PathVariable String uniqueVersionId);

    @PostMapping("/api/v1/workflow-request/running-instances/by-keys")
    public List<RunningInstancesVo> getRunningInstancesByProcessDefinitionKeys(
        @RequestBody Collection<String> processDefinitionKeys);

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class RunningInstancesVo implements Serializable {

        private String businessKey;

        private String uniqueVersionId;

        private String instanceId;

        private String uniqueProcessId;

    }

    @PostMapping("/api/v1/workflow-request/terminate-instances")
    public void terminateInstancesByUniqueVersionId(@RequestBody StopInstancesDto stopInstancesDto);

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class StopInstancesDto implements Serializable {

        private String uniqueVersionId;

        private String reason;

    }

}
