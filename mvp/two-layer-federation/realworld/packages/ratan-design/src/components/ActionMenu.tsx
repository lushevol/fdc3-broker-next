import {
  cloneElement,
  useState,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react';

export interface ActionMenuItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly disabled?: boolean;
  readonly tone?: 'default' | 'danger';
}

export interface ActionMenuProps {
  readonly ariaLabel: string;
  readonly trigger: ReactElement;
  readonly items: readonly ActionMenuItem[];
  readonly onAction: (id: string) => void;
  readonly className?: string;
}

interface TriggerProps {
  readonly 'aria-expanded'?: boolean;
  readonly 'aria-haspopup'?: 'menu';
  readonly 'aria-label'?: string;
  readonly onClick?: MouseEventHandler<HTMLElement>;
}

export function ActionMenu({
  ariaLabel,
  trigger,
  items,
  onAction,
  className,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const typedTrigger = trigger as ReactElement<TriggerProps>;
  const triggerLabel = typedTrigger.props['aria-label'] ?? ariaLabel;
  const triggerWithMenuBehavior = cloneElement(typedTrigger, {
    'aria-expanded': open,
    'aria-haspopup': 'menu',
    onClick: (event) => {
      typedTrigger.props.onClick?.(event);
      setOpen((current) => !current);
    },
  });

  return (
    <div className="ratan-action-menu-trigger">
      {triggerWithMenuBehavior}
      {open ? (
        <div className="ratan-action-menu-popover">
          <div
            aria-label={triggerLabel}
            className={['ratan-action-menu', className].filter(Boolean).join(' ')}
            data-ratan-component="action-menu"
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false);
            }}
            role="menu"
          >
            {items.map((item) => (
              <button
                className="ratan-action-menu-item"
                data-ratan-tone={item.tone ?? 'default'}
                disabled={item.disabled}
                key={item.id}
                onClick={() => {
                  onAction(item.id);
                  setOpen(false);
                }}
                role="menuitem"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
