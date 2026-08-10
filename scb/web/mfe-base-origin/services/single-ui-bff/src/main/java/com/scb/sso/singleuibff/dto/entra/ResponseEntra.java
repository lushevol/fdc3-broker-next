package com.scb.sso.singleuibff.dto.entra;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/** Response object for Microsoft Entra ID authentication. 
 * See https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow#refresh-the-access-token for more details.
*/
@Data
public class ResponseEntra {

    /**
     * The requested access token. The app uses this token to authenticate to secured resources, such as a web API.
     */
    @JsonProperty("access_token")
    private String accessToken;
    /**
     * Indicates the token type value. The only type that Microsoft Entra ID supports is "Bearer".
     * @example "Bearer"
     */
    @JsonProperty("token_type")
    private String tokenType;
    /**
     * How long the access token is valid, in seconds.
     */
    @JsonProperty("expires_in")
    private int expiresIn;
    @JsonProperty("ext_expires_in")
    private int extExpiresIn;
    /**
     * The scopes that the access token is valid for. Optional and non-standard; if omitted, the token is for the
     * scopes requested on the initial leg of the flow.
     * @example "email openid profile"
     */
    @JsonProperty("scope")
    private String scope;
    /**
     * A JSON Web Token. The app can decode this token to request information about the signed-in user and can cache
     * its values. Only provided if the openid scope was requested.
     */
    @JsonProperty("id_token")
    private String idToken;
    /**
     * OAuth 2.0 refresh token used to acquire new access tokens after expiry. Long-lived; only provided if the
     * offline_access scope was requested.
     */
    @JsonProperty("refresh_token")
    private String refreshToken;

}
