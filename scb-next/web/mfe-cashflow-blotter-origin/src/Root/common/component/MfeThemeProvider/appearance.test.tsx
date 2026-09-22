import { render, screen } from '@testing-library/react';
import { useTheme } from '@mui/material/styles';

vi.unmock('.');
vi.unmock('../../../import');

import MfeThemeProvider from '.';

function AppearanceProbe() {
  const theme = useTheme();
  return (
    <output aria-label="Cashflow appearance">
      {theme.palette.mode}/{theme.ratan.designGeneration}
    </output>
  );
}

describe('Cashflow MFE appearance scope', () => {
  it('updates explicit mode and generation while retaining the Cashflow theme provider', () => {
    const { rerender } = render(
      <MfeThemeProvider appearance={{ mode: 'dark', designGeneration: 'webkit' }}>
        <AppearanceProbe />
      </MfeThemeProvider>,
    );

    const output = screen.getByLabelText('Cashflow appearance');
    expect(output).toHaveTextContent('dark/webkit');
    expect(output.closest('.ratan-design-root')).toHaveAttribute('data-generation', 'webkit');

    rerender(
      <MfeThemeProvider appearance={{ mode: 'light', designGeneration: 'legacy' }}>
        <AppearanceProbe />
      </MfeThemeProvider>,
    );
    expect(output).toHaveTextContent('light/legacy');
  });
});
