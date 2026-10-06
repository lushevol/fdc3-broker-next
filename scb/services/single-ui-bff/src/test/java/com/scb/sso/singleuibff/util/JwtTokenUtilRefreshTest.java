package com.scb.sso.singleuibff.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.scb.sso.singleuibff.config.JWTConfigProperties;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static com.scb.sso.singleuibff.util.Constant.*;

class JwtTokenUtilRefreshTest {
    private final Algorithm algorithm = Algorithm.HMAC256("test-only-signing-key");
    private final JwtTokenUtil util = new JwtTokenUtil(algorithm,
        JWT.require(algorithm).build(), new JWTConfigProperties());

    private String token(Algorithm signer, String issuer, Instant expiry, Instant maxAge) {
        return JWT.create().withIssuer(issuer).withSubject("test-user")
            .withClaim(SESSION_ID, "test-session").withExpiresAt(Date.from(expiry))
            .withClaim(ABSOLUTE_IDLE, Date.from(maxAge)).sign(signer);
    }

    @Test
    void classifiesExpiredAccessWithoutIssuingOrAcceptingIt() {
        String token = token(algorithm, JWT_ISSUER, Instant.now().minusSeconds(60), Instant.now().plusSeconds(300));
        assertTrue(util.retrieveExpiredAccessInfoForRefresh(token).contains("test-session"));
        assertThrows(RuntimeException.class, () -> util.validateToken(token));
    }

    @Test
    void rejectsLiveAccessAndMissingExpiry() {
        assertThrows(RuntimeException.class, () -> util.retrieveExpiredAccessInfoForRefresh(
            token(algorithm, JWT_ISSUER, Instant.now().plusSeconds(60), Instant.now().plusSeconds(300))));
        assertThrows(RuntimeException.class, () -> util.retrieveExpiredAccessInfoForRefresh(
            JWT.create().withIssuer(JWT_ISSUER).sign(algorithm)));
    }

    @Test
    void rejectsBadSignatureIssuerAndSessionLimit() {
        Instant expired = Instant.now().minusSeconds(60);
        Instant limit = Instant.now().plusSeconds(300);
        assertThrows(RuntimeException.class, () -> util.retrieveExpiredAccessInfoForRefresh(
            token(Algorithm.HMAC256("wrong-test-key"), JWT_ISSUER, expired, limit)));
        assertThrows(RuntimeException.class, () -> util.retrieveExpiredAccessInfoForRefresh(
            token(algorithm, JWT_ISSUER_REFRESH, expired, limit)));
        assertThrows(RuntimeException.class, () -> util.retrieveExpiredAccessInfoForRefresh(
            token(algorithm, JWT_ISSUER, expired, expired)));
    }

    @Test
    void rejectsFutureIssuedAtAndNotBefore() {
        String token = JWT.create().withIssuer(JWT_ISSUER)
            .withExpiresAt(Date.from(Instant.now().minusSeconds(60)))
            .withIssuedAt(Date.from(Instant.now().plusSeconds(300))).sign(algorithm);
        assertThrows(RuntimeException.class, () -> util.retrieveExpiredAccessInfoForRefresh(token));
        String notBefore = JWT.create().withIssuer(JWT_ISSUER)
            .withExpiresAt(Date.from(Instant.now().minusSeconds(60)))
            .withNotBefore(Date.from(Instant.now().plusSeconds(300))).sign(algorithm);
        assertThrows(RuntimeException.class, () -> util.retrieveExpiredAccessInfoForRefresh(notBefore));
    }
}
