# Chatbot Integration Guide for MFEs

This guide explains how to integrate the ChatbotSidebar component into your Micro-Frontend application.

## Prerequisites

- Your MFE must be able to consume Module Federation remotes from the `@fm/base` MFE
- React 18+ is required
- Material-UI v5 is required

## Quick Start

### 1. Import the Chatbot Components

Add the chatbot imports to your MFE's import file:

```typescript
// src/Root/import/index.ts
import * as Container from '@fm/base';

// ... existing imports ...

// Chatbot exports
export const ChatbotSidebar = Container.ChatbotSidebar;
export const ChatbotProvider = Container.ChatbotProvider;
export const useChatbot = Container.useChatbot;
```

### 2. Wrap Your App with ChatbotProvider

```tsx
// src/App.tsx
import { ChatbotProvider, ChatbotSidebar } from './Root/import';

const App: React.FC = (props) => {
  return (
    <ChatbotProvider apiUrl="http://localhost:8080/api/chat">
      {/* Your app content */}
      <YourRoutes />
      {/* Add the sidebar */}
      <ChatbotSidebar />
    </ChatbotProvider>
  );
};
```

### 3. Configure the Backend URL (Optional)

By default, the chatbot uses `/api/chat` as the backend URL. You can customize this:

```tsx
<ChatbotProvider apiUrl="https://your-backend.com/api/chat">
  <ChatbotSidebar />
</ChatbotProvider>
```

## Component Props

### ChatbotSidebar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | undefined | Controlled open state |
| onToggle | () => void | undefined | Callback when sidebar is toggled |
| apiUrl | string | '/api/chat' | Backend API URL |
| position | 'left' \| 'right' | 'right' | Sidebar position |
| width | number \| string | 400 | Sidebar width |

### ChatbotProvider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| apiUrl | string | '/api/chat' | Backend API URL |
| initialOpen | boolean | false | Initial sidebar open state |

## Using the Hook

Access chatbot functionality programmatically:

```tsx
import { useChatbot } from './Root/import';

const MyComponent = () => {
  const { sendMessage, isOpen, toggleSidebar, messages } = useChatbot();

  const handleQuickQuestion = () => {
    sendMessage('What is the current stock price of AAPL?');
  };

  return (
    <div>
      <button onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'} Chat
      </button>
      <button onClick={handleQuickQuestion}>
        Quick Question
      </button>
    </div>
  );
};
```

### Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| messages | ChatMessage[] | Current conversation messages |
| isLoading | boolean | Whether a message is being processed |
| error | string \| null | Current error message |
| conversationId | string \| null | Current conversation ID |
| isOpen | boolean | Sidebar open state |
| sendMessage | (content: string) => Promise<void> | Send a message |
| clearConversation | () => void | Clear current conversation |
| toggleSidebar | () => void | Toggle sidebar open/close |
| retryLastMessage | () => Promise<void> | Retry the last failed message |

## Generative UI

The chatbot supports dynamic UI components that the AI can render. To add custom generative components:

```tsx
import { useRegisterGenerativeComponent } from './Root/import';

const MyCustomComponent = ({ props }: { props: CustomProps }) => {
  return <div>{props.title}</div>;
};

const MyComponent = () => {
  const registerComponent = useRegisterGenerativeComponent();

  React.useEffect(() => {
    const unregister = registerComponent({
      name: 'MyCustomComponent',
      component: MyCustomComponent,
    });

    return unregister;
  }, [registerComponent]);

  return <ChatbotSidebar />;
};
```

## Styling

The ChatbotSidebar uses Material-UI with emotion for styling. It respects your app's MUI theme.

### Custom Styling

You can override styles using MUI theme customization:

```tsx
const theme = createTheme({
  components: {
    // Customize chatbot styles
  },
});
```

## Backend Configuration

The chatbot backend must be running and accessible. Configure the backend URL based on your environment:

```tsx
const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://api.production.com/chat'
  : 'http://localhost:8080/api/chat';

<ChatbotProvider apiUrl={apiUrl}>
  <ChatbotSidebar />
</ChatbotProvider>
```

## Troubleshooting

### Chatbot not loading

1. Ensure `@fm/base` MFE is running and accessible
2. Check Module Federation configuration
3. Verify React and MUI versions are compatible

### Messages not sending

1. Check backend is running at the configured URL
2. Verify network requests in browser dev tools
3. Check for authentication errors

### Styling issues

1. Ensure MUI theme provider wraps your app
2. Check for CSS conflicts with emotion
3. Verify shared dependencies in Module Federation config

## Example: Full Integration

```tsx
// src/App.tsx
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import {
  ChatbotProvider,
  ChatbotSidebar,
  GenerativeUIProvider,
  defaultGenerativeComponents,
} from './Root/import';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ChatbotProvider apiUrl="/api/chat" initialOpen={false}>
        <GenerativeUIProvider initialComponents={defaultGenerativeComponents}>
          {/* Your app routes */}
          <Routes />
          {/* Chatbot sidebar */}
          <ChatbotSidebar position="right" width={400} />
        </GenerativeUIProvider>
      </ChatbotProvider>
    </ThemeProvider>
  );
};

export default App;
```