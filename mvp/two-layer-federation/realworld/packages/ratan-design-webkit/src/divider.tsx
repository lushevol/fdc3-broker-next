import type { DividerProps } from '@fm/ratan-design';
import { useEffect, useRef } from 'react';
import type * as React from 'react';
import { defineScDivider, type ScDivider } from '../elements/sc-divider.js';

/** React compatibility contract for the promoted Lit divider. */
export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  const dividerRef = useRef<ScDivider | null>(null);

  defineScDivider();

  useEffect(() => {
    if (!dividerRef.current) return;
    // The imported WebKit source names its horizontal-line mode `vertical`.
    dividerRef.current.vertical = orientation === 'horizontal';
    dividerRef.current.className = ['ratan-divider', className].filter(Boolean).join(' ');
  }, [className, orientation]);

  return (
    <sc-divider
      ref={(element) => {
        dividerRef.current = element;
      }}
      data-orientation={orientation}
      data-ratan-component="divider"
      data-ratan-implementation="webkit"
      role="separator"
      aria-orientation={orientation}
    />
  );
}

declare module 'react' {
  // Custom-element JSX declarations require React's ambient JSX namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'sc-divider': React.DetailedHTMLProps<React.HTMLAttributes<ScDivider>, ScDivider>;
    }
  }
}

export type { DividerProps };
