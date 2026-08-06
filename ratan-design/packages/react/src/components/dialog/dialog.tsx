import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import {
  AriaButtonAdapter,
  AriaDialogAdapter,
  AriaHeadingAdapter,
  AriaModalAdapter,
  AriaModalOverlayAdapter,
} from '@fm/ratan-design-foundation';

export type DialogDismissReason =
  | 'dismiss'
  | 'close-button'
  | 'programmatic';

export interface DialogOpenChangeDetail {
  readonly reason: DialogDismissReason;
}

export interface DialogLifecycleDetail extends DialogOpenChangeDetail {
  readonly open: boolean;
}

export interface DialogProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    'children' | 'onChange' | 'role' | 'title'
  > {
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (
    open: boolean,
    detail: DialogOpenChangeDetail,
  ) => void;
  readonly onShow?: (detail: DialogLifecycleDetail) => void;
  readonly onHide?: (detail: DialogLifecycleDetail) => void;
  readonly label?: ReactNode;
  readonly footer?: ReactNode;
  readonly children?: ReactNode;
  readonly closeLabel?: string;
  readonly showCloseButton?: boolean;
  readonly isDismissable?: boolean;
  readonly isKeyboardDismissDisabled?: boolean;
  readonly role?: 'dialog' | 'alertdialog';
}

export const Dialog = forwardRef<HTMLElement, DialogProps>(function Dialog(
  {
    open,
    defaultOpen = false,
    onOpenChange,
    onShow,
    onHide,
    label = '',
    footer,
    children,
    closeLabel = 'Close',
    showCloseButton = true,
    isDismissable = true,
    isKeyboardDismissDisabled = false,
    className,
    dir,
    lang,
    ...dialogProps
  },
  forwardedRef,
) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = open ?? uncontrolledOpen;
  const titleId = `ratan-dialog-${useId()}-title`;
  const dismissalReason = useRef<DialogDismissReason>('programmatic');
  const previousOpen = useRef(false);

  useEffect(() => {
    if (previousOpen.current === isOpen) return;
    const detail = { open: isOpen, reason: dismissalReason.current } as const;
    if (isOpen) onShow?.(detail);
    else onHide?.(detail);
    previousOpen.current = isOpen;
    dismissalReason.current = 'programmatic';
  }, [isOpen, onHide, onShow]);

  const requestOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && dismissalReason.current === 'programmatic') {
      dismissalReason.current = 'dismiss';
    }
    const detail = { reason: dismissalReason.current } as const;
    if (!isControlled) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen, detail);
  };

  return (
    <AriaModalOverlayAdapter
      isOpen={isOpen}
      onOpenChange={requestOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      data-ratan-component="DialogOverlay"
      data-open={isOpen}
      className="ratan-dialog__overlay"
    >
      <AriaModalAdapter
        data-ratan-component="DialogModal"
        className="ratan-dialog__positioner"
      >
        <AriaDialogAdapter
          {...dialogProps}
          ref={forwardedRef}
          aria-labelledby={label ? titleId : undefined}
          className={className
            ? `ratan-dialog__popup ${className}`
            : 'ratan-dialog__popup'}
          data-ratan-component="Dialog"
          dir={dir}
          lang={lang}
        >
          {({ close }) => (
            <>
              <header className="ratan-dialog__header">
                {label ? (
                  <AriaHeadingAdapter
                    id={titleId}
                    slot="title"
                    className="ratan-dialog__title"
                  >
                    {label}
                  </AriaHeadingAdapter>
                ) : null}
                {showCloseButton ? (
                  <AriaButtonAdapter
                    className="ratan-dialog__close"
                    aria-label={closeLabel}
                    onPress={() => {
                      dismissalReason.current = 'close-button';
                      close();
                    }}
                  >
                    <span aria-hidden="true">×</span>
                  </AriaButtonAdapter>
                ) : null}
              </header>
              <div className="ratan-dialog__content">{children}</div>
              {footer ? <footer className="ratan-dialog__footer">{footer}</footer> : null}
            </>
          )}
        </AriaDialogAdapter>
      </AriaModalAdapter>
    </AriaModalOverlayAdapter>
  );
});
