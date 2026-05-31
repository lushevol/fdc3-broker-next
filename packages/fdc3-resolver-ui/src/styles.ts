/**
 * Shared Styles for FDC3 Resolver UI Components
 *
 * Centralized style definitions for consistent theming and reduced code duplication.
 */

/**
 * Color palette
 */
export const Colors = {
  primary: '#1976d2',
  primaryLight: '#42a5f5',
  primaryDark: '#1565c0',
  text: '#333',
  textLight: '#666',
  background: '#fff',
  backgroundLight: '#f5f5f5',
  border: '#e0e0e0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.2)',
  focusOutline: '#42a5f5',
} as const;

/**
 * Layout styles
 */
export const Layout = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  dialog: {
    backgroundColor: Colors.background,
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '800px',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
    boxShadow: `0 8px 32px ${Colors.shadow}`,
  },
  header: {
    marginBottom: '16px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
} as const;

/**
 * Typography styles
 */
export const Typography = {
  title: {
    fontSize: '20px',
    fontWeight: 600,
    margin: 0,
    color: Colors.text,
  },
  subtitle: {
    fontSize: '14px',
    color: Colors.textLight,
    marginTop: '8px',
  },
  body: {
    fontSize: '14px',
    color: Colors.text,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '12px',
    color: Colors.textLight,
  },
  hint: {
    fontSize: '12px',
    color: Colors.textLight,
    fontStyle: 'italic' as const,
  },
} as const;

/**
 * Button styles
 */
export const Buttons = {
  primary: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#fff',
    backgroundColor: Colors.primary,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondary: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: Colors.textLight,
    backgroundColor: Colors.backgroundLight,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  outline: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: Colors.text,
    backgroundColor: Colors.backgroundLight,
    border: `1px solid ${Colors.border}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
} as const;

/**
 * Card styles
 */
export const Card = {
  base: {
    padding: '16px',
    backgroundColor: Colors.background,
    border: `1px solid ${Colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  selected: {
    borderColor: Colors.primary,
    boxShadow: `0 0 0 2px ${Colors.primaryLight}`,
  },
  focused: {
    outline: `2px solid ${Colors.focusOutline}`,
    outlineOffset: '2px',
  },
  hover: {
    borderColor: Colors.primaryLight,
  },
} as const;

/**
 * Context preview styles
 */
export const ContextPreviewStyles = {
  container: {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: Colors.backgroundLight,
    borderRadius: '4px',
    border: `1px solid ${Colors.border}`,
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: Colors.textLight,
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
  },
  content: {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: Colors.text,
    margin: 0,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-all' as const,
  },
} as const;

/**
 * App card specific styles
 */
export const AppCardStyles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  icon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: Colors.backgroundLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: '16px',
    fontWeight: 600,
    color: Colors.text,
    margin: 0,
  },
  description: {
    fontSize: '12px',
    color: Colors.textLight,
    margin: '4px 0 0 0',
  },
  instanceId: {
    fontSize: '11px',
    color: Colors.textLight,
    backgroundColor: Colors.backgroundLight,
    padding: '2px 6px',
    borderRadius: '4px',
    marginTop: '4px',
    display: 'inline-block',
  },
  contextBadge: {
    fontSize: '11px',
    color: Colors.primary,
    backgroundColor: '#e3f2fd',
    padding: '2px 8px',
    borderRadius: '12px',
  },
} as const;
