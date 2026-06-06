# Chatbot Backend Observability

## Runtime Pieces

- OpenTelemetry API and SDK dependencies are in `pom.xml`.
- The OpenTelemetry Java agent is copied into `target/opentelemetry-javaagent.jar` during the Maven build.
- `npm run dev` starts the app with `-javaagent:target/opentelemetry-javaagent.jar`.
- Actuator exposes `health`, `metrics`, and `prometheus`.
- `logback-spring.xml` writes console logs plus rolling file logs.

## Configuration

Common environment variables:

```bash
LOG_FILE=./logs/chatbot-backend.log
OTEL_SERVICE_NAME=chatbot-backend
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_TRACES_EXPORTER=logging
OTEL_METRICS_EXPORTER=otlp
OTEL_LOGS_EXPORTER=none
```

Root `.env.profile.dev` uses logging traces and disables metrics/log exporters for local simplicity.

## Spans

The code uses `@WithSpan` around protocol entry points and service internals, including:

- `ProtocolChatController.streamRun()`
- `ProtocolChatService.streamRun()`
- Agent decision, planning, execution, synthesis, tool, and MCP paths where annotated.

## Metrics

`ObservabilityConfig` registers:

- `chatbot.request.active`: active streaming request gauge.
- Actuator/Micrometer default JVM, HTTP, and process metrics.

## Verification

```bash
cd services/chatbot-backend
mvn -Dtest=ObservabilityActuatorTest,ObservabilityMetricsRegistrationTest test
```

Do not log provider API keys, bearer tokens, full prompts with private context, memory bodies, or raw large tool outputs.
