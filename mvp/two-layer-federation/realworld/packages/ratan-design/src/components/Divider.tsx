import { Separator } from 'react-aria-components';

export interface DividerProps {
  readonly orientation?: 'horizontal' | 'vertical';
  readonly className?: string;
}

export function Divider({
  orientation = 'horizontal',
  className,
}: DividerProps) {
  return (
    <Separator
      className={['ratan-divider', className].filter(Boolean).join(' ')}
      data-ratan-component="divider"
      orientation={orientation}
    />
  );
}
