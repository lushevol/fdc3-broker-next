import {
  Dialog as ReactAriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import {
  useId,
  type ReactNode,
} from 'react';
import { useDesignSystemContext } from '../provider';
import { Button } from './Button';

export type DialogWidth = 'small' | 'medium' | 'large';

export interface DialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly actions?: ReactNode;
  readonly onClose: () => void;
  readonly width?: DialogWidth;
  readonly dismissible?: boolean;
}

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
  const descriptionId = useId();
  const { appearance, portalContainer } = useDesignSystemContext();

  return (
    <ModalOverlay
      className="ratan-design-root ratan-modal-overlay"
      data-ratan-component="modal-overlay"
      data-ratan-theme={appearance?.scheme}
      data-ratan-density={appearance?.density}
      dir={appearance?.direction}
      isOpen={open}
      isDismissable={dismissible}
      isKeyboardDismissDisabled={!dismissible}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      UNSTABLE_portalContainer={portalContainer}
    >
      <Modal className="ratan-modal">
        <ReactAriaDialog
          className="ratan-dialog"
          data-ratan-component="dialog"
          data-ratan-width={width}
          aria-describedby={description ? descriptionId : undefined}
        >
          <header className="ratan-dialog-header">
            <Heading className="ratan-dialog-title" slot="title">
              {title}
            </Heading>
            {dismissible ? (
              <Button
                className="ratan-dialog-close"
                variant="ghost"
                aria-label={`Close ${title}`}
                onClick={onClose}
              >
                <span aria-hidden="true">×</span>
              </Button>
            ) : null}
          </header>
          <div className="ratan-dialog-body">
            {description ? (
              <p id={descriptionId} className="ratan-dialog-description">
                {description}
              </p>
            ) : null}
            {children}
          </div>
          {actions ? (
            <footer className="ratan-dialog-actions">{actions}</footer>
          ) : null}
        </ReactAriaDialog>
      </Modal>
    </ModalOverlay>
  );
}
