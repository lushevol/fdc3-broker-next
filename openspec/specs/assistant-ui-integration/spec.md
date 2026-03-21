## ADDED Requirements

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

### Requirement: ChatbotSidebar uses assistant-ui components

The system SHALL render the chat interface using assistant-ui's primitive components themed with Material-UI.

#### Scenario: Message thread is displayed

- **WHEN** the chatbot sidebar is open
- **THEN** the system SHALL render messages using assistant-ui's `<Thread>` and `<Message>` components
- **AND** user and assistant messages SHALL be visually distinguished
- **AND** the component SHALL match the existing Material-UI design system

#### Scenario: Composer input is rendered

- **WHEN** the chatbot sidebar is open
- **THEN** the system SHALL render the input using assistant-ui's `<Composer>` component
- **AND** the composer SHALL support multiline input with Enter to send
- **AND** the composer SHALL be themed to match Material-UI TextField appearance

#### Scenario: Loading state is displayed

- **WHEN** the assistant is generating a response
- **THEN** the system SHALL display assistant-ui's built-in loading indicator
- **AND** the indicator SHALL replace the custom typing dots animation

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

### Requirement: SSE connection management

The system SHALL manage SSE connections properly with cleanup and error handling.

#### Scenario: Connection is established

- **WHEN** a user sends a message
- **THEN** the system SHALL establish an SSE connection to the backend
- **AND** the connection SHALL include the message and conversationId as query parameters

#### Scenario: Connection is cleaned up on unmount

- **WHEN** the `ChatbotSidebar` component unmounts during an active stream
- **THEN** the system SHALL close the SSE connection
- **AND** any pending message updates SHALL be cancelled

#### Scenario: Connection error is handled

- **WHEN** the SSE connection encounters an error
- **THEN** the system SHALL display an error message
- **AND** the error state SHALL be clearable via a retry action

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

### Requirement: Generative UI components render

The system SHALL continue to support generative UI components triggered by the backend.

#### Scenario: Generative UI directive is received

- **WHEN** a `generative_ui` SSE event is received
- **THEN** the system SHALL render the registered component with the provided props
- **AND** the component SHALL be displayed inline in the message thread
