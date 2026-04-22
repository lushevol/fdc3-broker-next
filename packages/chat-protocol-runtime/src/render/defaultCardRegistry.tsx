import type { ComponentType } from 'react';

import type { ChatCardPart } from 'chat-protocol-contract';

type CardRendererProps = {
  card: ChatCardPart;
};

function DefaultCard({ card }: CardRendererProps) {
  return (
    <article data-card-type={card.cardType}>
      <strong>{card.cardType}</strong>
      <pre>{JSON.stringify(card.props, null, 2)}</pre>
    </article>
  );
}

export type CardRegistry = Record<string, ComponentType<CardRendererProps>>;

export const defaultCardRegistry: CardRegistry = {
  default: DefaultCard,
};
