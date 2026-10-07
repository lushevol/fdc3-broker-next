import React from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface EmptyStateProps extends Omit<BoxProps, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  illustration?: React.ReactNode;
  action?: React.ReactNode;
  wrapperProps?: BoxProps;
  contentProps?: BoxProps;
}

export function EmptyState({
  title,
  description,
  illustration,
  action,
  wrapperProps,
  contentProps,
  ...rootProps
}: EmptyStateProps) {
  return (
    <Box component="section" {...rootProps}>
      <Box {...wrapperProps}>
        <Box component="section" {...contentProps}>
          {illustration}
          <Typography variant="body1" gutterBottom>
            {title}
          </Typography>
          {description !== undefined && description !== null && (
            <Typography variant="body2" gutterBottom>
              {description}
            </Typography>
          )}
          {action}
        </Box>
      </Box>
    </Box>
  );
}
