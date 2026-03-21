## MODIFIED Requirements

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
