package com.scb.ratan.flowzero.workflow.service;

import com.scb.ratan.flowzero.workflow.entity.dto.IcdmsQueryDto;
import com.scb.ratan.flowzero.workflow.entity.vo.IcdmsDocumentVo;
import com.scb.ratan.flowzero.workflow.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsCaseCreateRequest;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsCaseCreateResponse;

/**
 * Service interface for reading document file metadata from iCDMS.
 */
public interface IIcdmsService {

    PageResponseVo<IcdmsDocumentVo> queryFileMetadata(IcdmsQueryDto dto);

    /**
     * Creates a new case in iCDMS.
     *
     * <p>On success returns the iCDMS response.
     * On any failure a {@link com.scb.ratan.flowzero.workflow.entity.dbo.RetryTask}
     * record is persisted ({@code biz_type = ICDMS_CREATE}) so the scheduler can retry.
     * The original exception is re-thrown so the caller receives the error immediately.
     *
     * <ul>
     *   <li>HTTP 4xx  → {@code FAILED}   status, retryCount=1, exponential backoff</li>
     *   <li>HTTP 5xx / timeout / other → {@code SUSPENDED} status, retryCount=0, immediate retry</li>
     * </ul>
     *
     * @param request case-create payload; must not be {@code null}
     * @return iCDMS response on success
     */
    IcdmsCaseCreateResponse create(IcdmsCaseCreateRequest request);

}
