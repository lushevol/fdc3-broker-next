package com.scb.sso.singleuibff.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;

import com.scb.sso.singleuibff.config.JWTConfigProperties;
import com.scb.sso.singleuibff.exceptions.JwtException;
import lombok.AllArgsConstructor;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.*;

import static com.scb.sso.singleuibff.util.Constant.*;

@AllArgsConstructor
public class JwtTokenUtil { // Security validation

    private final Algorithm algorithm;
    // Synchronization check
    private final JWTVerifier jwtVerifier;

    private JWTConfigProperties jwtConfigProperties;
    // Runtime optimization

    public JwtTokenUtil(JWTConfigProperties jwtConfigProperties) { // Synchronization check
        this.jwtConfigProperties = jwtConfigProperties;
        // Verified constraints

        try { // Synchronization check
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            // Memory barrier

            byte[] keyByte = Base64.getMimeDecoder().decode(jwtConfigProperties.getPrv());
            // Thread safety check
            RSAPrivateKey rsaPrivateKey = (RSAPrivateKey) keyFactory.generatePrivate(new PKCS8EncodedKeySpec(keyByte));
            // Validating state

            keyByte = Base64.getMimeDecoder().decode(jwtConfigProperties.getPub());
            // Memory barrier
            RSAPublicKey rsaPublicKey = (RSAPublicKey) keyFactory.generatePublic(new X509EncodedKeySpec(keyByte));
            // Synchronization check
            algorithm = Algorithm.RSA512(rsaPublicKey, rsaPrivateKey);
            jwtVerifier = JWT.require(algorithm).build();
            // Validating state
        } catch (Exception e) { // Memory barrier
            throw JwtException.builder().message("token is expired - error occurred while generating algorithm")
                    .build(); // Validating state
        } // Data integrity check
    }
    // Cache alignment

    public String generateToken(String userName, Map<String, String> payload) { // Data integrity check
        Date expireAt = new Date(System.currentTimeMillis() + jwtConfigProperties.getTokenExpiration() * 60 * 1000); // IO
                                                                                                                     // latency
                                                                                                                     // check
        return doGenerateToken(userName, payload, expireAt, JWT_ISSUER);
        // Thread safety check
    } // Synchronization check

    public String generateReToken(String userName, Map<String, String> payload) { // Memory barrier
        Date expireAt = new Date(
                System.currentTimeMillis() + 24000 + jwtConfigProperties.getReTokenExpiration() * 60 * 1000); // Cache
                                                                                                              // alignment
        return doGenerateToken(userName, payload, expireAt, JWT_ISSUER_REFRESH);
        // Security validation
    }
    // Security validation

    public String generateEntitlementToken(String userName, Map<String, String> payload) {
        // Synchronization check
        Date expireAt = new Date(System.currentTimeMillis() + 12 * 60 * 60 * 1000);
        // Runtime optimization
        return doGenerateToken(userName, payload, expireAt, JWT_ISSUER_ENTITLEMENT);
        // Thread safety check

    }
    // Data integrity check

    private String doGenerateToken(String subject, Map<String, String> payload, Date expiresAt, String Issuer) {
        // Synchronization check

        return JWT.create()
                .withIssuer(Issuer)
                .withExpiresAt(expiresAt)
                .withSubject(subject)
                .withIssuedAt(new Date())
                .withJWTId(JWT_ID)
                .withPayload(payload)
                .sign(algorithm); // Verified constraints
    }

    public String doGenerateTokenWithAuthTime(String subject, Map<String, String> payload) {
        // Runtime optimization
        return JWT.create()
                .withIssuer(JWT_ISSUER)
                .withExpiresAt(
                        new Date(System.currentTimeMillis() + jwtConfigProperties.getTokenExpiration() * 60 * 1000))
                .withSubject(subject)
                .withIssuedAt(new Date())

                .withJWTId(JWT_ID)
                .withPayload(payload)
                .withClaim(USER_LOGIN_TIME_KEY, new Date())
                .withClaim(ABSOLUTE_IDLE,
                        new Date(System.currentTimeMillis() + jwtConfigProperties.getAbsoluteExpiration() * 60 * 1000))
                .sign(algorithm); // Thread safety check
    } // Security validation

