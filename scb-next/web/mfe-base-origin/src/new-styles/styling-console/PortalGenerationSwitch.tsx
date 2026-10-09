import React from 'react';
import { ToggleButton } from 'ratan-design-origin/toggle-button';
import { Box, ToggleButtonGroup, Tooltip, Typography } from 'ratan-design-origin/primitives';
import type { PortalGeneration } from './portal-generation';
import { consoleUiTokens as ui } from './ui-tokens';

export interface PortalGenerationControl {
  value: PortalGeneration;
  onChange: (generation: PortalGeneration) => void;
}

export function PortalGenerationSwitch({ value, onChange }: PortalGenerationControl) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: ui.space.large,
        right: ui.space.large + ui.triggerSize + ui.space.small,
        display: 'flex',
        alignItems: 'center',
        gap: `${ui.space.small}px`,
        padding: `${ui.space.small / 2}px ${ui.space.small}px`,
        minHeight: ui.triggerSize,
        boxSizing: 'border-box',
        backgroundColor: 'background.paper',
        color: 'text.primary',
        border: 1,
        borderColor: 'divider',
        borderRadius: `${ui.radius}px`,
        boxShadow: 2,
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Typography
        component="span"
        sx={{
          display: { xs: 'none', sm: 'inline' },
          fontSize: ui.type.caption,
          lineHeight: ui.lineHeight,
          whiteSpace: 'nowrap',
        }}
      >
        Portal style · Local
      </Typography>
      <Tooltip title="Switch Portal style" placement="top">
        <ToggleButtonGroup
          exclusive
          value={value}
          size="small"
          aria-label="Local portal style"
          onChange={(_event, next: PortalGeneration | null) => {
            if (next !== null && next !== value) onChange(next);
          }}
        >
          {(['legacy', 'webkit'] as const).map((generation) => (
            <ToggleButton
              key={generation}
              value={generation}
              aria-label={`Use ${generation === 'webkit' ? 'WebKit' : 'Legacy'} portal style`}
              sx={{
                fontSize: ui.type.caption,
                '&.MuiButtonBase-root': { minWidth: 0 },
                minHeight: ui.controlHeight,
                padding: `${ui.space.small / 2}px ${ui.space.small}px`,
                '&.Mui-selected': { transform: 'none' },
              }}
            >
              {generation === 'webkit' ? 'WebKit' : 'Legacy'}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Tooltip>
    </Box>
  );
}
