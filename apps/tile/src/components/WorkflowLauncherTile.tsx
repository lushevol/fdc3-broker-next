import { useState } from 'react';
import type { TileProps } from '../Root/routing/common/interface';
import { FDC3Agent } from '../Root/import';
import { PENDING_VALIDATION_STATUS } from './tradeBlotterTypes';

const { useFDC3 } = FDC3Agent;

const WORKFLOW_ID = 'trade.pendingValidation.openChart';
const WORKFLOW_INPUT = {
  status: PENDING_VALIDATION_STATUS,
  originalRequest: 'Open a chart for the first pending validation trade',
};

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '16px',
    color: '#1f2937',
  },
  heading: {
    margin: '0 0 8px',
    fontSize: '20px',
    fontWeight: 700,
  },
  description: {
    margin: '0 0 12px',
    fontSize: '13px',
    color: '#4b5563',
  },
  button: {
    padding: '8px 14px',
    border: '0',
    borderRadius: '6px',
    backgroundColor: '#0f766e',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'wait',
  },
  status: {
    marginTop: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: '#ecfdf5',
    fontSize: '13px',
    whiteSpace: 'pre-wrap' as const,
  },
  error: {
    marginTop: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    fontSize: '13px',
    whiteSpace: 'pre-wrap' as const,
  },
  result: {
    marginTop: '12px',
    maxHeight: '240px',
    overflow: 'auto' as const,
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    fontSize: '12px',
  },
} as const;

type WorkflowResolution = {
  getResult: () => Promise<unknown>;
};

type WorkflowFdc3Api = {
  raiseWorkflow: (workflowId: string, input?: Record<string, unknown>) => Promise<WorkflowResolution>;
};

function WorkflowLauncherContent(): React.ReactElement {
  const fdc3 = useFDC3() as WorkflowFdc3Api;
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunWorkflow = async (): Promise<void> => {
    setIsRunning(true);
    setStatus('Running workflow');
    setResult(null);
    setError(null);

    try {
      const resolution = await fdc3.raiseWorkflow(WORKFLOW_ID, WORKFLOW_INPUT);
      const workflowResult = await resolution.getResult();
      setResult(workflowResult);
      setStatus('Workflow completed');
    } catch (workflowError) {
      setError(workflowError instanceof Error ? workflowError.message : String(workflowError));
      setStatus('Workflow failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>FDC3 Workflow Launcher</h2>
      <p style={styles.description}>
        Sample tile that raises a declared FDC3 workflow through the desktop agent.
      </p>
      <button
        type="button"
        style={{ ...styles.button, ...(isRunning ? styles.buttonDisabled : {}) }}
        onClick={handleRunWorkflow}
        disabled={isRunning}
      >
        {isRunning ? 'Running Workflow' : 'Run Workflow'}
      </button>
      <div data-testid="fdc3-workflow-launcher-status" style={styles.status}>
        {status}
      </div>
      {error ? (
        <div data-testid="fdc3-workflow-launcher-error" style={styles.error}>
          {error}
        </div>
      ) : null}
      {result ? (
        <pre data-testid="fdc3-workflow-launcher-result" style={styles.result}>
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

export function WorkflowLauncherTile(_props: TileProps): React.ReactElement {
  return <WorkflowLauncherContent />;
}
