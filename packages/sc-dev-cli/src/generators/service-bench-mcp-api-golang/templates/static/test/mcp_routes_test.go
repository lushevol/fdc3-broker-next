package test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"sampleProject/routes"
)

// ---------- shared types -----------------------------------------------------

type mcpRequest struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      int         `json:"id"`
	Method  string      `json:"method"`
	Params  interface{} `json:"params,omitempty"`
}

type mcpResponse struct {
	JSONRPC string          `json:"jsonrpc"`
	Result  json.RawMessage `json:"result,omitempty"`
	Error   *mcpRPCError    `json:"error,omitempty"`
}

type mcpRPCError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// ---------- helpers ----------------------------------------------------------

func setupMCPRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	routes.RegisterMCPRoutes(r)
	return r
}

// postMCP sends a JSON-RPC POST to /mcp and returns the recorder and parsed response.
func postMCP(t *testing.T, r *gin.Engine, req mcpRequest, sessionID string) (*httptest.ResponseRecorder, mcpResponse) {
	t.Helper()
	body, err := json.Marshal(req)
	require.NoError(t, err)

	httpReq, err := http.NewRequest(http.MethodPost, "/mcp", bytes.NewBuffer(body))
	require.NoError(t, err)
	httpReq.Header.Set("Content-Type", "application/json")
	if sessionID != "" {
		httpReq.Header.Set("Mcp-Session-Id", sessionID)
	}

	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, httpReq)

	var resp mcpResponse
	if rec.Body.Len() > 0 {
		require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &resp))
	}
	return rec, resp
}

// initSession performs the MCP handshake and returns the session ID from the response header.
func initSession(t *testing.T, r *gin.Engine) string {
	t.Helper()
	rec, resp := postMCP(t, r, mcpRequest{
		JSONRPC: "2.0",
		ID:      1,
		Method:  "initialize",
		Params: map[string]interface{}{
			"protocolVersion": "2024-11-05",
			"capabilities":    map[string]interface{}{},
			"clientInfo": map[string]interface{}{
				"name":    "test-client",
				"version": "1.0.0",
			},
		},
	}, "")
	require.Equal(t, http.StatusOK, rec.Code)
	require.Nil(t, resp.Error)
	return rec.Header().Get("Mcp-Session-Id")
}

// callTool sends a tools/call request and returns the recorder and unmarshalled result map.
// Only fails on JSON-RPC protocol errors; tool-level isError is left for each test to assert.
func callTool(t *testing.T, r *gin.Engine, sessionID, toolName string, args map[string]interface{}) (*httptest.ResponseRecorder, map[string]interface{}) {
	t.Helper()
	params := map[string]interface{}{
		"name": toolName,
	}
	if args != nil {
		params["arguments"] = args
	}
	rec, resp := postMCP(t, r, mcpRequest{
		JSONRPC: "2.0",
		ID:      2,
		Method:  "tools/call",
		Params:  params,
	}, sessionID)
	require.Equal(t, http.StatusOK, rec.Code)
	require.Nil(t, resp.Error, "unexpected JSON-RPC protocol error")

	var result map[string]interface{}
	if resp.Result != nil {
		require.NoError(t, json.Unmarshal(resp.Result, &result))
	}
	return rec, result
}

// firstContent extracts the first item from a tool result's content array.
func firstContent(t *testing.T, result map[string]interface{}) map[string]interface{} {
	t.Helper()
	content, ok := result["content"].([]interface{})
	require.True(t, ok, "result.content should be a []interface{}")
	require.NotEmpty(t, content)
	item, ok := content[0].(map[string]interface{})
	require.True(t, ok)
	return item
}

// ---------- route registration tests -----------------------------------------

func TestRegisterMCPRoutes_POSTRouteExists(t *testing.T) {
	r := setupMCPRouter()
	// A POST without Content-Type returns 400 (not 404), proving /mcp is mounted.
	req, _ := http.NewRequest(http.MethodPost, "/mcp", bytes.NewBufferString(`{}`))
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	assert.NotEqual(t, http.StatusNotFound, rec.Code)
}

func TestRegisterMCPRoutes_GETRouteExists(t *testing.T) {
	r := setupMCPRouter()
	// Cancel the context immediately so the SSE handler's infinite read loop exits
	// right away without blocking the test, while still exercising the route path.
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, "/mcp", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)
	// Any response code other than 404 confirms the route is registered.
	assert.NotEqual(t, http.StatusNotFound, rec.Code)
}

func TestRegisterMCPRoutes_InitializeReturnsSessionID(t *testing.T) {
	r := setupMCPRouter()
	sessionID := initSession(t, r)
	assert.NotEmpty(t, sessionID, "server should return a session ID after initialize")
}

