package com.scb.ratan.flowzero.workflow.controller;

import com.scb.ratan.flowzero.workflow.entity.dto.IcdmsQueryDto;
import com.scb.ratan.flowzero.workflow.entity.vo.IcdmsDocumentVo;
import com.scb.ratan.flowzero.workflow.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsCaseCreateRequest;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsCaseCreateResponse;
import com.scb.ratan.flowzero.workflow.external.icdms.KongGatewayAuthService;
import com.scb.ratan.flowzero.workflow.service.IIcdmsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * REST API for iCDMS document file metadata operations.
 *
 * <h3>Base URL</h3>
 * {@code /api/v1/icdms}
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/icdms")
@RequiredArgsConstructor
public class IcdmsController {

    private final IIcdmsService icdmsService;
    private final KongGatewayAuthService kongGatewayAuthService;

    @PostMapping("/documents/query")
    public ResponseEntity<PageResponseVo<IcdmsDocumentVo>> queryDocuments(
        @RequestBody IcdmsQueryDto dto) {

        log.info("[IcdmsController] queryDocuments – leId={}, docStatus={}, page={}, size={}",
            dto.getLeId(), dto.getDocStatus(), dto.getPage(), dto.getSize());

        PageResponseVo<IcdmsDocumentVo> result = icdmsService.queryFileMetadata(dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> getKongToken() {
        log.info("[IcdmsController] getKongToken – fetching token from cache");
        String token = kongGatewayAuthService.fetchAccessToken();
        return ResponseEntity.ok(Map.of("accessToken", token));
    }

    /**
     * Creates a new case in iCDMS.
     *
     * <pre>POST /api/v1/icdms/cases</pre>
     *
     * <p>On failure, a {@code t_retry_task} record is persisted automatically so the
     * distributed scheduler can retry the call without manual intervention.
     *
     * @param request case-create payload
     * @return {@code 201 Created} with the iCDMS case ID and full response body
     */
    @PostMapping("/cases")
    public ResponseEntity<IcdmsCaseCreateResponse> createCase(
        @RequestBody @Valid IcdmsCaseCreateRequest request) {

        log.info("[IcdmsController] createCase – leId={}, docType={}, requestId={}",
            request.getLeId(), request.getDocType(), request.getRequestId());

        IcdmsCaseCreateResponse response = icdmsService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
