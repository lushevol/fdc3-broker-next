package com.scb.ratan.flowzero.workflow.external.filenet;

import com.scb.ratan.flowzero.workflow.properties.FileNetConfigurationProperties;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

import static com.scb.ratan.flowzero.workflow.common.FileNetConstants.*;

/**
 * HTTP client for all FileNet document operations.
 *
 * <p>JWT is obtained from {@link FileNetJwtService} (Caffeine-cached, auto-refreshed every
 * 25 min) and placed in the {@code jwt} request header, as required by the FileNet API.
 *
 * <h3>Supported operations</h3>
 * <ul>
 *   <li>{@link #uploadFile} — single-file multipart upload, returns a {@link FileNetUploadResult}</li>
 *   <li>{@link #deleteFile} — delete a document by docId</li>
 *   <li>{@link #getContent} — stream file content as {@link InputStream}</li>
 * </ul>
 *
 * <h3>Timeout protection</h3>
 * <p>All HTTP timeouts (connect / socket / pool-wait) are enforced by Apache HttpClient 5
 * via {@link FileNetConfigurationProperties.HttpPool}, eliminating the need for a
 * separate thread-pool timeout wrapper.
 *
 * @author Aiden
 * @date 05/27/2026
 */
@Slf4j
@Component
public class FileNetApiClient {

    private final FileNetConfigurationProperties fileNetConfigurationProperties;
    private final FileNetJwtService fileNetJwtService;
    private final RestClient fileNetRestClient;

    public FileNetApiClient(
        FileNetConfigurationProperties fileNetConfigurationProperties,
        FileNetJwtService fileNetJwtService,
        @Qualifier("fileNetRestClient") RestClient fileNetRestClient) {
        this.fileNetConfigurationProperties = fileNetConfigurationProperties;
        this.fileNetJwtService = fileNetJwtService;
        this.fileNetRestClient = fileNetRestClient;
    }

    /**
     * Uploads a single file to FileNet.
     *
     * <p>The upload is synchronous. Callers <b>must</b> check {@link FileNetUploadResult#isSuccess()}
     * before using the returned {@code docId}; this method never throws on upload failure —
     * all errors are captured in the result object.
     *
     * @param file           multipart file from the HTTP request; must not be {@code null}
     * @param propertyValues optional document properties JSON; {@code null} uses the default
     * @return upload result containing {@code docId} on success or an error message on failure;
     *         never {@code null}
     */
    public FileNetUploadResult uploadFile(MultipartFile file, String propertyValues) {
        Objects.requireNonNull(file, "file must not be null");

        log.info("uploadFile >>> fileName={}, size={}", file.getOriginalFilename(), file.getSize());

        String jwt = fileNetJwtService.fetchJwt();
        FileNetUploadResult result = doUploadSingle(file, propertyValues, jwt);

        log.info("uploadFile <<< success={}, fileName={}, docId={}",
            result.isSuccess(), result.getFileName(), result.getDocId());
        return result;
    }

