import React from 'react';
import MuiTab from '@mui/material/Tab';
import { BuilderInstanceContext, getBuilderPanelId, getBuilderTabId } from './builder-context.js';

export { builderTabProps } from './builder-context.js';

type BuilderTabProps = React.ComponentProps<typeof MuiTab> & {
  'data-builder-tab-index'?: number;
  'data-builder-default-id'?: string;
  'data-builder-default-controls'?: string;
};

export const BuilderTab = /*#__PURE__*/ React.forwardRef<HTMLDivElement, BuilderTabProps>(
  function BuilderTab(
    {
      id,
      'aria-controls': ariaControls,
      'data-builder-tab-index': index,
      'data-builder-default-id': defaultId,
      'data-builder-default-controls': defaultControls,
      ...other
    },
    ref,
  ) {
    const instanceId = React.useContext(BuilderInstanceContext);
    const tabIndex = typeof index === 'number' ? index : undefined;
    const usesDefaultRelationship =
      tabIndex !== undefined && id === defaultId && ariaControls === defaultControls;
    const generatedTabId = !usesDefaultRelationship
      ? undefined
      : getBuilderTabId(instanceId, tabIndex);
    const generatedPanelId = !usesDefaultRelationship
      ? undefined
      : getBuilderPanelId(instanceId, tabIndex);
    return (
      <MuiTab
        ref={ref}
        id={generatedTabId ?? id}
        aria-controls={generatedPanelId ?? ariaControls}
        {...other}
      />
    );
  },
) as typeof MuiTab;
