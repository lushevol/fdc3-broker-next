import {
  Tab,
  TabList,
  TabPanel,
  Tabs as ReactAriaTabs,
} from 'react-aria-components';
import type { ReactNode } from 'react';

export interface TabDefinition {
  readonly id: string;
  readonly label: ReactNode;
  readonly content: ReactNode;
  readonly disabled?: boolean;
}

export interface TabsProps {
  readonly ariaLabel: string;
  readonly tabs: readonly TabDefinition[];
  readonly selectedId?: string;
  readonly onSelectionChange?: (id: string) => void;
  readonly className?: string;
}

export function Tabs({
  ariaLabel,
  tabs,
  selectedId,
  onSelectionChange,
  className,
}: TabsProps) {
  return (
    <ReactAriaTabs
      className={['ratan-tabs', className].filter(Boolean).join(' ')}
      data-ratan-component="tabs"
      selectedKey={selectedId}
      onSelectionChange={(key) => onSelectionChange?.(String(key))}
    >
      <TabList aria-label={ariaLabel} className="ratan-tab-list" items={tabs}>
        {(tab) => (
          <Tab className="ratan-tab" id={tab.id} isDisabled={tab.disabled}>
            {tab.label}
          </Tab>
        )}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel className="ratan-tab-panel" id={tab.id} key={tab.id}>
          {tab.content}
        </TabPanel>
      ))}
    </ReactAriaTabs>
  );
}
