import { useState } from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle, X } from 'lucide-react';

const Snackbar = ({
  isVisible,
  onClose,
  intent = 'informational' as 'informational' | 'error' | 'warning' | 'success',
  headline,
  description,
  hasClose = true,
  actions,
}: {
  isVisible: boolean;
  onClose: () => void;
  intent?: 'informational' | 'error' | 'warning' | 'success';
  headline: string;
  description?: string;
  hasClose?: boolean;
  actions?: Array<{ label: string; onClick: () => void }>;
}) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (intent) {
      case 'error':
        return <AlertTriangle size={20} color="var(--sc-color-red-600)" />;
      case 'warning':
        return <AlertCircle size={20} color="var(--sc-color-amber-700)" />;
      case 'success':
        return <CheckCircle size={20} color="var(--sc-color-green-600)" />;
      default:
        return <Info size={20} color="var(--sc-color-blue-600)" />;
    }
  };

  const getBorderColor = () => {
    switch (intent) {
      case 'error':
        return 'var(--sc-color-red-500)';
      case 'warning':
        return 'var(--sc-color-amber-500)';
      case 'success':
        return 'var(--sc-color-green-500)';
      default:
        return 'var(--sc-color-blue-500)';
    }
  };

  return (
    <div
      style={{
        minWidth: '320px',
        maxWidth: '600px',
        minHeight: '48px',
        maxHeight: '72px',
        backgroundColor:
          'var(--sc-color-foundation-basic-container-layer-inverse)',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          padding: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              fontWeight: '500',
              color: 'var(--sc-color-foundation-content-header-inverse)',
              marginBottom: description ? '4px' : 0,
            }}
          >
            {headline}
          </div>
          {description && (
            <div
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-body-inverse)',
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {actions && actions.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                style={{
                  padding: '4px 12px',
                  border: 'none',
                  background: 'transparent',
                  color: getBorderColor(),
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {hasClose && (
          <button
            onClick={onClose}
            style={{
              width: '24px',
              height: '24px',
              flexShrink: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sc-color-foundation-content-body-inverse)',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const Toast = ({
  isVisible,
  onClose,
  intent = 'informational' as 'informational' | 'error' | 'warning' | 'success',
  headline,
  description,
  hasClose = true,
  hasLoadingBar = false,
}: {
  isVisible: boolean;
  onClose: () => void;
  intent?: 'informational' | 'error' | 'warning' | 'success';
  headline: string;
  description?: string;
  hasClose?: boolean;
  hasLoadingBar?: boolean;
}) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (intent) {
      case 'error':
        return <AlertTriangle size={20} color="var(--sc-color-red-600)" />;
      case 'warning':
        return <AlertCircle size={20} color="var(--sc-color-amber-700)" />;
      case 'success':
        return <CheckCircle size={20} color="var(--sc-color-green-600)" />;
      default:
        return <Info size={20} color="var(--sc-color-blue-600)" />;
    }
  };

  const getBorderColor = () => {
    switch (intent) {
      case 'error':
        return 'var(--sc-color-red-500)';
      case 'warning':
        return 'var(--sc-color-amber-500)';
      case 'success':
        return 'var(--sc-color-green-500)';
      default:
        return 'var(--sc-color-blue-500)';
    }
  };

  return (
    <div
      style={{
        minWidth: '320px',
        maxWidth: '480px',
        minHeight: '48px',
        maxHeight: '72px',
        backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          padding: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              fontWeight: '500',
              color: 'var(--sc-color-foundation-content-header)',
              marginBottom: description ? '4px' : 0,
            }}
          >
            {headline}
          </div>
          {description && (
            <div
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-body)',
              }}
            >
              {description}
            </div>
          )}
        </div>

        {hasClose && (
          <button
            onClick={onClose}
            style={{
              width: '24px',
              height: '24px',
              flexShrink: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sc-color-grey-600)',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-grey-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {hasLoadingBar && (
        <div
          style={{
            height: '3px',
            backgroundColor: 'var(--sc-color-grey-200)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: getBorderColor(),
              animation: 'loading 3s linear forwards',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default function ToastShowcase() {
  const [infoToast, setInfoToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [warningToast, setWarningToast] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [loadingToast, setLoadingToast] = useState(false);

  const [snackbar1, setSnackbar1] = useState(false);
  const [snackbar2, setSnackbar2] = useState(false);
  const [snackbar3, setSnackbar3] = useState(false);

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
        Snackbars and toasts
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Snackbars are interactive messages that appear at the top centre, used
        for user-initiated actions. Toasts are brief, non-interactive system
        notifications that auto-dismiss.
      </p>

      {/* Snackbar section */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Snackbars (interactive)
        </h3>

        <p
          style={{
            fontSize: 'var(--sc-text-paragraph-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-foundation-content-body)',
            marginBottom: '16px',
          }}
        >
          Used for confirming user actions like "Document saved" or "Settings
          updated". Can include action buttons. Features a dark background with
          inverse text colours.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={() => setSnackbar1(true)}
            style={{
              height: '32px',
              padding: '0 16px',
              backgroundColor: 'var(--sc-color-blue-500)',
              color: 'var(--sc-color-white)',
              border: 'none',
              borderRadius: '24px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-blue-350)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-blue-500)';
            }}
          >
            Document saved
          </button>

          <button
            onClick={() => setSnackbar2(true)}
            style={{
              height: '32px',
              padding: '0 16px',
              backgroundColor: 'var(--sc-color-green-500)',
              color: 'var(--sc-color-white)',
              border: 'none',
              borderRadius: '24px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-green-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-green-500)';
            }}
          >
            Message sent
          </button>

          <button
            onClick={() => setSnackbar3(true)}
            style={{
              height: '32px',
              padding: '0 16px',
              backgroundColor: 'var(--sc-color-red-550)',
              color: 'var(--sc-color-white)',
              border: 'none',
              borderRadius: '24px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-red-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-red-550)';
            }}
          >
            Item deleted
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Snackbar
            isVisible={snackbar1}
            onClose={() => setSnackbar1(false)}
            intent="success"
            headline="Document saved"
            description="Changes applied to all apps"
            actions={[
              { label: 'View', onClick: () => console.log('View clicked') },
              { label: 'Undo', onClick: () => console.log('Undo clicked') },
            ]}
          />

          <Snackbar
            isVisible={snackbar2}
            onClose={() => setSnackbar2(false)}
            intent="success"
            headline="Message sent"
            description="Your message has been delivered"
          />

          <Snackbar
            isVisible={snackbar3}
            onClose={() => setSnackbar3(false)}
            intent="error"
            headline="Item deleted"
            description="Moved to trash"
            actions={[
              { label: 'Undo', onClick: () => console.log('Undo clicked') },
            ]}
          />
        </div>
      </section>

      {/* Toast section */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Toasts (system notifications)
        </h3>

        <p
          style={{
            fontSize: 'var(--sc-text-paragraph-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-foundation-content-body)',
            marginBottom: '16px',
          }}
        >
          Used for system-level notifications like "Connection lost" or "Update
          available". Non-interactive and auto-dismiss. Features a light
          background.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={() => setInfoToast(true)}
            style={{
              height: '32px',
              padding: '0 16px',
              backgroundColor: 'var(--sc-color-blue-500)',
              color: 'var(--sc-color-white)',
              border: 'none',
              borderRadius: '24px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-blue-350)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-blue-500)';
            }}
          >
            Show info
          </button>

          <button
            onClick={() => setErrorToast(true)}
            style={{
              height: '32px',
              padding: '0 16px',
              backgroundColor: 'var(--sc-color-red-550)',
              color: 'var(--sc-color-white)',
              border: 'none',
              borderRadius: '24px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-red-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-red-550)';
            }}
          >
            Show error
          </button>

          <button
            onClick={() => setWarningToast(true)}
            style={{
              height: '32px',
              padding: '0 16px',
              backgroundColor: 'var(--sc-color-amber-500)',
              color: 'var(--sc-color-black)',
              border: 'none',
              borderRadius: '24px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-amber-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-amber-500)';
            }}
          >
            Show warning
          </button>

          <button
            onClick={() => setSuccessToast(true)}
            style={{
              height: '32px',
              padding: '0 16px',
              backgroundColor: 'var(--sc-color-green-500)',
              color: 'var(--sc-color-white)',
              border: 'none',
              borderRadius: '24px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-green-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--sc-color-green-500)';
            }}
          >
            Show success
          </button>

          <button
            onClick={() => setLoadingToast(true)}
            style={{
              height: '32px',
              padding: '0 16px',
              backgroundColor: 'var(--sc-color-white)',
              color: 'var(--sc-color-foundation-content-body)',
              border: '1px solid var(--sc-color-grey-200)',
              borderRadius: '24px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
            }}
          >
            Show with loading bar
          </button>
        </div>

        {/* Toast previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Toast
            isVisible={infoToast}
            onClose={() => setInfoToast(false)}
            intent="informational"
            headline="Update available"
            description="A new version of the application is ready to install"
          />

          <Toast
            isVisible={errorToast}
            onClose={() => setErrorToast(false)}
            intent="error"
            headline="Connection lost"
            description="Unable to connect to the server. Please check your internet connection"
          />

          <Toast
            isVisible={warningToast}
            onClose={() => setWarningToast(false)}
            intent="warning"
            headline="Password expires in 3 days"
            description="Update your password to maintain account security"
          />

          <Toast
            isVisible={successToast}
            onClose={() => setSuccessToast(false)}
            intent="success"
            headline="Sync complete"
            description="Last synced 5 minutes ago"
          />

          <Toast
            isVisible={loadingToast}
            onClose={() => setLoadingToast(false)}
            intent="informational"
            headline="Syncing data"
            description="Please wait whilst we sync your files"
            hasLoadingBar={true}
          />
        </div>
      </section>

      <style>{`
        @keyframes loading {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
