import type { Preview } from '@storybook/react-webpack5';
import '@fm/ratan-design/styles.css';
import '@fm/ratan-design/themes/dark.css';
import '@fm/ratan-design/themes/cpbb.css';
import '@fm/ratan-design/modes/inter.css';
import '@fm/ratan-design/modes/roboto-mono.css';
import '@fm/ratan-design/modes/dyslexic.css';

const preview: Preview = {
  globalTypes: {
    theme: { description: 'SC theme', toolbar: { icon: 'paintbrush', items: ['standard', 'cpbb'] } },
    mode: { description: 'SC color mode', toolbar: { icon: 'contrast', items: ['light', 'dark'] } },
    font: { description: 'SC font mode', toolbar: { icon: 'paragraph', items: ['default', 'inter', 'roboto-mono', 'dyslexic'] } },
    direction: { description: 'Direction', toolbar: { icon: 'transfer', items: ['ltr', 'rtl'] } },
  },
  initialGlobals: { theme: 'standard', mode: 'light', font: 'default', direction: 'ltr' },
  decorators: [
    (Story, context) => {
      const root = document.documentElement;
      root.classList.remove('sc-theme-cpbb', 'sc-mode-light', 'sc-mode-dark', 'sc-mode-inter', 'sc-mode-roboto-mono', 'sc-mode-dyslexic');
      if (context.globals.theme === 'cpbb') root.classList.add('sc-theme-cpbb');
      root.classList.add(`sc-mode-${context.globals.mode}`);
      if (context.globals.font !== 'default') root.classList.add(`sc-mode-${context.globals.font}`);
      root.dir = context.globals.direction;
      return <div style={{ padding: 24 }}><Story /></div>;
    },
  ],
  parameters: {
    a11y: { test: 'error' },
    controls: { expanded: true },
    layout: 'fullscreen',
  },
};

export default preview;
