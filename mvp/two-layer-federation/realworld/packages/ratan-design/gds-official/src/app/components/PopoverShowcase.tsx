import { useState, useRef, useEffect } from 'react';
import { X, Info, Settings, HelpCircle } from 'lucide-react';

export default function PopoverShowcase() {
  const Popover = ({
    trigger,
    title = '',
    children,
    hasClose = true,
    hasDivider = false,
    hasFooter = false,
    footerActions,
    placement = 'bottom' as 'top' | 'bottom' | 'left' | 'right',
    hasIcon = false,
    icon,
    maxWidth = '320px',
  }: {
    trigger: React.ReactNode;
    title?: string;
    children: React.ReactNode;
    hasClose?: boolean;
    hasDivider?: boolean;
    hasFooter?: boolean;
    footerActions?: React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    hasIcon?: boolean;
    icon?: React.ReactNode;
    maxWidth?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen]);

    const getPopoverPosition = () => {
      switch (placement) {
        case 'top':
          return {
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
          };
        case 'left':
          return {
            right: 'calc(100% + 8px)',
            top: '50%',
            transform: 'translateY(-50%)',
          };
        case 'right':
          return {
            left: 'calc(100% + 8px)',
            top: '50%',
            transform: 'translateY(-50%)',
          };
        default: // bottom
          return {
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
          };
      }
    };

    const getArrowPosition = () => {
      const arrowSize = 8;
      switch (placement) {
        case 'top':
          // Arrow pointing downward (toward trigger below)
          return {
            bottom: `-${arrowSize}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
            borderColor:
              'var(--sc-color-white) transparent transparent transparent',
          };
        case 'left':
          // Arrow pointing rightward (toward trigger on right)
          return {
            right: `-${arrowSize}px`,
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
            borderColor:
              'transparent transparent transparent var(--sc-color-white)',
          };
        case 'right':
          // Arrow pointing leftward (toward trigger on left)
          return {
            left: `-${arrowSize}px`,
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
            borderColor:
              'transparent var(--sc-color-white) transparent transparent',
          };
        default: // bottom
          // Arrow pointing upward (toward trigger above)
          return {
            top: `-${arrowSize}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
            borderColor:
              'transparent transparent var(--sc-color-white) transparent',
          };
      }
    };

    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>

        {isOpen && (
          <div
            ref={popoverRef}
            style={{
              position: 'absolute',
              ...getPopoverPosition(),
              backgroundColor: 'var(--sc-color-white)',
              border: '1px solid var(--sc-color-grey-300)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              maxWidth,
              minWidth: '200px',
            }}
          >
            {/* Arrow */}
            <div
              style={{
                position: 'absolute',
                width: '0',
                height: '0',
                borderStyle: 'solid',
                ...getArrowPosition(),
              }}
            />

            {/* Header */}
            {(title || hasClose) && (
              <>
                <div
                  style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {hasIcon && icon && (
                    <div style={{ color: 'var(--sc-color-blue-500)' }}>
                      {icon}
                    </div>
                  )}
                  {title && (
                    <h3
                      style={{
                        flex: 1,
                        margin: 0,
                        fontSize: 'var(--sc-text-title-main)',
                        lineHeight: '26px',
                        color: 'var(--sc-color-foundation-content-header)',
                      }}
                    >
                      {title}
                    </h3>
                  )}
                  {hasClose && (
                    <button
                      onClick={() => setIsOpen(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: 'var(--sc-color-grey-500)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {hasDivider && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor:
                        'var(--sc-color-foundation-basic-divider-base)',
                    }}
                  />
                )}
              </>
            )}

            {/* Content */}
            <div
              style={{
                padding: title || hasClose ? '16px' : '16px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                maxHeight: '40vh',
                overflowY: 'auto',
              }}
            >
              {children}
            </div>

            {/* Footer */}
            {hasFooter && footerActions && (
              <>
                <div
                  style={{
                    height: '1px',
                    backgroundColor:
                      'var(--sc-color-foundation-basic-divider-base)',
                  }}
                />
                <div
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end',
                  }}
                >
                  {footerActions}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const Button = ({
    children,
    variant = 'primary' as 'primary' | 'secondary',
    onClick,
  }: {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      style={{
        height: '32px',
        padding: '0 16px',
        backgroundColor:
          variant === 'primary'
            ? 'var(--sc-color-blue-500)'
            : 'var(--sc-color-white)',
        color:
          variant === 'primary'
            ? 'var(--sc-color-white)'
            : 'var(--sc-color-foundation-content-body)',
        border:
          variant === 'primary' ? 'none' : '1px solid var(--sc-color-grey-200)',
        borderRadius: '24px',
        fontSize: 'var(--sc-text-component-main)',
        lineHeight: '22px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor =
          variant === 'primary'
            ? 'var(--sc-color-blue-350)'
            : 'var(--sc-color-grey-50)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor =
          variant === 'primary'
            ? 'var(--sc-color-blue-500)'
            : 'var(--sc-color-white)';
      }}
    >
      {children}
    </button>
  );

  return (
    <div>
      <h2
        style={{
          fontSize: 'var(--sc-text-section-main)',
          lineHeight: '44px',
          color: 'var(--sc-color-foundation-content-header)',
          marginBottom: '24px',
        }}
      >
        Popover
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Popovers display contextual content or lightweight actions adjacent to a
        trigger element. Max width: 320-420px, max height: 40-60vh with scroll,
        padding: 16-20px, arrow size: 8-12px.
      </p>

      {/* Basic popover */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic popover
        </h3>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Popover
            trigger={<Button>Bottom placement</Button>}
            title="Account information"
            placement="bottom"
          >
            <p style={{ margin: 0 }}>
              View and manage your account settings, including personal
              information, security preferences, and notification settings.
            </p>
          </Popover>

          <Popover
            trigger={<Button>Top placement</Button>}
            title="Help centre"
            placement="top"
          >
            <p style={{ margin: 0 }}>
              Access support documentation, FAQs, and contact options for
              assistance with your account.
            </p>
          </Popover>
        </div>
      </section>

      {/* With icon */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With leading icon
        </h3>

        <Popover
          trigger={
            <Button>
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Info size={16} />
                Information
              </span>
            </Button>
          }
          title="Important notice"
          hasIcon
          icon={<Info size={20} />}
          hasDivider
        >
          <p style={{ margin: 0 }}>
            Your account will be automatically logged out after 15 minutes of
            inactivity for security purposes. Please save your work regularly.
          </p>
        </Popover>
      </section>

      {/* With footer actions */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With footer actions
        </h3>

        <Popover
          trigger={
            <Button>
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Settings size={16} />
                Settings
              </span>
            </Button>
          }
          title="Notification preferences"
          hasDivider
          hasFooter
          footerActions={
            <>
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Apply</Button>
            </>
          }
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" defaultChecked />
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                }}
              >
                Email notifications
              </span>
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" />
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                }}
              >
                SMS notifications
              </span>
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" defaultChecked />
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                }}
              >
                Push notifications
              </span>
            </label>
          </div>
        </Popover>
      </section>

      {/* Without close button */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Without close button
        </h3>

        <Popover
          trigger={
            <Button>
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <HelpCircle size={16} />
                Quick tip
              </span>
            </Button>
          }
          hasClose={false}
          maxWidth="280px"
        >
          <p style={{ margin: 0 }}>
            Click outside or press Escape to close this popover. You can also
            click the trigger button again.
          </p>
        </Popover>
      </section>

      {/* Scrollable content */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Scrollable content
        </h3>

        <Popover
          trigger={<Button>View terms</Button>}
          title="Terms and conditions"
          hasDivider
          maxWidth="400px"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <p style={{ margin: 0 }}>
              1. By accessing and using this service, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>
            <p style={{ margin: 0 }}>
              2. The service is provided "as is" without warranty of any kind,
              either express or implied, including but not limited to warranties
              of merchantability.
            </p>
            <p style={{ margin: 0 }}>
              3. In no event shall Standard Chartered be liable for any direct,
              indirect, incidental, special, or consequential damages.
            </p>
            <p style={{ margin: 0 }}>
              4. You agree not to use the service for any unlawful purpose or in
              any way that might harm, damage, or disparage any other party.
            </p>
            <p style={{ margin: 0 }}>
              5. We reserve the right to modify these terms at any time.
              Continued use of the service constitutes acceptance of modified
              terms.
            </p>
          </div>
        </Popover>
      </section>
    </div>
  );
}
