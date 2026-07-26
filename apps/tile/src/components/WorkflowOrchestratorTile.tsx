import { css, cx } from '@emotion/css';
import { useMemo, useReducer } from 'react';
import type {
  WorkflowEvent,
  WorkflowEventSubscription,
  WorkflowResolution,
} from 'ratan-fdc3-agent';
import { FDC3Agent } from '../Root/import';
import type { TileProps } from '../Root/routing/common/interface';
import {
  createInitialOrchestratorState,
  type ProcessorState,
  WORKFLOW_PROCESSORS,
  workflowOrchestratorReducer,
} from './workflowOrchestratorState';

const WORKFLOW_ID = 'trade.workflow.insight';
const WORKFLOW_INPUT = { status: 'PENDING_VALIDATION' };

const TOKENS = {
  ink: '#14202b',
  slate: '#52606d',
  surface: '#f5f7f8',
  panel: '#ffffff',
  line: '#d9e2e7',
  signal: '#0b7285',
  signalSoft: '#e6f4f6',
  live: '#f59f00',
  liveSoft: '#fff4d6',
  success: '#087f5b',
  successSoft: '#e6fcf5',
  danger: '#c92a2a',
  dangerSoft: '#fff0f0',
} as const;

const styles = {
  root: css({
    minHeight: '100%',
    boxSizing: 'border-box',
    padding: 20,
    color: TOKENS.ink,
    backgroundColor: TOKENS.surface,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  }),
  header: css({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 18,
    paddingBottom: 18,
    borderBottom: `1px solid ${TOKENS.line}`,
    '@media (max-width: 720px)': {
      alignItems: 'stretch',
      flexDirection: 'column',
    },
  }),
  eyebrow: css({
    color: TOKENS.signal,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  }),
  title: css({
    margin: '6px 0 4px',
    fontSize: 26,
    lineHeight: 1.1,
    letterSpacing: '-0.035em',
  }),
  subtitle: css({
    margin: 0,
    maxWidth: 620,
    color: TOKENS.slate,
    fontSize: 13,
    lineHeight: 1.5,
  }),
  runButton: css({
    minWidth: 132,
    border: 0,
    borderRadius: 8,
    padding: '10px 16px',
    color: TOKENS.panel,
    backgroundColor: TOKENS.signal,
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'transform 120ms ease, opacity 120ms ease',
    '&:hover:not(:disabled)': { transform: 'translateY(-1px)' },
    '&:focus-visible': { outline: `3px solid ${TOKENS.live}`, outlineOffset: 2 },
    '&:disabled': { cursor: 'wait', opacity: 0.55 },
  }),
  runMeta: css({
    display: 'flex',
    gap: 16,
    padding: '12px 0',
    color: TOKENS.slate,
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
  }),
  processRail: css({
    display: 'grid',
    gridTemplateColumns: 'minmax(180px, 1fr) 54px minmax(180px, 1fr) 54px minmax(180px, 1fr)',
    alignItems: 'center',
    padding: '12px 0 18px',
    overflowX: 'auto',
    '@media (max-width: 760px)': {
      gridTemplateColumns: '1fr',
      gap: 0,
      overflowX: 'visible',
    },
  }),
  connector: css({
    position: 'relative',
    height: 2,
    backgroundColor: TOKENS.line,
    '&::after': {
      content: '""',
      position: 'absolute',
      right: -1,
      top: -3,
      width: 0,
      height: 0,
      borderTop: '4px solid transparent',
      borderBottom: '4px solid transparent',
      borderLeft: `7px solid ${TOKENS.line}`,
    },
    '@media (max-width: 760px)': {
      width: 2,
      height: 28,
      marginLeft: 28,
      '&::after': {
        right: -3,
        top: 'auto',
        bottom: -1,
        borderTop: `7px solid ${TOKENS.line}`,
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        borderBottom: 0,
      },
    },
  }),
  connectorComplete: css({
    backgroundColor: TOKENS.success,
    '&::after': { borderLeftColor: TOKENS.success },
    '@media (max-width: 760px)': {
      '&::after': { borderLeftColor: 'transparent', borderTopColor: TOKENS.success },
    },
  }),
  processor: css({
    minHeight: 174,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    padding: 16,
    border: `1px solid ${TOKENS.line}`,
    borderRadius: 12,
    color: TOKENS.ink,
    backgroundColor: TOKENS.panel,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(20, 32, 43, 0.06)',
    transition: 'border-color 140ms ease, transform 140ms ease',
    '&:hover': { transform: 'translateY(-2px)', borderColor: TOKENS.signal },
    '&:focus-visible': { outline: `3px solid ${TOKENS.live}`, outlineOffset: 2 },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  }),
  processorRunning: css({
    borderColor: TOKENS.live,
    backgroundColor: TOKENS.liveSoft,
  }),
  processorCompleted: css({
    borderColor: TOKENS.success,
  }),
  processorFailed: css({
    borderColor: TOKENS.danger,
    backgroundColor: TOKENS.dangerSoft,
  }),
  processorTop: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  }),
  processorIndex: css({
    color: TOKENS.slate,
    fontSize: 11,
    fontWeight: 800,
    fontVariantNumeric: 'tabular-nums',
  }),
  status: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 7px',
    borderRadius: 999,
    color: TOKENS.slate,
    backgroundColor: TOKENS.surface,
    fontSize: 10,
    fontWeight: 800,
    textTransform: 'uppercase',
  }),
  beacon: css({
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: TOKENS.slate,
  }),
  beaconRunning: css({
    backgroundColor: TOKENS.live,
    animation: 'workflow-pulse 1s ease-in-out infinite',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
    '@keyframes workflow-pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.35 },
    },
  }),
  beaconCompleted: css({ backgroundColor: TOKENS.success }),
  beaconFailed: css({ backgroundColor: TOKENS.danger }),
  processorTitle: css({ margin: '18px 0 3px', fontSize: 17 }),
  processorDescription: css({ margin: 0, color: TOKENS.slate, fontSize: 12 }),
  latest: css({
    marginTop: 'auto',
    paddingTop: 16,
    color: TOKENS.slate,
    fontSize: 11,
    lineHeight: 1.4,
  }),
  detailGrid: css({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.4fr) minmax(260px, 0.6fr)',
    gap: 14,
    '@media (max-width: 760px)': { gridTemplateColumns: '1fr' },
  }),
  panel: css({
    border: `1px solid ${TOKENS.line}`,
    borderRadius: 12,
    padding: 16,
    backgroundColor: TOKENS.panel,
  }),
  panelLabel: css({
    color: TOKENS.slate,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  }),
  json: css({
    maxHeight: 190,
    margin: '12px 0 0',
    overflow: 'auto',
    color: TOKENS.ink,
    fontSize: 11,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  }),
  openButton: css({
    marginTop: 14,
    padding: '7px 10px',
    border: `1px solid ${TOKENS.signal}`,
    borderRadius: 7,
    color: TOKENS.signal,
    backgroundColor: TOKENS.panel,
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
    '&:focus-visible': { outline: `3px solid ${TOKENS.live}`, outlineOffset: 2 },
  }),
  completion: css({
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: 16,
    alignItems: 'end',
    minHeight: 118,
    backgroundColor: TOKENS.successSoft,
    '@media (max-width: 520px)': { gridTemplateColumns: '1fr' },
  }),
  metric: css({
    fontSize: 22,
    fontWeight: 850,
    letterSpacing: '-0.025em',
    fontVariantNumeric: 'tabular-nums',
  }),
};

