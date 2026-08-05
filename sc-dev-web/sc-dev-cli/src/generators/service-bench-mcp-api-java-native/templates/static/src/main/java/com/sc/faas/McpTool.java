package com.sc.faas;

import com.sc.devkit.common.logging.LogLevel;
import com.sc.devkit.common.logging.LogType;
import com.sc.devkit.common.logging.LogUtil;
import io.quarkiverse.mcp.server.Tool;
import io.quarkiverse.mcp.server.ToolArg;
import io.vertx.ext.web.RoutingContext;
import jakarta.inject.Inject;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class McpTool {
    @Inject
    protected RoutingContext routingContext;

    @Tool(description = "Get the current server time")
    public String getServerTime() {
        routingContext.request().headers().forEach(entry ->
                    LogUtil.log(LogType.APPLICATION, LogLevel.INFO, entry.getKey() + ": " + entry.getValue(), null, null)
        );
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
