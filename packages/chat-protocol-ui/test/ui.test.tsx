import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Toolkit } from '@assistant-ui/react';
import type { ChatToolDescriptor } from '@fm/chat-protocol-contract';
import {
  ChatProtocolModal,
  ChatProtocolProvider,
  ChatProtocolThread,
} from '../src';

const toolkit: Toolkit = {};
const tools: ChatToolDescriptor[] = [];

describe('chat protocol ui', () => {
  it('renders the default thread welcome state inside the provider', () => {
    render(
      <ChatProtocolProvider
        apiUrl="http://127.0.0.1:8080/api/chat/runs"
        toolkit={toolkit}
        tools={tools}
        fetch={vi.fn()}
      >
        <ChatProtocolThread />
      </ChatProtocolProvider>,
    );

    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
  });

  it('renders the floating assistant modal trigger', () => {
    render(
      <ChatProtocolProvider
        apiUrl="http://127.0.0.1:8080/api/chat/runs"
        toolkit={toolkit}
        tools={tools}
        fetch={vi.fn()}
      >
        <ChatProtocolModal />
      </ChatProtocolProvider>,
    );

    expect(screen.getByRole('button', { name: /Open Assistant/ })).toBeInTheDocument();
  });
});
