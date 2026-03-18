## ADDED Requirements

### Requirement: assistant-ui runtime provider is configured

The system SHALL provide a runtime provider that integrates assistant-ui's ThreadRuntime with the existing SSE backend.

#### Scenario: Runtime is initialized with API URL

- **WHEN** the `ChatbotSidebar` component is mounted with an `apiUrl` prop
- **THEN** the system SHALL initialize an assistant-ui `ThreadRuntime` with a custom adapter
- **AND** the adapter SHALL connect to the SSE stream endpoint at `{apiUrl}/stream`

#### Scenario: SSE events are transformed to assistant-ui messages

- **WHEN** SSE events are received from the backend
- **THEN** the system SHALL transform custom SSE events (`message`, `tool_call`, `tool_result`, `done`) into assistant-ui message format
- **AND** streaming content SHALL be appended incrementally to the assistant message

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

The system SHALL display tool execution status using assistant-ui's tool rendering capabilities.

#### Scenario: Tool call is initiated

- **WHEN** the assistant initiates a tool call via SSE `tool_call` event
- **THEN** the system SHALL render a tool call card with the tool name and "running" status
- **AND** the card SHALL be displayed inline within the assistant message

#### Scenario: Tool result is received

- **WHEN** a `tool_result` SSE event is received
- **THEN** the system SHALL update the tool call status to "completed" or "failed"
- **AND** the result or error SHALL be displayed in the tool call card

### Requirement: Backward compatibility is maintained

The system SHALL maintain the existing `ChatbotSidebarProps` interface for consuming MFEs.

#### Scenario: Component accepts existing props

- **WHEN** an MFE imports and uses `ChatbotSidebar` with `isOpen`, `onToggle`, `apiUrl`, `position`, or `width` props
- **THEN** the component SHALL accept and respect these props
- **AND** the behavior SHALL match the pre-migration implementation

#### Scenario: Module Federation exports remain compatible

- **WHEN** an MFE imports `ChatbotSidebar` or `useChatbot` from the base MFE
- **THEN** the exports SHALL be available and functional
- **AND** assistant-ui hooks SHALL be additionally exported for optional use

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

The system SHALL support conversation management via assistant-ui's thread API.

#### Scenario: New conversation is started

- **WHEN** user clicks the "New Chat" button
- **THEN** the system SHALL clear the current thread state
- **AND** the conversationId SHALL be reset to null

#### Scenario: Message retry is supported

- **WHEN** an error occurs during message streaming
- **THEN** the system SHALL enable the retry button
- **AND** clicking retry SHALL resend the last user message

### Requirement: Generative UI components render

The system SHALL continue to support generative UI components triggered by the backend.

#### Scenario: Generative UI directive is received

- **WHEN** a `generative_ui` SSE event is received
- **THEN** the system SHALL render the registered component with the provided props
- **AND** the component SHALL be displayed inline in the message thread
