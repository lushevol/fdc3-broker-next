import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ToolFallback } from './tool-fallback';

jest.mock('@assistant-ui/react', () => ({
  useScrollLock: () => jest.fn(),
}));

describe('ToolFallback', () => {
  it('renders analytics tools as a premium receipt with app and range summary', () => {
    render(
      <ToolFallback
        toolName="statistic_count_by_app"
        argsText='{"appName":"cashflow","startTime":"2026-04-01T00:00:00Z","endTime":"2026-04-08T00:00:00Z"}'
        status={{ type: 'running' }}
      />,
    );

    expect(screen.getAllByText('Used tool').length).toBeGreaterThan(0);
    expect(screen.getAllByText('statistic_count_by_app').length).toBeGreaterThan(0);
    expect(screen.getByText('App')).toBeInTheDocument();
    expect(screen.getByText('cashflow')).toBeInTheDocument();
    expect(screen.getByText('Range')).toBeInTheDocument();
    expect(screen.getByText('Apr 1 - Apr 8')).toBeInTheDocument();

    const root = screen.getByRole('button').closest('[data-slot="tool-fallback-root"]');
    expect(root).toHaveClass('rounded-2xl');
  });

  it('shows raw arguments in the expanded body for analytics tools', () => {
    render(
      <ToolFallback
        toolName="statistic_count_by_app"
        argsText='{"appName":"cashflow","startTime":"2026-04-01T00:00:00Z","endTime":"2026-04-08T00:00:00Z"}'
        status={{ type: 'complete' }}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Request')).toBeInTheDocument();
    expect(screen.getByText(/"appName":"cashflow"/)).toBeInTheDocument();
  });
});
