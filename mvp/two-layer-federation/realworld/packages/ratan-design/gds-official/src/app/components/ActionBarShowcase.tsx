import {
  ArrowLeft,
  Save,
  Download,
  MoreVertical,
  Check,
  FileText,
  AlertCircle,
  Printer,
  Mail,
} from 'lucide-react';
import { useState } from 'react';

export default function ActionBarShowcase() {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

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
        Action bar
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Action bar provides a consistent place for primary and secondary
        actions, lightweight status and optional back navigation. It sits below
        the page header or can be used standalone on simpler pages and list
        views.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Basic action bar with right actions only */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            Basic action bar
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <button
              onClick={() => console.log('Cancel clicked')}
              style={{
                height: '32px',
                padding: '0 16px',
                backgroundColor: 'var(--sc-color-white)',
                color: 'var(--sc-color-foundation-content-body)',
                border: '1px solid var(--sc-color-grey-300)',
                borderRadius: '24px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-400)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => console.log('Submit clicked')}
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
                transition: 'background-color 0.15s ease',
                outline: 'none',
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
              Submit
            </button>
          </div>
        </section>

        {/* Action bar with primary and link button only */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            With primary and link button
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <button
              onClick={() => console.log('Draft clicked')}
              style={{
                padding: '0',
                backgroundColor: 'transparent',
                color: 'var(--sc-color-blue-500)',
                border: 'none',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'pointer',
                transition: 'color 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--sc-color-blue-350)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--sc-color-blue-500)';
              }}
            >
              Draft
            </button>
            <button
              onClick={() => console.log('Submit clicked')}
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
                transition: 'background-color 0.15s ease',
                outline: 'none',
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
              Submit
            </button>
          </div>
        </section>

        {/* Action bar with all three button types */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            With all three button types
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            <button
              onClick={() => console.log('Draft clicked')}
              style={{
                padding: '0',
                backgroundColor: 'transparent',
                color: 'var(--sc-color-blue-500)',
                border: 'none',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'pointer',
                transition: 'color 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--sc-color-blue-350)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--sc-color-blue-500)';
              }}
            >
              Draft
            </button>
            <button
              onClick={() => console.log('Cancel clicked')}
              style={{
                height: '32px',
                padding: '0 16px',
                backgroundColor: 'var(--sc-color-white)',
                color: 'var(--sc-color-foundation-content-body)',
                border: '1px solid var(--sc-color-grey-300)',
                borderRadius: '24px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-400)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => console.log('Submit clicked')}
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
                transition: 'background-color 0.15s ease',
                outline: 'none',
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
              Submit
            </button>
          </div>
        </section>

        {/* Action bar with back navigation and title */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            With back navigation and title
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => console.log('Back clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <div
                style={{
                  width: '1px',
                  height: '24px',
                  backgroundColor:
                    'var(--sc-color-foundation-basic-divider-base)',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--sc-text-title-sub)',
                  lineHeight: '24px',
                  color: 'var(--sc-color-foundation-content-title)',
                  fontWeight: '500',
                }}
              >
                Edit customer details
              </span>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => console.log('Discard clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                Discard
              </button>
              <button
                onClick={() => console.log('Draft clicked')}
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
                  transition: 'background-color 0.15s ease',
                  outline: 'none',
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
                Draft
              </button>
            </div>
          </div>
        </section>

        {/* Action bar with left actions */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            With left actions
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => console.log('Export clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <Download size={20} />
                <span>Export</span>
              </button>
              <button
                onClick={() => console.log('Template clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <FileText size={20} />
                <span>Template</span>
              </button>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => console.log('Cancel clicked')}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-foundation-content-body)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-400)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-white)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => console.log('Submit clicked')}
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
                  transition: 'background-color 0.15s ease',
                  outline: 'none',
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
                Submit
              </button>
            </div>
          </div>
        </section>

        {/* Action bar with more actions dropdown */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            With more actions
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* Left side */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
              }}
            >
              <button
                onClick={() => console.log('Export clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <Download size={20} />
                <span>Export</span>
              </button>
              <button
                onClick={() => console.log('Template clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <FileText size={20} />
                <span>Template</span>
              </button>
              <button
                onClick={() => console.log('Print clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <Printer size={20} />
                <span>Print</span>
              </button>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <MoreVertical size={20} />
                <span>More</span>
              </button>

              {/* More dropdown menu */}
              {showMoreMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    backgroundColor: 'var(--sc-color-white)',
                    border: '1px solid var(--sc-color-grey-200)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '8px',
                    minWidth: '160px',
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={() => {
                      console.log('Email clicked');
                      setShowMoreMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      color: 'var(--sc-color-foundation-content-body)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Mail size={16} />
                    <span>Email</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => console.log('Cancel clicked')}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-foundation-content-body)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-400)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-white)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => console.log('Submit clicked')}
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
                  transition: 'background-color 0.15s ease',
                  outline: 'none',
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
                Submit
              </button>
            </div>
          </div>
        </section>

        {/* Action bar with last saved status */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            With last saved status
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => console.log('Export clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <Download size={20} />
                <span>Export</span>
              </button>
            </div>

            {/* Right side - Last saved + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Last saved indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginRight: '4px',
                }}
              >
                <Check
                  size={16}
                  style={{ color: 'var(--sc-color-green-600)' }}
                />
                <span
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  Last saved 3m ago
                </span>
              </div>

              {/* Actions */}
              <button
                onClick={() => console.log('Draft clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                Draft
              </button>
              <button
                onClick={() => console.log('Cancel clicked')}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-foundation-content-body)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-400)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-white)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => console.log('Save clicked')}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.15s ease',
                  outline: 'none',
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
                <Save size={16} />
                Save changes
              </button>
            </div>
          </div>
        </section>

        {/* Action bar with validation error */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            With validation error
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* Left side - Error message */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <AlertCircle
                size={16}
                style={{ color: 'var(--sc-color-red-500)' }}
              />
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-red-500)',
                }}
              >
                Please fix 3 errors before submitting
              </span>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => console.log('Cancel clicked')}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-foundation-content-body)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-400)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-white)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => console.log('Submit clicked')}
                disabled
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-grey-200)',
                  color: 'var(--sc-color-grey-400)',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'not-allowed',
                  outline: 'none',
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </section>

        {/* Complete action bar with all features */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            Complete action bar with all features
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* Left side - Back + Title + Left actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
                minWidth: 0,
              }}
            >
              <button
                onClick={() => console.log('Back clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <div
                style={{
                  width: '1px',
                  height: '24px',
                  backgroundColor:
                    'var(--sc-color-foundation-basic-divider-base)',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 'var(--sc-text-title-sub)',
                  lineHeight: '24px',
                  color: 'var(--sc-color-foundation-content-title)',
                  fontWeight: '500',
                  marginRight: '16px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Payment request
              </span>
              <button
                onClick={() => console.log('Export clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                <Download size={20} />
                <span>Export</span>
              </button>
            </div>

            {/* Right side - Last saved + actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              {/* Last saved indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginRight: '4px',
                }}
              >
                <Check
                  size={16}
                  style={{ color: 'var(--sc-color-green-600)' }}
                />
                <span
                  style={{
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  Last saved 1m ago
                </span>
              </div>

              {/* Actions */}
              <button
                onClick={() => console.log('Draft clicked')}
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-blue-500)',
                  border: 'none',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-350)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sc-color-blue-500)';
                }}
              >
                Draft
              </button>
              <button
                onClick={() => console.log('Cancel clicked')}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-foundation-content-body)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-400)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-white)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => console.log('Proceed clicked')}
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
                  transition: 'background-color 0.15s ease',
                  outline: 'none',
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
                Proceed
              </button>
            </div>
          </div>
        </section>

        {/* Destructive action bar */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            With destructive action
          </h3>

          <div
            style={{
              height: '48px',
              padding: '0 24px',
              backgroundColor:
                'var(--sc-color-foundation-basic-container-layer)',
              borderRadius: '8px',
              border: '1px solid var(--sc-color-foundation-basic-divider-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* Left side */}
            <span
              style={{
                fontSize: 'var(--sc-text-title-sub)',
                lineHeight: '24px',
                color: 'var(--sc-color-foundation-content-title)',
              }}
            >
              Delete this transaction?
            </span>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => console.log('Keep clicked')}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-foundation-content-body)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-400)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-white)';
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                }}
              >
                Keep
              </button>
              <button
                onClick={() => console.log('Delete clicked')}
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
                  transition: 'background-color 0.15s ease',
                  outline: 'none',
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
