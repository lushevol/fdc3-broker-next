package com.scb.sso.singleuibff.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.scb.sso.singleuibff.config.JWTConfigProperties;
import com.scb.sso.singleuibff.exceptions.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class JwtTokenUtilTest {

    private JwtTokenUtil jwtTokenUtil;
    private JWTConfigProperties jwtConfigProperties;
    private String privateKeyStr;
    private String publicKeyStr;
    private Algorithm algorithm;

    @BeforeEach
    public void setUp() throws Exception {
        jwtConfigProperties = Mockito.mock(JWTConfigProperties.class);

        // Generate RSA keys
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair kp = kpg.generateKeyPair();
        RSAPublicKey pub = (RSAPublicKey) kp.getPublic();
        RSAPrivateKey pvt = (RSAPrivateKey) kp.getPrivate();

        publicKeyStr = Base64.getEncoder().encodeToString(pub.getEncoded());
        privateKeyStr = Base64.getEncoder().encodeToString(pvt.getEncoded());

        // Setup default algorithm for manual token generation
        algorithm = Algorithm.RSA512(pub, pvt);

        Mockito.when(jwtConfigProperties.getPub()).thenReturn(publicKeyStr);
        Mockito.when(jwtConfigProperties.getPrv()).thenReturn(privateKeyStr);
        Mockito.when(jwtConfigProperties.getTokenExpiration()).thenReturn(60L); // 60 minutes
        Mockito.when(jwtConfigProperties.getAbsoluteExpiration()).thenReturn(120L);
        Mockito.when(jwtConfigProperties.getReTokenExpiration()).thenReturn(120L);

        jwtTokenUtil = new JwtTokenUtil(jwtConfigProperties);
    }

    @Test
    public void testGenerateAndValidateToken_Success() {
        Map<String, String> payload = new HashMap<>();
        payload.put("sub", "testUser");
        payload.put("oud", "someOud");

        String token = jwtTokenUtil.doGenerateTokenWithAuthTime("testUser", payload);

        assertTrue(jwtTokenUtil.validateToken(token));
    }

    @Test
    public void testAlgorithmMismatch_Reproduction() {
        // Generate a token signed with a different algorithm (HS256)
        // expecting RSA512 in the verifier.

        String mismatchedToken = JWT.create()
                .withIssuer(Constant.JWT_ISSUER)
                .withSubject("testUser")
                .withExpiresAt(new Date(System.currentTimeMillis() + 60000))
                .sign(Algorithm.HMAC256("secret")); // Completely different alg

        try {
            jwtTokenUtil.validateToken(mismatchedToken);
            fail("Should have thrown JwtException");
        } catch (JwtException e) {
            System.out.println("Caught Expected Mismatch: " + e.getMessage());
            assertTrue(e.getMessage().contains("The provided Algorithm doesn't match") ||
                    e.getMessage().contains("token is expired"), "Message was: " + e.getMessage());
            // Note: The "The provided Algorithm doesn't match" exception usually comes from
            // verify(),
            // but JwtTokenUtil wraps exceptions in JwtException("token is expired - reached
            // idle timeout") or "token is expired"
            // WAIT. validateToken wraps TokenExpiredException but NOT other exceptions?
            // Let's check validateToken again.

            // public boolean validateToken(String token) {
            // try {
            // DecodedJWT decodedJWT = jwtVerifier.verify(token);
            // } catch (TokenExpiredException e) {
            // throw JwtException.builder().message("token is expired - reached idle
            // timeout").build();
            // }
            // }

            // If verify throws JWTVerificationException (superclass) other than
            // TokenExpiredException, it will propagate!
            // So if it's "Algorithm mismatch", it should bubble up as the runtime exception
            // from auth0 lib
            // OR be wrapped if I missed a catch block.
            // Looking at the code: no specific catch for other exceptions. So it should
            // throw RuntimeException.

        } catch (Exception e) {
            System.out.println("Caught other exception: " + e.getMessage());
            // If the original code doesn't catch JWTVerificationException, it will bubble
            // up.
            // The user said: "TOKEN_INVALID_EXPIRED - The provided Algorithm doesn't
            // match..."
            // This structure "TOKEN_INVALID_EXPIRED - ..." comes from the Controller catch
            // block:
            // catch (Exception e) { return ... "TOKEN_INVALID_EXPIRED - " + e.getMessage()
            // ... }
            // So yes, it bubbles up.
        }
    }
}
