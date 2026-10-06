import React from 'react';
import { createTheme, type Theme } from 'ratan-design-origin/theme';
import { Console } from './Console';
import {
  createControlPreviewBaseline,
  createStylePreviewTheme,
  createStylePreviewVariables,
} from './preview-theme';
import {
  DEFAULT_STYLE_SETTINGS,
  isLocalStylingConsole,
  normalizeStyleSettings,
  readStyleSettings,
  saveStyleSettings,
  type StyleSettings,
} from './settings';
import type { PortalStylePreview } from './contract';

interface Props {
  onPreviewChange: (preview: PortalStylePreview | null) => void;
}

function sessionStorageOrNull(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function LocalConsole({ onPreviewChange }: Props) {
  const [settings, setSettings] = React.useState(() => {
    const storage = sessionStorageOrNull();
    return storage ? readStyleSettings(storage) : DEFAULT_STYLE_SETTINGS;
  });
  React.useEffect(() => {
    const storage = sessionStorageOrNull();
    if (storage) saveStyleSettings(storage, settings);
    onPreviewChange(
      settings.applyToPortal
        ? {
            mode: settings.mode,
            designGeneration: settings.designGeneration,
            composeTheme: (baseline: Theme) => {
              const theme = createStylePreviewTheme(
                createControlPreviewBaseline(baseline, settings),
                settings,
              );
              const variables = createStylePreviewVariables(settings);
              return createTheme(theme, {
                components: {
                  MuiCssBaseline: {
                    styleOverrides: [
                      baseline.components?.MuiCssBaseline?.styleOverrides,
                      {
                        html: variables,
                        'html.ratan-design-root[data-generation][data-mode]': variables,
                        body: { fontFamily: theme.typography.fontFamily },
                      },
                    ],
                  },
                },
              });
            },
          }
        : null,
    );
  }, [settings, onPreviewChange]);
  React.useEffect(() => () => onPreviewChange(null), [onPreviewChange]);
  const onChange = React.useCallback((patch: Partial<StyleSettings>) => {
    setSettings((previous) => normalizeStyleSettings({ ...previous, ...patch }));
  }, []);
  return (
    <Console
      settings={settings}
      onChange={onChange}
      onReset={() => setSettings(DEFAULT_STYLE_SETTINGS)}
    />
  );
}

export default function StyleConsoleBoundary(props: Props) {
  return isLocalStylingConsole(true, window.location.hostname) ? <LocalConsole {...props} /> : null;
}
