/**
 * Generative UI Renderer
 *
 * Renders generative UI components using the existing registry
 */

import React from 'react';
import { Box, useTheme } from '@mui/material';
import { useGenerativeUI } from '../common/GenerativeUI';

interface GenerativeUIRendererProps {
  componentName: string;
  props: Record<string, unknown>;
}

// Unknown component fallback
const UnknownComponent: React.FC<{ name: string }> = ({ name }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: theme.palette.warning.light,
        borderRadius: 2,
        color: theme.palette.warning.contrastText,
      }}
    >
      Unknown component: {name}
    </Box>
  );
};

export const GenerativeUIRenderer: React.FC<GenerativeUIRendererProps> = ({
  componentName,
  props,
}) => {
  const { getComponent } = useGenerativeUI();
  const Component = getComponent(componentName);

  if (!Component) {
    console.warn(`[GenerativeUIRenderer] Component "${componentName}" not found in registry`);
    return <UnknownComponent name={componentName} />;
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Component props={props} />
    </Box>
  );
};

export default GenerativeUIRenderer;
