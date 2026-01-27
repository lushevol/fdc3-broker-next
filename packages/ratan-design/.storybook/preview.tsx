import type { Preview } from '@storybook/react';
import '../src/gds.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div data-theme="Light Mode" style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
};

export default preview;
