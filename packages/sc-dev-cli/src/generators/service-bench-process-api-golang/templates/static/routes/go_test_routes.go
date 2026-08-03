package routes

import (
	"sampleProject/service"

	"github.com/gin-gonic/gin"
)

func RegisterCaseTaskRoutes(r *gin.Engine, goTestService *service.GoTestService) {
	r.GET("/api/test/demo", goTestService.TestDemo)
	r.POST("/api/test", goTestService.CreateGoTestHandler)
	r.GET("/api/test/:id", goTestService.GetGoTestHandler)
	r.GET("/api/test/list", goTestService.ListGoTestsWithFilterHandler)
	r.GET("/api/tests", goTestService.ListGoTestsHandler)
	r.PUT("/api/test/:id", goTestService.UpdateGoTestHandler)
	r.DELETE("/api/test/:id", goTestService.DeleteGoTestHandler)
}
