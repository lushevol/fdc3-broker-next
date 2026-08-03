import {
  Button,
  Disclosure as ReactAriaDisclosure,
  DisclosurePanel,
  Heading,
} from 'react-aria-components';
import type { ReactNode } from 'react';

export interface DisclosureProps {
  readonly title: ReactNode;
  readonly children: ReactNode;
  readonly defaultExpanded?: boolean;
  readonly className?: string;
}

export function Disclosure({
  title,
  children,
  defaultExpanded = false,
  className,
}: DisclosureProps) {
  return (
    <ReactAriaDisclosure
      className={['ratan-disclosure', className].filter(Boolean).join(' ')}
      data-ratan-component="disclosure"
      defaultExpanded={defaultExpanded}
    >
      <Heading>
        <Button className="ratan-disclosure-trigger" slot="trigger">
          <span>{title}</span>
          <span className="ratan-disclosure-indicator" aria-hidden="true">›</span>
        </Button>
      </Heading>
      <DisclosurePanel className="ratan-disclosure-panel">
        {children}
      </DisclosurePanel>
    </ReactAriaDisclosure>
  );
}
