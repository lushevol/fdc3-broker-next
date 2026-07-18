import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CashflowTable } from '../src';

const rows = [
  { id: 'CF-1001', currency: 'USD', amount: 1250000, counterparty: 'Atlas Bank', status: 'Ready' as const },
  { id: 'CF-1002', currency: 'EUR', amount: -420000, counterparty: 'Northstar AM', status: 'Review' as const },
];

describe('CashflowTable', () => {
  it('renders accessible cashflow rows and formatted amounts', () => {
    render(<CashflowTable rows={rows} selectedId={null} onSelect={vi.fn()} />);
    expect(screen.getByRole('table', { name: 'Cashflow records' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'CF-1001' })).toBeInTheDocument();
    expect(screen.getByText('1,250,000.00')).toBeInTheDocument();
    expect(screen.getByText('-420,000.00')).toBeInTheDocument();
    expect(screen.getByText('Ready').closest('[data-status]')).toHaveAttribute('data-status', 'ready');
    expect(screen.getByText('Review').closest('[data-status]')).toHaveAttribute('data-status', 'review');
  });

  it('reports row selection and exposes selected state', () => {
    const onSelect = vi.fn();
    const { rerender } = render(<CashflowTable rows={rows} selectedId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select CF-1002' }));
    expect(onSelect).toHaveBeenCalledWith(rows[1]);
    rerender(<CashflowTable rows={rows} selectedId="CF-1002" onSelect={onSelect} />);
    expect(screen.getByRole('row', { name: /CF-1002/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders an empty state', () => {
    render(<CashflowTable rows={[]} selectedId={null} onSelect={vi.fn()} />);
    expect(screen.getByText('No cashflows match this filter.')).toBeInTheDocument();
  });
});
