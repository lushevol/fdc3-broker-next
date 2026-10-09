import React from 'react';
import { RatanDesignProvider } from 'ratan-design-origin/provider';
import { CssBaseline } from 'ratan-design-origin/primitives';
import { Config, getPortalTheme } from 'ratan-design-origin/portal-theme';
import { LocalizationProvider, AdapterDayjs } from 'ratan-design-origin/dates';
import { createPortalPresentationTheme } from './theme';
import './webkit.css';

interface StoryContext {
  globals: { theme?: string; designGeneration?: string };
}

/** Catalog appearance is explicit and independent of auth, URL and host storage. */
export default function StorybookTheme(Story: React.ComponentType, context: StoryContext) {
  const mode = context.globals.theme === 'dark' ? 'dark' : 'light';
  const designGeneration = context.globals.designGeneration === 'legacy' ? 'legacy' : 'webkit';
  const theme = React.useMemo(() => designGeneration === 'webkit'
    ? createPortalPresentationTheme(mode)
    : Config(getPortalTheme(mode)).config, [mode, designGeneration]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RatanDesignProvider baseTheme={theme} mode={mode} designGeneration={designGeneration}>
        <CssBaseline /><Story />
      </RatanDesignProvider>
    </LocalizationProvider>
  );
}
