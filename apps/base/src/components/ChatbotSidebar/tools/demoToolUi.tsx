import React, { useEffect, useState } from 'react';
import type { ToolCallMessagePartProps } from '@assistant-ui/react';
import { GenerativeUIRenderer } from '../components/GenerativeUIRenderer';
import type {
  StatusCardArgs,
  StatusCardResult,
  TimeToolArgs,
  TimeToolResult,
  WorkspaceAnnouncementArgs,
  WorkspaceAnnouncementResult,
} from './demoToolLogic';
import { createWorkspaceAnnouncementDecision } from './demoToolLogic';

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
  const resolvedTimezone = result?.timezone ?? args.timezone ?? 'UTC';
  const resolvedLocale = args.locale ?? result?.locale ?? 'en-US';
  const resolvedFormattedTime = result?.formattedTime ?? result?.formatted ?? '';
  const embeddedGenerativeUi = result?.__assistantUiGenerativeUi?.componentName
    ? {
        componentName: result.__assistantUiGenerativeUi.componentName,
        props: result.__assistantUiGenerativeUi.props ?? {},
      }
    : null;

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
        {args.timezone || result?.timezone
          ? `Timezone: ${resolvedTimezone}`
          : `Locale: ${resolvedLocale}`}
      </div>
      {embeddedGenerativeUi ? (
        <GenerativeUIRenderer
          componentName={embeddedGenerativeUi.componentName}
          props={embeddedGenerativeUi.props}
        />
      ) : null}
      <div style={{ marginTop: '0.5rem' }}>
        {result ? resolvedFormattedTime : 'Running browser time tool...'}
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

export function DemoWorkspaceAnnouncementApprovalToolUi({
  args,
  result,
  status,
  addResult,
}: ToolCallMessagePartProps<WorkspaceAnnouncementArgs, WorkspaceAnnouncementResult>): JSX.Element {
  const [optimisticResult, setOptimisticResult] = useState<WorkspaceAnnouncementResult | null>(
    result ?? null,
  );

  useEffect(() => {
    setOptimisticResult(result ?? null);
  }, [result]);

  const resolvedResult = result ?? optimisticResult;
  const decisionSubmitted = !!resolvedResult;

  const handleDecision = (approved: boolean) => {
    if (decisionSubmitted) {
      return;
    }

    const nextResult = createWorkspaceAnnouncementDecision(args, approved);
    setOptimisticResult(nextResult);
    addResult(nextResult);
  };

  if (!resolvedResult && status.type === 'requires-action') {
    return (
      <div
        style={{
          marginTop: '0.75rem',
          border: '1px solid #f0b429',
          borderRadius: '14px',
          padding: '1rem',
          backgroundColor: '#fff8e1',
          color: '#7a4f01',
        }}
      >
        <div style={{ fontWeight: 700 }}>Approval Required</div>
        <div style={{ marginTop: '0.375rem', fontSize: '0.95rem' }}>
          Review whether this workspace announcement should be sent.
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
          <strong>Title:</strong> {args.title}
        </div>
        <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
          <strong>Audience:</strong> {args.audience}
        </div>
        <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
          <strong>Summary:</strong> {args.summary}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => handleDecision(true)}
            disabled={decisionSubmitted}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.55rem 0.95rem',
              backgroundColor: '#2e7d32',
              color: '#ffffff',
              cursor: decisionSubmitted ? 'not-allowed' : 'pointer',
              opacity: decisionSubmitted ? 0.6 : 1,
              fontWeight: 600,
            }}
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => handleDecision(false)}
            disabled={decisionSubmitted}
            style={{
              border: '1px solid #c62828',
              borderRadius: '999px',
              padding: '0.55rem 0.95rem',
              backgroundColor: '#ffffff',
              color: '#c62828',
              cursor: decisionSubmitted ? 'not-allowed' : 'pointer',
              opacity: decisionSubmitted ? 0.6 : 1,
              fontWeight: 600,
            }}
          >
            Reject
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: '0.75rem',
        border: '1px solid #d0d7de',
        borderRadius: '14px',
        padding: '1rem',
        backgroundColor: '#f8fafc',
      }}
    >
      <div style={{ fontWeight: 700 }}>
        {resolvedResult?.approved ? 'Announcement Approved' : 'Announcement Rejected'}
      </div>
      <div style={{ marginTop: '0.375rem', fontSize: '0.95rem' }}>{args.title}</div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
        Audience: {resolvedResult?.audience ?? args.audience}
      </div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
        {resolvedResult?.summary ?? args.summary}
      </div>
      {resolvedResult?.reviewedAt ? (
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
          {resolvedResult.reviewer} reviewed at {resolvedResult.reviewedAt}
        </div>
      ) : null}
    </div>
  );
}
