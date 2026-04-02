import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import {
  createBrowserFdc3IntentToolkit,
  createFdc3IntentToolkit,
} from '../tools/fdc3IntentTool';

describe('fdc3IntentTool', () => {
  it('matches a declared ViewChart intent and builds declaration-backed payload args', () => {
    const toolkit = createFdc3IntentToolkit({
      openTile: jest.fn(),
      waitForIntentListener: jest.fn(),
      raiseIntent: jest.fn(),
    });

    const match = toolkit.process_fdc3_intent.matchPrompt?.('I want to view chart');

    expect(match).toMatchObject({
      matchedIntent: 'ViewChart',
      targetAppId: 'template_tile_fdc3_2',
      canProcess: true,
      payload: {
        type: 'fdc3.instrument',
        id: {
          ticker: 'AAPL',
        },
      },
    });
  });

  it('drops when the prompt does not match a declaration-backed intent', () => {
    const toolkit = createFdc3IntentToolkit({
      openTile: jest.fn(),
      waitForIntentListener: jest.fn(),
      raiseIntent: jest.fn(),
    });

    expect(toolkit.process_fdc3_intent.matchPrompt?.('open weather dashboard')).toBeNull();
  });

  it('renders a matched intent card and processes the intent on click', async () => {
    const openTile = jest.fn().mockResolvedValue({
      workspaceId: 'workspace-2',
      opened: true,
      newTile: true,
      failedReason: '',
    });
    const waitForIntentListener = jest.fn().mockResolvedValue(undefined);
    const raiseIntent = jest.fn().mockResolvedValue(undefined);
    const toolkit = createFdc3IntentToolkit({
      openTile,
      waitForIntentListener,
      raiseIntent,
    });

    const ToolUi = toolkit.process_fdc3_intent.render;
    const addResult = jest.fn();
    const resume = jest.fn();

    render(
      <ToolUi
        toolName="process_fdc3_intent"
        toolCallId="tool-1"
        status={{ type: 'requires-action' }}
        args={{
          matchedIntent: 'ViewChart',
          targetAppId: 'template_tile_fdc3_2',
          targetContexts: ['fdc3.instrument'],
          payload: {
            type: 'fdc3.instrument',
            id: {
              ticker: 'AAPL',
            },
            name: 'Apple Inc.',
          },
          canProcess: true,
          sourcePrompt: 'I want to view chart',
        }}
        result={undefined}
        isError={false}
        addResult={addResult}
        resume={resume}
      />,
    );

    expect(screen.getByText('FDC3 Intent Match')).toBeInTheDocument();
    expect(screen.getByText('ViewChart')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Process Intent' })).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'Process Intent' }));

    await waitFor(() => {
      expect(openTile).toHaveBeenCalledWith({
        tile: 'template_tile_fdc3_2',
      });
    });

    await waitFor(() => {
      expect(waitForIntentListener).toHaveBeenCalledWith({
        appId: 'template_tile_fdc3_2',
        intent: 'ViewChart',
      });
    });

    await waitFor(() => {
      expect(raiseIntent).toHaveBeenCalledWith(
        'ViewChart',
        expect.objectContaining({
          type: 'fdc3.instrument',
        }),
        {
          appId: 'template_tile_fdc3_2',
        },
      );
    });

    await waitFor(() => {
      expect(addResult).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: 'success',
          targetInstanceId: 'workspace-2',
        }),
      );
    });
  });

  it('shows a disabled process button when the declaration-backed match cannot be executed', () => {
    const toolkit = createFdc3IntentToolkit({
      openTile: jest.fn(),
      waitForIntentListener: jest.fn(),
      raiseIntent: jest.fn(),
    });
    const ToolUi = toolkit.process_fdc3_intent.render;

    render(
      <ToolUi
        toolName="process_fdc3_intent"
        toolCallId="tool-2"
        status={{ type: 'requires-action' }}
        args={{
          matchedIntent: 'ViewChart',
          targetAppId: 'template_tile_fdc3_2',
          targetContexts: ['fdc3.instrument'],
          payload: {
            type: 'fdc3.instrument',
            id: {
              ticker: '',
            },
          },
          canProcess: false,
          sourcePrompt: 'I want to view chart',
          blockedReason: 'Missing required payload identifiers in declarations.',
        }}
        result={undefined}
        isError={false}
        addResult={jest.fn()}
        resume={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Process Intent' })).toBeDisabled();
    expect(screen.getByText('Missing required payload identifiers in declarations.')).toBeInTheDocument();
  });

  it('uses the shared broker agent when processing intent in the browser toolkit', async () => {
    const openTile = jest.fn().mockResolvedValue({
      workspaceId: 'workspace-2',
      opened: true,
      newTile: true,
      failedReason: '',
    });
    const raiseIntent = jest.fn().mockResolvedValue(undefined);
    const waitForIntentListener = jest.fn().mockResolvedValue(undefined);

    const toolkit = createBrowserFdc3IntentToolkit(openTile, () => ({
      raiseIntent,
    }), waitForIntentListener);
    const ToolUi = toolkit.process_fdc3_intent.render;

    render(
      <ToolUi
        toolName="process_fdc3_intent"
        toolCallId="tool-3"
        status={{ type: 'requires-action' }}
        args={{
          matchedIntent: 'ViewChart',
          targetAppId: 'template_tile_fdc3_2',
          targetContexts: ['fdc3.instrument'],
          payload: {
            type: 'fdc3.instrument',
            id: {
              ticker: 'AAPL',
            },
          },
          canProcess: true,
          sourcePrompt: 'I want to view chart',
        }}
        result={undefined}
        isError={false}
        addResult={jest.fn()}
        resume={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Process Intent' }));

    await waitFor(() => {
      expect(waitForIntentListener).toHaveBeenCalledWith({
        appId: 'template_tile_fdc3_2',
        intent: 'ViewChart',
      });
    });

    await waitFor(() => {
      expect(raiseIntent).toHaveBeenCalledWith(
        'ViewChart',
        expect.objectContaining({
          type: 'fdc3.instrument',
        }),
        {
          appId: 'template_tile_fdc3_2',
        },
      );
    });
  });
});
