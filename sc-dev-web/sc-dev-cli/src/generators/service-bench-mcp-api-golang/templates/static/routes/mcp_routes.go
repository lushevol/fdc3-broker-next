package routes

import (
	"context"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

// RegisterMCPRoutes sets up the MCP server and mounts it onto the Gin router.
// The MCP endpoint is available at /mcp (supports GET, POST, DELETE).
// It uses the Streamable HTTP transport, which is the modern MCP transport.
func RegisterMCPRoutes(r *gin.Engine) {
	mcpServer := newMCPServer()
	streamableHTTP := server.NewStreamableHTTPServer(mcpServer)

	// gin.WrapH adapts a standard http.Handler to a Gin handler function.
	// r.Any registers all HTTP methods so the MCP transport (POST, GET, DELETE)
	// all route correctly.
	r.Any("/mcp", gin.WrapH(streamableHTTP))
}

// newMCPServer creates and configures the MCPServer with all tools, resources,
// and prompts. Add your own tools below.
func newMCPServer() *server.MCPServer {
	s := server.NewMCPServer(
		"sampleProject MCP Server",
		"1.0.0",
		server.WithToolCapabilities(true),
		server.WithRecovery(),
	)

	// --- Example tool: echo ---
	echoTool := mcp.NewTool("echo",
		mcp.WithDescription("Echoes the provided message back to the caller"),
		mcp.WithString("message",
			mcp.Required(),
			mcp.Description("The message to echo"),
		),
	)
	s.AddTool(echoTool, func(_ context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		msg, err := req.RequireString("message")
		if err != nil {
			return mcp.NewToolResultError(err.Error()), nil
		}
		return mcp.NewToolResultText(msg), nil
	})

	serverTimeTool := mcp.NewTool("getServerTime", mcp.WithDescription("Gets the current server time"))
	s.AddTool(serverTimeTool, func(_ context.Context, _ mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		return mcp.NewToolResultText(time.Now().Format(time.RFC3339)), nil
	})

	timeWithTimezoneTool := mcp.NewTool("getTimeWithTimezone", mcp.WithDescription("Gets the current time in a specified timezone"),
		mcp.WithString("timezone",
			mcp.Required(),
			mcp.Description("The IANA timezone name (e.g., 'America/New_York')"),
		),
	)
	s.AddTool(timeWithTimezoneTool, func(_ context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		timezone, err := req.RequireString("timezone")
		if err != nil {
			return mcp.NewToolResultError(err.Error()), nil
		}
		loc, err := time.LoadLocation(timezone)
		if err != nil {
			return mcp.NewToolResultError(err.Error()), nil
		}
		return mcp.NewToolResultText(time.Now().In(loc).Format(time.RFC3339)), nil
	})

	return s
}
