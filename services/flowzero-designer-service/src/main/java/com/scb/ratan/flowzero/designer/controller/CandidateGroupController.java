package com.scb.ratan.flowzero.designer.controller;

import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CandidateGroupQueryDto;
import com.scb.ratan.flowzero.designer.service.ICandidateGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Kinson Wang
 * @date 3/30/2026
 */
@RestController
@RequestMapping(value = "/api/v1/candidate-group")
@RequiredArgsConstructor
@Slf4j
public class CandidateGroupController {

    private final ICandidateGroupService candidateGroupService;

    /**
     * Query candidate groups with pagination
     */
    @GetMapping(value = "/page")
    public ResponseEntity<?> page(CandidateGroupQueryDto queryDto, @Valid BasePageDto basePageDto) {
        return ResponseEntity.ok(candidateGroupService.page(queryDto, basePageDto));
    }

    /**
     * Search candidate groups by conditions
     */
    @GetMapping(value = "/search")
    public ResponseEntity<?> search(CandidateGroupQueryDto queryDto) {
        return ResponseEntity.ok(candidateGroupService.searchByConditions(queryDto));
    }

    /**
     * Get candidate group detail by ID
     */
    @GetMapping(value = "/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable String id) {
        return ResponseEntity.ok(candidateGroupService.findById(id));
    }

}
