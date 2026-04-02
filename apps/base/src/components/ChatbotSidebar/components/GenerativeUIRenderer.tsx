import React from 'react';
import { Box } from '@mui/material';
import { RegisteredComponent } from '../common/GenerativeUI';

interface GenerativeUIRendererProps {
  componentName: string;
  props: Record<string, unknown>;
}

export const GenerativeUIRenderer = React.memo(function GenerativeUIRenderer({
  componentName,
  props,
}: GenerativeUIRendererProps) {
  return (
    <Box sx={{ mt: 1 }}>
      <RegisteredComponent name={componentName} props={props} />
    </Box>
  );
});

export default GenerativeUIRenderer;
