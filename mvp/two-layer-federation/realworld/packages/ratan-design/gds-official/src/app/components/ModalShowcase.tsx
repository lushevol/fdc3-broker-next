import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  intent = 'neutral' as
    | 'neutral'
    | 'error'
    | 'warning'
    | 'success'
    | 'informational',
  footer,
  size = 'medium' as 'small' | 'medium' | 'large',
  hasIcon = false,
  hasDivider = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  intent?: 'neutral' | 'error' | 'warning' | 'success' | 'informational';
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  hasIcon?: boolean;
  hasDivider?: boolean;
}) => {
  if (!isOpen) return null;

  const getWidth = () => {
    switch (size) {
      case 'small':
        return '480px';
      case 'large':
        return '800px';
      default:
        return '640px';
    }
  };

  const getHeaderBg = () => {
    switch (intent) {
      case 'error':
        return 'var(--sc-color-red-50)';
      case 'warning':
        return 'var(--sc-color-amber-50)';
      case 'success':
        return 'var(--sc-color-green-50)';
      case 'informational':
        return 'var(--sc-color-blue-50)';
      default:
        return 'var(--sc-color-white)';
    }
  };

  const getIcon = () => {
    switch (intent) {
      case 'error':
        return <AlertTriangle size={24} color="var(--sc-color-red-600)" />;
      case 'warning':
        return <Info size={24} color="var(--sc-color-amber-700)" />;
      case 'success':
        return <CheckCircle size={24} color="var(--sc-color-green-600)" />;
      case 'informational':
        return <Info size={24} color="var(--sc-color-blue-600)" />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: getWidth(),
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: 'var(--sc-color-white)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: getHeaderBg(),
            borderBottom: hasDivider
              ? '1px solid var(--sc-color-grey-200)'
              : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {hasIcon && getIcon()}
          <h2
            style={{
              flex: 1,
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
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
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '24px',
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--sc-color-grey-200)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ModalShowcase() {
  const [neutralModal, setNeutralModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

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
        Modals
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Modals are focused overlays used to confirm decisions, collect short
        inputs, or display critical information.
      </p>

      {/* Trigger buttons */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Modal examples
        </h3>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setNeutralModal(true)}
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
            Open neutral modal
          </button>

          <button
            onClick={() => setDeleteModal(true)}
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
            Delete confirmation
          </button>

          <button
            onClick={() => setWarningModal(true)}
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
            Warning modal
          </button>

          <button
            onClick={() => setSuccessModal(true)}
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
            Success modal
          </button>
        </div>
      </section>

      {/* Neutral Modal */}
      <Modal
        isOpen={neutralModal}
        onClose={() => setNeutralModal(false)}
        title="Update settings"
        hasDivider={true}
        footer={
          <>
            <button
              onClick={() => setNeutralModal(false)}
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
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => setNeutralModal(false)}
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
              Save changes
            </button>
          </>
        }
      >
        <p
          style={{
            fontSize: 'var(--sc-text-paragraph-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-foundation-content-body)',
            margin: 0,
          }}
        >
          Your changes will be applied immediately to all connected
          applications.
        </p>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete account"
        intent="error"
        hasIcon={true}
        hasDivider={true}
        footer={
          <>
            <button
              onClick={() => setDeleteModal(false)}
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
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => setDeleteModal(false)}
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
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-red-400)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-red-550)';
              }}
            >
              Delete
            </button>
          </>
        }
      >
        <p
          style={{
            fontSize: 'var(--sc-text-paragraph-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-foundation-content-body)',
            margin: 0,
          }}
        >
          This action cannot be reversed. All your data will be permanently
          deleted.
        </p>
      </Modal>

      {/* Warning Modal */}
      <Modal
        isOpen={warningModal}
        onClose={() => setWarningModal(false)}
        title="Warning"
        intent="warning"
        hasIcon={true}
        footer={
          <>
            <button
              onClick={() => setWarningModal(false)}
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
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => setWarningModal(false)}
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
              Proceed
            </button>
          </>
        }
      >
        <p
          style={{
            fontSize: 'var(--sc-text-paragraph-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-foundation-content-body)',
            margin: 0,
          }}
        >
          Your session will expire in 5 minutes. Do you want to proceed?
        </p>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Payment successful"
        intent="success"
        hasIcon={true}
        footer={
          <button
            onClick={() => setSuccessModal(false)}
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
            Done
          </button>
        }
      >
        <p
          style={{
            fontSize: 'var(--sc-text-paragraph-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-foundation-content-body)',
            marginBottom: '16px',
          }}
        >
          Your payment has been processed.
        </p>
        <div
          style={{
            fontSize: '28px',
            fontWeight: '500',
            lineHeight: '36px',
            color: 'var(--sc-color-foundation-content-header)',
          }}
        >
          SGD 1,234.50
        </div>
      </Modal>
    </div>
  );
}
