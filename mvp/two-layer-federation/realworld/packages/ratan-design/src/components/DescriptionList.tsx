import type { ReactNode } from 'react';

export interface DescriptionItem {
  readonly id: string;
  readonly term: ReactNode;
  readonly description: ReactNode;
}

export interface DescriptionListProps {
  readonly items: readonly DescriptionItem[];
  readonly className?: string;
}

export function DescriptionList({
  items,
  className,
}: DescriptionListProps) {
  return (
    <dl
      className={['ratan-description-list', className].filter(Boolean).join(' ')}
      data-ratan-component="description-list"
    >
      {items.map((item) => (
        <div className="ratan-description-item" key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
