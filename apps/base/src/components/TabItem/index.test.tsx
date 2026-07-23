import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TabItem from './index';

jest.mock('./common/style', () => {
  const mockReact = jest.requireActual<typeof import('react')>('react');
  const MockRoot = mockReact.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ children, ...props }, ref) => (
      <section ref={ref} {...props}>
        {children}
      </section>
    ),
  );
  return {
    __esModule: true,
    default: MockRoot,
    classes: { textBoxOutter: 'textBoxOutter', textBox: 'textBox', button: 'button' },
    PREFIX: 'tab',
  };
});

const item = {
  id: 'workspace-1',
  label: 'Workspace 1',
  isActive: true,
  containers: [
    {
      id: 'tile-1',
      container: '@fm/tile',
      module: '/module',
      tile: '/tile',
      title: 'Tile',
      emailSupport: 'support@example.com',
      panelId: 'panel-1',
      tabId: 'workspace-1',
    },
  ],
};

const renderTab = (openInSingleView = jest.fn().mockResolvedValue(undefined)) => {
  render(
    <TabItem
      item={item}
      edit={() => jest.fn()}
      remove={() => jest.fn()}
      refreshTab={() => jest.fn()}
      showRemove={true}
      showRefresh={false}
      closeOthers={jest.fn()}
      closeAll={jest.fn()}
      openInSingleView={openInSingleView}
    />,
  );
  return openInSingleView;
};

describe('TabItem single-view interaction', () => {
  it('opens a tile in single view from the kebab menu', () => {
    const openInSingleView = renderTab();

    fireEvent.click(screen.getByLabelText('workspace menu'));
    fireEvent.click(screen.getByText('Open in Single View'));

    expect(openInSingleView).toHaveBeenCalledWith(item);
  });

  it('opens the same menu on right click', () => {
    renderTab();

    fireEvent.contextMenu(screen.getByTestId('tab'));

    expect(screen.getByText('Open in Single View')).toBeVisible();
  });
});