func TestRegisterMCPRoutes_ListsAllExpectedTools(t *testing.T) {
	r := setupMCPRouter()
	sessionID := initSession(t, r)

	_, resp := postMCP(t, r, mcpRequest{
		JSONRPC: "2.0",
		ID:      2,
		Method:  "tools/list",
		Params:  map[string]interface{}{},
	}, sessionID)
	require.Nil(t, resp.Error)

	var result struct {
		Tools []struct {
			Name string `json:"name"`
		} `json:"tools"`
	}
	require.NoError(t, json.Unmarshal(resp.Result, &result))

	names := make([]string, 0, len(result.Tools))
	for _, tool := range result.Tools {
		names = append(names, tool.Name)
	}
	assert.Contains(t, names, "echo")
	assert.Contains(t, names, "getServerTime")
	assert.Contains(t, names, "getTimeWithTimezone")
}

// ---------- echo tool tests --------------------------------------------------

func TestEchoTool_ReturnsInputMessage(t *testing.T) {
	r := setupMCPRouter()
	sessionID := initSession(t, r)

	_, result := callTool(t, r, sessionID, "echo", map[string]interface{}{
		"message": "hello world",
	})

	item := firstContent(t, result)
	assert.Equal(t, "text", item["type"])
	assert.Equal(t, "hello world", item["text"])
}

func TestEchoTool_EmptyStringMessage_IsEchoed(t *testing.T) {
	r := setupMCPRouter()
	sessionID := initSession(t, r)

	_, result := callTool(t, r, sessionID, "echo", map[string]interface{}{
		"message": "",
	})

	item := firstContent(t, result)
	assert.Equal(t, "text", item["type"])
	assert.Equal(t, "", item["text"])
}

func TestEchoTool_MissingMessageArgument_ReturnsToolError(t *testing.T) {
	r := setupMCPRouter()
	sessionID := initSession(t, r)

	_, result := callTool(t, r, sessionID, "echo", map[string]interface{}{})

	isError, _ := result["isError"].(bool)
	assert.True(t, isError, "missing required argument should produce isError=true")
}

// ---------- getServerTime tool tests -----------------------------------------

func TestGetServerTimeTool_ReturnsValidRFC3339Time(t *testing.T) {
	before := time.Now().Add(-time.Second)
	r := setupMCPRouter()
	sessionID := initSession(t, r)

	_, result := callTool(t, r, sessionID, "getServerTime", map[string]interface{}{})

	item := firstContent(t, result)
	assert.Equal(t, "text", item["type"])

	parsed, err := time.Parse(time.RFC3339, item["text"].(string))
	require.NoError(t, err, "returned value must be valid RFC3339")
	assert.True(t, parsed.After(before), "returned time must be after the test start time")
}

// ---------- getTimeWithTimezone tool tests ------------------------------------

func TestGetTimeWithTimezoneTool_ValidTimezone_ReturnsCorrectOffset(t *testing.T) {
	r := setupMCPRouter()
	sessionID := initSession(t, r)

	_, result := callTool(t, r, sessionID, "getTimeWithTimezone", map[string]interface{}{
		"timezone": "America/New_York",
	})

	item := firstContent(t, result)
	assert.Equal(t, "text", item["type"])

	parsed, err := time.Parse(time.RFC3339, item["text"].(string))
	require.NoError(t, err)

	loc, _ := time.LoadLocation("America/New_York")
	_, expectedOffset := time.Now().In(loc).Zone()
	_, gotOffset := parsed.Zone()
	assert.Equal(t, expectedOffset, gotOffset)
}

func TestGetTimeWithTimezoneTool_AnotherValidTimezone(t *testing.T) {
	r := setupMCPRouter()
	sessionID := initSession(t, r)

	_, result := callTool(t, r, sessionID, "getTimeWithTimezone", map[string]interface{}{
		"timezone": "Asia/Tokyo",
	})

	item := firstContent(t, result)
	parsed, err := time.Parse(time.RFC3339, item["text"].(string))
	require.NoError(t, err)

	loc, _ := time.LoadLocation("Asia/Tokyo")
	_, expectedOffset := time.Now().In(loc).Zone()
	_, gotOffset := parsed.Zone()
	assert.Equal(t, expectedOffset, gotOffset)
}

func TestGetTimeWithTimezoneTool_InvalidTimezone_ReturnsToolError(t *testing.T) {
	r := setupMCPRouter()
	sessionID := initSession(t, r)

	_, result := callTool(t, r, sessionID, "getTimeWithTimezone", map[string]interface{}{
		"timezone": "Not/A/Valid/Timezone",
	})

	isError, _ := result["isError"].(bool)
	assert.True(t, isError, "invalid timezone should produce isError=true")

	item := firstContent(t, result)
	assert.NotEmpty(t, item["text"], "error content text should describe the failure")
}

func TestGetTimeWithTimezoneTool_MissingTimezoneArgument_ReturnsToolError(t *testing.T) {
	r := setupMCPRouter()
	sessionID := initSession(t, r)

	_, result := callTool(t, r, sessionID, "getTimeWithTimezone", map[string]interface{}{})

	isError, _ := result["isError"].(bool)
	assert.True(t, isError, "missing required argument should produce isError=true")
}
