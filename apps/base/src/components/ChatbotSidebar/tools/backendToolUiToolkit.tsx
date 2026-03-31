import React from 'react';
import type { ToolCallMessagePartProps } from '@assistant-ui/react';
import { z } from 'zod';
import { GenerativeUIRenderer } from '../components/GenerativeUIRenderer';
import type { AssistantRegisteredToolkit } from './toolRouting';

interface CalculatorArgs {
  expression?: string;
}

interface CalculatorResult {
  expression?: string;
  result?: number;
  error?: string;
  __assistantUiGenerativeUi?: {
    componentName?: string;
    props?: Record<string, unknown>;
  };
}

interface WeatherArgs {
  location?: string;
}

interface WeatherResult {
  location?: string;
  temperature?: number;
  temperatureUnit?: string;
  conditions?: string;
  humidity?: number;
  windSpeed?: number;
  windUnit?: string;
  lastUpdated?: string;
  note?: string;
  error?: string;
  __assistantUiGenerativeUi?: {
    componentName?: string;
    props?: Record<string, unknown>;
  };
}

function getEmbeddedGenerativeUi(
  result: CalculatorResult | WeatherResult | undefined,
): { componentName: string; props: Record<string, unknown> } | null {
  const componentName = result?.__assistantUiGenerativeUi?.componentName;

  if (!componentName) {
    return null;
  }

  return {
    componentName,
    props: result.__assistantUiGenerativeUi?.props ?? {},
  };
}

function getCardStyles(hasError: boolean): React.CSSProperties {
  if (hasError) {
    return {
      border: '1px solid #ef9a9a',
      backgroundColor: '#ffebee',
      color: '#7f1d1d',
    };
  }

  return {
    border: '1px solid #d0d7de',
    backgroundColor: '#f8fafc',
    color: '#111827',
  };
}

async function throwBackendOnlyExecutionError(toolName: string): Promise<never> {
  throw new Error(
    `Backend tool UI entry is render-only and cannot execute on the client: ${toolName}`,
  );
}

function BackendToolCard(props: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  hasError?: boolean;
}): JSX.Element {
  return (
    <div
      style={{
        marginTop: '0.75rem',
        borderRadius: '14px',
        padding: '1rem',
        ...getCardStyles(!!props.hasError),
      }}
    >
      <div style={{ fontWeight: 700 }}>{props.title}</div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', opacity: 0.8 }}>
        {props.subtitle}
      </div>
      <div style={{ marginTop: '0.75rem' }}>{props.children}</div>
    </div>
  );
}

function BackendCalculatorToolUi({
  args,
  result,
}: ToolCallMessagePartProps<CalculatorArgs, CalculatorResult>): JSX.Element {
  const hasError = !!result?.error;
  const expression = result?.expression ?? args.expression ?? 'Pending expression';
  const embeddedGenerativeUi = getEmbeddedGenerativeUi(result);

  return (
    <BackendToolCard title="Calculator" subtitle={`Expression: ${expression}`} hasError={hasError}>
      {embeddedGenerativeUi ? (
        <GenerativeUIRenderer
          componentName={embeddedGenerativeUi.componentName}
          props={embeddedGenerativeUi.props}
        />
      ) : null}
      {!embeddedGenerativeUi && hasError ? <div>{result?.error}</div> : null}
      {!embeddedGenerativeUi && !hasError && result?.result !== undefined ? (
        <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>Result: {result.result}</div>
      ) : null}
      {!embeddedGenerativeUi && !hasError && result?.result === undefined ? (
        <div>Running calculation...</div>
      ) : null}
    </BackendToolCard>
  );
}

function BackendWeatherToolUi({
  args,
  result,
}: ToolCallMessagePartProps<WeatherArgs, WeatherResult>): JSX.Element {
  const hasError = !!result?.error;
  const location = result?.location ?? args.location ?? 'Pending location';
  const embeddedGenerativeUi = getEmbeddedGenerativeUi(result);

  return (
    <BackendToolCard title="Weather" subtitle={`Location: ${location}`} hasError={hasError}>
      {embeddedGenerativeUi ? (
        <GenerativeUIRenderer
          componentName={embeddedGenerativeUi.componentName}
          props={embeddedGenerativeUi.props}
        />
      ) : null}
      {!embeddedGenerativeUi && hasError ? <div>{result?.error}</div> : null}
      {!embeddedGenerativeUi && result ? (
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <div>
            {result.temperature ?? '--'} {result.temperatureUnit ?? ''}
          </div>
          <div>{result.conditions ?? 'Fetching conditions...'}</div>
          <div>Humidity: {result.humidity ?? '--'}%</div>
          <div>
            Wind: {result.windSpeed ?? '--'} {result.windUnit ?? ''}
          </div>
          {result.lastUpdated ? (
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Updated {result.lastUpdated}</div>
          ) : null}
          {result.note ? (
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{result.note}</div>
          ) : null}
        </div>
      ) : null}
      {!embeddedGenerativeUi && !result ? <div>Fetching current weather...</div> : null}
    </BackendToolCard>
  );
}

export function createBackendToolUiToolkit(): AssistantRegisteredToolkit {
  return {
    calculator: {
      type: 'frontend',
      renderOnly: true,
      description: 'Render backend calculator tool calls inline in the assistant thread.',
      parameters: z.object({
        expression: z.string().optional(),
      }),
      execute: async () => throwBackendOnlyExecutionError('calculator'),
      render: BackendCalculatorToolUi,
    },
    get_weather: {
      type: 'frontend',
      renderOnly: true,
      description: 'Render backend weather tool calls inline in the assistant thread.',
      parameters: z.object({
        location: z.string().optional(),
      }),
      execute: async () => throwBackendOnlyExecutionError('get_weather'),
      render: BackendWeatherToolUi,
    },
  };
}
