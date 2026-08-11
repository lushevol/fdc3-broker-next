import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { assertNoAxeViolations } from '@fm/ratan-design-vitest';

import parityManifest from '../../../manifests/parity-manifest.json';
import {
  Tab,
  TabDivider,
  TabList,
  TabPanel,
  Tabs,
  type TabsHandle,
} from '../src/tabs';

function Fixture({ activation = 'auto' }: { activation?: 'auto' | 'manual' }) {
  return (
    <Tabs defaultSelectedKey="positions" activation={activation} aria-label="Workspace">
      <TabList>
        <Tab id="positions">Positions</Tab>
        <Tab id="orders">Orders</Tab>
        <Tab id="disabled" disabled>Disabled</Tab>
      </TabList>
      <TabPanel id="positions">Position content</TabPanel>
      <TabPanel id="orders">Order content</TabPanel>
      <TabPanel id="disabled">Disabled content</TabPanel>
    </Tabs>
  );
}

describe('Tabs proof contract', () => {
  it('selects uncontrolled tabs with React Aria arrow navigation and roving focus', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const positions = screen.getByRole('tab', { name: 'Positions' });
    await user.click(positions);
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Orders' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Orders' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Order content');
  });

  it('keeps focus and selection distinct in manual activation mode', async () => {
    const user = userEvent.setup();
    render(<Fixture activation="manual" />);
    const positions = screen.getByRole('tab', { name: 'Positions' });
    await user.click(positions);
    await user.keyboard('{ArrowRight}');

    const orders = screen.getByRole('tab', { name: 'Orders' });
    expect(orders).toHaveFocus();
    expect(positions).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Enter}');
    expect(orders).toHaveAttribute('aria-selected', 'true');
  });

  it('supports controlled selection and stable lifecycle details', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const onTabSelect = vi.fn();
    const onTabHide = vi.fn();
    const onTabShow = vi.fn();
    render(
      <Tabs
        selectedKey="positions"
        onSelectionChange={onSelectionChange}
        onTabSelect={onTabSelect}
        onTabHide={onTabHide}
        onTabShow={onTabShow}
        aria-label="Controlled"
      >
        <TabList><Tab id="positions">Positions</Tab><Tab id="orders">Orders</Tab></TabList>
        <TabPanel id="positions">Positions</TabPanel><TabPanel id="orders">Orders</TabPanel>
      </Tabs>,
    );
    await user.click(screen.getByRole('tab', { name: 'Orders' }));

    expect(onSelectionChange).toHaveBeenCalledWith('orders');
    expect(onTabSelect).toHaveBeenCalledWith(expect.objectContaining({ key: 'orders', previousKey: 'positions' }));
    expect(onTabHide).toHaveBeenCalledWith(expect.objectContaining({ key: 'positions' }));
    expect(onTabShow).toHaveBeenCalledWith(expect.objectContaining({ key: 'orders' }));
    expect(screen.getByRole('tab', { name: 'Positions' })).toHaveAttribute('aria-selected', 'true');
  });

  it('skips disabled tabs and inherits RTL keyboard direction', async () => {
    const user = userEvent.setup();
    render(
      <div dir="rtl">
        <Tabs defaultSelectedKey="orders" aria-label="RTL">
          <TabList>
            <Tab id="positions">Positions</Tab><Tab id="orders">Orders</Tab><Tab id="disabled" disabled>Disabled</Tab>
          </TabList>
          <TabPanel id="positions">Positions</TabPanel><TabPanel id="orders">Orders</TabPanel><TabPanel id="disabled">Disabled</TabPanel>
        </Tabs>
      </div>,
    );
    const orders = screen.getByRole('tab', { name: 'Orders' });
    await user.click(orders);
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Positions' })).toHaveFocus();
  });

  it('uses React Aria press behavior for closable tabs', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Tabs defaultSelectedKey="orders" aria-label="Closable">
        <TabList><Tab id="orders" closable onClose={onClose}>Orders</Tab></TabList>
        <TabPanel id="orders">Orders</TabPanel>
      </Tabs>,
    );
    await user.click(screen.getByRole('button', { name: 'Close Orders' }));
    expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ key: 'orders', reason: 'close-button' }));
  });

  it('preserves frozen variants and imperative selection compatibility', () => {
    const ref = createRef<TabsHandle>();
    render(
      <Tabs ref={ref} defaultSelectedKey="positions" variant="segmented" alignment="center" showTabsBottomLine aria-label="Styled">
        <TabList><Tab id="positions">Positions</Tab><Tab id="orders" error counter={3}>Orders</Tab></TabList>
        <TabPanel id="positions">Positions</TabPanel><TabPanel id="orders">Orders</TabPanel>
      </Tabs>,
    );
    const root = screen.getByRole('tablist').closest('[data-ratan-component="Tabs"]');
    expect(root).toHaveAttribute('data-variant', 'segmented');
    expect(root).toHaveAttribute('data-alignment', 'center');
    expect(root).toHaveAttribute('data-bottom-line', 'true');
    act(() => ref.current?.show('orders'));
    expect(screen.getByRole('tab', { name: /Orders/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('maps the full frozen tab cohort to the tabs subpath and passes Axe', async () => {
    const { container } = render(<Fixture />);
    const tags = parityManifest.components
      .filter((component) => component.react?.subpath === './tabs')
      .map((component) => component.legacy.tag);
    expect(tags).toEqual(['sc-tab', 'sc-tab-divider', 'sc-tab-group', 'sc-tab-panel']);
    await expect(assertNoAxeViolations({ context: container })).resolves.toBeDefined();
  });

  it('covers legacy aliases, visual states, separators, and custom classes', () => {
    render(
      <Tabs defaultSelectedKey="legacy" orientation="vertical" className="custom-tabs" aria-label="Legacy">
        <TabList className="custom-list">
          <Tab
            panel="legacy"
            active
            noActiveBottomLine
            error
            icon={<span>Icon</span>}
            counter={0}
            variant="filled"
            className="custom-tab"
          >
            Legacy
          </Tab>
          <TabDivider className="custom-divider" />
        </TabList>
        <TabPanel name="legacy" active className="custom-panel">Legacy panel</TabPanel>
      </Tabs>,
    );

    const tab = screen.getByRole('tab', { name: /Legacy/ });
    expect(tab).toHaveClass('custom-tab');
    expect(tab).toHaveAttribute('data-active', 'true');
    expect(tab).toHaveAttribute('data-no-active-bottom-line', 'true');
    expect(tab).toHaveAttribute('data-variant', 'filled');
    expect(screen.getByRole('separator')).toHaveClass('custom-divider');
    expect(screen.getByRole('tabpanel')).toHaveClass('custom-panel');
  });

  it('preserves imperative scroll and closed-tab recovery methods', () => {
    const ref = createRef<TabsHandle>();
    const scrollIntoView = vi.fn();
    render(
      <Tabs ref={ref} defaultSelectedKey="removed" aria-label="Imperative">
        <TabList><Tab id="first">First</Tab><Tab id="disabled" disabled>Disabled</Tab></TabList>
        <TabPanel id="first">First panel</TabPanel><TabPanel id="disabled">Disabled panel</TabPanel>
      </Tabs>,
    );
    const first = screen.getByRole('tab', { name: 'First' });
    first.scrollIntoView = scrollIntoView;

    act(() => ref.current?.hideClosedTab());
    expect(first).toHaveAttribute('aria-selected', 'true');
    act(() => ref.current?.updateScrollControls());
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
    expect(ref.current?.element).toBe(first.closest('[data-ratan-component="Tabs"]'));
    act(() => ref.current?.hideClosedTab());
    expect(first).toHaveAttribute('aria-selected', 'true');
  });

  it('supports custom close labels for rich tab labels', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Tabs defaultSelectedKey="rich" aria-label="Rich">
        <TabList>
          <Tab id="rich" closable closeLabel="Dismiss rich tab" onClose={onClose}>
            <strong>Rich</strong>
          </Tab>
        </TabList>
        <TabPanel id="rich">Rich panel</TabPanel>
      </Tabs>,
    );
    await user.click(screen.getByRole('button', { name: 'Dismiss rich tab' }));
    expect(onClose).toHaveBeenCalledWith({ key: 'rich', reason: 'close-button' });
  });
});
