import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Paper, Stack, Typography } from '../src/primitives';

const groups = [
  ['Actions', 'Buttons, loading and search actions, toggles, submission and reset.'],
  [
    'Fields and search',
    'Input and selection variants, validation, adornments, criteria and responsive forms.',
  ],
  [
    'Dialogs and feedback',
    'Modal forms, notifications, progress, empty states, retries and loading overlays.',
  ],
  [
    'Builder and dates',
    'Retained tab panels, filter configuration, date/time constraints and optional Pro ranges.',
  ],
  [
    'Foundations',
    'Layout, navigation, all curated primitives and icons, data grids, themes and tokens.',
  ],
  ['Compatibility', 'Legacy namespace APIs, presentation roots and their preserved defaults.'],
] as const;

function CatalogOverview() {
  return (
    <Box component="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Ratan Design Origin
        </Typography>
        <Typography>
          Reusable page-building components, their variants, and interactive scenarios.
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Explore a component
          </Typography>
          <Typography>
            Choose a story, adjust its Controls, and try the actions. Examples display their current
            values and callback results. Use Docs to inspect props and source.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            The toolbar switches between legacy and WebKit designs and light and dark modes. Resize
            the canvas to inspect compact and wide layouts.
          </Typography>
        </Paper>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {groups.map(([title, description]) => (
            <Paper key={title} variant="outlined" sx={{ p: 2, minWidth: 0 }}>
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
              <Typography>{description}</Typography>
            </Paper>
          ))}
        </Box>
        <Typography variant="body2">
          Examples run locally without portal services. Date ranges require the consuming
          application’s MUI X Pro license. Compatibility examples preserve legacy behavior; use core
          components for new UI.
        </Typography>
      </Stack>
    </Box>
  );
}

const meta = {
  title: 'Start here/Catalog',
  component: CatalogOverview,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'See STORYBOOK_COVERAGE.md for the complete component inventory, scenario dimensions and validation policy.',
      },
    },
  },
} satisfies Meta<typeof CatalogOverview>;
export default meta;
export const Overview: StoryObj<typeof meta> = {};
