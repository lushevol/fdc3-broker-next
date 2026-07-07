import type { ReactNode } from 'react';

export interface SortableTabProps {
  id: string;
  active: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
  children: ReactNode;
}
