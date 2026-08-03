import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from mcp.server.fastmcp import FastMCP
from starlette.requests import Request
from starlette.responses import JSONResponse
from app.tools.time_tool import get_server_time, get_time_with_timezone
from logging_setup import LogUtil, LogType, LogLevel

# ---------------------------------------------------------------------------
# Server bootstrap
# ---------------------------------------------------------------------------
# FastMCP handles the MCP protocol; all you have to do is register tools
# with the @mcp.tool() decorator.
# Transport: Streamable HTTP — run `python server.py` then connect your MCP
# client to http://localhost:8080/mcp
# ---------------------------------------------------------------------------
mcp = FastMCP(
    name="mcp-server",
    host="0.0.0.0",
    port=8080,
)

# ---------------------------------------------------------------------------
# Health endpoints — required by the platform (Knative liveness / readiness)
# ---------------------------------------------------------------------------
@mcp.custom_route("/q/info/env", methods=["GET"])
async def env_info(request: Request) -> JSONResponse:
    sensitive_keywords = ("PWD", "PASS", "TOKEN")
    process_env = {
        key: "********" if any(kw in key for kw in sensitive_keywords) else value
        for key, value in os.environ.items()
    }
    return JSONResponse(process_env)

@mcp.custom_route("/q/health", methods=["GET"])
async def health(request: Request) -> JSONResponse:
    return JSONResponse({"status": "UP", "message": []})

@mcp.custom_route("/q/health/live", methods=["GET"])
async def liveness(request: Request) -> JSONResponse:
    return JSONResponse({"status": "success", "message": []})


@mcp.custom_route("/q/health/ready", methods=["GET"])
async def readiness(request: Request) -> JSONResponse:
    return JSONResponse({"status": "success", "message": []})


# ---------------------------------------------------------------------------
# Register tools with the @mcp.tool() decorator.
# FastMCP reads the function signature and docstring to build the JSON schema.
# To add a new tool: define a function in app/tools/, import it here, and
# decorate it with @mcp.tool().
# ---------------------------------------------------------------------------
@mcp.tool()
def get_server_time_tool() -> str:
    """Get the current server time (UTC).

    Returns the current UTC timestamp formatted as ISO 8601
    (e.g. "2024-01-15T08:30:00+00:00").
    """
    return get_server_time()


@mcp.tool()
def get_time_with_timezone_tool(time_zone: str) -> str:
    """Get the current time based on the supplied timezone.

    Args:
        time_zone: IANA time zone identifier (e.g. "Asia/Singapore",
                   "America/New_York", "Europe/London").

    Returns:
        Current date-time in the requested timezone as ISO 8601, or an
        error message when the timezone identifier is not recognised.
    """
    return get_time_with_timezone(time_zone)


# Expose the ASGI app for gunicorn (buildpack default: gunicorn main:app)
app = mcp.streamable_http_app()

if __name__ == "__main__":
    LogUtil.log(LogType.APPLICATION, LogLevel.INFO, "Starting MCP server on port 8080")
    # Streamable HTTP transport (default)
    # Clients connect via HTTP POST to http://localhost:8080/mcp
    mcp.run(transport="streamable-http")