type OrchestratorFdc3Api = {
  raiseWorkflow(
    workflowId: string,
    input: Record<string, unknown>,
  ): Promise<WorkflowResolution>;
  open(app: { appId: string }, context?: Record<string, unknown>): Promise<unknown>;
};

function statusLabel(status: ProcessorState['status']): string {
  switch (status) {
    case 'running':
      return 'Processing';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return 'Pending';
  }
}

function ProcessorCard({
  processor,
  onSelect,
}: {
  processor: ProcessorState;
  onSelect(): void;
}): React.ReactElement {
  const label = statusLabel(processor.status);
  return (
    <button
      type="button"
      aria-label={`Select ${processor.title} processor, ${label}`}
      className={cx(styles.processor, {
        [styles.processorRunning]: processor.status === 'running',
        [styles.processorCompleted]: processor.status === 'completed',
        [styles.processorFailed]: processor.status === 'failed',
      })}
      onClick={onSelect}
    >
      <div className={styles.processorTop}>
        <span className={styles.processorIndex}>0{processor.index}</span>
        <span className={styles.status}>
          <span
            className={cx(styles.beacon, {
              [styles.beaconRunning]: processor.status === 'running',
              [styles.beaconCompleted]: processor.status === 'completed',
              [styles.beaconFailed]: processor.status === 'failed',
            })}
          />
          {label}
        </span>
      </div>
      <strong className={styles.processorTitle}>{processor.title}</strong>
      <p className={styles.processorDescription}>{processor.description}</p>
      <span className={styles.latest}>{processor.latestMessage}</span>
    </button>
  );
}

