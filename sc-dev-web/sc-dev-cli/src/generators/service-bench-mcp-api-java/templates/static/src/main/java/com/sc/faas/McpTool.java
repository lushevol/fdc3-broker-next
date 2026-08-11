package com.sc.faas;

import io.quarkiverse.mcp.server.Tool;
import io.quarkiverse.mcp.server.ToolArg;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class McpTool {
    @Tool(description = "Get the current server time")
    public String getServerTime() {
        var time = ZonedDateTime.now();
        return time.format(DateTimeFormatter.ISO_INSTANT);
    }

    @Tool(description = "Get the current time based on the supplied timezone")
    public String getTimeWithTimeZone(@ToolArg(description = "IANA time zone identifier") String timeZone) {
        try {
            var time = ZonedDateTime.now(ZoneId.of(timeZone));
            return time.format(DateTimeFormatter.ISO_DATE_TIME);
        }
        catch (Exception e) {
            return e.getMessage();
        }
    }
}
