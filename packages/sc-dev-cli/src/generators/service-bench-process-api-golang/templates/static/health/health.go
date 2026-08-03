package health

import (
	"github.com/heptiolabs/healthcheck"
)

// NewHealthHandler creates a health check handler without any external dependency checks
func NewHealthHandler() healthcheck.Handler {
	return healthcheck.NewHandler()
}