export function WorkflowOrchestratorTile(_props: TileProps): React.ReactElement {
  const fdc3 = FDC3Agent.useFDC3() as OrchestratorFdc3Api;
  const [state, dispatch] = useReducer(
    workflowOrchestratorReducer,
    undefined,
    createInitialOrchestratorState,
  );
  const selectedNode = state.nodes[state.selectedStepId];
  const riskResult = state.nodes['assess-risk'].result as
    | { tradeId?: string; classification?: string; exposure?: number }
    | undefined;
  const isRunning = state.status === 'running';

  const handleRun = async (): Promise<void> => {
    let subscription: WorkflowEventSubscription | undefined;
    dispatch({ type: 'execution-started' });
    try {
      const resolution = await fdc3.raiseWorkflow(WORKFLOW_ID, WORKFLOW_INPUT);
      subscription = resolution.subscribe((event: WorkflowEvent) => {
        dispatch({ type: 'event', event });
      });
      await resolution.getResult();
    } catch (error) {
      dispatch({
        type: 'execution-error',
        error: error instanceof Error ? error.message : 'Workflow execution failed',
      });
    } finally {
      subscription?.unsubscribe();
    }
  };

  const completionMetrics = useMemo(() => {
    if (!riskResult) {
      return undefined;
    }
    return {
      tradeId: riskResult.tradeId ?? '—',
      classification: riskResult.classification ?? '—',
      exposure:
        typeof riskResult.exposure === 'number'
          ? `$${riskResult.exposure.toLocaleString('en-US')}`
          : '—',
    };
  }, [riskResult]);

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>FDC3 process desk</div>
          <h2 className={styles.title}>Workflow orchestrator</h2>
          <p className={styles.subtitle}>
            Discover a pending trade, enrich it with market pricing, then assess its exposure.
            Select any processor to inspect the context moving through the rail.
          </p>
        </div>
        <button
          type="button"
          aria-label="Run workflow"
          className={styles.runButton}
          disabled={isRunning}
          onClick={() => void handleRun()}
        >
          {isRunning ? 'Processing…' : 'Run workflow'}
        </button>
      </header>

      <div className={styles.runMeta} aria-live="polite">
        <span>
          STATUS ·{' '}
          {state.status === 'completed'
            ? 'Workflow completed'
            : state.status === 'failed'
              ? 'Workflow failed'
              : state.status === 'running'
                ? 'Workflow running'
                : 'Ready'}
        </span>
        <span>EVENT · {state.lastSequence || '—'}</span>
        <span>RUN · {state.runId ?? 'Not started'}</span>
      </div>

      <section aria-label="Workflow processors" className={styles.processRail}>
        {WORKFLOW_PROCESSORS.map((definition, index) => {
          const processor = state.nodes[definition.stepId];
          const nextProcessor = WORKFLOW_PROCESSORS[index + 1];
          return (
            <div key={definition.stepId} style={{ display: 'contents' }}>
              <ProcessorCard
                processor={processor}
                onSelect={() => dispatch({ type: 'select', stepId: processor.stepId })}
              />
              {nextProcessor ? (
                <div
                  aria-hidden="true"
                  className={cx(styles.connector, {
                    [styles.connectorComplete]: processor.status === 'completed',
                  })}
                />
              ) : null}
            </div>
          );
        })}
      </section>

      <section className={styles.detailGrid}>
        <div className={styles.panel}>
          <div className={styles.panelLabel}>Selected processor</div>
          <h3>{selectedNode.title}</h3>
          <p className={styles.subtitle}>{selectedNode.intent}</p>
          <pre className={styles.json}>
            {JSON.stringify(
              selectedNode.result ?? selectedNode.context ?? { status: selectedNode.status },
              null,
              2,
            )}
          </pre>
          <button
            type="button"
            className={styles.openButton}
            onClick={() =>
              void fdc3.open(
                { appId: selectedNode.appId },
                selectedNode.context ?? { type: 'ratan.workflow.processor' },
              )
            }
          >
            Open full tile
          </button>
        </div>

        {state.status === 'completed' && completionMetrics ? (
          <div className={cx(styles.panel, styles.completion)} aria-label="Workflow result">
            <div>
              <div className={styles.panelLabel}>Workflow completed</div>
              <div className={styles.metric}>{completionMetrics.tradeId}</div>
            </div>
            <div>
              <div className={styles.panelLabel}>Risk</div>
              <div className={styles.metric}>{completionMetrics.classification}</div>
            </div>
            <div>
              <div className={styles.panelLabel}>Exposure</div>
              <div className={styles.metric}>{completionMetrics.exposure}</div>
            </div>
          </div>
        ) : (
          <div className={styles.panel}>
            <div className={styles.panelLabel}>Run result</div>
            <h3>{state.status === 'failed' ? 'Workflow failed' : 'Awaiting completion'}</h3>
            <p className={styles.subtitle}>
              {state.error ?? 'Final trade, pricing, and exposure metrics will appear here.'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
