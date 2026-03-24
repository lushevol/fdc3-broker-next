import React, { useEffect, useMemo, useState } from 'react';
import {
  useAssistantToolMetadata,
  useAssistantToolRoutingDebug,
} from './AssistantUIRuntimeProvider';

interface ToolRegistryDebugPanelProps {
  enabled?: boolean;
}

interface ToolRegistryPosition {
  left: number;
  top: number;
}

interface ToolRegistryDragState {
  offsetX: number;
  offsetY: number;
}

const DEFAULT_TOOL_PANEL_OFFSET = '1rem';
const PANEL_Z_INDEX = 1400;

export function ToolRegistryDebugPanel({
  enabled = process.env.NODE_ENV !== 'production',
}: ToolRegistryDebugPanelProps): JSX.Element | null {
  const toolMetadata = useAssistantToolMetadata();
  const lastToolRoute = useAssistantToolRoutingDebug();
  const [isHidden, setIsHidden] = useState(false);
  const [position, setPosition] = useState<ToolRegistryPosition | null>(null);
  const [dragState, setDragState] = useState<ToolRegistryDragState | null>(null);

  useEffect(() => {
    if (!dragState) {
      return undefined;
    }

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        left: event.clientX - dragState.offsetX,
        top: event.clientY - dragState.offsetY,
      });
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);

  const floatingStyle = useMemo<React.CSSProperties>(
    () =>
      position
        ? {
            left: `${position.left}px`,
            top: `${position.top}px`,
            bottom: 'auto',
          }
        : {
            left: DEFAULT_TOOL_PANEL_OFFSET,
            bottom: DEFAULT_TOOL_PANEL_OFFSET,
          },
    [position],
  );

  const startDragging = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget
      .closest('[data-testid="tool-registry-debug-panel"]')
      ?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setDragState({
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    });
  };

  if (!enabled) {
    return null;
  }

  if (isHidden) {
    return (
      <button
        aria-label="Show Tools"
        onClick={() => setIsHidden(false)}
        style={{
          position: 'fixed',
          zIndex: PANEL_Z_INDEX,
          border: '1px solid #cbd5e1',
          borderRadius: '999px',
          padding: '0.625rem 0.875rem',
          backgroundColor: 'rgba(248, 250, 252, 0.96)',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.16)',
          color: '#0f172a',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          cursor: 'pointer',
          ...floatingStyle,
        }}
        type="button"
      >
        Show Tools
      </button>
    );
  }

  return (
    <aside
      data-testid="tool-registry-debug-panel"
      style={{
        position: 'fixed',
        zIndex: PANEL_Z_INDEX,
        width: '18rem',
        maxWidth: 'calc(100vw - 2rem)',
        border: '1px solid #cbd5e1',
        borderRadius: '14px',
        padding: '0.875rem',
        backgroundColor: 'rgba(248, 250, 252, 0.96)',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.18)',
        color: '#0f172a',
        ...floatingStyle,
      }}
    >
      <div
        data-testid="tool-registry-drag-handle"
        onMouseDown={startDragging}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>
          Assistant Tools
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <button
            aria-label="Hide tool debug panel"
            onClick={() => setIsHidden(true)}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '999px',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.7rem',
              cursor: 'pointer',
            }}
            type="button"
          >
            Hide
          </button>
        </div>
      </div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#475569' }}>
        Active frontend registrations
      </div>
      <div
        style={{
          marginTop: '0.75rem',
          border: '1px solid #dbeafe',
          borderRadius: '10px',
          padding: '0.75rem',
          backgroundColor: '#eff6ff',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8' }}>Last Route</div>
        {lastToolRoute ? (
          <>
            <div style={{ marginTop: '0.375rem', fontSize: '0.875rem', fontWeight: 600 }}>
              {lastToolRoute.toolName}
            </div>
            <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#1e3a8a' }}>
              priority {lastToolRoute.priority}
            </div>
            <div style={{ marginTop: '0.125rem', fontSize: '0.75rem', color: '#1e3a8a' }}>
              confidence {lastToolRoute.confidence}
            </div>
            <div style={{ marginTop: '0.125rem', fontSize: '0.75rem', color: '#1e3a8a' }}>
              prompt {lastToolRoute.input}
            </div>
          </>
        ) : (
          <div style={{ marginTop: '0.375rem', fontSize: '0.75rem', color: '#1e3a8a' }}>
            No recent frontend tool route
          </div>
        )}
      </div>
      <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem' }}>
        {toolMetadata.map((item) => (
          <div
            key={item.toolName}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.625rem 0.75rem',
              backgroundColor: '#ffffff',
            }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.toolName}</div>
            <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#475569' }}>
              priority {item.matchPriority}
            </div>
            <div style={{ marginTop: '0.125rem', fontSize: '0.75rem', color: '#475569' }}>
              matcher {item.hasPromptMatcher ? 'on' : 'off'}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ToolRegistryDebugPanel;
