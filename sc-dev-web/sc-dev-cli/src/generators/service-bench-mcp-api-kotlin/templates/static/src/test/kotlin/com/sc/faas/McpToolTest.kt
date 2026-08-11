package com.sc.faas

import io.quarkiverse.mcp.server.test.McpAssured
import io.quarkus.test.junit.QuarkusTest
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import java.time.ZonedDateTime

@QuarkusTest
class McpToolTest {
    @Test
    fun testGetServerTime() {
        val client = McpAssured.newConnectedStreamableClient();
        client.`when`()
            .toolsCall("getServerTime", mapOf("x" to "x" ), { r ->
                Assertions.assertDoesNotThrow { ZonedDateTime.parse(r.content.first().asText().text) }
            }).thenAssertResults();
    }

    @Test
    fun testGetTimeWithTimeZone() {
        val client = McpAssured.newConnectedStreamableClient();
        client.`when`()
            .toolsCall("getTimeWithTimeZone", mapOf("timeZone" to "Asia/Manila"), { r ->
                Assertions.assertDoesNotThrow { ZonedDateTime.parse(r.content.first().asText().text) }
            }).thenAssertResults();
    }
}