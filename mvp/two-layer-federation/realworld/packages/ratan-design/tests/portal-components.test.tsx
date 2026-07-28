import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  DesignSystemProvider,
  PageHeader,
  SideNavigation,
  WorkspaceTabs,
  type WorkspaceTabDefinition,
} from '../src';

const appearance = {
  scheme: 'dark',
  density: 'compact',
  direction: 'ltr',
} as const;

function renderDesign(children: React.ReactNode) {
  return render(
    <DesignSystemProvider appearance={appearance}>
      {children}
    </DesignSystemProvider>,
  );
}

function ControlledWorkspaceTabs({
  onClose,
}: {
  readonly onClose: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState('cashflow-1');
  const tabs: readonly WorkspaceTabDefinition[] = [
    {
      id: 'cashflow-1',
      label: 'Cashflow 1',
      closeLabel: 'Close Cashflow',
      content: <span>Cashflow panel</span>,
    },
    {
      id: 'cashflow-2',
      label: 'Cashflow 2',
      closeLabel: 'Close Cashflow 2',
      content: <span>Second cashflow panel</span>,
    },
  ];
  return (
    <WorkspaceTabs
      ariaLabel="Open applications"
      tabs={tabs}
      selectedId={selectedId}
      onSelectionChange={setSelectedId}
      onClose={onClose}
    />
  );
}

describe('portal design-system components', () => {
  it('renders a semantic page header with description and actions', () => {
    renderDesign(
      <PageHeader
        eyebrow="FMO NEXT"
        title="Operations Workspace"
        description="Post-trade application host"
        actions={<Button>Theme</Button>}
      />,
    );
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-ratan-component', 'page-header');
    expect(within(header).getByRole('heading', { level: 1 }))
      .toHaveTextContent('Operations Workspace');
    expect(within(header).getByText('Post-trade application host')).toBeInTheDocument();
    expect(within(header).getByRole('button', { name: 'Theme' })).toBeInTheDocument();
  });

  it('supports a title-only page header', () => {
    renderDesign(<PageHeader className="host-header" title="Workspace" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('ratan-page-header', 'host-header');
    expect(screen.queryByText('Post-trade application host')).not.toBeInTheDocument();
  });

  it('renders an application-level side navigation and delegates actions', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderDesign(
      <SideNavigation
        ariaLabel="Application launcher"
        title="Applications"
        selectedId="cashflow"
        items={[
          { id: 'cashflow', label: 'Cashflow', description: 'Settlement operations' },
          { id: 'reports', label: 'Reports', disabled: true },
        ]}
        onAction={onAction}
      />,
    );
    const navigation = screen.getByRole('navigation', { name: 'Application launcher' });
    expect(navigation).toHaveAttribute('data-ratan-component', 'side-navigation');
    expect(screen.getByRole('button', { name: /Cashflow/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Reports' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Cashflow/ }));
    expect(onAction).toHaveBeenCalledWith('cashflow');
  });

  it('supports an unselected navigation without optional item content', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderDesign(
      <SideNavigation
        ariaLabel="Compact launcher"
        className="compact-launcher"
        items={[{ id: 'cashflow', label: 'Cashflow' }]}
        onAction={onAction}
      />,
    );
    const navigation = screen.getByRole('navigation', { name: 'Compact launcher' });
    expect(navigation).toHaveClass('compact-launcher');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    const action = screen.getByRole('button', { name: 'Cashflow' });
    expect(action).not.toHaveAttribute('aria-current');
    await user.click(action);
    expect(onAction).toHaveBeenCalledWith('cashflow');
  });

  it('provides closable tabs, persistent panels, and keyboard selection', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderDesign(<ControlledWorkspaceTabs onClose={onClose} />);
    const tablist = screen.getByRole('tablist', { name: 'Open applications' });
    expect(tablist).toHaveAttribute('data-ratan-component', 'workspace-tabs');
    const first = screen.getByRole('tab', { name: 'Cashflow 1' });
    const second = screen.getByRole('tab', { name: 'Cashflow 2' });
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Cashflow panel').closest('[role="tabpanel"]')).not.toHaveAttribute('hidden');
    expect(screen.getByText('Second cashflow panel').closest('[role="tabpanel"]')).toHaveAttribute('hidden');

    first.focus();
    await user.keyboard('{ArrowRight}');
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Home}');
    expect(first).toHaveFocus();
    await user.keyboard('{End}');
    expect(second).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Close Cashflow 2' }));
    expect(onClose).toHaveBeenCalledWith('cashflow-2');
  });

  it('supports reverse tab navigation and empty workspaces', async () => {
    const user = userEvent.setup();
    renderDesign(
      <>
        <ControlledWorkspaceTabs onClose={vi.fn()} />
        <WorkspaceTabs
          ariaLabel="Empty applications"
          className="empty-workspace"
          tabs={[]}
          selectedId={null}
          onSelectionChange={vi.fn()}
          onClose={vi.fn()}
        />
      </>,
    );
    const first = screen.getByRole('tab', { name: 'Cashflow 1' });
    first.focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Cashflow 2' })).toHaveFocus();
    const empty = screen.getByRole('tablist', { name: 'Empty applications' });
    expect(empty).toBeEmptyDOMElement();
    expect(empty.parentElement).toHaveClass('empty-workspace');
    await user.keyboard('{Escape}');
  });
});
