import React from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export interface ErrorFallbackProps extends Omit<BoxProps, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function ErrorFallback({ title, description, action, ...rootProps }: ErrorFallbackProps) {
  return (
    <Box component="section" sx={{ width: '100%', p: 2 }} {...rootProps}>
      <Stack spacing={2} direction="column">
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {description !== undefined && description !== null && (
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
        )}
        {action !== undefined && action !== null && <div>{action}</div>}
      </Stack>
    </Box>
  );
}
