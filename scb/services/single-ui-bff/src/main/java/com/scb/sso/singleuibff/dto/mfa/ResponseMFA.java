package com.scb.sso.singleuibff.dto.mfa;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * @deprecated This class is deprecated as the response from Entra may contain more fields in the future, and it is better to use ResponseEntra which is more generic.
 */
@Data
public class ResponseMFA {

    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("scope")
    private String scope;
    @JsonProperty("id_token")
    private String idToken;
    @JsonProperty("token_type")
    private String tokenType;
    @JsonProperty("expires_in")
    private int expiresIn;

}
