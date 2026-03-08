import React, { createContext, useContext, useCallback, useRef } from 'react';
import { useTheme } from '@mui/material';
import {
  GenerativeComponentEntry,
  RegisteredComponentProps,
  CardComponentProps,
  ListComponentProps,
  TableComponentProps,
  StatusComponentProps,
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
  const registryRef = useRef<Map<string, GenerativeComponentEntry>>(new Map());

  // Register initial components
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
    component: CardComponent as React.ComponentType<{ props: Record<string, unknown> }>,
  },
  {
    name: 'List',
    component: ListComponent as React.ComponentType<{ props: Record<string, unknown> }>,
  },
  {
    name: 'Table',
    component: TableComponent as React.ComponentType<{ props: Record<string, unknown> }>,
  },
  {
    name: 'Status',
    component: StatusComponent as React.ComponentType<{ props: Record<string, unknown> }>,
  },
  {
    name: 'Error',
    component: ErrorComponent as React.ComponentType<{ props: Record<string, unknown> }>,
  },
  {
    name: 'Form',
    component: FormComponent as React.ComponentType<{ props: Record<string, unknown> }>,
  },
];

export default GenerativeUIProvider;
