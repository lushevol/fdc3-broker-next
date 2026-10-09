import React from 'react';
import DOMPurify from 'dompurify';
import { Snackbar as DesignSnackbar, type SnackbarProps } from 'ratan-design-origin';
import { PREFIX } from './common/style';

export type { SnackbarProps } from 'ratan-design-origin';

// Existing Base callers provide HTML strings. Keep that legacy contract here;
// the standalone package renders text and React content without HTML parsing.
const SnackBar = ({ message, ...rest }: SnackbarProps) => (
  <DesignSnackbar
    data-testid={PREFIX}
    {...rest}
    message={
      <span
        style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`${message}`) }}
      />
    }
  />
);
export default React.memo(SnackBar);
