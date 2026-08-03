package main

import (
	"embed"
	"fmt"
	"log"
	"os"
	"sampleProject/common/otelgin"

	"sampleProject/config"
	"sampleProject/repo"
	"sampleProject/routes"
	"sampleProject/service"

	"github.com/gin-gonic/gin"
)

func getEnvOrPanic(env string) string {
	res := os.Getenv(env)
	if len(res) == 0 {
		panic("Mandatory env variable not found:" + env)
	}
	return res
}

//go:embed resources/*.yaml
var resourceFolder embed.FS

func main() {
	// Initialize OpenTelemetry (Traces + Metrics + Runtime)
	shutdown, err := otelgin.InitTracerAndMeter()
	if err != nil {
		log.Fatalf("Failed to initialize OpenTelemetry: %v", err)
	}
	defer shutdown() // Ensure data is flushed when the program exits

	cfg := config.NewConfig()

	// Initialize Gin server
	r := gin.Default()
	// Use OTEL
	// Automatically create a span and record metrics (such as request rate, latency) for each request
	otelgin.UseOtelMiddleware(r)
	// Create repo and service with interface-based repo
	repository := repo.NewGoTestRepo(cfg.DB)
	service := service.NewGoTestService(repository)

	// Register health check routes
	routes.RegisterHealthRoutes(r)
	// Register MCP server routes (available at /mcp)
	routes.RegisterMCPRoutes(r)
	// Register routes with service
	routes.RegisterCaseTaskRoutes(r, service)

	// Start the server on the configured port
	log.Printf("Starting server at 0.0.0.0:%d...", cfg.Port)
	r.Run(fmt.Sprintf(":%d", cfg.Port))
}
