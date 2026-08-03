import {
  useId,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { IconButton } from './IconButton';

export interface WorkspaceTabDefinition {
  readonly id: string;
  readonly label: ReactNode;
  readonly closeLabel: string;
  readonly content: ReactNode;
}

export interface WorkspaceTabsProps {
  readonly ariaLabel: string;
  readonly tabs: readonly WorkspaceTabDefinition[];
  readonly selectedId: string | null;
  readonly onSelectionChange: (id: string) => void;
  readonly onClose: (id: string) => void;
  readonly className?: string;
}

function focusTab(
  event: KeyboardEvent<HTMLButtonElement>,
  index: number,
  id: string,
  onSelectionChange: (id: string) => void,
) {
  const tablist = event.currentTarget.closest('[role="tablist"]') as HTMLElement;
  const tabs = Array.from(
    tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  const tab = tabs[index];
  tab.focus();
  onSelectionChange(id);
}

export function WorkspaceTabs({
  ariaLabel,
  tabs,
  selectedId,
  onSelectionChange,
  onClose,
  className,
}: WorkspaceTabsProps) {
  const componentId = useId();

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    focusTab(event, nextIndex, tabs[nextIndex].id, onSelectionChange);
  };

  return (
    <div className={['ratan-workspace-tabs', className].filter(Boolean).join(' ')}>
      <div
        aria-label={ariaLabel}
        className="ratan-workspace-tab-list"
        data-ratan-component="workspace-tabs"
        role="tablist"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === selectedId;
          const tabDomId = `${componentId}-tab-${index}`;
          const panelDomId = `${componentId}-panel-${index}`;
          return (
            <span className="ratan-workspace-tab" key={tab.id} role="presentation">
              <button
                aria-controls={panelDomId}
                aria-selected={selected}
                className="ratan-workspace-tab-trigger"
                data-ratan-component="button"
                data-ratan-variant="ghost"
                data-ratan-tab-id={tab.id}
                id={tabDomId}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => onSelectionChange(tab.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {tab.label}
              </button>
              <IconButton
                className="ratan-workspace-tab-close"
                icon="×"
                label={tab.closeLabel}
                type="button"
                variant="ghost"
                onClick={() => onClose(tab.id)}
              />
            </span>
          );
        })}
      </div>
      <div className="ratan-workspace-tab-panels">
        {tabs.map((tab, index) => (
          <div
            aria-labelledby={`${componentId}-tab-${index}`}
            className="ratan-workspace-tab-panel"
            hidden={tab.id !== selectedId}
            id={`${componentId}-panel-${index}`}
            key={tab.id}
            role="tabpanel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
