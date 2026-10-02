import { render, screen } from '@testing-library/react';
import { useTheme } from '@mui/material/styles';
import { createRatanTheme } from 'ratan-design-origin/theme';

vi.unmock('.');
vi.unmock('../../../import');

import MfeThemeProvider from '.';
import NestedRatanThemeProvider from '../../../../cashflow-ratan/Root/component/MfeThemeProvider';

function AppearanceProbe() {
  const theme = useTheme();
  return (
    <output
      aria-label="Cashflow appearance"
      data-font-family={theme.typography.fontFamily}
      data-primary={theme.palette.primary.main}
      data-background={theme.palette.background.default}
    >
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

  it.each(['light', 'dark'] as const)('uses the WebKit palette and font in %s mode', (mode) => {
    const expected = createRatanTheme({ mode, designGeneration: 'webkit' });
    render(<MfeThemeProvider appearance={{ mode, designGeneration: 'webkit' }}>
      <AppearanceProbe />
    </MfeThemeProvider>);

    const output = screen.getByLabelText('Cashflow appearance');
    expect(output).toHaveAttribute('data-font-family', expected.typography.fontFamily);
    expect(output).toHaveAttribute('data-primary', expected.palette.primary.main);
    expect(output).toHaveAttribute('data-background', expected.palette.background.default);
  });

  it('keeps the WebKit palette and font in the nested Ratan scope', () => {
    const expected = createRatanTheme({ mode: 'dark', designGeneration: 'webkit' });
    render(<MfeThemeProvider appearance={{ mode: 'dark', designGeneration: 'webkit' }}>
      <NestedRatanThemeProvider><AppearanceProbe /></NestedRatanThemeProvider>
    </MfeThemeProvider>);

    const output = screen.getByLabelText('Cashflow appearance');
    expect(output).toHaveAttribute('data-font-family', expected.typography.fontFamily);
    expect(output).toHaveAttribute('data-primary', expected.palette.primary.main);
    expect(output).toHaveAttribute('data-background', expected.palette.background.default);
    expect(output.closest('.ratan-design-root')?.parentElement?.closest('.ratan-design-root'))
      .toHaveAttribute('data-generation', 'webkit');
  });
});
