import {
  Circle,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
  Archive,
  Clock,
} from 'lucide-react';

export default function StatusShowcase() {
  const Status = ({
    type = 'neutral' as
      | 'neutral'
      | 'information'
      | 'in-progress'
      | 'complete'
      | 'success'
      | 'warning'
      | 'error'
      | 'rejected'
      | 'draft'
      | 'locked'
      | 'archived',
    label,
    isFilled = false,
    hasIconLeading = true,
    size = 'default' as 'compact' | 'default',
  }: {
    type?:
      | 'neutral'
      | 'information'
      | 'in-progress'
      | 'complete'
      | 'success'
      | 'warning'
      | 'error'
      | 'rejected'
      | 'draft'
      | 'locked'
      | 'archived';
    label: string;
    isFilled?: boolean;
    hasIconLeading?: boolean;
    size?: 'compact' | 'default';
  }) => {
    const getIcon = () => {
      switch (type) {
        case 'success':
        case 'complete':
          return <CheckCircle size={size === 'compact' ? 12 : 14} />;
        case 'warning':
          return <AlertTriangle size={size === 'compact' ? 12 : 14} />;
        case 'error':
        case 'rejected':
          return <AlertTriangle size={size === 'compact' ? 12 : 14} />;
        case 'information':
        case 'in-progress':
          return <Info size={size === 'compact' ? 12 : 14} />;
        case 'locked':
          return <Lock size={size === 'compact' ? 12 : 14} />;
        case 'archived':
          return <Archive size={size === 'compact' ? 12 : 14} />;
        case 'draft':
          return <Clock size={size === 'compact' ? 12 : 14} />;
        default:
          return <Circle size={size === 'compact' ? 12 : 14} />;
      }
    };

    const getColors = () => {
      if (isFilled) {
        switch (type) {
          case 'success':
          case 'complete':
            return {
              bg: 'var(--sc-color-green-100)',
              text: 'var(--sc-color-green-700)',
              border: 'transparent',
            };
          case 'warning':
            return {
              bg: 'var(--sc-color-amber-100)',
              text: 'var(--sc-color-amber-800)',
              border: 'transparent',
            };
          case 'error':
          case 'rejected':
            return {
              bg: 'var(--sc-color-red-100)',
              text: 'var(--sc-color-red-700)',
              border: 'transparent',
            };
          case 'information':
          case 'in-progress':
            return {
              bg: 'var(--sc-color-blue-100)',
              text: 'var(--sc-color-blue-700)',
              border: 'transparent',
            };
          case 'draft':
          case 'locked':
          case 'archived':
            return {
              bg: 'var(--sc-color-grey-100)',
              text: 'var(--sc-color-grey-700)',
              border: 'transparent',
            };
          default:
            return {
              bg: 'var(--sc-color-grey-100)',
              text: 'var(--sc-color-grey-700)',
              border: 'transparent',
            };
        }
      } else {
        // Outlined style
        switch (type) {
          case 'success':
          case 'complete':
            return {
              bg: 'transparent',
              text: 'var(--sc-color-green-700)',
              border: 'var(--sc-color-green-500)',
            };
          case 'warning':
            return {
              bg: 'transparent',
              text: 'var(--sc-color-amber-800)',
              border: 'var(--sc-color-amber-500)',
            };
          case 'error':
          case 'rejected':
            return {
              bg: 'transparent',
              text: 'var(--sc-color-red-700)',
              border: 'var(--sc-color-red-500)',
            };
          case 'information':
          case 'in-progress':
            return {
              bg: 'transparent',
              text: 'var(--sc-color-blue-700)',
              border: 'var(--sc-color-blue-500)',
            };
          case 'draft':
          case 'locked':
          case 'archived':
            return {
              bg: 'transparent',
              text: 'var(--sc-color-grey-700)',
              border: 'var(--sc-color-grey-400)',
            };
          default:
            return {
              bg: 'transparent',
              text: 'var(--sc-color-grey-700)',
              border: 'var(--sc-color-grey-400)',
            };
        }
      }
    };

    const colors = getColors();
    const height = size === 'compact' ? '20px' : '28px';
    const padding = size === 'compact' ? '0 8px' : '0 10px';

    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: size === 'compact' ? '6px' : '8px',
          height,
          padding,
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: '4px',
          color: colors.text,
        }}
      >
        {hasIconLeading && getIcon()}
        <span
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            fontWeight: '500',
          }}
        >
          {label}
        </span>
      </div>
    );
  };

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
        Status
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Status indicators communicate the current state or outcome of an entity.
        They support multiple types, filled or outlined styles, and icons.
      </p>

      {/* Filled status badges */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Filled status indicators
        </h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Status type="draft" label="Draft" isFilled />
          <Status type="in-progress" label="In progress" isFilled />
          <Status type="complete" label="Complete" isFilled />
          <Status type="success" label="Success" isFilled />
          <Status type="warning" label="Pending" isFilled />
          <Status type="error" label="Error" isFilled />
          <Status type="rejected" label="Rejected" isFilled />
          <Status type="locked" label="Locked" isFilled />
          <Status type="archived" label="Archived" isFilled />
        </div>
      </section>

      {/* Outlined status badges */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Outlined status indicators
        </h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Status type="draft" label="Draft" />
          <Status type="in-progress" label="In progress" />
          <Status type="complete" label="Complete" />
          <Status type="success" label="Success" />
          <Status type="warning" label="Pending" />
          <Status type="error" label="Error" />
          <Status type="rejected" label="Rejected" />
          <Status type="locked" label="Locked" />
          <Status type="archived" label="Archived" />
        </div>
      </section>

      {/* Without icons */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Without leading icons
        </h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Status type="draft" label="Draft" isFilled hasIconLeading={false} />
          <Status
            type="in-progress"
            label="In progress"
            isFilled
            hasIconLeading={false}
          />
          <Status
            type="success"
            label="Success"
            isFilled
            hasIconLeading={false}
          />
          <Status type="error" label="Error" isFilled hasIconLeading={false} />
        </div>
      </section>

      {/* Compact size */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Compact size
        </h3>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Status type="draft" label="Draft" isFilled size="compact" />
          <Status
            type="in-progress"
            label="In progress"
            isFilled
            size="compact"
          />
          <Status type="success" label="Approved" isFilled size="compact" />
          <Status type="error" label="Failed" isFilled size="compact" />
        </div>
      </section>
    </div>
  );
}
