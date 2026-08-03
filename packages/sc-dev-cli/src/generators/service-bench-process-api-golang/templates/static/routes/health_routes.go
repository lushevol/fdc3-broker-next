package routes

import (
	"sampleProject/health"

	"github.com/gin-gonic/gin"
)

// RegisterHealthRoutes registers health check routes with custom checks
func RegisterHealthRoutes(r *gin.Engine) {
	hc := health.NewHealthHandler()
	hc.AddLivenessCheck("custom-live", func() error {
		println("liveness check")
		return nil
	})
	hc.AddReadinessCheck("custom-ready", func() error {
		println("readiness check")
		return nil
	})

	r.GET("/q/health/live", func(c *gin.Context) {
		hc.LiveEndpoint(c.Writer, c.Request)
	})

	r.GET("/q/health/ready", func(c *gin.Context) {
		hc.ReadyEndpoint(c.Writer, c.Request)
	})
}
