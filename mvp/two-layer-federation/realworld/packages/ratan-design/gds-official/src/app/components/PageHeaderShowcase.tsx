import { useState } from 'react';
import { Bell, Settings, User } from 'lucide-react';

export default function PageHeaderShowcase() {
  const [activeTab, setActiveTab] = useState('overview');

  const PageHeader = ({
    title,
    description = '',
    hasTabs = false,
    tabs = [],
    actions,
  }: {
    title: string;
    description?: string;
    hasTabs?: boolean;
    tabs?: Array<{ id: string; label: string }>;
    actions?: React.ReactNode;
  }) => {
    return (
      <div
        style={{
          backgroundColor:
            'var(--sc-color-foundation-basic-brand-prosper-blue)',
          color: 'var(--sc-color-white)',
        }}
      >
        {/* Main header */}
        <div
          style={{
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 'var(--sc-text-section-main)',
                lineHeight: '44px',
                fontWeight: '500',
                color: 'var(--sc-color-white)',
                marginBottom: description ? '8px' : 0,
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--sc-text-paragraph-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-white)',
                  opacity: 0.9,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              {actions}
            </div>
          )}
        </div>

        {/* Tabs */}
        {hasTabs && tabs.length > 0 && (
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              gap: '8px',
              padding: '0 32px',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 16px',
                  backgroundColor:
                    activeTab === tab.id
                      ? 'var(--sc-color-foundation-basic-background-base)'
                      : 'transparent',
                  color:
                    activeTab === tab.id
                      ? 'var(--sc-color-foundation-content-body)'
                      : 'var(--sc-color-white)',
                  border: 'none',
                  borderRadius: '6px 6px 0 0',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  top: '1px',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const IconButton = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      style={{
        width: '32px',
        height: '32px',
        padding: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'var(--sc-color-white)',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      }}
    >
      {children}
    </button>
  );

  const Button = ({
    children,
    variant = 'secondary' as 'secondary' | 'primary',
  }: {
    children: React.ReactNode;
    variant?: 'secondary' | 'primary';
  }) => (
    <button
      style={{
        height: '32px',
        padding: '0 16px',
        backgroundColor:
          variant === 'primary' ? 'var(--sc-color-white)' : 'transparent',
        color:
          variant === 'primary'
            ? 'var(--sc-color-blue-500)'
            : 'var(--sc-color-white)',
        border:
          variant === 'primary' ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        fontSize: 'var(--sc-text-component-main)',
        lineHeight: '22px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        } else {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
        } else {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
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
        Page header
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Page headers are the main top-level component on any page. Title: 28px
        medium, description: 14px regular, background: Prosper blue, titles are
        white.
      </p>

      {/* Basic header */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic page header
        </h3>

        <div
          style={{
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <PageHeader title="Dashboard" />
          <div
            style={{
              padding: '32px',
              backgroundColor:
                'var(--sc-color-foundation-basic-background-base)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                margin: 0,
              }}
            >
              Page content goes here
            </p>
          </div>
        </div>
      </section>

      {/* With description */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With description
        </h3>

        <div
          style={{
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <PageHeader
            title="Account overview"
            description="View and manage your account details, transactions, and settings"
          />
          <div
            style={{
              padding: '32px',
              backgroundColor:
                'var(--sc-color-foundation-basic-background-base)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                margin: 0,
              }}
            >
              Page content goes here
            </p>
          </div>
        </div>
      </section>

      {/* With actions */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With action buttons
        </h3>

        <div
          style={{
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <PageHeader
            title="Transactions"
            description="Review your recent transactions and account activity"
            actions={
              <>
                <IconButton>
                  <Bell size={16} />
                </IconButton>
                <IconButton>
                  <Settings size={16} />
                </IconButton>
                <Button variant="primary">Export</Button>
              </>
            }
          />
          <div
            style={{
              padding: '32px',
              backgroundColor:
                'var(--sc-color-foundation-basic-background-base)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                margin: 0,
              }}
            >
              Page content goes here
            </p>
          </div>
        </div>
      </section>

      {/* With tabs */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With tabs
        </h3>

        <div
          style={{
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <PageHeader
            title="Settings"
            description="Configure your account preferences and security settings"
            hasTabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'security', label: 'Security' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'privacy', label: 'Privacy' },
            ]}
          />
          <div
            style={{
              padding: '32px',
              backgroundColor:
                'var(--sc-color-foundation-basic-background-base)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                margin: 0,
              }}
            >
              {activeTab === 'overview' && 'Overview content'}
              {activeTab === 'security' && 'Security settings content'}
              {activeTab === 'notifications' &&
                'Notification preferences content'}
              {activeTab === 'privacy' && 'Privacy settings content'}
            </p>
          </div>
        </div>
      </section>

      {/* Complete example */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Complete example
        </h3>

        <div
          style={{
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <PageHeader
            title="Corporate accounts"
            description="Manage your corporate banking accounts and services"
            hasTabs
            tabs={[
              { id: 'accounts', label: 'Accounts' },
              { id: 'payments', label: 'Payments' },
              { id: 'reports', label: 'Reports' },
            ]}
            actions={
              <>
                <IconButton>
                  <Bell size={16} />
                </IconButton>
                <IconButton>
                  <User size={16} />
                </IconButton>
                <Button variant="secondary">Settings</Button>
                <Button variant="primary">New payment</Button>
              </>
            }
          />
          <div
            style={{
              padding: '32px',
              backgroundColor:
                'var(--sc-color-foundation-basic-background-base)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                margin: 0,
              }}
            >
              Page content goes here
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
