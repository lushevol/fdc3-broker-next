import type { ReactNode } from 'react';
import { Button } from './Button';

export interface SideNavigationItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly ariaLabel?: string;
  readonly description?: ReactNode;
  readonly trailingContent?: ReactNode;
  readonly disabled?: boolean;
}

export interface SideNavigationProps {
  readonly ariaLabel: string;
  readonly title?: ReactNode;
  readonly items: readonly SideNavigationItem[];
  readonly selectedId?: string;
  readonly onAction: (id: string) => void;
  readonly className?: string;
}

export function SideNavigation({
  ariaLabel,
  title,
  items,
  selectedId,
  onAction,
  className,
}: SideNavigationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={['ratan-side-navigation', className].filter(Boolean).join(' ')}
      data-ratan-component="side-navigation"
    >
      {title ? <h2 className="ratan-side-navigation-title">{title}</h2> : null}
      <div className="ratan-side-navigation-items">
        {items.map((item) => (
          <Button
            aria-label={item.ariaLabel}
            aria-current={item.id === selectedId ? 'page' : undefined}
            className="ratan-side-navigation-item"
            disabled={item.disabled}
            key={item.id}
            type="button"
            variant="ghost"
            onClick={() => onAction(item.id)}
          >
            <span className="ratan-side-navigation-copy">
              <span className="ratan-side-navigation-label">{item.label}</span>
              {item.description ? (
                <span className="ratan-side-navigation-description">
                  {item.description}
                </span>
              ) : null}
            </span>
            {item.trailingContent ? (
              <span className="ratan-side-navigation-trailing">
                {item.trailingContent}
              </span>
            ) : null}
          </Button>
        ))}
      </div>
    </nav>
  );
}
