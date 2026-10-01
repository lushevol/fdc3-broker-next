import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { RatanDesignProvider } from '../src';
import '../assets/styles.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Start here',
          'Components',
          'Patterns',
          'Foundation',
          'Inputs',
          'Search',
          'Feedback',
          'Integration',
          'Migration',
          'Controls',
        ],
      },
    },
    a11y: {
      test: 'error',
    },
  },
  globalTypes: {
    mode: {
      name: 'Color mode',
      toolbar: { icon: 'circlehollow', items: ['light', 'dark'], dynamicTitle: true },
    },
    designGeneration: {
      name: 'Design generation',
      toolbar: { icon: 'paintbrush', items: ['legacy', 'webkit'], dynamicTitle: true },
    },
  },
  initialGlobals: { mode: 'light', designGeneration: 'legacy' },
  decorators: [
    (Story, { globals }) => (
      <RatanDesignProvider mode={globals.mode} designGeneration={globals.designGeneration}>
        <div style={{ minHeight: '100vh' }}>
          <Story />
        </div>
      </RatanDesignProvider>
    ),
  ],
};
export default preview;
