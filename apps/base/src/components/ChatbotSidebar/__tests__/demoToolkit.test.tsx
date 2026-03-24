import React from 'react';
import { render, screen } from '@testing-library/react';
import { createDemoToolkit } from '../tools/demoToolkit';

describe('demoToolkit', () => {
  it('defines demo frontend tools with browser execution handlers', async () => {
    const toolkit = createDemoToolkit();

    expect(toolkit).toMatchObject({
      get_current_time: expect.objectContaining({
        description: expect.any(String),
        execute: expect.any(Function),
      }),
      generate_status_card: expect.objectContaining({
        description: expect.any(String),
        execute: expect.any(Function),
        render: expect.any(Function),
      }),
    });

    await expect(toolkit.get_current_time.execute({ locale: 'en-US' })).resolves.toMatchObject({
      locale: 'en-US',
      formattedTime: expect.any(String),
    });
  });

  it('renders inline tool ui for the demo status card tool', () => {
    const toolkit = createDemoToolkit();
    const StatusToolUi = toolkit.generate_status_card.render;
    const addResult = jest.fn();

    render(
      <StatusToolUi
        toolName="generate_status_card"
        toolCallId="tool-1"
        status={{ type: 'complete' }}
        args={{ title: 'Workspace', tone: 'success' }}
        result={{ title: 'Workspace', message: 'All systems operational', tone: 'success' }}
        isError={false}
        addResult={addResult}
        resume={jest.fn()}
      />,
    );

    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('All systems operational')).toBeInTheDocument();
  });
});
