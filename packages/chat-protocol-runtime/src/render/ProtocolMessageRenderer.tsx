import type { ReactNode } from 'react';

import type {
  ChatActionPart,
  ChatAssistantPart,
  ChatCardPart,
  ChatErrorPart,
  ChatMessage,
  ChatUserPart,
  ChatToolCallPart,
} from 'chat-protocol-contract';

import { defaultCardRegistry, type CardRegistry } from './defaultCardRegistry';

type ProtocolRendererProps = {
  message: ChatMessage;
  cardRegistry?: CardRegistry;
};

type ProtocolRenderablePart = ChatAssistantPart | ChatUserPart;

function renderPart(part: ProtocolRenderablePart, cardRegistry: CardRegistry): ReactNode {
  switch (part.type) {
    case 'text':
      return <p key={part.text}>{part.text}</p>;
    case 'image':
      return <img key={part.url} src={part.url} alt={part.alt ?? ''} />;
    case 'file':
      return (
        <a key={part.url} href={part.url}>
          {part.name ?? part.url}
        </a>
      );
    case 'reasoning-summary':
      return <aside key={part.text}>{part.text}</aside>;
    case 'plan':
      return (
        <section key={part.planId} data-plan-id={part.planId}>
          <strong>{part.summary}</strong>
        </section>
      );
    case 'step-start':
      return (
        <div key={part.stepId} data-step-id={part.stepId}>
          {part.title ?? part.stepId}
        </div>
      );
    case 'step':
      return (
        <div key={part.stepId} data-step-id={part.stepId} data-step-status={part.status}>
          {part.title}
        </div>
      );
    case 'tool-call': {
      const toolPart = part as ChatToolCallPart;
      return (
        <div key={toolPart.toolCallId} data-tool-call-id={toolPart.toolCallId}>
          <strong>{toolPart.toolName}</strong>
          <pre>{JSON.stringify(toolPart.input, null, 2)}</pre>
        </div>
      );
    }
    case 'tool-result':
      return (
        <div key={part.toolCallId} data-tool-result-id={part.toolCallId}>
          <pre>{JSON.stringify(part.output, null, 2)}</pre>
        </div>
      );
    case 'card': {
      const cardPart = part as ChatCardPart;
      const Card =
        cardRegistry[cardPart.cardType] ?? cardRegistry.default ?? defaultCardRegistry.default;
      return <Card key={cardPart.cardType} card={cardPart} />;
    }
    case 'action': {
      const actionPart = part as ChatActionPart;
      return (
        <section key={actionPart.actionId} data-action-id={actionPart.actionId}>
          <strong>{actionPart.title}</strong>
          {actionPart.description ? <p>{actionPart.description}</p> : null}
        </section>
      );
    }
    case 'error': {
      const errorPart = part as ChatErrorPart;
      return (
        <div key={errorPart.code ?? errorPart.message} role="alert">
          {errorPart.message}
        </div>
      );
    }
    default:
      return null;
  }
}

export function ProtocolMessageRenderer({
  message,
  cardRegistry = defaultCardRegistry,
}: ProtocolRendererProps) {
  const parts = (
    'content' in message ? message.content : message.parts
  ) as readonly ProtocolRenderablePart[];
  const rendered = parts.map((part: ProtocolRenderablePart) => renderPart(part, cardRegistry));
  return (
    <section data-message-id={message.id} data-message-role={message.role}>
      {rendered}
    </section>
  );
}

export type { ProtocolRendererProps };
