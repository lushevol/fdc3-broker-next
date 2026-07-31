import {
  StatusBadge as EstablishedStatusBadge,
  type StatusBadgeProps,
  type StatusTone,
} from '@fm/ratan-design';
import { useEffect, useRef } from 'react';
import type * as React from 'react';
import { defineScBadge, type ScBadge } from './elements/sc-badge.js';

const STATUS_COLORS: Record<StatusTone, string> = {
  ready: 'green',
  review: 'amber',
  blocked: 'red',
  neutral: 'grey',
};

/** React compatibility contract for the promoted Lit badge. */
export function StatusBadge({
  status = 'neutral',
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const badgeRef = useRef<ScBadge | null>(null);
  const supportsWebKit = typeof children === 'string' || typeof children === 'number';

  defineScBadge();

  useEffect(() => {
    if (!supportsWebKit || !badgeRef.current) return;
    badgeRef.current.type = 'text';
    badgeRef.current.color = STATUS_COLORS[status] as ScBadge['color'];
    badgeRef.current.label = String(children);
  }, [children, status, supportsWebKit]);

  if (!supportsWebKit) {
    return (
      <EstablishedStatusBadge {...props} className={className} status={status}>
        {children}
      </EstablishedStatusBadge>
    );
  }

  return (
    <span
      {...props}
      className={['ratan-status-badge', className].filter(Boolean).join(' ')}
      data-ratan-component="status-badge"
      data-ratan-implementation="webkit"
      data-status={status}
    >
      <sc-badge
        ref={(element) => {
          badgeRef.current = element;
        }}
      >
        {String(children)}
      </sc-badge>
    </span>
  );
}

declare module 'react' {
  // Custom-element JSX declarations require React's ambient JSX namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'sc-badge': React.DetailedHTMLProps<React.HTMLAttributes<ScBadge>, ScBadge>;
    }
  }
}

export type { StatusBadgeProps, StatusTone };
