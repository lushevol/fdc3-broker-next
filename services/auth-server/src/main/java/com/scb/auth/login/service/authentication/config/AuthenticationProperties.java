package com.scb.auth.login.service.authentication.config;

import com.scb.auth.login.service.authentication.repository.UserRepoEnum;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;

@Data
@Configuration
@ConfigurationProperties("ratanone.authentication")
public class AuthenticationProperties {

    private String cipherKey;
    private List<RatanUser> users;

    @Data
    public static class RatanUser {

        private String username;
        private String password;
        private List<String> actions = Collections.emptyList();
        private UserRepoEnum type = UserRepoEnum.RATAN;

    }

}
