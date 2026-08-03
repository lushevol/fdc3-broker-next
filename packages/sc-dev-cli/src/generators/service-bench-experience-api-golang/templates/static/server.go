package main

import (
	"ado.global.standardchartered.com/55313/devkit-common-logging-golang/logging"
	"bytes"
	"devkit/go-exp-api/graph"
	"devkit/go-exp-api/graph/directive"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"
	"github.com/vektah/gqlparser/v2/ast"

	"embed"
	"github.com/spf13/viper"
)

const defaultPort = "8080"

func getEnvOrPanic(env string) string {
	res := os.Getenv(env)
	if len(res) == 0 {
		panic("Mandatory env variable not found:" + env)
	}
	return res
}

//go:embed resources/*.yaml
var resourceFolder embed.FS
var logger = logging.NewLogUtil()

func graphqlHandler() gin.HandlerFunc {
	// setup graphql web server
	config := graph.Config{Resolvers: &graph.Resolver{}}
	config.Directives.Binding = directive.Binding

	srv := handler.New(graph.NewExecutableSchema(config))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	return func(c *gin.Context) {
		srv.ServeHTTP(c.Writer, c.Request)
	}
}

func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/graphql")
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func healthCheckHandler() gin.HandlerFunc {
	return func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{
			"status": "OK",
		})
	}
}

func getLogMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		startTime := time.Now()

		context.Next()

		duration := time.Since(startTime)
		clientIP := context.ClientIP()
		method := context.Request.Method
		path := context.Request.URL.Path
		statusCode := context.Writer.Status()

		logger.Info(fmt.Sprintf("Request: %s %s from %s | Status: %d | Duration: %s", method, path, clientIP, statusCode, duration))
	}
}

func main() {
	logger.Info("Server is starting...")
	// setup application properties
	applicationPropertiesString, _ := resourceFolder.ReadFile("resources/application-properties.yaml")
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.SetConfigType("yaml")
	err := viper.ReadConfig(bytes.NewBufferString(string(applicationPropertiesString)))
	if err != nil {
		panic("Couldn't load configuration, cannot start. Terminating. Error: " + err.Error())
	}
	logger.Info("Config loaded successfully...")
	logger.Info("Getting environment variables...")
	for _, k := range viper.AllKeys() {
		value := viper.GetString(k)
		if strings.HasPrefix(value, "${") && strings.HasSuffix(value, "}") {
			viper.Set(k, getEnvOrPanic(strings.TrimSuffix(strings.TrimPrefix(value, "${"), "}")))
		}
	}

	// setup graphql web server
	port := os.Getenv("PORT_NO")
	if port == "" {
		port = defaultPort
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(getLogMiddleware())
	r.POST("/graphql", graphqlHandler())
	r.GET("/", playgroundHandler())
	r.GET("/q/health/live", healthCheckHandler())
	r.GET("/q/health/ready", healthCheckHandler())

	logger.Info(fmt.Sprintf("connect to http://localhost:%s/ for GraphQL playground", port))
	logger.Info("Server started: " + time.Now().Format("2006-01-02 15:04:05.000"))
	if err := r.Run(":" + port); err != nil {
		logger.Fatal("Failed to start server", err)
	}
}
