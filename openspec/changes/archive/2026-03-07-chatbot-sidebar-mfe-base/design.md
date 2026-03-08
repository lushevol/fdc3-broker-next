## Context

The MFE platform currently lacks an AI-powered assistant for user support and workflow automation. This design introduces a chatbot sidebar in the base MFE with a Java-based backend using Google ADK and LangChain4j. The frontend uses assistant-ui for a modern chat interface with generative UI capabilities.

**Current State**:
- Base MFE exports shared components via Module Federation
- No existing chatbot or AI integration
- No backend service for AI orchestration

**Constraints**:
- Frontend must integrate with existing MFE architecture (Webpack Module Federation)
- Backend must use Google ADK Java with LangChain4j
- UI must use assistant-ui library (latest version)
- Must support streaming responses for real-time feedback

## Goals / Non-Goals

**Goals:**
- Provide a collapsible chatbot sidebar accessible from any MFE
- Enable natural language interaction with AI assistant
- Support generative UI - AI can render React components dynamically
- Implement tool use - AI can execute registered actions
- Stream responses for real-time user feedback
- Expose chatbot as Module Federation remote for reuse

**Non-Goals:**
- Multi-tenant chat history persistence (future enhancement)
- Voice input/output (future enhancement)
- Custom model fine-tuning
- Mobile-responsive sidebar (desktop-first for initial release)

## Decisions

### 1. Frontend Framework: assistant-ui

**Decision**: Use assistant-ui library for the chat interface.

**Rationale**:
- Purpose-built for AI chat interfaces with React
- Built-in support for streaming responses
- Extensible component architecture for generative UI
- Active maintenance and good documentation
- TypeScript-first with excellent type safety

**Alternatives Considered**:
- Custom chat UI: More control but significant development effort
- Vercel AI SDK UI: Good option but assistant-ui has better generative UI support

### 2. Backend Framework: Google ADK Java + LangChain4j

**Decision**: Use Google ADK Java with LangChain4j for the backend agent.

**Rationale**:
- Google ADK provides structured agent development patterns
- LangChain4j offers mature LLM integration with multiple providers
- Java ecosystem fits enterprise requirements
- Strong typing and tool registration patterns

**Alternatives Considered**:
- Python LangChain: More mature but doesn't align with Java-first backend
- Node.js with LangChain.js: Simpler but less enterprise-ready

### 3. Communication Protocol: SSE over WebSocket

**Decision**: Use Server-Sent Events (SSE) for streaming responses.

**Rationale**:
- Simpler than WebSocket for unidirectional server-to-client streaming
- Native browser support with EventSource API
- Easier error handling and reconnection
- Sufficient for chat use case (no bidirectional real-time needed)

**Alternatives Considered**:
- WebSocket: Overkill for unidirectional streaming, more complex
- Polling: Poor user experience for real-time chat

### 4. Generative UI Architecture: Component Registry

**Decision**: Use a component registry pattern where the backend returns component identifiers with props, and the frontend renders registered components.

**Rationale**:
- Security: Backend cannot inject arbitrary React code
- Type safety: Components are pre-defined with typed props
- Maintainability: UI components live in frontend codebase
- Flexibility: Easy to add new generative UI components

**Implementation**:
```
Backend returns: { component: "StockCard", props: { symbol: "AAPL", price: 150.00 } }
Frontend renders: <RegisteredComponent name="StockCard" props={...} />
```

### 5. Tool Execution: Backend-orchestrated

**Decision**: Tools are registered and executed on the backend, with results returned to the frontend for display.

**Rationale**:
- Security: Sensitive operations stay server-side
- Consistency: Tool logic is centralized
- Auditability: All tool executions are logged server-side

**Tool Categories**:
- Read-only tools: Fetch data (e.g., get stock price, search documents)
- Action tools: Perform operations (e.g., send message, create task)
- UI tools: Request user input (e.g., show form, confirm action)

### 6. Module Federation Exposure

**Decision**: Export `ChatbotSidebar` and related hooks from base MFE via Module Federation.

**Rationale**:
- Allows any MFE to embed the chatbot
- Consistent with existing base MFE patterns
- Enables future customization by consuming MFEs

**Exports**:
- `ChatbotSidebar` - Main component
- `useChatbot` - Hook for programmatic interaction
- `ChatbotProvider` - Context provider for state management

## Risks / Trade-offs

**Risk: LLM API latency and cost**
→ Mitigation: Implement response caching for common queries, use streaming to improve perceived latency, set token limits

**Risk: Generative UI complexity**
→ Mitigation: Start with a small set of well-defined components, use strict TypeScript types, implement component preview in development

**Risk: Tool execution security**
→ Mitigation: Implement tool permission system, validate all inputs server-side, require user confirmation for destructive actions

**Risk: Backend service availability**
→ Mitigation: Implement graceful degradation in UI, show cached responses when offline, health checks and auto-restart

**Trade-off: SSE vs WebSocket**
→ SSE is simpler but doesn't support bidirectional communication. Acceptable for chat use case where client sends requests via HTTP and receives streamed responses.

## Migration Plan

1. **Phase 1**: Backend service setup
   - Create Java service with Google ADK + LangChain4j
   - Implement basic chat endpoint with streaming
   - Deploy to development environment

2. **Phase 2**: Frontend integration
   - Add assistant-ui to base MFE dependencies
   - Create ChatbotSidebar component
   - Connect to backend API

3. **Phase 3**: Generative UI
   - Implement component registry
   - Create initial generative UI components
   - Add tool execution display

4. **Phase 4**: Module Federation
   - Configure Module Federation exports
   - Test consumption from other MFEs
   - Document integration guide

**Rollback Strategy**:
- Feature flag to disable chatbot sidebar
- Backend can be scaled down independently
- Frontend gracefully handles backend unavailability

## Open Questions

1. **LLM Provider**: Which LLM provider to use? (OpenAI, Anthropic, Google Gemini)
   - Recommendation: Start with OpenAI for maturity, consider multi-provider support

2. **Authentication**: How should the backend authenticate requests?
   - Recommendation: Use existing MFE authentication tokens, pass via Authorization header

3. **Chat History Storage**: Where to store conversation history?
   - Recommendation: Start with in-memory/session storage, add persistence in future iteration