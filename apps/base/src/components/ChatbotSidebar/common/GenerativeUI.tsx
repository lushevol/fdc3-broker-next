import React, { createContext, useContext, useCallback, useRef } from 'react';
import { useTheme } from '@mui/material';
import {
  GenerativeComponentEntry,
  RegisteredComponentProps,
  CardComponentProps,
  ListComponentProps,
  TableComponentProps,
  StatusComponentProps,
  ExecutionPlanStatusComponentProps,
  UsageStatisticsCardComponentProps,
  ErrorComponentProps,
  FormComponentProps,
} from './interface';
import { generativeStyles } from './style';

// Context for generative UI
interface GenerativeUIContextValue {
  registry: Map<string, GenerativeComponentEntry>;
  registerComponent: (entry: GenerativeComponentEntry) => void;
  unregisterComponent: (name: string) => void;
  getComponent: (name: string) => React.ComponentType<{ props: Record<string, unknown> }> | null;
}

const GenerativeUIContext = createContext<GenerativeUIContextValue | null>(null);

// Provider component
interface GenerativeUIProviderProps {
  children: React.ReactNode;
  initialComponents?: GenerativeComponentEntry[];
}

export const GenerativeUIProvider: React.FC<GenerativeUIProviderProps> = ({
  children,
  initialComponents = [],
}) => {
  // Initialize registry synchronously with initial components using lazy initialization
  const registryRef = useRef<Map<string, GenerativeComponentEntry>>(
    initialComponents.length > 0
      ? new Map(initialComponents.map((c) => [c.name, c]))
      : new Map<string, GenerativeComponentEntry>(),
  );

  // Update registry when initialComponents change
  React.useEffect(() => {
    initialComponents.forEach((component) => {
      registryRef.current.set(component.name, component);
    });
  }, [initialComponents]);

  const registerComponent = useCallback((entry: GenerativeComponentEntry) => {
    registryRef.current.set(entry.name, entry);
  }, []);

  const unregisterComponent = useCallback((name: string) => {
    registryRef.current.delete(name);
  }, []);

  const getComponent = useCallback((name: string) => {
    const entry = registryRef.current.get(name);
    return entry?.component || null;
  }, []);

  return (
    <GenerativeUIContext.Provider
      value={{
        registry: registryRef.current,
        registerComponent,
        unregisterComponent,
        getComponent,
      }}
    >
      {children}
    </GenerativeUIContext.Provider>
  );
};

// Hook to access generative UI context
export const useGenerativeUI = () => {
  const context = useContext(GenerativeUIContext);
  if (!context) {
    throw new Error('useGenerativeUI must be used within a GenerativeUIProvider');
  }
  return context;
};

// Hook for registering components
export const useRegisterGenerativeComponent = () => {
  const { registerComponent, unregisterComponent } = useGenerativeUI();

  const register = useCallback(
    (entry: GenerativeComponentEntry) => {
      registerComponent(entry);
      return () => unregisterComponent(entry.name);
    },
    [registerComponent, unregisterComponent],
  );

  return register;
};

// Component that renders registered components
export const RegisteredComponent: React.FC<RegisteredComponentProps> = ({
  name,
  props,
  onAction,
}) => {
  void onAction;
  const { getComponent } = useGenerativeUI();
  const Component = getComponent(name);

  if (!Component) {
    console.warn(`Generative component "${name}" not found in registry`);
    return <UnknownComponent name={name} />;
  }

  return <Component props={props} />;
};

// Fallback for unknown components
const UnknownComponent: React.FC<{ name: string }> = ({ name }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        padding: '16px',
        background: theme.palette.warning.light,
        borderRadius: '8px',
        color: theme.palette.warning.contrastText,
      }}
    >
      Unknown component: {name}
    </div>
  );
};

// Default generative components

export const CardComponent: React.FC<{ props: CardComponentProps }> = ({ props }) => {
  const theme = useTheme();
  const { title, content, icon, variant = 'default' } = props;

  return (
    <div className={generativeStyles.card(theme, variant)}>
      <div className={generativeStyles.cardTitle(theme)}>
        {icon && <span>{icon}</span>}
        {title}
      </div>
      <div>{content}</div>
    </div>
  );
};

export const ListComponent: React.FC<{ props: ListComponentProps }> = ({ props }) => {
  const theme = useTheme();
  const { items, ordered } = props;

  return (
    <ul className={generativeStyles.list(theme)}>
      {items.map((item, index) => (
        <li key={item.id} className={generativeStyles.listItem(theme)} onClick={item.onClick}>
          {ordered && <span style={{ marginRight: 8 }}>{index + 1}.</span>}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500 }}>{item.title}</div>
            {item.subtitle && (
              <div style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }}>
                {item.subtitle}
              </div>
            )}
          </div>
          {item.icon && <span>{item.icon}</span>}
        </li>
      ))}
    </ul>
  );
};

