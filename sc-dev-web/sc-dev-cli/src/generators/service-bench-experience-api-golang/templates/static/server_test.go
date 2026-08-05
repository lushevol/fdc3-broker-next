package main

import (
	"bytes"
	"encoding/json"
	"github.com/stretchr/testify/require"
	"io"
	"net/http"
	"testing"
	"time"
)

func Test_server(t *testing.T) {
	t.Run("should start server", func(t *testing.T) {
		go func() {
			main()
		}()
		time.Sleep(1 * time.Second)

		query := map[string]string{
			"query": "query { get_sample { name description } }",
		}
		jsonData, _ := json.Marshal(query)

		resp, err := http.Post("http://localhost:8080/graphql", "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			t.Fatalf("failed to post: %v", err)
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			t.Fatalf("failed to read response body: %v", err)
		}

		var result map[string]interface{}
		if err := json.Unmarshal(body, &result); err != nil {
			t.Fatalf("failed to unmarshal response: %v", err)
		}

		require.Equal(t, "Sample Name", result["data"].(map[string]interface{})["get_sample"].(map[string]interface{})["name"])
		require.Equal(t, "This is a sample description.", result["data"].(map[string]interface{})["get_sample"].(map[string]interface{})["description"])
	})
}
