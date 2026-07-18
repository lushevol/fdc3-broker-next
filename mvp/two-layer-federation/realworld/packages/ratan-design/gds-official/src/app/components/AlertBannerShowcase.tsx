import { useState } from 'react';
import { Info, Check, AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function AlertBannerShowcase() {
  const [showInfo, setShowInfo] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [showError, setShowError] = useState(true);
  const [showWithActions, setShowWithActions] = useState(true);

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
        Alert banners
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Alert message banners communicate important status updates, warnings,
        errors and confirmations. Background colour is based on intent. Icons
        are always filled.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Informational banner */}
        {showInfo && (
          <section>
            <h3
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                marginBottom: '16px',
              }}
            >
              Informational
            </h3>

            <div
              style={{
                padding: '12px',
                backgroundColor: 'var(--sc-color-blue-50)',
                borderRadius: '8px',
                display: 'flex',
                gap: '12px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  color: 'var(--sc-color-blue-600)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Info size={20} fill="currentColor" />
              </div>
              <div style={{ flex: 1, paddingRight: '24px' }}>
                <h4
                  style={{
                    fontSize: 'var(--sc-text-title-sub)',
                    lineHeight: '24px',
                    color: 'var(--sc-color-blue-700)',
                    margin: '0 0 4px 0',
                    fontWeight: '500',
                  }}
                >
                  System maintenance scheduled
                </h4>
                <p
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    color: 'var(--sc-color-blue-600)',
                    margin: 0,
                  }}
                >
                  We'll be performing scheduled maintenance on 15 Feb 2026 from
                  02:00–04:00 SGT. Some features may be temporarily unavailable.
                </p>
              </div>
              <button
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--sc-color-blue-600)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close"
                onClick={() => setShowInfo(false)}
              >
                <X size={16} />
              </button>
            </div>
          </section>
        )}

        {/* Success banner */}
        {showSuccess && (
          <section>
            <h3
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                marginBottom: '16px',
              }}
            >
              Success
            </h3>

            <div
              style={{
                padding: '12px',
                backgroundColor: 'var(--sc-color-green-50)',
                borderRadius: '8px',
                display: 'flex',
                gap: '12px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  color: 'var(--sc-color-green-600)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Check size={20} fill="currentColor" />
              </div>
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: 'var(--sc-text-title-sub)',
                    lineHeight: '24px',
                    color: 'var(--sc-color-green-700)',
                    margin: '0 0 4px 0',
                    fontWeight: '500',
                  }}
                >
                  Payment completed
                </h4>
                <p
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    color: 'var(--sc-color-green-700)',
                    margin: 0,
                  }}
                >
                  Your payment has been processed. Transaction ID:
                  TXN-2026-00124
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Warning banner */}
        {showWarning && (
          <section>
            <h3
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                marginBottom: '16px',
              }}
            >
              Warning
            </h3>

            <div
              style={{
                padding: '12px',
                backgroundColor: 'var(--sc-color-amber-50)',
                borderRadius: '8px',
                position: 'relative',
              }}
            >
              <div
                style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}
              >
                <div
                  style={{
                    color: 'var(--sc-color-amber-600)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <AlertTriangle size={20} fill="currentColor" />
                </div>
                <div style={{ flex: 1, paddingRight: '24px' }}>
                  <h4
                    style={{
                      fontSize: 'var(--sc-text-title-sub)',
                      lineHeight: '24px',
                      color: 'var(--sc-color-amber-750)',
                      margin: '0 0 4px 0',
                      fontWeight: '500',
                    }}
                  >
                    Action required
                  </h4>
                  <p
                    style={{
                      fontSize: 'var(--sc-text-description-main)',
                      lineHeight: '16px',
                      color: 'var(--sc-color-amber-750)',
                      margin: 0,
                    }}
                  >
                    Your account information needs to be updated by 28 Feb 2026
                    to continue using all services.
                  </p>
                </div>
                <button
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '0',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--sc-color-amber-750)',
                    fontSize: '16px',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Close"
                  onClick={() => setShowWarning(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <div style={{ paddingLeft: '32px' }}>
                <button
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
                    fontFamily: 'SC Prosper Sans',
                  }}
                >
                  Update account
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Error banner */}
        {showError && (
          <section>
            <h3
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                marginBottom: '16px',
              }}
            >
              Error
            </h3>

            <div
              style={{
                padding: '12px',
                backgroundColor: 'var(--sc-color-red-50)',
                borderRadius: '8px',
                display: 'flex',
                gap: '12px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  color: 'var(--sc-color-red-600)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <AlertCircle size={20} fill="currentColor" />
              </div>
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: 'var(--sc-text-title-sub)',
                    lineHeight: '24px',
                    color: 'var(--sc-color-red-550)',
                    margin: '0 0 4px 0',
                    fontWeight: '500',
                  }}
                >
                  Transaction failed
                </h4>
                <p
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    color: 'var(--sc-color-red-550)',
                    margin: 0,
                  }}
                >
                  Unable to process your request. Please check your details and
                  try again.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Banner with actions (trailing) */}
        {showWithActions && (
          <section>
            <h3
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                marginBottom: '16px',
              }}
            >
              With actions (trailing)
            </h3>

            <div
              style={{
                padding: '12px',
                backgroundColor: 'var(--sc-color-blue-50)',
                borderRadius: '8px',
                position: 'relative',
              }}
            >
              <div
                style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}
              >
                <div
                  style={{
                    color: 'var(--sc-color-blue-600)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Info size={20} fill="currentColor" />
                </div>
                <div style={{ flex: 1, paddingRight: '100px' }}>
                  <h4
                    style={{
                      fontSize: 'var(--sc-text-title-sub)',
                      lineHeight: '24px',
                      color: 'var(--sc-color-blue-700)',
                      margin: '0 0 4px 0',
                      fontWeight: '500',
                    }}
                  >
                    New features available
                  </h4>
                  <p
                    style={{
                      fontSize: 'var(--sc-text-description-main)',
                      lineHeight: '16px',
                      color: 'var(--sc-color-blue-600)',
                      margin: 0,
                    }}
                  >
                    We've added new reporting capabilities to help you track
                    your transactions more effectively.
                  </p>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <button
                    style={{
                      padding: '0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--sc-color-blue-600)',
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontFamily: 'SC Prosper Sans',
                    }}
                  >
                    Learn more
                  </button>
                  <button
                    style={{
                      padding: '0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--sc-color-blue-600)',
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontFamily: 'SC Prosper Sans',
                    }}
                  >
                    View tutorial
                  </button>
                  <button
                    style={{
                      padding: '0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--sc-color-blue-600)',
                      fontSize: '16px',
                      cursor: 'pointer',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    aria-label="Close"
                    onClick={() => setShowWithActions(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Banner with custom content */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            With custom content
          </h3>

          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--sc-color-amber-50)',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  color: 'var(--sc-color-amber-600)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <AlertTriangle size={20} fill="currentColor" />
              </div>
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: 'var(--sc-text-title-sub)',
                    lineHeight: '24px',
                    color: 'var(--sc-color-amber-750)',
                    margin: '0 0 4px 0',
                    fontWeight: '500',
                  }}
                >
                  Document verification required
                </h4>
                <p
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    color: 'var(--sc-color-amber-750)',
                    marginBottom: '12px',
                  }}
                >
                  Please upload the following documents to complete your
                  verification:
                </p>
                <ul
                  style={{
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '20px',
                    color: 'var(--sc-color-amber-750)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>Valid identification document</li>
                  <li>Proof of address (dated within last 3 months)</li>
                </ul>
              </div>
            </div>
            <div style={{ paddingLeft: '32px' }}>
              <button
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
                  fontFamily: 'SC Prosper Sans',
                }}
              >
                Upload documents
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
