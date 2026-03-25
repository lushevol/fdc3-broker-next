import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { GenerativeUIProvider } from '../common/GenerativeUI';
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
      send_workspace_announcement: expect.objectContaining({
        description: expect.any(String),
        humanInTheLoop: true,
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

  it('renders a HITL approval card and submits approval through addResult', async () => {
    const toolkit = createDemoToolkit();
    const ApprovalToolUi = toolkit.send_workspace_announcement.render;
    const addResult = jest.fn();

    if (!ApprovalToolUi) {
      throw new Error('Expected send_workspace_announcement tool UI renderer to exist');
    }

    render(
      <ApprovalToolUi
        toolName="send_workspace_announcement"
        toolCallId="tool-hitl-1"
        status={{ type: 'requires-action', reason: 'tool-calls' }}
        args={{
          title: 'Workspace Update Ready',
          audience: 'Operations Desk',
          summary: 'The active workspace was updated and is ready to be shared with the desk.',
        }}
        result={undefined}
        isError={false}
        addResult={addResult}
        resume={jest.fn()}
      />,
    );

    expect(screen.getByText('Approval Required')).toBeInTheDocument();
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Approve'));

    expect(addResult).toHaveBeenCalledWith(
      expect.objectContaining({
        approved: true,
        audience: 'Operations Desk',
        title: 'Workspace Update Ready',
      }),
    );
    expect(screen.getByText('Announcement Approved')).toBeInTheDocument();
    expect(screen.queryByText('Approval Required')).not.toBeInTheDocument();
    expect(screen.queryByText('Approve')).not.toBeInTheDocument();
    expect(screen.queryByText('Reject')).not.toBeInTheDocument();
    expect(addResult).toHaveBeenCalledTimes(1);
  });

  it('prefers the completed HITL result view when a result exists', () => {
    const toolkit = createDemoToolkit();
    const ApprovalToolUi = toolkit.send_workspace_announcement.render;

    if (!ApprovalToolUi) {
      throw new Error('Expected send_workspace_announcement tool UI renderer to exist');
    }

    render(
      <ApprovalToolUi
        toolName="send_workspace_announcement"
        toolCallId="tool-hitl-2"
        status={{ type: 'requires-action', reason: 'tool-calls' }}
        args={{
          title: 'Workspace Update Ready',
          audience: 'Operations Desk',
          summary: 'The active workspace was updated and is ready to be shared with the desk.',
        }}
        result={{
          approved: true,
          audience: 'Operations Desk',
          title: 'Workspace Update Ready',
          summary: 'The active workspace was updated and is ready to be shared with the desk.',
          reviewedAt: '10:58 AM',
          reviewer: 'Operator',
        }}
        isError={false}
        addResult={jest.fn()}
        resume={jest.fn()}
      />,
    );

    expect(screen.getByText('Announcement Approved')).toBeInTheDocument();
    expect(screen.queryByText('Approval Required')).not.toBeInTheDocument();
  });

  it('renders backend time tool results for the shared get_current_time tool name', () => {
    const toolkit = createDemoToolkit();
    const TimeToolUi = toolkit.get_current_time.render;

    if (!TimeToolUi) {
      throw new Error('Expected get_current_time tool UI renderer to exist');
    }

    render(
      <TimeToolUi
        toolName="get_current_time"
        toolCallId="tool-1"
        status={{ type: 'complete' }}
        args={{ timezone: 'Asia/Shanghai' }}
        result={{ timezone: 'Asia/Shanghai', formatted: '2026-03-25 10:00:00' }}
        isError={false}
        addResult={jest.fn()}
        resume={jest.fn()}
      />,
    );

    expect(screen.getByText('Browser Time')).toBeInTheDocument();
    expect(screen.getByText('Timezone: Asia/Shanghai')).toBeInTheDocument();
    expect(screen.getByText('2026-03-25 10:00:00')).toBeInTheDocument();
  });

  it('renders embedded generative UI metadata for the shared get_current_time tool name', () => {
    const toolkit = createDemoToolkit();
    const TimeToolUi = toolkit.get_current_time.render;

    if (!TimeToolUi) {
      throw new Error('Expected get_current_time tool UI renderer to exist');
    }

    render(
      <GenerativeUIProvider
        initialComponents={[
          {
            name: 'Card',
            component: ({ props }) => (
              <div data-testid="embedded-time-generative-ui">{String(props.title ?? '')}</div>
            ),
          },
        ]}
      >
        <TimeToolUi
          toolName="get_current_time"
          toolCallId="tool-2"
          status={{ type: 'complete' }}
          args={{ timezone: 'Asia/Shanghai' }}
          result={{
            timezone: 'Asia/Shanghai',
            formatted: '2026-03-25 10:00:00',
            __assistantUiGenerativeUi: {
              componentName: 'Card',
              props: { title: 'Current Time' },
            },
          }}
          isError={false}
          addResult={jest.fn()}
          resume={jest.fn()}
        />
      </GenerativeUIProvider>,
    );

    expect(screen.getByTestId('embedded-time-generative-ui')).toHaveTextContent('Current Time');
  });
});
