import React from 'react';
import type { StyledComponent } from '@emotion/styled';
import Alert, { type AlertProps } from '@mui/material/Alert';
import MuiSnackbar, {
  type SnackbarCloseReason,
  type SnackbarProps as MuiSnackbarProps,
} from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { styled, type SxProps, type Theme } from '@mui/material/styles';
import { newStyleTokens } from './tokens/webkit.js';
import { legacyTokens } from './tokens/legacy.js';

const notificationTokens = { radius: '6px', messageMaxHeight: '50px', fontWeight: 500 };

export const SnackbarRoot: StyledComponent<
  MuiSnackbarProps & { theme?: Theme; as?: React.ElementType }
> = /*#__PURE__*/ styled(MuiSnackbar)(({ theme }) => ({
  borderRadius:
    theme.ratan?.designGeneration === 'webkit'
      ? newStyleTokens.radius.medium
      : notificationTokens.radius,
  backgroundColor: theme.palette.background.paper,
}));

export interface SnackbarProps extends MuiSnackbarProps {
  variant?: AlertProps['variant'];
  severity?: AlertProps['severity'];
  alertsx?: SxProps<Theme>;
  onClose?: (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
}

/** Messages are React content; strings are never interpreted as HTML. */
export const Snackbar = React.memo(function Snackbar({
  message,
  action,
  variant,
  severity,
  alertsx = [],
  ...rest
}: SnackbarProps) {
  return (
    <SnackbarRoot {...rest}>
      <Alert
        elevation={6}
        onClose={rest.onClose}
        variant={variant}
        severity={severity}
        sx={[
          (theme) => ({
            borderRadius:
              theme.ratan?.designGeneration === 'webkit'
                ? newStyleTokens.radius.medium
                : notificationTokens.radius,
          }),
          ...(Array.isArray(alertsx) ? alertsx : [alertsx]),
        ]}
      >
        <SnackbarContent
          role="presentation"
          message={<span style={{ width: '100%' }}>{message}</span>}
          action={action}
          sx={{
            background: 'inherit',
            color: 'inherit',
            boxShadow: 'none',
            '& .MuiSnackbarContent-message': {
              maxHeight: notificationTokens.messageMaxHeight,
              overflowY: 'auto',
              width: '100%',
              userSelect: 'text',
              fontSize: legacyTokens.font.fontSizeM,
              fontWeight: notificationTokens.fontWeight,
              '& *': {
                userSelect: 'text',
                fontSize: legacyTokens.font.fontSizeM,
                fontWeight: notificationTokens.fontWeight,
                wordBreak: 'break-all',
              },
            },
          }}
        />
      </Alert>
    </SnackbarRoot>
  );
});
