## MODIFIED Requirements

### Requirement: assistant-ui runtime provider is configured

The system SHALL provide a single assistant-ui runtime provider that integrates assistant-ui's thread runtime with the chatbot SSE backend and serves as the canonical source of frontend chat state.

#### Scenario: Runtime is initialized with API URL

- **WHEN** the `ChatbotSidebar` component is mounted with an `apiUrl` prop
- **THEN** the system SHALL initialize one assistant-ui thread runtime with a custom adapter
- **AND** the adapter SHALL connect to the SSE stream endpoint at `{apiUrl}/stream`
- **AND** no parallel legacy runtime SHALL manage the same conversation state

#### Scenario: SSE events are transformed to assistant-ui messages

- **WHEN** SSE events are received from the backend
- **THEN** the system SHALL transform `conversation_id`, `message`, `tool_call`, `tool_result`, `generative_ui`, `error`, and `done` events into assistant-ui runtime updates
- **AND** streaming text SHALL be appended incrementally to the active assistant message
- **AND** tool and generative UI payloads SHALL be attached to the correct assistant message or thread state entry

### Requirement: Tool calls are rendered

The system SHALL display tool execution status using assistant-ui's tool rendering capabilities and the project's custom renderers.

#### Scenario: Tool call is initiated

- **WHEN** the assistant initiates a tool call via SSE `tool_call` event
- **THEN** the system SHALL render the tool call inline within the relevant assistant turn
- **AND** the renderer SHALL display the tool name, call identifier, and current execution status

#### Scenario: Tool result is received

- **WHEN** a `tool_result` SSE event is received
- **THEN** the system SHALL update the matching tool call entry using the tool call identifier
- **AND** the renderer SHALL display the completed result, failure state, or confirmation-needed state without losing previously streamed assistant text

### Requirement: Backward compatibility is maintained

The system SHALL maintain the existing `ChatbotSidebarProps` interface for consuming MFEs while routing exported chatbot behavior through the assistant-ui runtime.

#### Scenario: Component accepts existing props

- **WHEN** an MFE imports and uses `ChatbotSidebar` with `isOpen`, `onToggle`, `apiUrl`, `position`, or `width` props
- **THEN** the component SHALL accept and respect these props
- **AND** the assistant-ui runtime SHALL be configured internally without requiring consumer changes

#### Scenario: Module Federation exports remain compatible

- **WHEN** an MFE imports `ChatbotSidebar`, `useChatbot`, or `useChatbotController` from the base MFE
- **THEN** the exports SHALL remain available
- **AND** their behavior SHALL be backed by the assistant-ui runtime or documented compatibility wrappers
- **AND** assistant-ui hooks MAY be exported in addition to the compatibility surface

### Requirement: Thread management functions work

The system SHALL support conversation management via assistant-ui's thread API and keep that behavior aligned with backend conversation state.

#### Scenario: New conversation is started

- **WHEN** user clicks the "New Chat" button
- **THEN** the system SHALL clear the current assistant-ui thread state
- **AND** the conversationId SHALL be reset before the next message is sent
- **AND** subsequent messages SHALL start a new backend conversation

#### Scenario: Message retry is supported

- **WHEN** an error occurs during message streaming
- **THEN** the system SHALL enable retry for the last user turn through the assistant-ui runtime
- **AND** clicking retry SHALL resend the last user message against the correct conversation context
- **AND** stale failed assistant/tool state from the previous attempt SHALL NOT remain attached to the retried turn
