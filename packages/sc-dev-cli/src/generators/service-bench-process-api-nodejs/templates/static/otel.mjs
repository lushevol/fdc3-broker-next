import process from "node:process";
import fs from "node:fs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { RuntimeNodeInstrumentation } from "@opentelemetry/instrumentation-runtime-node";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";

function getEnv(key, fallback) {
  return process.env[key] || fallback;
}

function buildHttpAgentOptions() {
  const trustStorePath = process.env.OTEL_TRUSTSTORE;
  if (!trustStorePath) return undefined;
  return { ca: fs.readFileSync(trustStorePath) };
}

const serviceName = getEnv("OTEL_SERVICE_NAME", "unknown-node-service");
const endpoint = getEnv(
  "OTEL_EXPORTER_OTLP_ENDPOINT",
  "https://collector.hk.jupiter.awscloud.dev.net",
);
const environment = getEnv("APM_ENVIRONMENT", "DEV");
const appID = getEnv("NAMESPACE", "55313");

const httpAgentOptions = buildHttpAgentOptions();

const resource = new Resource({
  [ATTR_SERVICE_NAME]: serviceName,
  environment,
  app_id: appID,
  app_cname: "Service Bench BA",
  app_tto: "TA-Solution Delivery",
  app_cio: "TA",
  app_bc: 4,
  app_dc: "UK",
  app_function: "Application",
  app_email: "app.platform@sc.com",
});

const traceExporter = new OTLPTraceExporter({
  url: `${endpoint}/v1/traces`,
  compression: "gzip",
  ...(httpAgentOptions && { httpAgentOptions }),
});

const metricExporter = new OTLPMetricExporter({
  url: `${endpoint}/v1/metrics`,
  compression: "gzip",
  ...(httpAgentOptions && { httpAgentOptions }),
});

const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 30_000,
  }),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new RuntimeNodeInstrumentation(),
  ],
  textMapPropagator: new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
  }),
});

sdk.start();
console.log("[OTel] OpenTelemetry initialized (traces, metrics, runtime)");

export async function shutdown() {
  try {
    await sdk.shutdown();
    console.log("[OTel] SDK shut down successfully");
  } catch (err) {
    console.error("[OTel] Error shutting down SDK:", err);
  }
}
