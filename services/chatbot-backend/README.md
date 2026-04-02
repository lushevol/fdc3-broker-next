# Chatbot Backend Service

A Spring Boot-based AI chatbot backend service that provides conversational AI capabilities via OpenAI's GPT models using LangChain4j.

## Features

- **Streaming Responses**: Real-time SSE (Server-Sent Events) streaming for chat responses
- **Multi-Provider Support**: OpenAI and Anthropic Claude support via LangChain4j
- **Tool System**: Extensible tool execution framework for AI-assisted workflows
- **Rate Limiting**: Built-in rate limiting to prevent API abuse
- **Conversation Management**: In-memory conversation storage with history
- **Generative UI**: Support for dynamic UI components rendered by AI

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- OpenAI API Key (or Anthropic API Key)

## Configuration

### Environment Variables

The service uses the following environment variables for configuration:

| Variable                     | Required | Default                    | Description                         |
| ---------------------------- | -------- | -------------------------- | ----------------------------------- |
| `CHATBOT_OPENAI_API_KEY`     | Yes\*    | -                          | Your OpenAI API key                 |
| `CHATBOT_OPENAI_BASE_URL`    | No       | `https://api.openai.com`   | OpenAI API base URL                 |
| `CHATBOT_OPENAI_MODEL`       | No       | `gpt-4`                    | OpenAI model to use                 |
| `CHATBOT_OPENAI_TEMPERATURE` | No       | `0.7`                      | Temperature for response generation |
| `CHATBOT_ANTHROPIC_API_KEY`  | No       | -                          | Anthropic API key (optional)        |
| `CHATBOT_ANTHROPIC_MODEL`    | No       | `claude-3-sonnet-20240229` | Anthropic model to use              |

\* Required when `chatbot.mock.enabled=false`

### Mock Mode

For development and testing without API keys, you can enable mock mode:

```yaml
chatbot:
  mock:
    enabled: true
```

In mock mode, the service simulates AI responses without calling external APIs.

## Running the Service

### Local Development

1. **Set environment variables:**

   ```bash
   export CHATBOT_OPENAI_API_KEY="your-api-key-here"
   export CHATBOT_OPENAI_BASE_URL="https://api.openai.com"
   ```

2. **Build and run with Maven:**

   ```bash
   cd services/chatbot-backend
   mvn spring-boot:run
   ```

3. **Or build the JAR and run:**
   ```bash
   cd services/chatbot-backend
   mvn clean package
   java -jar target/chatbot-backend.jar
   ```

### Build a CentOS Deploy Bundle

To compile the service on macOS, upload it manually to a CentOS server, and run it there:

1. **Build the deploy archive locally:**

   ```bash
   cd services/chatbot-backend
   npm run bundle:centos
   ```

2. **Upload the archive to the target CentOS server:**

   ```bash
   scp dist/chatbot-backend-centos.tar.gz your-user@your-server:/path/to/deploy/
   ```

3. **Extract it on the server:**

   ```bash
   cd /path/to/deploy
   tar -xzf chatbot-backend-centos.tar.gz
   cd chatbot-backend-centos
   ```

4. **Create the runtime environment file:**

   ```bash
   cp .env.example .env
   ```

5. **Start the service:**

   ```bash
   chmod +x run.sh
   ./run.sh
   ```

`run.sh` stops early with explicit errors if Java 17+, `.env`, or `chatbot-backend.jar` is missing.

### Using Environment File

Create a `.env` file in the project root:

```bash
CHATBOT_OPENAI_API_KEY=your-api-key-here
CHATBOT_OPENAI_BASE_URL=https://api.openai.com
CHATBOT_OPENAI_MODEL=gpt-4
CHATBOT_OPENAI_TEMPERATURE=0.7
```

Then source it before running:

```bash
source .env
./mvnw spring-boot:run
```

### Docker (Future)

```dockerfile
# Dockerfile to be added
FROM eclipse-temurin:17-jdk-alpine
COPY target/chatbot-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## API Endpoints

The service exposes the following REST endpoints:

### Health Check

- **GET** `/api/chat/health` - Service health check

### Chat Endpoints

- **POST** `/api/chat` - Send a message and get a complete response
- **GET** `/api/chat/stream` - Send a message and receive streaming SSE response
- **GET** `/api/chat/{conversationId}/history` - Get conversation history
- **DELETE** `/api/chat/{conversationId}` - Clear a conversation

### Tool Management

- **POST** `/api/chat/{conversationId}/tools/{toolCallId}/confirm` - Confirm/cancel tool execution

For full API documentation, see [API.md](docs/API.md).

## Architecture

### Key Components

- **ChatController**: REST API endpoints and canonical SSE event emission
- **ChatService**: Conversation management, assistant turn persistence, and stream orchestration
- **AgentService**: AI model integration via LangChain4j and tool lifecycle coordination
- **ToolRegistry**: Tool definitions and execution

### Technologies

- **Spring Boot 3.2.0**: Web framework
- **LangChain4j 1.12.2**: AI model abstraction
- **Project Reactor**: Reactive programming for streaming
- **Bucket4j**: Rate limiting
- **Lombok**: Boilerplate reduction

## Development

### Adding Custom Tools

Tools can be added to extend the AI's capabilities:

```java
@Component
public class MyCustomTool {
    @Tool(name = "my_tool", description = "Does something useful")
    public String execute(String input) {
        return "Result: " + input;
    }
}
```

See [TOOL_CREATION_GUIDE.md](docs/TOOL_CREATION_GUIDE.md) for details.

### Testing

```bash
./mvnw test
```

## Integration with Frontend

The chatbot backend integrates with the `@fm/base` MFE's assistant-ui modal surface. The frontend mounts `AssistantUIRuntimeProvider` once near the app root and renders `ChatbotSidebar` as the floating assistant modal trigger.

Configure the frontend to connect to this service:

```tsx
<AssistantUIRuntimeProvider apiUrl="http://localhost:8080/api/chat">
  <AppShell />
  <ChatbotSidebar />
</AssistantUIRuntimeProvider>
```

See [MFE_INTEGRATION.md](docs/MFE_INTEGRATION.md) for full integration details.
See [API.md](docs/API.md) for the canonical SSE event contract (`conversation_id`, `message`, `tool_call`, `tool_result`, `generative_ui`, `error`, `done`).

## Troubleshooting

### Service won't start

- Verify Java 17+ is installed: `java -version`
- Check that the required environment variables are set
- Review application logs for configuration errors

### API calls failing

- Verify the OpenAI API key is valid
- Check network connectivity to OpenAI's API
- Review rate limiting status

### No AI responses

- Check if mock mode is enabled when it shouldn't be
- Verify the model name is valid
- Check LangChain4j logs for API errors

## License

Proprietary - FDC3 Project