export const TableComponent: React.FC<{ props: TableComponentProps }> = ({ props }) => {
  const theme = useTheme();
  const { columns, rows } = props;

  return (
    <table className={generativeStyles.table(theme)}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col.key}>{String(row[col.key] ?? '')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const StatusComponent: React.FC<{ props: StatusComponentProps }> = ({ props }) => {
  const theme = useTheme();
  const { status, message, details } = props;

  return (
    <div className={generativeStyles.statusBadge(theme, status)}>
      {status === 'loading' && '⏳'}
      {status === 'success' && '✓'}
      {status === 'error' && '✕'}
      {status === 'warning' && '⚠'}
      {status === 'info' && 'ℹ'}
      <span>{message}</span>
      {details && <span style={{ opacity: 0.8 }}> - {details}</span>}
    </div>
  );
};

function mapExecutionStatusToVisualState(
  status: ExecutionPlanStatusComponentProps['status'],
): StatusComponentProps['status'] {
  switch (status) {
    case 'running':
      return 'loading';
    case 'completed':
      return 'success';
    case 'failed':
      return 'error';
    case 'awaiting_review':
      return 'warning';
    case 'pending':
      return 'info';
    default:
      return 'info';
  }
}

export const ExecutionPlanStatusComponent: React.FC<{
  props: ExecutionPlanStatusComponentProps;
}> = ({ props }) => {
  const theme = useTheme();
  const label = props.kind === 'plan' ? 'Governed plan' : 'Execution step';
  const details = [
    props.kind === 'plan' && typeof props.totalSteps === 'number'
      ? `${props.totalSteps} step${props.totalSteps === 1 ? '' : 's'}`
      : null,
    props.stepType ? props.stepType.toUpperCase() : null,
    props.targetName ?? null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={generativeStyles.card(theme, 'default')}>
      <div className={generativeStyles.cardTitle(theme)}>{label}</div>
      <StatusComponent
        props={{
          status: mapExecutionStatusToVisualState(props.status),
          message: props.summary,
          details,
        }}
      />
    </div>
  );
};

function formatUsageDateLabel(timestamp: string): string {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return timestamp;
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function buildTrendPolyline(
  values: number[],
  width: number,
  height: number,
  padding: number,
): string {
  if (values.length === 0) {
    return '';
  }

  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = Math.max(maxValue - minValue, 1);

  return values
    .map((value, index) => {
      const x =
        values.length === 1
          ? width / 2
          : padding + (index * (width - padding * 2)) / (values.length - 1);
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');
}

const TrendChart: React.FC<{
  label: string;
  color: string;
  values: number[];
  ticks: string[];
}> = ({ label, color, values, ticks }) => {
  const width = 320;
  const height = 160;
  const padding = 20;
  const points = buildTrendPolyline(values, width, height, padding);

  return (
    <div>
      <div style={{ marginBottom: 8, fontWeight: 600, letterSpacing: '-0.01em' }}>{label}</div>
      <div
        data-testid={`usage-statistics-${label.toLowerCase().replace(/\s+/g, '-')}-panel`}
        style={{
          borderRadius: 18,
          background: color ? 'transparent' : 'transparent',
          padding: 14,
          border: '1px solid rgba(148, 163, 184, 0.18)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="160" role="img" aria-label={label}>
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="currentColor"
            opacity="0.2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="currentColor"
            opacity="0.2"
          />
          {points ? (
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="3"
              points={points}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}
        </svg>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 8,
            color: 'inherit',
            fontSize: '0.75rem',
            opacity: 0.75,
          }}
        >
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const UsageStatisticsCardComponent: React.FC<{
  props: UsageStatisticsCardComponentProps;
}> = ({ props }) => {
  const theme = useTheme();
  const ticks = props.trendPoints.map((point) => formatUsageDateLabel(point.timestamp));
  const pvValues = props.trendPoints.map((point) => point.pv);
  const uvValues = props.trendPoints.map((point) => point.uv);
  const isDarkMode = theme.palette.mode === 'dark';
  const shellBackground = isDarkMode
    ? `linear-gradient(180deg, ${theme.palette.background.paper} 0%, rgba(15, 23, 42, 0.88) 100%)`
    : `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[50]} 100%)`;
  const shellBorder = isDarkMode ? 'rgba(148, 163, 184, 0.18)' : 'rgba(148, 163, 184, 0.22)';
  const tileBackground = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.86)';
  const chartBackground = isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.02)';

  return (
    <div
      data-testid="usage-statistics-card"
      className={generativeStyles.card(theme, 'default')}
      style={{
        borderRadius: 24,
        background: shellBackground,
        border: `1px solid ${shellBorder}`,
        boxShadow: isDarkMode
          ? '0 18px 44px -28px rgba(15, 23, 42, 0.75)'
          : '0 20px 48px -30px rgba(15, 23, 42, 0.24)',
      }}
    >
      <div
        className={generativeStyles.cardTitle(theme)}
        style={{ marginBottom: theme.spacing(0.75), fontSize: '1rem', letterSpacing: '-0.02em' }}
      >
        {props.appLabel}
      </div>
      <div
        style={{
          marginBottom: theme.spacing(2),
          color: theme.palette.text.secondary,
          fontSize: '0.875rem',
        }}
      >
        {formatUsageDateLabel(props.startTime)} - {formatUsageDateLabel(props.endTime)}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: theme.spacing(1.5),
          marginBottom: theme.spacing(2),
        }}
      >
        <div
          data-testid="usage-statistics-pv-tile"
          style={{
            padding: theme.spacing(1.75),
            borderRadius: 18,
            background: tileBackground,
            border: `1px solid ${shellBorder}`,
            boxShadow: isDarkMode
              ? 'inset 0 1px 0 rgba(255,255,255,0.04)'
              : '0 10px 24px -24px rgba(15,23,42,0.28)',
          }}
        >
          <div style={{ color: theme.palette.text.secondary, fontSize: '0.75rem', textTransform: 'uppercase' }}>
            PV
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            {props.pv.toLocaleString()}
          </div>
        </div>
        <div
          data-testid="usage-statistics-uv-tile"
          style={{
            padding: theme.spacing(1.75),
            borderRadius: 18,
            background: tileBackground,
            border: `1px solid ${shellBorder}`,
            boxShadow: isDarkMode
              ? 'inset 0 1px 0 rgba(255,255,255,0.04)'
              : '0 10px 24px -24px rgba(15,23,42,0.28)',
          }}
        >
          <div style={{ color: theme.palette.text.secondary, fontSize: '0.75rem', textTransform: 'uppercase' }}>
            UV
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            {props.uv.toLocaleString()}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gap: theme.spacing(2),
          borderRadius: 20,
          background: chartBackground,
          border: `1px solid ${shellBorder}`,
          padding: theme.spacing(1.5),
        }}
      >
        <TrendChart label="PV Trend" color={theme.palette.primary.main} values={pvValues} ticks={ticks} />
        <TrendChart label="UV Trend" color={theme.palette.success.main} values={uvValues} ticks={ticks} />
      </div>
    </div>
  );
};

export const ErrorComponent: React.FC<{ props: ErrorComponentProps }> = ({ props }) => {
  const theme = useTheme();
  const { title, message, code, retryable, onRetry } = props;

  return (
    <div className={generativeStyles.card(theme, 'error')}>
      <div className={generativeStyles.cardTitle(theme)}>❌ {title}</div>
      <div style={{ marginBottom: theme.spacing(1) }}>{message}</div>
      {code && <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Error code: {code}</div>}
      {retryable && onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: theme.spacing(1),
            padding: '4px 12px',
            border: 'none',
            borderRadius: 4,
            background: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export const FormComponent: React.FC<{ props: FormComponentProps }> = ({ props }) => {
  const theme = useTheme();
  const { fields, submitLabel = 'Submit', onSubmit } = props;
  const [values, setValues] = React.useState<Record<string, unknown>>({});

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form className={generativeStyles.form(theme)} onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className={generativeStyles.formField(theme)}>
          <label className={generativeStyles.formLabel(theme)}>
            {field.label}
            {field.required && ' *'}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              name={field.name}
              required={field.required}
              defaultValue={field.defaultValue as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              required={field.required}
              defaultValue={field.defaultValue as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              required={field.required}
              defaultChecked={field.defaultValue as boolean}
              onChange={(e) =>
                handleChange(
                  field.name,
                  field.type === 'checkbox' ? e.target.checked : e.target.value,
                )
              }
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 4,
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          cursor: 'pointer',
        }}
      >
        {submitLabel}
      </button>
    </form>
  );
};

// Default component registry entries
export const defaultGenerativeComponents: GenerativeComponentEntry[] = [
  {
    name: 'Card',
    component: CardComponent as unknown as React.ComponentType<{ props: Record<string, unknown> }>,
  },
  {
    name: 'List',
    component: ListComponent as unknown as React.ComponentType<{ props: Record<string, unknown> }>,
  },
  {
    name: 'Table',
    component: TableComponent as unknown as React.ComponentType<{ props: Record<string, unknown> }>,
  },
  {
    name: 'Status',
    component: StatusComponent as unknown as React.ComponentType<{
      props: Record<string, unknown>;
    }>,
  },
  {
    name: 'ExecutionPlanStatus',
    component: ExecutionPlanStatusComponent as unknown as React.ComponentType<{
      props: Record<string, unknown>;
    }>,
  },
  {
    name: 'UsageStatisticsCard',
    component: UsageStatisticsCardComponent as unknown as React.ComponentType<{
      props: Record<string, unknown>;
    }>,
  },
  {
    name: 'Error',
    component: ErrorComponent as unknown as React.ComponentType<{ props: Record<string, unknown> }>,
  },
  {
    name: 'Form',
    component: FormComponent as unknown as React.ComponentType<{ props: Record<string, unknown> }>,
  },
];

export const DEFAULT_GENERATIVE_COMPONENTS = defaultGenerativeComponents;

export default GenerativeUIProvider;
