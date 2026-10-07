import React from 'react';

export const BuilderInstanceContext = /*#__PURE__*/ React.createContext<string | undefined>(
  undefined,
);

export const getBuilderTabId = (instanceId: string | undefined, index: number) =>
  instanceId === undefined ? `Builder-tab-${index}` : `Builder-${instanceId}-tab-${index}`;

export const getBuilderPanelId = (instanceId: string | undefined, index: number) =>
  instanceId === undefined
    ? `Builder-tabpanel-${index}`
    : `Builder-${instanceId}-tabpanel-${index}`;

export function builderTabProps(index: number) {
  const tabId = getBuilderTabId(undefined, index);
  const panelId = getBuilderPanelId(undefined, index);
  return {
    id: tabId,
    'aria-controls': panelId,
    'data-builder-tab-index': index,
    'data-builder-default-id': tabId,
    'data-builder-default-controls': panelId,
  };
}
