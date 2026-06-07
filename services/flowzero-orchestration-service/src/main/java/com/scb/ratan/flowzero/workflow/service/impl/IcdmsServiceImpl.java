package com.scb.ratan.flowzero.workflow.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.ratan.flowzero.workflow.common.enums.RetryBizType;
import com.scb.ratan.flowzero.workflow.common.enums.RetryTaskStatus;
import com.scb.ratan.flowzero.workflow.entity.dbo.RetryTask;
import com.scb.ratan.flowzero.workflow.entity.dto.IcdmsQueryDto;
import com.scb.ratan.flowzero.workflow.entity.vo.IcdmsDocumentVo;
import com.scb.ratan.flowzero.workflow.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.workflow.external.icdms.ICDMSApiClient;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsCaseCreateRequest;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsCaseCreateResponse;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsPagination;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsQueryRequest;
import com.scb.ratan.flowzero.workflow.external.icdms.IcdmsQueryResponse;
import com.scb.ratan.flowzero.workflow.repository.RetryTaskRepository;
import com.scb.ratan.flowzero.workflow.service.IIcdmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.Objects.requireNonNull;

/**
 * Default implementation of {@link IIcdmsService}.
 *
 * <p>Delegates to {@link ICDMSApiClient#getMetadata(IcdmsQueryRequest)} and
 * converts the raw response into the front-end view model.
 *
 * <h3>Pagination parsing</h3>
 * iCDMS returns pagination as top-level strings:
 * <ul>
 *   <li>{@code totalCount} — total records as a numeric string, e.g. {@code "494"}</li>
 *   <li>{@code page}       — "current of total" format, e.g. {@code "1 of 1"}</li>
 *   <li>{@code rowsPerPage} — page size as a numeric string, e.g. {@code "1000"}</li>
 * </ul>
 * {@link #parseCurrentPage} and {@link #parseLong} / {@link #parseInt} convert these
 * safely, falling back to request-supplied values on any parse failure.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IcdmsServiceImpl implements IIcdmsService {

    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_SIZE = 20;
    private static final int MAX_ERROR_LENGTH = 2000;

    private final ICDMSApiClient icdmsApiClient;
    private final RetryTaskRepository retryTaskRepository;
    private final ObjectMapper objectMapper;

    // ── queryFileMetadata ─────────────────────────────────────────────────────

    @Override
    public PageResponseVo<IcdmsDocumentVo> queryFileMetadata(IcdmsQueryDto dto) {
        requireNonNull(dto, "dto must not be null");

        int page = Optional.ofNullable(dto.getPage()).orElse(DEFAULT_PAGE);
        int size = Optional.ofNullable(dto.getSize()).orElse(DEFAULT_SIZE);

        log.info("[IcdmsService] queryFileMetadata – leId={}, docStatus={}, page={}, size={}",
                dto.getLeId(), dto.getDocStatus(), page, size);

        IcdmsQueryRequest request = buildRequest(dto, page, size);
        ResponseEntity<IcdmsQueryResponse> responseEntity = icdmsApiClient.getMetadata(request);

        IcdmsQueryResponse response = responseEntity == null ? null : responseEntity.getBody();
        if (response == null) {
            log.warn("[IcdmsService] iCDMS returned null response, returning empty result");
            return emptyPage(page, size);
        }

        List<IcdmsDocumentVo> voList = toVoList(response);
        log.info("[IcdmsService] iCDMS status={}, totalCount={}, dataSize={}",
                response.getStatus(), response.getTotalCount(), voList.size());

        return buildPageResponse(response, voList, page, size);
    }

    // ── create ────────────────────────────────────────────────────────────────

    @Override
    public IcdmsCaseCreateResponse create(IcdmsCaseCreateRequest request) {
        requireNonNull(request, "request must not be null");

        // Use caller-supplied requestId as idempotency key; generate one if absent
        String bizId = StringUtils.isNotBlank(request.getRequestId())
            ? request.getRequestId()
            : UUID.randomUUID().toString();

        log.info("[IcdmsService] createCase – leId={} bizId={}", request.getLeId(), bizId);

        try {
            IcdmsCaseCreateResponse response = icdmsApiClient.create(request);
            String caseId = Optional.ofNullable(response)
                .map(IcdmsCaseCreateResponse::getData)
                .map(IcdmsCaseCreateResponse.CaseData::getCaseId)
                .orElse("N/A");
            log.info("[IcdmsService] createCase SUCCESS – bizId={} caseId={}", bizId, caseId);
            return response;

        } catch (RuntimeException e) {
            // Distinguish 4xx (data error → FAILED) from 5xx/other (service error → SUSPENDED)
            RetryTaskStatus status = resolveCreateErrorStatus(e);
            saveCreateRetryTask(bizId, request, status, e.getMessage());
            log.error("[IcdmsService] createCase {} – bizId={} error={}", status, bizId, e.getMessage());
            // Re-throw so controller can return appropriate HTTP error to the caller
            throw e;
        }
    }

    /**
     * HTTP 4xx (bad request / validation) → FAILED: data problem, schedule with backoff.
     * HTTP 5xx / timeout / CB open / other → SUSPENDED: service problem, retry immediately.
     */
    private RetryTaskStatus resolveCreateErrorStatus(RuntimeException e) {
        Throwable cause = e.getCause();
        if (cause instanceof HttpClientErrorException) {
            return RetryTaskStatus.FAILED;
        }
        return RetryTaskStatus.SUSPENDED;
    }

    /**
     * Upserts a {@link RetryTask} for {@code ICDMS_CREATE}.
     * If a record already exists for the same {@code bizId}, its state is updated in-place.
     */
    private void saveCreateRetryTask(String bizId, IcdmsCaseCreateRequest request,
        RetryTaskStatus status, String errorMessage) {
        String payloadJson;
        try {
            payloadJson = objectMapper.writeValueAsString(request);
        } catch (Exception ex) {
            log.warn("[IcdmsService] Failed to serialize createCase payload bizId={}", bizId);
            payloadJson = "{}";
        }

        final String finalPayload = payloadJson;
        retryTaskRepository.findByBizTypeAndBizId(RetryBizType.ICDMS_CREATE, bizId)
            .ifPresentOrElse(
                existing -> {
                    int newCount = RetryTaskStatus.FAILED.equals(status)
                        ? existing.getRetryCount() + 1 : existing.getRetryCount();
                    boolean exceeded = newCount >= existing.getMaxRetry();
                    existing.setStatus(exceeded ? RetryTaskStatus.SKIPPED : status);
                    existing.setRetryCount(newCount);
                    existing.setLastError(truncate(errorMessage));
                    existing.setNextRetryAt(RetryTaskStatus.FAILED.equals(status) && !exceeded
                        ? IcdmsSyncServiceImpl.calculateNextRetryAt(newCount) : null);
                    existing.setUpdatedBy("system");
                    retryTaskRepository.save(existing);
                    if (exceeded) {
                        log.error("[IcdmsService][ALERT] createCase max retry exceeded bizId={}", bizId);
                    }
                },
                () -> {
                    int retryCount = RetryTaskStatus.FAILED.equals(status) ? 1 : 0;
                    RetryTask task = RetryTask.builder()
                        .bizType(RetryBizType.ICDMS_CREATE)
                        .bizId(bizId)
                        .payload(finalPayload)
                        .status(status)
                        .retryCount(retryCount)
                        .maxRetry(3)
                        .lastError(truncate(errorMessage))
                        .nextRetryAt(RetryTaskStatus.FAILED.equals(status)
                            ? IcdmsSyncServiceImpl.calculateNextRetryAt(retryCount) : null)
                        .build();
                    task.setCreatedBy("system");
                    task.setUpdatedBy("system");
                    retryTaskRepository.save(task);
                });
    }

    // ── Private query helpers ─────────────────────────────────────────────────

    private List<IcdmsDocumentVo> toVoList(IcdmsQueryResponse response) {
        return Optional.ofNullable(response.getData())
                .orElseGet(Collections::emptyList)
                .stream()
                .filter(Objects::nonNull)
                .map(this::toVo)
                .collect(Collectors.toList());
    }

    private PageResponseVo<IcdmsDocumentVo> buildPageResponse(
            IcdmsQueryResponse response, List<IcdmsDocumentVo> voList,
            int fallbackPage, int fallbackSize) {
        int page = parseCurrentPage(response.getPage(), fallbackPage);
        int size = parseInt(response.getRowsPerPage(), fallbackSize);
        long total = parseLong(response.getTotalCount(), voList.size());
        long totalPages = total == 0 ? 0L : (long) Math.ceil((double) total / size);
        return new PageResponseVo<>(page, size, total, totalPages, voList);
    }

    private IcdmsQueryRequest buildRequest(IcdmsQueryDto dto, int page, int size) {
        IcdmsPagination pagination = new IcdmsPagination();
        pagination.setPage(page);
        pagination.setSize(size);

        List<IcdmsQueryRequest.DocClassification> classifications = null;
        if (!CollectionUtils.isEmpty(dto.getDocClassifications())) {
            classifications = dto.getDocClassifications().stream()
                    .map(c -> new IcdmsQueryRequest.DocClassification(c.getDocCategory(), c.getDocType()))
                    .collect(Collectors.toList());
        }

        return IcdmsQueryRequest.builder()
                .leId(dto.getLeId())
                .docStatus(dto.getDocStatus())
                .pagination(pagination)
                .docClassification(classifications)
                .build();
    }

    private IcdmsDocumentVo toVo(IcdmsQueryResponse.DocItem item) {
        return IcdmsDocumentVo.builder()
                .leId(item.getLeId())
                .caseId(item.getCaseId())
                .attachmentName(item.getAttachmentName())
                .attachmentSize(item.getAttachmentSize())
                .attachmentType(item.getAttachmentType())
                .filenetRefId(item.getFilenetRefId())
                .docCategory(item.getDocCategory())
                .docType(item.getDocType())
                .docName(item.getDocName())
                .docLocation(item.getDocLocation())
                .docStatus(item.getDocStatus())
                .completionDate(item.getCompletionDate())
                .systemId(item.getSystemId())
                .createDate(item.getCreateDate())
                .agreementDate(item.getAgreementDate())
                .agreementExpiryDate(item.getAgreementExpiryDate())
                .createdBy(item.getCreatedBy())
                .build();
    }

    private PageResponseVo<IcdmsDocumentVo> emptyPage(int page, int size) {
        return new PageResponseVo<>(page, size, 0L, 0L, Collections.emptyList());
    }

    // ── Pagination string parsers ─────────────────────────────────────────────

    private static int parseCurrentPage(String pageStr, int fallback) {
        if (StringUtils.isBlank(pageStr)) {
            return fallback;
        }
        String[] parts = pageStr.split("(?i)\\s+of\\s+");
        try {
            return Integer.parseInt(parts[0].trim());
        } catch (NumberFormatException e) {
            log.warn("[IcdmsService] Unable to parse iCDMS page value '{}', using fallback={}", pageStr, fallback);
            return fallback;
        }
    }

    private static long parseLong(String value, long fallback) {
        if (StringUtils.isBlank(value)) {
            return fallback;
        }
        try {
            return Long.parseLong(value.trim());
        } catch (NumberFormatException e) {
            log.warn("[IcdmsService] Unable to parse iCDMS long value '{}', using fallback={}", value, fallback);
            return fallback;
        }
    }

    private static int parseInt(String value, int fallback) {
        if (StringUtils.isBlank(value)) {
            return fallback;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            log.warn("[IcdmsService] Unable to parse iCDMS int value '{}', using fallback={}", value, fallback);
            return fallback;
        }
    }

    private String truncate(String s) {
        if (s == null) {
            return null;
        }
        return s.length() > MAX_ERROR_LENGTH ? s.substring(0, MAX_ERROR_LENGTH) : s;
    }

}
