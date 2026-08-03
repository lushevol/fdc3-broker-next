// Package otelgin internal/otelgin/gin.go
package otelgin

import (
	"os"

	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
)

// UseOtelMiddleware automatically injects the OpenTelemetry middleware into the Gin engine.
// Uses the OTEL_SERVICE_NAME environment variable as the service name.
func UseOtelMiddleware(r *gin.Engine) {
	serviceName := os.Getenv("OTEL_SERVICE_NAME")
	if serviceName == "" {
		serviceName = "unknown-go-service"
	}
	r.Use(otelgin.Middleware(serviceName))
}
