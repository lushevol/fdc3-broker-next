import React from 'react';
import type { ToolCallMessagePartProps } from '@assistant-ui/react';
import type {
  StatusCardArgs,
  StatusCardResult,
  TimeToolArgs,
  TimeToolResult,
} from './demoToolLogic';

function getToneStyles(tone: 'success' | 'warning' | 'info'): React.CSSProperties {
  if (tone === 'success') {
    return {
      borderColor: '#2e7d32',
      backgroundColor: '#edf7ed',
      color: '#1b5e20',
    };
  }

  if (tone === 'warning') {
    return {
      borderColor: '#ed6c02',
      backgroundColor: '#fff4e5',
      color: '#8a4b00',
    };
  }

  return {
    borderColor: '#0288d1',
    backgroundColor: '#e5f6fd',
    color: '#014361',
  };
}

export function DemoTimeToolUi({
  args,
  result,
}: ToolCallMessagePartProps<TimeToolArgs, TimeToolResult>): JSX.Element {
  return (
    <div
      style={{
        marginTop: '0.75rem',
        border: '1px solid #d0d7de',
        borderRadius: '12px',
        padding: '0.875rem 1rem',
        backgroundColor: '#f8fafc',
      }}
    >
      <div style={{ fontWeight: 600 }}>Browser Time</div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
        Locale: {args.locale || 'en-US'}
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        {result ? result.formattedTime : 'Running browser time tool...'}
      </div>
    </div>
  );
}

export function DemoStatusCardToolUi({
  result,
}: ToolCallMessagePartProps<StatusCardArgs, StatusCardResult>): JSX.Element {
  const tone = result?.tone ?? 'info';

  return (
    <div
      style={{
        marginTop: '0.75rem',
        border: '1px solid',
        borderRadius: '14px',
        padding: '1rem',
        ...getToneStyles(tone),
      }}
    >
      <div style={{ fontWeight: 700 }}>{result?.title ?? 'Generating status card'}</div>
      <div style={{ marginTop: '0.375rem', fontSize: '0.95rem' }}>
        {result?.message ?? 'Preparing status summary...'}
      </div>
      {result?.generatedAt ? (
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
          Generated at {result.generatedAt}
        </div>
      ) : null}
    </div>
  );
}
