package com.scb.ratan.flowzero.workflow.external.icdms;

import com.scb.ratan.flowzero.workflow.properties.ICDMSConfigurationProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import java.util.Optional;

/**
 * Synchronous HTTP client for iCDMS business operations.
 *
 * <p>Handles direct, blocking API calls initiated by frontend requests:
 * <ul>
 *   <li>{@link #getMetadata} — query document metadata</li>
 *   <li>{@link #create}      — create a new case</li>
 * </ul>
 *
 * <p>For the async compensation/retry flow (workflow attachment sync), see
 * {@link IcdmsCompensationClient}.
 *
 * @author Aiden
 * @date 05/27/2026
 */
@Slf4j
@Component
public class ICDMSApiClient {

    private final RestClient kongCertRestClient;
    private final ICDMSConfigurationProperties icdmsConfigurationProperties;
    private final KongGatewayAuthService authServerClient;
    private final IcdmsErrorParser errorParser;

    public ICDMSApiClient(
        @Qualifier("kongCertRestClient") RestClient kongCertRestClient,
        ICDMSConfigurationProperties icdmsConfigurationProperties,
        KongGatewayAuthService authServerClient,
        IcdmsErrorParser errorParser) {
        this.kongCertRestClient = kongCertRestClient;
        this.icdmsConfigurationProperties = icdmsConfigurationProperties;
        this.authServerClient = authServerClient;
        this.errorParser = errorParser;
    }

    /**
     * Queries iCDMS for document metadata (POST).
     *
     * @param icdmsRequest query parameters; must not be {@code null}
     * @return response entity containing matched documents
     * @throws RuntimeException if iCDMS returns a non-2xx status or a network error occurs
     */
    public ResponseEntity<IcdmsQueryResponse> getMetadata(IcdmsQueryRequest icdmsRequest) {
        String url = icdmsConfigurationProperties.getMetadataEndpoint();
        log.info("getMetadata >>> [POST] url={} body={}", url, icdmsRequest);

        try {
            IcdmsQueryResponse body = kongCertRestClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authServerClient.fetchAccessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(icdmsRequest)
                .retrieve()
                .body(IcdmsQueryResponse.class);

            log.info("getMetadata <<< SUCCESS");
            return ResponseEntity.ok(body);

        } catch (HttpStatusCodeException e) {
            log.error("getMetadata <<< FAILED – status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException(
                errorParser.buildErrorMessage("iCDMS getMetadata", e.getStatusCode().toString(),
                    e.getResponseBodyAsString()),
                e);
        } catch (Exception e) {
            log.error("getMetadata <<< exception calling url={}", url, e);
            throw new RuntimeException("iCDMS getMetadata exception: " + e.getMessage(), e);
        }
    }

    /**
     * Creates a new case in iCDMS (POST /cases).
     *
     * @param request case-create payload; must not be {@code null}
     * @return response containing the created case ID
     * @throws RuntimeException if iCDMS returns a non-2xx status or a network error occurs
     */
    public IcdmsCaseCreateResponse create(IcdmsCaseCreateRequest request) {
        String url = icdmsConfigurationProperties.getCreateEndpoint();
        log.info("create >>> [POST] url={} body={}", url, request);

        try {
            IcdmsCaseCreateResponse response = kongCertRestClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + authServerClient.fetchAccessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(IcdmsCaseCreateResponse.class);

            String caseId = Optional.ofNullable(response)
                .map(IcdmsCaseCreateResponse::getData)
                .map(IcdmsCaseCreateResponse.CaseData::getCaseId)
                .orElse(null);
            log.info("create <<< SUCCESS caseId={}", caseId);
            return response;

        } catch (HttpStatusCodeException e) {
            String errorBody = e.getResponseBodyAsString();
            log.error("create <<< FAILED – status={}, body={}", e.getStatusCode(), errorBody);
            throw new RuntimeException(
                errorParser.buildErrorMessage("iCDMS create", e.getStatusCode().toString(), errorBody), e);
        } catch (Exception e) {
            log.error("create <<< exception – url={}", url, e);
            throw new RuntimeException("iCDMS create exception: " + e.getMessage(), e);
        }
    }

}
