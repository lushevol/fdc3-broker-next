package com.scb.sso.singleuibff.service.v1.implementation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.config.FmaaProperties;
import com.scb.sso.singleuibff.dto.config.FmaaResult;
import com.scb.sso.singleuibff.service.v1.ApplicationConfigService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@Slf4j
@AllArgsConstructor
public class ApplicationConfigServiceImpl implements ApplicationConfigService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private FmaaProperties fmaaProperties;

    @Override
    public FmaaResult getAppId(String jwt) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(String.format(fmaaProperties.getVerificationPath(), jwt),
                String.class);
            return objectMapper.readValue(response.getBody(), FmaaResult.class);
        } catch (Exception e) {
            log.warn("getAppId, e: {}", e.getMessage());
        }
        FmaaResult fmaaResult = new FmaaResult();
        fmaaResult.setActive("false");
        return fmaaResult;
    }

}
