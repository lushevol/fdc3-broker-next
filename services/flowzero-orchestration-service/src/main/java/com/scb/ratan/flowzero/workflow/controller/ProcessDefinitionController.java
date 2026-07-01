package com.scb.ratan.flowzero.workflow.controller;

import com.scb.ratan.flowzero.workflow.entity.dto.ProcessDefinitionDto;
import com.scb.ratan.flowzero.workflow.entity.vo.ProcessDefinitionVo;
import com.scb.ratan.flowzero.workflow.service.IProcessDefinitionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@Slf4j
@RestController
@RequestMapping("/api/v1/process-definitions")
public class ProcessDefinitionController {

    @Autowired
    private IProcessDefinitionService processDefinitionService;

    /**
     * deploy a process definition
     */
    @PostMapping("/deploy")
    public ResponseEntity<ProcessDefinitionVo> deployProcessDefinition(@Valid @RequestBody ProcessDefinitionDto dto) {
        return ResponseEntity.ok(processDefinitionService.deployProcess(dto));
    }

}
