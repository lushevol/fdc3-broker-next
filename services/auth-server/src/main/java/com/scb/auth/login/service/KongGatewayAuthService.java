package com.scb.auth.login.service;

import com.scb.auth.login.jwtparser.properties.KongConfigurationProperties;
import com.scb.ratan.service.resttemplate.config.RestTemplateConfig;
import com.scb.ratan.service.resttemplate.properties.RestTemplateProperties;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@Import({ RestTemplateConfig.class, RestTemplateProperties.class })
public class KongGatewayAuthService {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private KongConfigurationProperties kongConfigurationProperties;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    @Qualifier("certRestTemplate")
    private RestTemplate certRestTemplate;

    private final static String GRANT_TYPE = "grant_type=";
    private final static String GRANT_TYPE_VALUE = "client_credentials";
    private final static String SCOPE = "scope=";
    private final static String SCOPE_VALUE = "RDMApiService_GET_V3_portfolioData";

    private final static String BODY = GRANT_TYPE + GRANT_TYPE_VALUE + "&" + SCOPE + SCOPE_VALUE;

    private final static long DEFAULT_EXP_TIME = 800;

    public final static String KONG_CLIENT_KEY = "ratanone:da:pct2:kong:client:";
    public final static String BASIC = "Basic ";
    public final static String ACCESS_TOKEN = "access_token";
    public final static String REDIS_ACCESS_TOKEN = KONG_CLIENT_KEY + ACCESS_TOKEN;
    public final static String CLIENT_ID = "client_id";
    public final static String CLIENT_SECRET = "client_secret";
    public final static String REDIS_CLIENT_ID = KONG_CLIENT_KEY + CLIENT_ID;
    public final static String REDIS_CLIENT_SECRET = KONG_CLIENT_KEY + CLIENT_SECRET;
    public final static String EXP_TIME = "expires_in";

    public String fetchAccessToken() {

        log.info("fetchAccessToken start");

        String clientId = stringRedisTemplate.opsForValue().get(REDIS_CLIENT_ID);
        String clientSec = stringRedisTemplate.opsForValue().get(REDIS_CLIENT_SECRET);

        if (StringUtils.isEmpty(clientId) || StringUtils.isEmpty(clientSec)) {
            log.info("no Token cache, query by api");
            fetchClientInfo();
            clientId = stringRedisTemplate.opsForValue().get(REDIS_CLIENT_ID);
            clientSec = stringRedisTemplate.opsForValue().get(REDIS_CLIENT_SECRET);
        }

        String credentials = clientId + ":" + clientSec;

        String enc = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        httpHeaders.set(HttpHeaders.AUTHORIZATION, BASIC + enc);

        HttpEntity<String> entity = new HttpEntity<>(BODY, httpHeaders);

        String url = kongConfigurationProperties.getTokenEndpoint();

        log.info("fetchAccessToken-url: {}", url);

        try {
            ResponseEntity<String> response = certRestTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (HttpStatus.OK == response.getStatusCode()
                && StringUtils.isNotEmpty(response.getBody())) {

                JSONObject jsonObject = new JSONObject(response.getBody());
                String token = jsonObject.optString(ACCESS_TOKEN, null);

                if (StringUtils.isNotEmpty(token)) {
                    return token;
                }
            } else {
                log.error("Fail to get token: {}", response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error getting token: ", e);
        }
        deleteClientCache();
        return null;
    }

    private void fetchClientInfo() {

        log.info("fetchClientInfo start");

        String oudInfo = kongConfigurationProperties.getAccount()
            + ":" + kongConfigurationProperties.getSec();

        String enc = Base64.getEncoder().encodeToString(oudInfo.getBytes(StandardCharsets.UTF_8));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.AUTHORIZATION, BASIC + enc);

        HttpEntity<String> entity = new HttpEntity<>(null, httpHeaders);

        String url = kongConfigurationProperties.getClientEndpoint();

        log.info("fetchClientInfo-url: {}", url);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (HttpStatus.OK == response.getStatusCode()
                && StringUtils.isNotEmpty(response.getBody())) {
                JSONObject jsonObject = new JSONObject(response.getBody());
                String clientId = jsonObject.getString(CLIENT_ID);
                String sec = jsonObject.getString(CLIENT_SECRET);
                stringRedisTemplate.opsForValue().set(REDIS_CLIENT_ID, clientId);
                stringRedisTemplate.opsForValue().set(REDIS_CLIENT_SECRET, sec);
            }
        } catch (Exception e) {
            log.error("Error getting client info: ", e);
        }
    }

    private void deleteClientCache() {
        stringRedisTemplate.delete(REDIS_CLIENT_ID);
        stringRedisTemplate.delete(REDIS_CLIENT_SECRET);
    }

}
