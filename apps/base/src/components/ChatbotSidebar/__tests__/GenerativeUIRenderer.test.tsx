import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GenerativeUIProvider } from '../common/GenerativeUI';
import { GenerativeUIRenderer } from '../components/GenerativeUIRenderer';

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <GenerativeUIProvider
        initialComponents={[
          {
            name: 'ChartCard',
            component: ({ props }) => <div>{props.title as string}</div>,
          },
        ]}
      >
        {ui}
      </GenerativeUIProvider>
    </ThemeProvider>,
  );

describe('GenerativeUIRenderer', () => {
  it('renders registered generative UI components', () => {
    renderWithProviders(
      <GenerativeUIRenderer componentName="ChartCard" props={{ title: 'Revenue' }} />,
    );

    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('falls back for unknown components', () => {
    renderWithProviders(<GenerativeUIRenderer componentName="UnknownCard" props={{}} />);

    expect(screen.getByText(/Unknown component: UnknownCard/)).toBeInTheDocument();
  });
});
