import React from 'react';
import { BuilderInstanceContext, getBuilderPanelId, getBuilderTabId } from './builder-context.js';

export interface BuilderTabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  value: number;
}

export function BuilderTabPanel({
  children,
  value,
  index,
  ...other
}: Readonly<BuilderTabPanelProps>) {
  const instanceId = React.useContext(BuilderInstanceContext);
  const panelId = getBuilderPanelId(instanceId, index);
  const tabId = getBuilderTabId(instanceId, index);
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={panelId}
      data-testid={`Builder-tabpanel-${index}`}
      aria-labelledby={tabId}
      {...other}
    >
      {children}
    </div>
  );
}
