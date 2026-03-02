import { useState } from 'react';
import {
  FileText,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function AnchorNavigationShowcase() {
  const [activeAnchor, setActiveAnchor] = useState('introduction');
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'section-1',
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
        Anchor navigation
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Anchor Navigation provides in-page wayfinding for long documents and
        content-heavy pages, allowing users to jump to headings and track scroll
        position.
      </p>

      {/* Basic Anchor Navigation */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic anchor navigation
        </h3>

        <div
          style={{
            width: '280px',
            backgroundColor: 'var(--sc-color-white)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            padding: '12px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--sc-color-grey-600)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            ON THIS PAGE
          </div>

          {[
            { id: 'introduction', label: 'Introduction' },
            { id: 'getting-started', label: 'Getting started' },
            { id: 'key-features', label: 'Key features' },
            { id: 'examples', label: 'Examples' },
            { id: 'api-reference', label: 'API reference' },
            { id: 'troubleshooting', label: 'Troubleshooting' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveAnchor(item.id)}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color:
                  activeAnchor === item.id
                    ? 'var(--sc-color-blue-600)'
                    : 'var(--sc-color-foundation-content-body)',
                fontSize: '14px',
                lineHeight: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease',
                outline: 'none',
                marginBottom: '2px',
                fontWeight: activeAnchor === item.id ? '500' : '400',
              }}
              onMouseEnter={(e) => {
                if (activeAnchor !== item.id) {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeAnchor !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {activeAnchor === item.id && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '20px',
                    backgroundColor: 'var(--sc-color-blue-600)',
                    borderRadius: '0 2px 2px 0',
                  }}
                />
              )}
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* With Leading Icons */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With leading icons
        </h3>

        <div
          style={{
            width: '280px',
            backgroundColor: 'var(--sc-color-white)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            padding: '12px',
          }}
        >
          {[
            { id: 'overview', label: 'Overview', icon: <FileText size={16} /> },
            { id: 'timeline', label: 'Timeline', icon: <Clock size={16} /> },
            {
              id: 'completed',
              label: 'Completed tasks',
              icon: <CheckCircle2 size={16} />,
            },
          ].map((item) => (
            <button
              key={item.id}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: 'var(--sc-color-foundation-content-body)',
                fontSize: '14px',
                lineHeight: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.15s ease',
                outline: 'none',
                marginBottom: '2px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Hierarchical with Indentation */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Hierarchical structure
        </h3>

        <div
          style={{
            width: '320px',
            backgroundColor: 'var(--sc-color-white)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            padding: '12px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--sc-color-grey-600)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            TABLE OF CONTENTS
          </div>

          {/* Section 1 */}
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === 'section-1' ? null : 'section-1',
              )
            }
            style={{
              width: '100%',
              height: '32px',
              padding: '0 12px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--sc-color-foundation-content-body)',
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: '500',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background-color 0.15s ease',
              outline: 'none',
              marginBottom: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {expandedSection === 'section-1' ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            1. Introduction
          </button>

          {expandedSection === 'section-1' && (
            <>
              {['1.1 Background', '1.2 Purpose', '1.3 Scope'].map((item) => (
                <button
                  key={item}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px 0 32px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: 'var(--sc-color-foundation-content-body)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    outline: 'none',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-grey-50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {item}
                </button>
              ))}
            </>
          )}

          {/* Section 2 */}
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === 'section-2' ? null : 'section-2',
              )
            }
            style={{
              width: '100%',
              height: '32px',
              padding: '0 12px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--sc-color-foundation-content-body)',
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: '500',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background-color 0.15s ease',
              outline: 'none',
              marginBottom: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {expandedSection === 'section-2' ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            2. Implementation
          </button>

          {expandedSection === 'section-2' && (
            <>
              {['2.1 Setup', '2.2 Configuration', '2.3 Testing'].map((item) => (
                <button
                  key={item}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px 0 32px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: 'var(--sc-color-foundation-content-body)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    outline: 'none',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-grey-50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {item}
                </button>
              ))}
            </>
          )}

          {/* Section 3 */}
          <button
            style={{
              width: '100%',
              height: '32px',
              padding: '0 12px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--sc-color-foundation-content-body)',
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: '500',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background-color 0.15s ease',
              outline: 'none',
              marginBottom: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ChevronRight size={16} />
            3. Conclusion
          </button>
        </div>
      </section>

      {/* With Trailing Content */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With trailing content
        </h3>

        <div
          style={{
            width: '320px',
            backgroundColor: 'var(--sc-color-white)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            padding: '12px',
          }}
        >
          {[
            { id: 'intro', label: 'Introduction', time: '2 min' },
            { id: 'setup', label: 'Setup guide', time: '5 min' },
            { id: 'usage', label: 'Usage examples', time: '8 min' },
            { id: 'advanced', label: 'Advanced topics', time: '12 min' },
          ].map((item) => (
            <button
              key={item.id}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: 'var(--sc-color-foundation-content-body)',
                fontSize: '14px',
                lineHeight: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 0.15s ease',
                outline: 'none',
                marginBottom: '2px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>{item.label}</span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--sc-color-grey-600)',
                }}
              >
                {item.time}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
