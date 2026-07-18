import { Chip, styled } from '@mui/material';
import type { ReactNode } from 'react';

export type StatusTone = 'ready' | 'review' | 'blocked' | 'neutral';

export interface StatusBadgeProps {
  readonly status?: StatusTone;
  readonly children: ReactNode;
}

const StyledStatusBadge = styled(Chip)({
  height: 'calc(var(--ratan-control-height) * 0.75)',
  borderRadius: 'var(--ratan-radius-pill)',
  fontSize: 'var(--ratan-font-size-label)',
  fontWeight: 'var(--ratan-font-weight-strong)',
  '&[data-status="ready"]': {
    color: 'var(--ratan-color-status-ready-content)',
    background: 'var(--ratan-color-status-ready-surface)',
  },
  '&[data-status="review"]': {
    color: 'var(--ratan-color-status-review-content)',
    background: 'var(--ratan-color-status-review-surface)',
  },
  '&[data-status="blocked"]': {
    color: 'var(--ratan-color-status-blocked-content)',
    background: 'var(--ratan-color-status-blocked-surface)',
  },
  '&[data-status="neutral"]': {
    color: 'var(--ratan-color-status-neutral-content)',
    background: 'var(--ratan-color-status-neutral-surface)',
  },
});

export function StatusBadge({ status = 'neutral', children }: StatusBadgeProps) {
  return <StyledStatusBadge data-status={status} label={children} size="small" />;
}
