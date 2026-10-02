import { render, screen } from '@testing-library/react';
import { useTheme } from '@mui/material/styles';
import { createRatanTheme } from 'ratan-design-origin/theme';
import MfeThemeProvider from '.';

function AppearanceProbe() {
  const theme = useTheme();
  return (
    <output
      aria-label="Ratan appearance"
      data-font-family={theme.typography.fontFamily}
      data-primary={theme.palette.primary.main}
      data-background={theme.palette.background.default}
    >
      {theme.palette.mode}/{theme.ratan.designGeneration}
    </output>
  );
}

describe('Ratan MFE appearance scope', () => {
  it('updates explicit generation and restores the legacy host theme policy', () => {
    const { rerender } = render(
      <MfeThemeProvider appearance={{ mode: 'dark', designGeneration: 'webkit' }}>
        <AppearanceProbe />
      </MfeThemeProvider>,
    );

    const output = screen.getByLabelText('Ratan appearance');
    expect(output).toHaveTextContent('dark/webkit');
    expect(output.closest('.ratan-design-root')).toHaveAttribute('data-mode', 'dark');

    rerender(
      <MfeThemeProvider appearance={{ mode: 'light', designGeneration: 'legacy' }}>
        <AppearanceProbe />
      </MfeThemeProvider>,
    );
    expect(output).toHaveTextContent('light/legacy');
    expect(output).toHaveAttribute('data-font-family', '"Roboto", "Helvetica", "Arial", sans-serif');
    expect(output).toHaveAttribute('data-primary', '#1976d2');
  });

  it('keeps multiple mounted scopes independent', () => {
    render(
      <>
        <MfeThemeProvider appearance={{ mode: 'dark', designGeneration: 'webkit' }}>
          <span>WebKit host</span>
        </MfeThemeProvider>
        <MfeThemeProvider appearance={{ mode: 'light', designGeneration: 'legacy' }}>
          <span>Legacy host</span>
        </MfeThemeProvider>
      </>,
    );

    expect(screen.getByText('WebKit host').closest('.ratan-design-root')).toHaveAttribute(
      'data-generation',
      'webkit',
    );
    expect(screen.getByText('Legacy host').closest('.ratan-design-root')).toHaveAttribute(
      'data-generation',
      'legacy',
    );
  });

  it.each(['light', 'dark'] as const)('uses the WebKit palette and font in %s mode', (mode) => {
    const expected = createRatanTheme({ mode, designGeneration: 'webkit' });
    render(<MfeThemeProvider appearance={{ mode, designGeneration: 'webkit' }}>
      <AppearanceProbe />
    </MfeThemeProvider>);

    const output = screen.getByLabelText('Ratan appearance');
    expect(output).toHaveAttribute('data-font-family', expected.typography.fontFamily);
    expect(output).toHaveAttribute('data-primary', expected.palette.primary.main);
    expect(output).toHaveAttribute('data-background', expected.palette.background.default);
  });
});
