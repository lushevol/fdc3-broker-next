## ADDED Requirements

### Requirement: Backend provides chat API endpoint

The system SHALL provide chat endpoints that preserve conversation context and expose a stable contract for both non-streaming and SSE-based assistant-ui clients.

#### Scenario: Client sends chat message

- **WHEN** client POSTs a message to `/api/chat` endpoint
- **THEN** the system SHALL return the assistant response and conversation identifier in a JSON payload
- **AND** the response SHALL reflect the same conversation state model used by the streaming endpoint

#### Scenario: Chat request includes conversation context

- **WHEN** client sends a chat request with an existing conversation identifier
- **THEN** the system SHALL include prior conversation history as context for the LLM
- **AND** the system SHALL append the new user turn and final assistant turn to that conversation history

### Requirement: Backend integrates with LLM provider

The system SHALL integrate with an LLM provider to generate responses.

#### Scenario: LLM generates response

- **WHEN** the backend receives a chat request
- **THEN** the system SHALL call the configured LLM provider with the prompt
- **AND** stream the response back to the client

#### Scenario: LLM request fails

- **WHEN** the LLM provider returns an error
- **THEN** the system SHALL return an error response to the client
- **AND** log the error for debugging

### Requirement: Backend supports streaming responses

The system SHALL stream chat responses to clients using Server-Sent Events (SSE) with a canonical event contract that supports assistant-ui runtime integration.

#### Scenario: Client connects to SSE endpoint

- **WHEN** client connects to `/api/chat/stream` endpoint
- **THEN** the system SHALL establish an SSE connection
- **AND** the stream SHALL emit `conversation_id`, `message`, `tool_call`, `tool_result`, `generative_ui`, `error`, and `done` events as applicable

#### Scenario: SSE stream maintains conversation lifecycle

- **WHEN** a streaming response completes successfully
- **THEN** the system SHALL persist the final assistant turn in conversation history
- **AND** the stream SHALL terminate with a `done` event after all text, tool, and generative UI events for that turn have been emitted

#### Scenario: SSE connection is closed

- **WHEN** client disconnects from SSE endpoint
- **THEN** the system SHALL cancel any in-flight LLM or tool execution work associated with that stream
- **AND** release associated resources without corrupting stored conversation history

### Requirement: Backend registers and executes tools

The system SHALL allow registration of tools that can be executed by the AI agent and SHALL expose tool lifecycle updates to clients through the streaming contract.

#### Scenario: Tool is registered

- **WHEN** a tool is registered with the agent
- **THEN** the tool SHALL be available for the LLM to call
- **AND** the backend SHALL expose enough metadata for the client to render the tool name and status

#### Scenario: LLM requests tool execution

- **WHEN** the LLM returns a tool call request
- **THEN** the system SHALL emit a `tool_call` event containing a stable tool call identifier, tool name, arguments, and status
- **AND** the system SHALL execute the corresponding tool or transition it into a pending confirmation state
- **AND** the eventual outcome SHALL be emitted through a `tool_result` event referencing the same tool call identifier

#### Scenario: Tool execution requires confirmation

- **WHEN** a tool is marked as requiring user confirmation
- **THEN** the system SHALL surface that pending state to the client before execution
- **AND** the confirmation endpoint SHALL resume or cancel the pending tool call using the same conversation and tool call identifiers

### Requirement: Backend registers remote MCP providers

The system SHALL allow other services to register remote Model Context Protocol (MCP) providers with the chatbot backend at runtime so the chatbot backend can discover and execute those remote tools.

#### Scenario: Service registers an MCP provider

- **WHEN** another service submits an MCP provider registration to the chatbot backend
- **THEN** the chatbot backend SHALL persist that provider in its runtime registry
- **AND** the chatbot backend SHALL establish an MCP client connection using the configured transport
- **AND** the chatbot backend SHALL discover the provider's available MCP tools before exposing them to the agent

#### Scenario: Service unregisters an MCP provider

- **WHEN** another service unregisters a previously registered MCP provider
- **THEN** the chatbot backend SHALL remove that provider from the runtime registry
- **AND** the chatbot backend SHALL stop exposing the provider's tools to future chat requests

#### Scenario: MCP provider registration fails

- **WHEN** the chatbot backend cannot initialize or discover tools for a submitted MCP provider
- **THEN** the registration request SHALL fail
- **AND** the chatbot backend SHALL not expose any partially initialized tools from that provider

### Requirement: Backend supports current MCP transport protocols

The system SHALL support current MCP client transports, including the latest Streamable HTTP protocol, while preserving compatibility for legacy HTTP SSE MCP endpoints when explicitly configured.

#### Scenario: Provider uses Streamable HTTP transport

- **WHEN** an MCP provider is registered with Streamable HTTP transport
- **THEN** the chatbot backend SHALL connect using a Streamable HTTP MCP client transport
- **AND** the backend SHALL use the discovered MCP tool schemas when exposing those tools to the agent

#### Scenario: Provider uses legacy HTTP SSE transport

- **WHEN** an MCP provider is registered with legacy HTTP SSE transport
- **THEN** the chatbot backend SHALL connect using an HTTP SSE MCP client transport
- **AND** the backend SHALL continue to expose the discovered tools through the same tool execution contract

### Requirement: Backend filters tools by authenticated user profile

The system SHALL dynamically resolve the available backend tool and MCP capability set for each authenticated user based on profile claims carried by the user's authentication token.

#### Scenario: User token includes matching profile claims

- **WHEN** an authenticated user's token contains profile claims that match a tool or MCP provider's allowed profiles
- **THEN** the chatbot backend SHALL include those capabilities in the tool set exposed for that request
- **AND** the agent SHALL be able to call those resolved tools during that conversation turn

#### Scenario: User token does not include matching profile claims

- **WHEN** an authenticated user's token does not contain the required profile claims for a tool or MCP provider
- **THEN** the chatbot backend SHALL exclude those capabilities from the tool set exposed for that request
- **AND** the agent SHALL not receive those excluded tool schemas

#### Scenario: Tool capability set is reused for repeated requests

- **WHEN** the same authenticated user sends repeated requests with the same profile fingerprint
- **THEN** the chatbot backend SHALL reuse a cached resolved capability set for that user profile
- **AND** the cache SHALL be invalidated when the registry changes or the user's profile fingerprint changes

### Requirement: Backend uses Google ADK and LangChain4j

The system SHALL be built using Google ADK Java with LangChain4j for agent orchestration.

#### Scenario: Agent is configured

- **WHEN** the backend initializes
- **THEN** the system SHALL create an ADK agent with LangChain4j integration
- **AND** configure the LLM provider

#### Scenario: Agent handles conversation

- **WHEN** a chat request is received
- **THEN** the system SHALL use the ADK agent to process the request
- **AND** manage conversation state

### Requirement: Backend validates authentication

The system SHALL validate authentication tokens for chat requests.

#### Scenario: Valid authentication token provided

- **WHEN** client provides a valid authentication token
- **THEN** the system SHALL process the chat request

#### Scenario: Invalid or missing authentication token

- **WHEN** client provides an invalid or missing authentication token
- **THEN** the system SHALL return a 401 Unauthorized response

### Requirement: Backend implements rate limiting

The system SHALL implement rate limiting to prevent abuse.

#### Scenario: User exceeds rate limit

- **WHEN** user sends more than the allowed number of requests per minute
- **THEN** the system SHALL return a 429 Too Many Requests response
- **AND** include a Retry-After header
