import { useState } from 'react';
import { Home, User, Settings, Bell } from 'lucide-react';

const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'underlined' as 'underlined' | 'filled',
}: {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
  }>;
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: 'underlined' | 'filled';
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div
      style={{
        borderBottom:
          variant === 'underlined'
            ? '1px solid var(--sc-color-grey-200)'
            : 'none',
        display: 'flex',
        gap: '4px',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isHovered = hoveredTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              height: '48px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              borderRadius: variant === 'filled' ? '6px 6px 0 0' : '0',
              backgroundColor:
                variant === 'filled' && isActive
                  ? 'var(--sc-color-blue-500)'
                  : isHovered && variant === 'filled'
                    ? 'var(--sc-color-grey-50)'
                    : 'transparent',
              color:
                variant === 'filled' && isActive
                  ? 'var(--sc-color-white)'
                  : isActive
                    ? 'var(--sc-color-blue-500)'
                    : 'var(--sc-color-foundation-content-body)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease',
              borderBottom:
                variant === 'underlined' && isActive
                  ? '2px solid var(--sc-color-blue-500)'
                  : variant === 'underlined'
                    ? '2px solid transparent'
                    : 'none',
              marginBottom: variant === 'underlined' ? '-1px' : '0',
              fontWeight: isActive ? '500' : '400',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                '0 0 0 3px var(--sc-color-blue-100)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {tab.icon && (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {tab.icon}
              </span>
            )}
            {tab.label}
            {tab.badge && (
              <span
                style={{
                  minWidth: '20px',
                  height: '20px',
                  padding: '0 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  backgroundColor:
                    variant === 'filled' && isActive
                      ? 'var(--sc-color-blue-700)'
                      : 'var(--sc-color-grey-200)',
                  color:
                    variant === 'filled' && isActive
                      ? 'var(--sc-color-white)'
                      : 'var(--sc-color-foundation-content-body)',
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default function TabsShowcase() {
  const [underlinedActive, setUnderlinedActive] = useState('home');
  const [filledActive, setFilledActive] = useState('profile');
  const [iconActive, setIconActive] = useState('dashboard');

  const basicTabs = [
    { id: 'home', label: 'Home' },
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const iconTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={16} /> },
    { id: 'account', label: 'Account', icon: <User size={16} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={16} /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell size={16} />, badge: '3' },
  ];

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
        Tabs
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Tabs organise content into mutually exclusive views. They support
        underlined and filled variants with optional icons and badges.
      </p>

      {/* Underlined tabs */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Underlined tabs
        </h3>

        <Tabs
          tabs={basicTabs}
          activeTab={underlinedActive}
          onTabChange={setUnderlinedActive}
          variant="underlined"
        />

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--sc-color-grey-50)',
            borderRadius: '0 0 6px 6px',
          }}
        >
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
              margin: 0,
            }}
          >
            Content for {underlinedActive} tab
          </p>
        </div>
      </section>

      {/* Filled tabs */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Filled tabs
        </h3>

        <Tabs
          tabs={basicTabs}
          activeTab={filledActive}
          onTabChange={setFilledActive}
          variant="filled"
        />

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--sc-color-grey-50)',
            borderRadius: '0 6px 6px 6px',
          }}
        >
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
              margin: 0,
            }}
          >
            Content for {filledActive} tab
          </p>
        </div>
      </section>

      {/* Tabs with icons and badges */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Tabs with icons and badges
        </h3>

        <Tabs
          tabs={iconTabs}
          activeTab={iconActive}
          onTabChange={setIconActive}
          variant="underlined"
        />

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--sc-color-grey-50)',
            borderRadius: '0 0 6px 6px',
          }}
        >
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
              margin: 0,
            }}
          >
            Content for {iconActive} tab
          </p>
        </div>
      </section>
    </div>
  );
}
