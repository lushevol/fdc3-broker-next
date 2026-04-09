import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ToolFallback } from './tool-fallback';

jest.mock('@assistant-ui/react', () => ({
  useScrollLock: () => jest.fn(),
}));

describe('ToolFallback', () => {
  it('renders a generic tool receipt without analytics-specific narration', () => {
    render(
      <ToolFallback
        toolName="statistic_count_by_app"
        argsText='{"appName":"cashflow","startTime":"2026-04-01T00:00:00Z","endTime":"2026-04-08T00:00:00Z"}'
        status={{ type: 'running' }}
      />,
    );

    expect(screen.getAllByText('Used tool').length).toBeGreaterThan(0);
    expect(screen.getAllByText('statistic_count_by_app').length).toBeGreaterThan(0);
    expect(screen.queryByText('App')).not.toBeInTheDocument();
    expect(screen.queryByText('Range')).not.toBeInTheDocument();

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
