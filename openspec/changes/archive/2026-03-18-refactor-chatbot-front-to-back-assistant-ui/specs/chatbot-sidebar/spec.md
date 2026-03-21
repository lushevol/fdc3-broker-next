## MODIFIED Requirements

### Requirement: Chatbot displays message history

The system SHALL display the current conversation history using the assistant-ui thread model while preserving chronological ordering and clear role distinctions.

#### Scenario: User views conversation history

- **WHEN** user opens the chatbot sidebar
- **THEN** the system SHALL display the current thread's prior user and assistant turns in chronological order
- **AND** messages SHALL remain visually distinguished between user and assistant
- **AND** any inline tool or generative UI content SHALL remain attached to the assistant turn that produced it

#### Scenario: User starts new conversation

- **WHEN** user clicks "New Chat" button
- **THEN** the system SHALL clear the current thread state
- **AND** the next submitted message SHALL begin a fresh conversation with no previous turns attached

### Requirement: Chatbot supports streaming responses

The system SHALL display assistant responses through the assistant-ui runtime as the backend stream emits text, tool, and completion events.

#### Scenario: User sends message and receives streaming response

- **WHEN** user submits a message
- **THEN** the system SHALL append the user turn immediately
- **AND** the assistant response SHALL stream incrementally into the active assistant turn as `message` events arrive
- **AND** the UI SHALL show an in-progress assistant state while the stream is active

#### Scenario: Streaming response is interrupted

- **WHEN** streaming response is in progress
- **AND** user closes the sidebar, navigates away, or the runtime is unmounted
- **THEN** the system SHALL cancel the active streaming request
- **AND** the UI SHALL surface a recoverable error or retry state instead of leaving the thread in a permanently loading state

### Requirement: Chatbot accepts user input

The system SHALL provide an assistant-ui composer-based input experience for sending chatbot messages.

#### Scenario: User types and sends message

- **WHEN** user types a message in the composer
- **AND** presses Enter or clicks Send button
- **THEN** the system SHALL send the message through the assistant-ui runtime to the backend
- **AND** clear or reset the composer according to assistant-ui send behavior

#### Scenario: User input is validated

- **WHEN** user attempts to send an empty or whitespace-only message
- **THEN** the system SHALL NOT send the message
- **AND** the composer SHALL remain available for corrected input without producing a new thread entry

### Requirement: Chatbot displays tool execution status

The system SHALL display the status of tool executions initiated by the assistant as part of the assistant message flow.

#### Scenario: Assistant executes a tool

- **WHEN** the assistant initiates a tool execution
- **THEN** the system SHALL display an inline tool execution card or renderer within the associated assistant turn
- **AND** the renderer SHALL show that the tool is running or awaiting confirmation

#### Scenario: Tool execution completes successfully

- **WHEN** a tool execution completes successfully
- **THEN** the system SHALL update the existing tool execution UI in place
- **AND** the result SHALL be visible within the same conversation turn

#### Scenario: Tool execution fails

- **WHEN** a tool execution fails
- **THEN** the system SHALL display the failure state and error details in the conversation
- **AND** the rest of the assistant turn SHALL remain readable

### Requirement: Chatbot is exported via Module Federation

The system SHALL export the ChatbotSidebar component and related hooks via Module Federation while preserving compatibility for existing consuming MFEs.

#### Scenario: MFE imports chatbot component

- **WHEN** an MFE imports `ChatbotSidebar` from the base MFE
- **THEN** the component SHALL render correctly in the consuming MFE
- **AND** the consuming MFE SHALL NOT need to know whether the internal runtime uses assistant-ui or a compatibility wrapper

#### Scenario: MFE uses chatbot hooks

- **WHEN** an MFE imports `useChatbot` or `useChatbotController` from the base MFE
- **THEN** the hook SHALL provide programmatic access to chatbot functionality backed by the assistant-ui runtime
- **AND** any deprecation of legacy hook names SHALL be documented without breaking existing consumers
