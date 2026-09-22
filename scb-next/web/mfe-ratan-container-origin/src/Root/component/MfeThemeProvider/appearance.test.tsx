import { render, screen } from '@testing-library/react';
import { useTheme } from '@mui/material/styles';
import MfeThemeProvider from '.';

function AppearanceProbe() {
  const theme = useTheme();
  return (
    <output aria-label="Ratan appearance">
      {theme.palette.mode}/{theme.ratan.designGeneration}
    </output>
  );
}

describe('Ratan MFE appearance scope', () => {
  it('updates explicit mode and generation without replacing its host theme policy', () => {
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
});
