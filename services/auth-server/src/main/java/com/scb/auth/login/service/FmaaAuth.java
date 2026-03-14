/**
 *
 */
package com.scb.auth.login.service;

import com.scb.auth.login.service.authentication.config.FMAAProperties;
import com.scb.fmaa.client.oauth2.ClientCredentialsFlow;
import com.scb.fmaa.client.oauth2.TokenResponse;
import com.scb.fmaa.client.oauth2.config.FMAAConfig;
import com.scb.fmaa.client.oauth2.config.HttpClientConfig;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jasypt.properties.PropertyValueEncryptionUtils;
import org.jasypt.util.text.BasicTextEncryptor;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.concurrent.TimeUnit;

/**
 *
 *
 * @author Wang, NickLong
 *
 * @since Oct 11, 2021
 * @version 1.0
 */
@Slf4j
public class FmaaAuth {

    private static final String FMAA_TOKEN_CACHE_KEY = "ratan:fmaaToken:str";

    private static FmaaAuth instance;

    private final FMAAProperties fmaaProperties;

    private final StringRedisTemplate redisTemplate;

    private FmaaAuth(FMAAProperties fmaaProperties, StringRedisTemplate redisTemplate) {
        this.fmaaProperties = fmaaProperties;
        this.redisTemplate = redisTemplate;
    }

    public static FmaaAuth instance(FMAAProperties fmaaProperties, StringRedisTemplate redisTemplate) {
        if (instance == null) {
            synchronized (FmaaAuth.class) {
                if (instance == null) {
                    instance = new FmaaAuth(fmaaProperties, redisTemplate);
                }
            }
        }
        return instance;
    }

    public String getFmaaToken() throws Exception {
        String token = null;
        try {
            token = redisTemplate.opsForValue().get(FMAA_TOKEN_CACHE_KEY);
        } catch (Exception e) {
            log.warn(" get fmaa token from cache error.", e);
        }
        if (StringUtils.isEmpty(token)) {
            token = initToken();
        } else {
            log.info("get fmaa token from cache successful.");
        }
        log.info("fmaa token: {}", token);
        return token;
    }

    /**
     * @return
     * @throws UnknownHostException
     */
    public String initToken() throws UnknownHostException {

        String clientId = String.format("RatanOne_%s", InetAddress.getLocalHost().getHostName());
        final FMAAConfig fmaaConfig = new FMAAConfig.Builder().appId(clientId).endpoint(fmaaProperties.getHost())
            .build();

        log.info("Build fmaa config instance successfully with host: {}", fmaaProperties.getHost());

        final HttpClientConfig httpClientConfig = new HttpClientConfig.Builder().retryCount(3).retryIntervalMs(1000L)
            .certPath(fmaaProperties.getCertPath()).build();

        log.info("Build fmaa http client config instance successfully with cert path: {}", fmaaProperties.getCertPath());

        final ClientCredentialsFlow authFlow = new ClientCredentialsFlow.Builder(fmaaConfig)
            .httpClientConfig(httpClientConfig).build();

        log.info("Build fmaa auth flow instance successfully");

        final TokenResponse tokenResponse = authFlow.execute(fmaaProperties.getAccount(),
            decrypt(fmaaProperties.getJanus()));

        if (tokenResponse.isSuccessful()) {
            log.info("Calling fmaa to auth with account: {} successfully, response: {}", fmaaProperties.getAccount(),
                tokenResponse);
            String token = tokenResponse.getAccessToken();
            try {
                redisTemplate.opsForValue().set(FMAA_TOKEN_CACHE_KEY, token, fmaaProperties.getTokenRefreshDuration().toDays(),
                    TimeUnit.DAYS);
            } catch (Exception e) {
                log.warn("save fmaa token into cache error. token: {}", token, e);
            }
            return token;
        } else {
            log.error("Calling fmaa to auth with account: {} failed, response: {}", fmaaProperties.getAccount(),
                tokenResponse.getErrorResponse().getMessage());
            throw new IllegalStateException(tokenResponse.getErrorResponse().getMessage());
        }

    }

    public String decrypt(String password) {
        if (PropertyValueEncryptionUtils.isEncryptedValue(password)) {
            BasicTextEncryptor encryptor = new BasicTextEncryptor();
            encryptor.setPassword(fmaaProperties.getCipherKey());
            return PropertyValueEncryptionUtils.decrypt(password, encryptor);
        } else {
            return password;
        }
    }

}
