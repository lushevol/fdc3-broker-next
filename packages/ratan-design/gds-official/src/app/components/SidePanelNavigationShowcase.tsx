import { useState } from 'react';
import {
  Home,
  FileText,
  Settings,
  Users,
  BarChart,
  ChevronRight,
  ChevronDown,
  GripVertical,
} from 'lucide-react';

export default function SidePanelNavigationShowcase() {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'reports',
  ]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const NavigationItem = ({
    id,
    label,
    icon,
    isSelected = false,
    isNested = false,
    hasChildren = false,
    isExpanded = false,
    hasDrag = false,
    description = '',
    trailingContent = '',
    disabled = false,
    onClick,
    onToggle,
  }: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    isSelected?: boolean;
    isNested?: boolean;
    hasChildren?: boolean;
    isExpanded?: boolean;
    hasDrag?: boolean;
    description?: string;
    trailingContent?: string;
    disabled?: boolean;
    onClick?: () => void;
    onToggle?: () => void;
  }) => {
    return (
      <div>
        <button
          onClick={hasChildren ? onToggle : onClick}
          disabled={disabled}
          style={{
            width: '100%',
            height: '32px',
            padding: '0 12px',
            paddingLeft: isNested ? '28px' : '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isSelected
              ? 'var(--sc-color-blue-50)'
              : 'transparent',
            color: isSelected
              ? 'var(--sc-color-blue-600)'
              : disabled
                ? 'var(--sc-color-grey-400)'
                : 'var(--sc-color-foundation-content-body)',
            border: 'none',
            borderRadius: '4px',
            fontSize: 'var(--sc-text-component-main)',
            lineHeight: '22px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            transition: 'background-color 0.15s ease',
            opacity: disabled ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!disabled && !isSelected) {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {hasDrag && (
            <GripVertical
              size={16}
              style={{ color: 'var(--sc-color-grey-400)' }}
            />
          )}

          {hasChildren && (
            <div
              style={{ width: '16px', display: 'flex', alignItems: 'center' }}
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          )}

          {icon && (
            <div
              style={{ width: '20px', display: 'flex', alignItems: 'center' }}
            >
              {icon}
            </div>
          )}

          <span style={{ flex: 1 }}>{label}</span>

          {trailingContent && (
            <span
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-grey-500)',
              }}
            >
              {trailingContent}
            </span>
          )}
        </button>

        {description && (
          <div
            style={{
              paddingLeft: isNested ? '52px' : '36px',
              paddingRight: '12px',
              paddingTop: '4px',
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-helper-text)',
            }}
          >
            {description}
          </div>
        )}
      </div>
    );
  };

  const NavigationHeader = ({
    label,
    hasDivider = false,
  }: {
    label: string;
    hasDivider?: boolean;
  }) => (
    <>
      <div
        style={{
          padding: '12px 12px 8px 12px',
          fontSize: 'var(--sc-text-description-main)',
          lineHeight: '16px',
          fontWeight: '600',
          color: 'var(--sc-color-grey-600)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
      {hasDivider && (
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--sc-color-foundation-basic-divider-base)',
            margin: '8px 12px',
          }}
        />
      )}
    </>
  );

  const NavigationDivider = () => (
    <div
      style={{
        height: '1px',
        backgroundColor: 'var(--sc-color-foundation-basic-divider-base)',
        margin: '8px 12px',
      }}
    />
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
        Side panel navigation
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Side panel navigation provides application-level or module-level
        navigation. Item height: 32px, leading icon size: 16-20px, indentation
        step: 12-16px, container padding: 12-16px.
      </p>

      {/* Basic navigation */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic navigation
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
          <NavigationItem
            id="home"
            label="Home"
            icon={<Home size={20} />}
            onClick={() => setSelectedItem('home')}
          />
          <NavigationItem
            id="dashboard"
            label="Dashboard"
            icon={<BarChart size={20} />}
            isSelected={selectedItem === 'dashboard'}
            onClick={() => setSelectedItem('dashboard')}
          />
          <NavigationItem
            id="documents"
            label="Documents"
            icon={<FileText size={20} />}
            onClick={() => setSelectedItem('documents')}
          />
          <NavigationItem
            id="users"
            label="Users"
            icon={<Users size={20} />}
            onClick={() => setSelectedItem('users')}
          />
          <NavigationItem
            id="settings"
            label="Settings"
            icon={<Settings size={20} />}
            onClick={() => setSelectedItem('settings')}
          />
        </div>
      </section>

      {/* With sections and headers */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With sections and headers
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
          <NavigationHeader label="Main" />
          <NavigationItem
            id="overview"
            label="Overview"
            icon={<Home size={20} />}
            onClick={() => setSelectedItem('overview')}
          />
          <NavigationItem
            id="analytics"
            label="Analytics"
            icon={<BarChart size={20} />}
            onClick={() => setSelectedItem('analytics')}
          />

          <NavigationDivider />

          <NavigationHeader label="Management" />
          <NavigationItem
            id="documents2"
            label="Documents"
            icon={<FileText size={20} />}
            onClick={() => setSelectedItem('documents2')}
          />
          <NavigationItem
            id="team"
            label="Team"
            icon={<Users size={20} />}
            onClick={() => setSelectedItem('team')}
          />
        </div>
      </section>

      {/* With nested items */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With nested items
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
          <NavigationItem
            id="home2"
            label="Home"
            icon={<Home size={20} />}
            onClick={() => setSelectedItem('home2')}
          />
          <NavigationItem
            id="reports"
            label="Reports"
            icon={<FileText size={20} />}
            hasChildren
            isExpanded={expandedSections.includes('reports')}
            onToggle={() => toggleSection('reports')}
          />
          {expandedSections.includes('reports') && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <NavigationItem
                id="sales-report"
                label="Sales report"
                isNested
                onClick={() => setSelectedItem('sales-report')}
              />
              <NavigationItem
                id="financial-report"
                label="Financial report"
                isNested
                onClick={() => setSelectedItem('financial-report')}
              />
              <NavigationItem
                id="performance-report"
                label="Performance report"
                isNested
                onClick={() => setSelectedItem('performance-report')}
              />
            </div>
          )}
          <NavigationItem
            id="settings2"
            label="Settings"
            icon={<Settings size={20} />}
            onClick={() => setSelectedItem('settings2')}
          />
        </div>
      </section>

      {/* With trailing content */}
      <section style={{ marginBottom: '48px' }}>
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
            width: '280px',
            backgroundColor: 'var(--sc-color-white)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            padding: '12px',
          }}
        >
          <NavigationItem
            id="inbox"
            label="Inbox"
            icon={<FileText size={20} />}
            trailingContent="12"
            onClick={() => setSelectedItem('inbox')}
          />
          <NavigationItem
            id="drafts"
            label="Drafts"
            icon={<FileText size={20} />}
            trailingContent="3"
            onClick={() => setSelectedItem('drafts')}
          />
          <NavigationItem
            id="sent"
            label="Sent"
            icon={<FileText size={20} />}
            onClick={() => setSelectedItem('sent')}
          />
        </div>
      </section>

      {/* With drag handles */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With drag handles
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
          <NavigationItem
            id="task1"
            label="Task 1"
            hasDrag
            onClick={() => setSelectedItem('task1')}
          />
          <NavigationItem
            id="task2"
            label="Task 2"
            hasDrag
            onClick={() => setSelectedItem('task2')}
          />
          <NavigationItem
            id="task3"
            label="Task 3"
            hasDrag
            onClick={() => setSelectedItem('task3')}
          />
        </div>
      </section>

      {/* With descriptions and disabled state */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With descriptions and states
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
          <NavigationItem
            id="active"
            label="Active projects"
            icon={<FileText size={20} />}
            description="Projects currently in progress"
            trailingContent="5"
            onClick={() => setSelectedItem('active')}
          />
          <NavigationItem
            id="completed"
            label="Completed projects"
            icon={<FileText size={20} />}
            description="Successfully finished projects"
            trailingContent="12"
            onClick={() => setSelectedItem('completed')}
          />
          <NavigationItem
            id="archived"
            label="Archived projects"
            icon={<FileText size={20} />}
            description="Old projects moved to archive"
            disabled
          />
        </div>
      </section>
    </div>
  );
}
