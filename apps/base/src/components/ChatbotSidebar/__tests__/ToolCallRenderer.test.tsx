import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToolCallRenderer } from '../components/ToolCallRenderer';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

describe('ToolCallRenderer', () => {
  it('renders a pending confirmation state', () => {
    renderWithTheme(
      <ToolCallRenderer
        toolCallId="tool-1"
        toolName="calculator"
        args={{ expression: '2 + 2' }}
        requiresConfirmation
      />,
    );

    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText(/Waiting for confirmation/)).toBeInTheDocument();
  });

  it('renders tool results when execution completes', () => {
    renderWithTheme(
      <ToolCallRenderer
        toolCallId="tool-1"
        toolName="calculator"
        args={{ expression: '2 + 2' }}
        result={{ result: 4 }}
      />,
    );

    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText(/"result": 4/)).toBeInTheDocument();
  });
});
