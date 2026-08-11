import type { Preview } from '@storybook/web-components';
import '../dist/elements/index.js';
import '../dist/src/styles/basic.js';
import '../dist/src/styles/follow-system.js';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      autodocs: 'tag',
    },
  },
};

export default preview;
