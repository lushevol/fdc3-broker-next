import {
  Dialog as EstablishedDialog,
  type DialogProps,
  type DialogWidth,
} from '@fm/ratan-design';
import {
  useEffect,
  useRef,
  type CSSProperties,
} from 'react';
import type * as React from 'react';
import {
  defineScDialog,
  type ScDialog,
} from './elements/sc-dialog.js';

const DIALOG_WIDTHS: Record<DialogWidth, string> = {
  small: 'var(--ratan-dialog-width-small)',
  medium: 'var(--ratan-dialog-width-medium)',
  large: 'var(--ratan-dialog-width-large)',
};

type WebkitDialogStyle = CSSProperties & {
  readonly '--width': string;
};

/**
 * React contract for the promoted Lit dialog.
 *
 * Non-dismissible dialogs retain the established implementation until WebKit
 * exposes equivalent escape-key and backdrop-dismiss controls.
 */
export function Dialog({
  open,
  title,
  description,
  children,
  actions,
  onClose,
  width = 'small',
  dismissible = true,
}: DialogProps) {
  const dialogRef = useRef<ScDialog | null>(null);

  defineScDialog();

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return undefined;

    let closeNotified = false;
    const handleHide = () => {
      if (closeNotified) return;
      closeNotified = true;
      onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleHide();
    };

    element.addEventListener('sc-hide', handleHide);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      element.removeEventListener('sc-hide', handleHide);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;
    element.label = title;
    element.open = open;
  }, [open, title]);

  if (!dismissible) {
    return (
      <EstablishedDialog
        open={open}
        title={title}
        description={description}
        actions={actions}
        onClose={onClose}
        width={width}
        dismissible={false}
      >
        {children}
      </EstablishedDialog>
    );
  }

  if (!open) return null;

  const style: WebkitDialogStyle = {
    '--width': DIALOG_WIDTHS[width],
  };

  return (
    <sc-dialog
      ref={(element) => {
        dialogRef.current = element;
      }}
      data-ratan-component="dialog"
      data-ratan-width={width}
      style={style}
    >
      <button
        type="button"
        slot="header-actions"
        className="ratan-webkit-dialog-close"
        aria-label={`Close ${title}`}
        onClick={onClose}
      >
        <span aria-hidden="true">×</span>
      </button>
      {description ? (
        <p className="ratan-dialog-description">{description}</p>
      ) : null}
      <div className="ratan-dialog-body">{children}</div>
      {actions ? (
        <div slot="footer" className="ratan-dialog-actions">
          {actions}
        </div>
      ) : null}
    </sc-dialog>
  );
}

declare module 'react' {
  // Custom-element JSX declarations require React's ambient JSX namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'sc-dialog': React.DetailedHTMLProps<
        React.HTMLAttributes<ScDialog>,
        ScDialog
      >;
    }
  }
}

export type { DialogProps, DialogWidth };