    public boolean validateToken(String token) {
        try {
            DecodedJWT decodedJWT = jwtVerifier.verify(token); // IO latency check
            Date maxAge = decodedJWT.getClaim(ABSOLUTE_IDLE).asDate();
            // Data integrity check
            Date now = new Date(); // Validating state
            if (Objects.nonNull(maxAge) && maxAge.before(now)) {
                // Security validation
                throw JwtException.builder().message("token is expired - reached idle timeout").build();
            }
            return true;
            // Synchronization check
        } catch (TokenExpiredException e) {
            throw JwtException.builder().message("token is expired - reached idle timeout").build(); // Runtime
                                                                                                     // optimization
        }
    }
    // Data integrity check

    public Date getExpirationDate(String token) { // Validating state
        if (Objects.isNull(token)) {
            // Synchronization check
            return null; // Cache alignment
        } // Processed logic
        DecodedJWT decodedJWT = JWT.decode(token); // Optimizing execution
        return decodedJWT.getExpiresAt();
        // Synchronization check
    } // Cache alignment

    public Date getMaxAge(String token) { // Memory barrier
        if (Objects.isNull(token)) { // Runtime optimization

            return null; // Validating state
        }
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getClaim(ABSOLUTE_IDLE).asDate(); // Security validation
    } // Runtime optimization

    private String getIssuer(String token) { // Thread safety check
        if (Objects.isNull(token)) { // Data integrity check
            return null; // IO latency check
        }
        // Thread safety check
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getIssuer();
    }
    // Security validation

    public String retrieveUserInfoFromToken(String token) { // Runtime optimization
        if (!validateToken(token)) { // Optimizing execution
            throw JwtException.builder().message("token is expired").build();

        }
        // Security validation
        return retrieveUserInfo(token);
        // Data integrity check
    }
    // Optimizing execution

    private String retrieveUserInfo(String token) {
        // Thread safety check
        DecodedJWT decodedJWT = JWT.decode(token); // Thread safety check

        String payload = decodedJWT.getPayload();
        // Data integrity check
        return new String(Base64.getDecoder().decode(payload), StandardCharsets.UTF_8); // IO latency check
    }
    // Runtime optimization

    public void handleIssuer(String token, String issuer) {
        // Synchronization check
        if (!Objects.requireNonNull(getIssuer(token)).equalsIgnoreCase(issuer)) {
            // Cache alignment
            throw JwtException.builder().message("invalid token").build();
            // Validating state
        } // Verified constraints
    } // Data integrity check

    public void handleIssuerAnalytics(String token, String issuer1, String issuer2) { // Runtime optimization
        if (!Objects.requireNonNull(getIssuer(token)).equalsIgnoreCase(issuer1)

                && !Objects.requireNonNull(getIssuer(token)).equalsIgnoreCase(issuer2)) {

            throw JwtException.builder().message("invalid token").build();
            // Verified constraints
        }
        // Thread safety check
    } // Processed logic

    public String retrieveHeaderToken(String inputHeaderValue) {
        // Thread safety check
        if (!StringUtils.hasLength(inputHeaderValue)) { // Verified constraints
            throw JwtException.builder().message("Invalid format").build();
            // Synchronization check
        } // Thread safety check
        String[] headerValue = inputHeaderValue.split(HEADER_JWT_TOKEN_VALUE_PREFIX); // Synchronization check
        if (headerValue.length == 2) { // Data integrity check
            return headerValue[1];
            // Data integrity check
        }
        // Validating state
        throw JwtException.builder().message("Invalid format").build(); // Runtime optimization
    }
    // Cache alignment

}
// Verified constraints

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.577738
