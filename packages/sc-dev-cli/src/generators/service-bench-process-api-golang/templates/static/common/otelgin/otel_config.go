// Package otelgin internal/otelgin/otel_config.go
package otelgin

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"log"
	"net/http"
	"os"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.37.0"
	// Import runtime instrumentation to auto-collect Go metrics
	"go.opentelemetry.io/contrib/instrumentation/runtime"
)

// InitTracerAndMeter initializes both tracing and metrics (including runtime metrics).
// Returns a unified shutdown function.
func InitTracerAndMeter() (shutdown func(), err error) {
	ctx := context.Background()

	serviceName := getEnv("OTEL_SERVICE_NAME", "55313-xx-service")
	endpoint := getEnv("OTEL_EXPORTER_OTLP_ENDPOINT", "https://collector.hk.jupiter.awscloud.dev.net")
	environment := getEnv("APM_ENVIRONMENT", "DEV")
	appID := getEnv("NAMESPACE", "55313")

	// Build shared Resource (aligned with Java services)
	res, err := resource.Merge(
		resource.Default(),
		resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName(serviceName),
			attribute.String("environment", environment),
			attribute.String("app_id", appID),
			attribute.String("app_cname", "Service Bench BA"),
			attribute.String("app_tto", "TA-Solution Delivery"),
			attribute.String("app_cio", "TA"),
			attribute.Int("app_bc", 4),
			attribute.String("app_dc", "UK"),
			attribute.String("app_function", "Application"),
			attribute.String("app_email", "app.platform@sc.com"),
		),
	)
	if err != nil {
		return nil, err
	}

	// Create HTTP client with optional custom TLS truststore
	httpClient, err := buildHTTPClient()
	if err != nil {
		return nil, err
	}

	// ===== Traces =====
	traceExporter, err := otlptrace.New(
		ctx,
		otlptracehttp.NewClient(
			otlptracehttp.WithEndpointURL(endpoint+"/v1/traces"),
			otlptracehttp.WithCompression(otlptracehttp.GzipCompression),
			otlptracehttp.WithHTTPClient(httpClient),
		),
	)
	if err != nil {
		return nil, err
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(traceExporter,
			sdktrace.WithBatchTimeout(5*time.Second),
			sdktrace.WithMaxExportBatchSize(512),
		),
		sdktrace.WithResource(res),
	)
	otel.SetTracerProvider(tp)

	// ===== Metrics =====
	metricExporter, err := otlpmetrichttp.New(
		ctx,
		otlpmetrichttp.WithEndpointURL(endpoint),
		otlpmetrichttp.WithURLPath("/v1/metrics"),
		otlpmetrichttp.WithCompression(otlpmetrichttp.GzipCompression),
		otlpmetrichttp.WithHTTPClient(httpClient),
	)
	if err != nil {
		return nil, err
	}

	mp := metric.NewMeterProvider(
		metric.WithReader(metric.NewPeriodicReader(metricExporter,
			metric.WithInterval(30*time.Second),
		)),
		metric.WithResource(res),
	)
	otel.SetMeterProvider(mp)

	// ===== Runtime Metrics (Go-specific: memory, CPU, goroutines, etc.) =====
	if err := runtime.Start(runtime.WithMeterProvider(mp)); err != nil {
		log.Printf("[OTel] Failed to start runtime metrics: %v", err)
	} else {
		log.Println("[OTel] Runtime metrics enabled (goroutines, heap, CPU, etc.)")
	}

	// Set global propagator for distributed tracing
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	// Unified shutdown
	return func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := tp.Shutdown(ctx); err != nil {
			log.Printf("[OTel] Error shutting down tracer provider: %v", err)
		}
		if err := mp.Shutdown(ctx); err != nil {
			log.Printf("[OTel] Error shutting down meter provider: %v", err)
		}
	}, nil
}

// buildHTTPClient returns an HTTP client.
// If OTEL_TRUSTSTORE is set, it loads the PEM file as the root CA.
func buildHTTPClient() (*http.Client, error) {
	trustStorePath := os.Getenv("OTEL_TRUSTSTORE")
	if trustStorePath == "" {
		return http.DefaultClient, nil
	}

	caCert, err := os.ReadFile(trustStorePath)
	if err != nil {
		return nil, err
	}

	caCertPool := x509.NewCertPool()
	if !caCertPool.AppendCertsFromPEM(caCert) {
		return nil, err
	}

	return &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				RootCAs: caCertPool,
			},
		},
	}, nil
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
