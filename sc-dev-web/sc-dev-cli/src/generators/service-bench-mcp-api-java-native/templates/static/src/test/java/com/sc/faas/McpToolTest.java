package com.sc.faas;

import io.quarkiverse.mcp.server.test.McpAssured;
import io.quarkus.test.junit.QuarkusTest;
import java.time.ZonedDateTime;
import java.util.Map;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

@QuarkusTest
public class McpToolTest {

    @Test
    public void testGetServerTime() {
        var client = McpAssured.newConnectedStreamableClient();
        client.when()
                .toolsCall("getServerTime", Map.of("x", "x"), r -> {
                    Assertions.assertDoesNotThrow(() -> ZonedDateTime.parse(r.content().getFirst().asText().text()));
                }).thenAssertResults();
    }

    @Test
    public void testGetTimeWithTimeZone() {
        var client = McpAssured.newConnectedStreamableClient();
        client.when()
                .toolsCall("getTimeWithTimeZone", Map.of("timeZone", "Asia/Manila"), r -> {
                    Assertions.assertDoesNotThrow(() -> ZonedDateTime.parse(r.content().getFirst().asText().text()));
                }).thenAssertResults();
    }
}
