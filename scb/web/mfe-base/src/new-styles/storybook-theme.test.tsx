import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRatanAppearance } from 'ratan-design-origin/provider';
import { useTheme } from 'ratan-design-origin/theme';
import { DatePicker } from 'ratan-design-origin/dates';
import StorybookTheme from './storybook-theme';

function CatalogStory() {
  const appearance = useRatanAppearance();
  const theme = useTheme();
  return <><span>{`${appearance.mode}/${appearance.designGeneration}/${theme.palette.mode}`}</span>
    <DatePicker label="Catalog date" value={null} /></>;
}

it('provides the requested WebKit default and date localization without host authentication', () => {
  function DecoratedStory() { return StorybookTheme(CatalogStory, { globals: {} }); }
  render(<DecoratedStory />);
  expect(screen.getByText('light/webkit/light')).toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Catalog date' })).toHaveValue('');
});

it('supports an explicit Legacy dark catalog comparison', () => {
  function DecoratedStory() {
    return StorybookTheme(CatalogStory, { globals: { theme: 'dark', designGeneration: 'legacy' } });
  }
  render(<DecoratedStory />);
  expect(screen.getByText('dark/legacy/dark')).toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Catalog date' })).toHaveValue('');
});
