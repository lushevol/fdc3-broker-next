import type { Preview } from '@storybook/react';
import { DesignSystemProvider } from '../src';

const preview: Preview = {
  decorators: [
    (Story) => (
      <DesignSystemProvider
        appearance={{ scheme: 'dark', density: 'compact', direction: 'ltr' }}
        scope="storybook"
      >
        <div style={{ minHeight: '8rem', padding: '1rem' }}><Story /></div>
      </DesignSystemProvider>
    ),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
