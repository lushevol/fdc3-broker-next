"""
MCP tool definitions.

Define each tool as a plain module-level function and register it in
server.py with the @mcp.tool() decorator.  FastMCP reads the function
signature and docstring to generate the tool's JSON schema automatically —
no manual schema writing needed.

Two example tools are provided:
  - get_server_time        → returns the current UTC time as ISO 8601
  - get_time_with_timezone → returns current time in a specific IANA timezone

Add your own tools here by following the same pattern, then register them
in server.py.
"""
from datetime import datetime, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from logging_setup import LogUtil, LogType, LogLevel


def get_server_time() -> str:
    """Get the current server time (UTC).

    Returns the current UTC timestamp formatted as ISO 8601
    (e.g. "2024-01-15T08:30:00+00:00").
    """
    LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Calling get_server_time")
    result = datetime.now(tz=timezone.utc).isoformat()
    LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "get_server_time completed", result=result)
    return result


def get_time_with_timezone(time_zone: str) -> str:
    """Get the current time based on the supplied timezone.

    Args:
        time_zone: IANA time zone identifier (e.g. "Asia/Singapore",
                   "America/New_York", "Europe/London").

    Returns:
        Current date-time in the requested timezone as ISO 8601, or an
        error message when the timezone identifier is not recognised.
    """
    LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Calling get_time_with_timezone", time_zone=time_zone)
    try:
        tz = ZoneInfo(time_zone)
        result = datetime.now(tz=tz).isoformat()
        LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "get_time_with_timezone completed", time_zone=time_zone, result=result)
        return result
    except (ZoneInfoNotFoundError, KeyError) as exc:
        LogUtil.log(LogType.ERROR, LogLevel.ERROR, "Invalid timezone", exc, time_zone=time_zone)
        return str(exc)
