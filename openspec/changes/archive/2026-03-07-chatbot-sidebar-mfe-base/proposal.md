## Why

Users need AI-powered assistance within the MFE platform to help with tasks, answer questions, and automate workflows through natural language interaction. The chatbot sidebar will provide a persistent, accessible interface for users to interact with an intelligent assistant that can render dynamic UI components and execute tools on their behalf.

## What Changes

- Add a collapsible chatbot sidebar component to the base MFE
- Integrate assistant-ui library (latest version) for the chat interface
- Create backend service using Google ADK Java with LangChain4j for AI orchestration
- Implement generative UI capabilities allowing the assistant to render dynamic components
- Support tool use enabling the assistant to execute actions on behalf of users
- Expose chatbot sidebar as a Module Federation remote for consumption by other MFEs

## Capabilities

### New Capabilities

- `chatbot-sidebar`: Chatbot sidebar UI component with assistant-ui integration, message history, and tool execution display
- `chatbot-backend`: Backend service using Google ADK Java and LangChain4j for AI agent orchestration, tool registration, and response generation
- `generative-ui`: Dynamic UI rendering capability allowing the AI to render React components based on conversation context and tool results

### Modified Capabilities

None - this is a new feature with no changes to existing spec-level behavior.

## Impact

**Frontend (apps/base)**:
- New `ChatbotSidebar` component with assistant-ui integration
- New hooks for chat state management and tool execution
- New services for backend API communication
- Module Federation exports for chatbot components

**Backend (new service)**:
- New Java service using Google ADK for agent development
- LangChain4j integration for LLM capabilities
- Tool registry for executable actions
- WebSocket/SSE support for streaming responses

**Dependencies**:
- assistant-ui (latest) - React components for AI chat interfaces
- Google ADK Java - Agent development kit
- LangChain4j - LLM integration framework

**APIs**:
- New REST endpoints for chat operations
- WebSocket/SSE endpoint for streaming responses
- Tool execution API