    /**
     * Deletes a document from FileNet by its document ID.
     *
     * @param docId FileNet document ID, e.g. {@code {178F7269-4FF2-4AF5-9057-1D228B0E5E3C}};
     *              must not be {@code null}
     * @throws RuntimeException if the delete request fails with a non-2xx status or network error
     */
    public void deleteFile(String docId) {
        Objects.requireNonNull(docId, "docId must not be null");

        URI uri = resolveUri(fileNetConfigurationProperties.getDeleteEndpoint(), docId);
        log.info("deleteFile >>> [DELETE] uri={}", uri);

        try {
            fileNetRestClient.delete()
                .uri(uri)
                .header(JWT_HEADER, fileNetJwtService.fetchJwt())
                .retrieve()
                .toBodilessEntity();

            log.info("deleteFile <<< SUCCESS, docId={}", docId);

        } catch (HttpStatusCodeException e) {
            log.error("deleteFile <<< FAILED – status={}, body={}",
                e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException(
                "FileNet delete failed [" + e.getStatusCode() + "] for docId: " + docId, e);
        } catch (Exception e) {
            log.error("deleteFile <<< exception – docId={}", docId, e);
            throw new RuntimeException("FileNet delete exception for docId: " + docId, e);
        }
    }

    /**
     * Retrieves the file content of a FileNet document as a {@link ByteArrayInputStream}.
     *
     * <p>All bytes are read inside the HTTP exchange callback (while the connection is still
     * open) and wrapped in an in-memory stream, ensuring the HTTP connection is recycled
     * back to the pool in all code paths — success, error, and exception.
     *
     * @param docId FileNet document ID; must not be {@code null}
     * @return {@link ByteArrayInputStream} backed by the full file bytes; always readable
     * @throws RuntimeException if FileNet returns a non-2xx status or a network error occurs
     */
    public InputStream getContent(String docId) {
        Objects.requireNonNull(docId, "docId must not be null");

        URI uri = resolveUri(fileNetConfigurationProperties.getRetrieveEndpoint(), docId);
        log.info("getContent >>> [GET] uri={}", uri);

        try {
            return fileNetRestClient.get()
                .uri(uri)
                .header(JWT_HEADER, fileNetJwtService.fetchJwt())
                .exchange((request, response) -> {
                    // Always drain the body first — ensures the connection is returned to the
                    // pool cleanly in all code paths (success and error).
                    byte[] body = response.getBody().readAllBytes();

                    if (response.getStatusCode().is2xxSuccessful()) {
                        log.info("getContent <<< SUCCESS, docId={}, contentType={}, bytes={}",
                            docId, response.getHeaders().getContentType(), body.length);
                        return new ByteArrayInputStream(body);
                    }

                    String errorBody = new String(body, StandardCharsets.UTF_8);
                    log.error("getContent <<< FAILED – status={}, docId={}, errorBody={}",
                        response.getStatusCode(), docId, errorBody);
                    throw new RuntimeException(
                        "FileNet getContent failed ["
                            + response.getStatusCode() + "] for docId: " + docId
                            + ". Response: " + errorBody);
                });

        } catch (HttpStatusCodeException e) {
            log.error("getContent <<< FAILED – status={}, body={}",
                e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException(
                "FileNet getContent failed [" + e.getStatusCode() + "] for docId: " + docId, e);
        } catch (Exception e) {
            log.error("getContent <<< exception – docId={}", docId, e);
            throw new RuntimeException("FileNet getContent exception for docId: " + docId, e);
        }
    }

    /**
     * Performs the actual multipart upload and always returns a {@link FileNetUploadResult}.
     * Catches {@link IOException} (form serialisation) and {@link RestClientException}
     * (HTTP transport) separately for precise error categorisation; a final
     * {@link Exception} guard handles any unforeseen runtime errors.
     */
    private FileNetUploadResult doUploadSingle(
        MultipartFile file, String propertyValues, String jwt) {
        String fileName = StringUtils.defaultIfBlank(file.getOriginalFilename(), "unknown");

        try {
            String props = StringUtils.defaultIfBlank(propertyValues, DEFAULT_PROPERTY_JSON);
            MultiValueMap<String, Object> formBody = buildUploadForm(file, props);

            String responseBody = fileNetRestClient.post()
                .uri(fileNetConfigurationProperties.getMultipartEndpoint())
                .header(JWT_HEADER, jwt)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(formBody)
                .retrieve()
                .body(String.class);

            String docId = extractDocId(responseBody);
            log.info("doUploadSingle <<< SUCCESS, fileName={}, docId={}", fileName, docId);
            return FileNetUploadResult.ofSuccess(fileName, docId);

        } catch (IOException e) {
            return buildFailureResult(fileName, "IO error reading file", e);
        } catch (RestClientException e) {
            return buildFailureResult(fileName, "HTTP error calling FileNet", e);
        } catch (Exception e) {
            return buildFailureResult(fileName, "Unexpected error during upload", e);
        }
    }

    /** Builds a failure result and logs the error; ensures error message is never {@code null}. */
    private FileNetUploadResult buildFailureResult(String fileName, String context, Exception e) {
        String errorMessage = context + ": "
            + StringUtils.defaultIfBlank(e.getMessage(), e.getClass().getSimpleName());
        log.error("doUploadSingle <<< FAILED, fileName={}, error={}", fileName, errorMessage);
        return FileNetUploadResult.ofFailure(fileName, errorMessage);
    }

    /** Builds the multipart form body for a FileNet upload request. */
    private MultiValueMap<String, Object> buildUploadForm(
        MultipartFile file, String propertiesJson) throws IOException {
        final String filename = StringUtils.defaultIfBlank(
            file.getOriginalFilename(), "attachment");
        final String mimeType = StringUtils.defaultIfBlank(
            file.getContentType(), MediaType.APPLICATION_OCTET_STREAM_VALUE);

        MultiValueMap<String, Object> form = new LinkedMultiValueMap<>();
        form.add(FIELD_OS_NAME, fileNetConfigurationProperties.getObjectStore());
        form.add(FIELD_DOC_CLASS_NAME, fileNetConfigurationProperties.getDocumentClass());
        form.add(FIELD_FILE_NAME, filename);
        form.add(FIELD_FOLDER_PATH, DEFAULT_FOLDER_PATH);
        form.add(FIELD_CONTENT_TYPE, mimeType);
        form.add(FIELD_PROPERTY_VALUES, propertiesJson);
        // Stream directly from the request buffer — no extra heap copy
        form.add(FIELD_DOC_CONTENT, new InputStreamResource(file.getInputStream()) {

            @Override
            public String getFilename() {
                return filename;
            }

            @Override
            public long contentLength() {
                return file.getSize();
            }

        });
        return form;
    }

    /** Resolves the final URI by injecting the encoded {@code docId} into the URL template. */
    private URI resolveUri(String urlTemplate, String docId) {
        String encodedDocId = docId.replace("{", "%7B").replace("}", "%7D");

        String path = urlTemplate.contains("{documentId}")
            ? urlTemplate.replace("{documentId}", encodedDocId)
            : (urlTemplate.endsWith("/")
                ? urlTemplate + encodedDocId
                : urlTemplate + "/" + encodedDocId);

        return UriComponentsBuilder.fromHttpUrl(path)
            .queryParam(PARAM_OS_NAME, fileNetConfigurationProperties.getObjectStore())
            .queryParam(PARAM_DOC_CLASS_NAME, fileNetConfigurationProperties.getDocumentClass())
            .build(true)
            .toUri();
    }

    /** Parses and validates the {@code docId} field from the FileNet upload response JSON. */
    private String extractDocId(String responseBody) {
        if (StringUtils.isBlank(responseBody)) {
            throw new IllegalStateException("FileNet upload returned empty response body");
        }
        JSONObject json = new JSONObject(responseBody.trim());
        String docId = json.optString(DOC_ID_FIELD, null);
        if (StringUtils.isEmpty(docId)) {
            throw new IllegalStateException(
                "FileNet upload response missing '" + DOC_ID_FIELD
                    + "' field. Response: " + responseBody);
        }
        return docId;
    }

}
