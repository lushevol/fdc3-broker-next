import { ChevronRight } from 'lucide-react';

export default function BreadcrumbsShowcase() {
  const BreadcrumbItem = ({
    label,
    isLast = false,
    onClick,
  }: {
    label: string;
    isLast?: boolean;
    onClick?: () => void;
  }) => {
    if (isLast) {
      return (
        <span
          style={{
            fontSize: 'var(--sc-text-component-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-foundation-content-body)',
          }}
        >
          {label}
        </span>
      );
    }

    return (
      <>
        <button
          onClick={onClick}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: 'var(--sc-text-component-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-blue-500)',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--sc-color-blue-350)';
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--sc-color-blue-500)';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {label}
        </button>
        <ChevronRight
          size={16}
          style={{
            color: 'var(--sc-color-grey-500)',
            margin: '0 8px',
          }}
        />
      </>
    );
  };

  const Breadcrumb = ({
    items,
  }: {
    items: Array<{ label: string; onClick?: () => void }>;
  }) => {
    return (
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {items.map((item, index) => (
          <BreadcrumbItem
            key={index}
            label={item.label}
            isLast={index === items.length - 1}
            onClick={item.onClick}
          />
        ))}
      </nav>
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
        Breadcrumbs
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Breadcrumbs display the current location within a hierarchy and allow
        users to navigate back to parent states. They use chevron separators and
        follow link button styling.
      </p>

      {/* Two segments */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Two segments
        </h3>

        <Breadcrumb
          items={[
            { label: 'Home', onClick: () => console.log('Home') },
            { label: 'Products' },
          ]}
        />
      </section>

      {/* Three segments */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Three segments
        </h3>

        <Breadcrumb
          items={[
            { label: 'Home', onClick: () => console.log('Home') },
            { label: 'Products', onClick: () => console.log('Products') },
            { label: 'Banking solutions' },
          ]}
        />
      </section>

      {/* Four segments */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Four segments
        </h3>

        <Breadcrumb
          items={[
            { label: 'Home', onClick: () => console.log('Home') },
            { label: 'Products', onClick: () => console.log('Products') },
            {
              label: 'Banking solutions',
              onClick: () => console.log('Banking'),
            },
            { label: 'Corporate accounts' },
          ]}
        />
      </section>

      {/* Five segments */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Five segments
        </h3>

        <Breadcrumb
          items={[
            { label: 'Home', onClick: () => console.log('Home') },
            { label: 'Products', onClick: () => console.log('Products') },
            { label: 'Banking', onClick: () => console.log('Banking') },
            { label: 'Corporate', onClick: () => console.log('Corporate') },
            { label: 'Account details' },
          ]}
        />
      </section>
    </div>
  );
}
