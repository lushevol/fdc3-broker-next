package com.scb.ratan.flowzero.auth.web;

import com.scb.ratan.flowzero.auth.entity.dto.SyncResultDto;
import com.scb.ratan.flowzero.auth.service.DataSyncService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/v1/sync")
public class DataSyncController {

    @Autowired
    private DataSyncService dataSyncService;

    @GetMapping("/entitlements")
    public ResponseEntity<SyncResultDto> syncEntitlements() {

        dataSyncService.syncAll();

        return ResponseEntity.ok(SyncResultDto.success());

    }

}
