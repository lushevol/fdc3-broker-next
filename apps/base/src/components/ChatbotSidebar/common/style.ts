import { css } from '@emotion/css';
import { Theme } from '@mui/material';

export const sidebarStyles = {
  container: (
    theme: Theme,
    isOpen: boolean,
    width: number | string = 400,
    position: 'left' | 'right' = 'right',
  ) => css`
    position: fixed;
    top: 0;
    ${position}: 0;
    width: ${typeof width === 'number' ? `${width}px` : width};
    height: 100vh;
    background: ${theme.palette.background.paper};
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
    transform: translateX(${isOpen ? '0' : position === 'right' ? '100%' : '-100%'});
    transition: transform 0.3s ease-in-out;
    z-index: ${theme.zIndex.drawer};
    display: flex;
    flex-direction: column;
    border-${position === 'right' ? 'left' : 'right'}: 1px solid ${theme.palette.divider};
  `,

  header: (theme: Theme) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing(2)};
    border-bottom: 1px solid ${theme.palette.divider};
    background: ${theme.palette.background.default};
  `,

  title: (theme: Theme) => css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    font-size: 1.1rem;
    font-weight: 600;
    color: ${theme.palette.text.primary};
  `,

  headerActions: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  content: (theme: Theme) => css`
    flex: 1;
    overflow-y: auto;
    padding: ${theme.spacing(2)};
    display: flex;
    flex-direction: column;
    background: ${theme.palette.background.default};
  `,

  inputArea: (theme: Theme) => css`
    padding: ${theme.spacing(2)};
    border-top: 1px solid ${theme.palette.divider};
    background: ${theme.palette.background.paper};
  `,

  inputContainer: (theme: Theme) => css`
    display: flex;
    gap: ${theme.spacing(1)};
    align-items: flex-end;
  `,

  textField: (theme: Theme) => css`
    flex: 1;
    & .MuiOutlinedInput-root {
      background: ${theme.palette.background.default};
      border-radius: 24px;
    }
  `,

  sendButton: (theme: Theme) => css`
    border-radius: 50%;
    min-width: 48px;
    width: 48px;
    height: 48px;
  `,

  toggleButton: (theme: Theme, position: 'left' | 'right' = 'right') => css`
    position: fixed;
    ${position === 'right' ? 'right' : 'left'}: 16px;
    bottom: 16px;
    z-index: ${theme.zIndex.fab};
    border-radius: 50%;
    width: 56px;
    height: 56px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `,

  messageList: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,

  message: (theme: Theme, role: 'user' | 'assistant') => css`
    max-width: 85%;
    padding: ${theme.spacing(1.5)};
    border-radius: ${role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
    background: ${role === 'user' ? theme.palette.primary.main : theme.palette.grey[100]};
    color: ${role === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary};
    align-self: ${role === 'user' ? 'flex-end' : 'flex-start'};
    word-wrap: break-word;
  `,

  typingIndicator: (theme: Theme) => css`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: ${theme.spacing(1.5)};
    border-radius: 16px;
    background: ${theme.palette.grey[100]};
    align-self: flex-start;
  `,

  typingDot: (theme: Theme) => css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${theme.palette.grey[400]};
    animation: typing 1.4s infinite ease-in-out both;

    &:nth-of-type(1) {
      animation-delay: -0.32s;
    }

    &:nth-of-type(2) {
      animation-delay: -0.16s;
    }

    @keyframes typing {
      0%,
      80%,
      100% {
        transform: scale(0.6);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,

  toolCard: (theme: Theme) => css`
    padding: ${theme.spacing(1.5)};
    border-radius: 8px;
    background: ${theme.palette.grey[50]};
    border: 1px solid ${theme.palette.divider};
    margin-top: ${theme.spacing(1)};
  `,

  toolHeader: (theme: Theme) => css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    font-weight: 500;
    font-size: 0.875rem;
    color: ${theme.palette.text.secondary};
  `,

  toolStatus: (theme: Theme, status: 'pending' | 'running' | 'completed' | 'failed') => css`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: ${status === 'completed'
      ? theme.palette.success.main
      : status === 'failed'
        ? theme.palette.error.main
        : status === 'running'
          ? theme.palette.warning.main
          : theme.palette.text.disabled};
  `,

  emptyState: (theme: Theme) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${theme.palette.text.secondary};
    text-align: center;
    padding: ${theme.spacing(4)};
  `,

  emptyIcon: (theme: Theme) => css`
    font-size: 64px;
    margin-bottom: ${theme.spacing(2)};
    color: ${theme.palette.grey[300]};
  `,

  errorMessage: (theme: Theme) => css`
    padding: ${theme.spacing(1.5)};
    border-radius: 8px;
    background: ${theme.palette.error.light};
    color: ${theme.palette.error.contrastText};
    margin-bottom: ${theme.spacing(1)};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `,
};

// Generative UI component styles
export const generativeStyles = {
  card: (theme: Theme, variant: 'default' | 'success' | 'warning' | 'error' = 'default') => css`
    padding: ${theme.spacing(2)};
    border-radius: 8px;
    background: ${variant === 'success'
      ? theme.palette.success.light
      : variant === 'warning'
        ? theme.palette.warning.light
        : variant === 'error'
          ? theme.palette.error.light
          : theme.palette.grey[50]};
    border: 1px solid
      ${variant === 'success'
        ? theme.palette.success.main
        : variant === 'warning'
          ? theme.palette.warning.main
          : variant === 'error'
            ? theme.palette.error.main
            : theme.palette.divider};
  `,

  cardTitle: (theme: Theme) => css`
    font-weight: 600;
    margin-bottom: ${theme.spacing(1)};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `,

  list: (theme: Theme) => css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,

  listItem: (theme: Theme) => css`
    padding: ${theme.spacing(1, 2)};
    border-bottom: 1px solid ${theme.palette.divider};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: ${theme.palette.action.hover};
    }

    &:last-child {
      border-bottom: none;
    }
  `,

  table: (theme: Theme) => css`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;

    th,
    td {
      padding: ${theme.spacing(1)};
      text-align: left;
      border-bottom: 1px solid ${theme.palette.divider};
    }

    th {
      font-weight: 600;
      background: ${theme.palette.grey[50]};
    }
  `,

  statusBadge: (theme: Theme, status: 'loading' | 'success' | 'error' | 'warning' | 'info') => css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: ${theme.spacing(0.5, 1)};
    border-radius: 16px;
    font-size: 0.75rem;
    font-weight: 500;
    background: ${status === 'success'
      ? theme.palette.success.light
      : status === 'error'
        ? theme.palette.error.light
        : status === 'warning'
          ? theme.palette.warning.light
          : status === 'info'
            ? theme.palette.info.light
            : theme.palette.grey[100]};
    color: ${status === 'success'
      ? theme.palette.success.dark
      : status === 'error'
        ? theme.palette.error.dark
        : status === 'warning'
          ? theme.palette.warning.dark
          : status === 'info'
            ? theme.palette.info.dark
            : theme.palette.text.secondary};
  `,

  form: (theme: Theme) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
  `,

  formField: (theme: Theme) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.5)};
  `,

  formLabel: (theme: Theme) => css`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${theme.palette.text.secondary};
  `,
};
