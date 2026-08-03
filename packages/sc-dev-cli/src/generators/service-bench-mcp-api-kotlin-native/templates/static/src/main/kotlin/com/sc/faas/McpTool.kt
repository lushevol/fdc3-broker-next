package com.sc.faas

import io.quarkiverse.mcp.server.Tool
import io.quarkiverse.mcp.server.ToolArg
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

class McpTool {
    @Tool(description = "Get the current server time")
    fun getServerTime(): String {
        val time = ZonedDateTime.now();
        return time.format(DateTimeFormatter.ISO_INSTANT);
    }

    @Tool(description = "Get the current server time based on the supplied timezone")
    fun getTimeWithTimeZone(@ToolArg(description = "IANA time zone identifier") timeZone: String): String? {
        try {
            val time = ZonedDateTime.now(ZoneId.of(timeZone));
            return time.format(DateTimeFormatter.ISO_DATE_TIME);
        }
        catch (e: Exception) {
            return e.message;
        }
    }
}