import { useState } from 'react';
import { User, Lock, Bell, ChevronRight } from 'lucide-react';

export default function AccordionShowcase() {
  const [expandedBasic, setExpandedBasic] = useState<string | null>('item1');
  const [expandedWithIcon, setExpandedWithIcon] = useState<string | null>(null);
  const [expandedWithActions, setExpandedWithActions] = useState<string | null>(
    null,
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
        Accordions
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Accordions are collapsible sections that help organise content and
        reduce scrolling. Chevrons rotate 90° when expanded.
      </p>

      {/* Basic accordion */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic accordion
        </h3>

        <div
          style={{
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {['item1', 'item2', 'item3'].map((itemId, index) => {
            const isExpanded = expandedBasic === itemId;
            return (
              <div key={itemId}>
                {index > 0 && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor:
                        'var(--sc-color-foundation-basic-divider-base)',
                    }}
                  />
                )}
                <button
                  onClick={() => setExpandedBasic(isExpanded ? null : itemId)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    backgroundColor: isExpanded
                      ? 'var(--sc-color-grey-50)'
                      : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-25)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--sc-color-foundation-content-body)',
                    }}
                  >
                    <ChevronRight size={16} />
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      color: 'var(--sc-color-foundation-content-body)',
                      fontWeight: '500',
                    }}
                  >
                    Accordion item {index + 1}
                  </span>
                </button>
                {isExpanded && (
                  <div
                    style={{
                      padding: '12px 12px 12px 36px',
                      backgroundColor: 'var(--sc-color-grey-25)',
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
                      This is the content for accordion item {index + 1}.
                      Accordions help reduce cognitive load by allowing users to
                      focus on one item at a time.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Accordion with icons and descriptions */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With icons and descriptions
        </h3>

        <div
          style={{
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {[
            {
              id: 'icon1',
              title: 'Personal information',
              desc: 'Manage your account details',
              icon: <User size={20} />,
            },
            {
              id: 'icon2',
              title: 'Security settings',
              desc: 'Password and authentication',
              icon: <Lock size={20} />,
            },
            {
              id: 'icon3',
              title: 'Notifications',
              desc: 'Configure alert preferences',
              icon: <Bell size={20} />,
            },
          ].map((item, index, arr) => {
            const isExpanded = expandedWithIcon === item.id;
            return (
              <div key={item.id}>
                {index > 0 && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor:
                        'var(--sc-color-foundation-basic-divider-base)',
                    }}
                  />
                )}
                <button
                  onClick={() =>
                    setExpandedWithIcon(isExpanded ? null : item.id)
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    backgroundColor: isExpanded
                      ? 'var(--sc-color-grey-50)'
                      : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-25)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--sc-color-foundation-content-body)',
                    }}
                  >
                    <ChevronRight size={16} />
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--sc-color-foundation-content-body)',
                      marginLeft: '4px',
                    }}
                  >
                    {item.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 'var(--sc-text-component-main)',
                        lineHeight: '22px',
                        color: 'var(--sc-color-foundation-content-body)',
                        fontWeight: '500',
                        marginBottom: '2px',
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--sc-text-description-main)',
                        lineHeight: '16px',
                        color: 'var(--sc-color-foundation-content-helper-text)',
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </button>
                {isExpanded && (
                  <div
                    style={{
                      padding: '16px 12px 16px 60px',
                      backgroundColor: 'var(--sc-color-grey-25)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 'var(--sc-text-paragraph-main)',
                        lineHeight: '22px',
                        color: 'var(--sc-color-foundation-content-body)',
                        marginBottom: '12px',
                      }}
                    >
                      Content for {item.title.toLowerCase()}. This section
                      contains additional details and options.
                    </p>
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'var(--sc-color-white)',
                        borderRadius: '4px',
                        border:
                          '1px solid var(--sc-color-foundation-basic-divider-base)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 'var(--sc-text-description-main)',
                          lineHeight: '16px',
                          color: 'var(--sc-color-foundation-content-body)',
                          margin: 0,
                        }}
                      >
                        Example nested content
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Accordion with trailing actions */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With status and actions
        </h3>

        <div
          style={{
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {[
            {
              id: 'action1',
              title: 'Payment details',
              status: 'Complete',
              statusColor: 'var(--sc-color-green-700)',
              statusBg: 'var(--sc-color-green-50)',
            },
            {
              id: 'action2',
              title: 'Shipping address',
              status: 'Pending',
              statusColor: 'var(--sc-color-amber-750)',
              statusBg: 'var(--sc-color-amber-50)',
            },
            {
              id: 'action3',
              title: 'Order summary',
              status: 'Draft',
              statusColor: 'var(--sc-color-grey-700)',
              statusBg: 'var(--sc-color-grey-100)',
            },
          ].map((item, index) => {
            const isExpanded = expandedWithActions === item.id;
            return (
              <div key={item.id}>
                {index > 0 && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor:
                        'var(--sc-color-foundation-basic-divider-base)',
                    }}
                  />
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isExpanded
                      ? 'var(--sc-color-grey-50)'
                      : 'transparent',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <button
                    onClick={() =>
                      setExpandedWithActions(isExpanded ? null : item.id)
                    }
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        transform: isExpanded
                          ? 'rotate(90deg)'
                          : 'rotate(0deg)',
                        transition: 'transform 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--sc-color-foundation-content-body)',
                      }}
                    >
                      <ChevronRight size={16} />
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--sc-text-component-main)',
                        lineHeight: '22px',
                        color: 'var(--sc-color-foundation-content-body)',
                        fontWeight: '500',
                        flex: 1,
                      }}
                    >
                      {item.title}
                    </span>
                  </button>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      paddingRight: '12px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '20px',
                        padding: '0 8px',
                        backgroundColor: item.statusBg,
                        color: item.statusColor,
                        borderRadius: '12px',
                        fontSize: 'var(--sc-text-description-main)',
                        lineHeight: '16px',
                      }}
                    >
                      {item.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      style={{
                        padding: '4px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--sc-color-blue-500)',
                        fontSize: 'var(--sc-text-component-main)',
                        lineHeight: '22px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div
                    style={{
                      padding: '16px 12px 16px 36px',
                      backgroundColor: 'var(--sc-color-grey-25)',
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
                      Details for {item.title.toLowerCase()}. Trailing actions
                      should not trigger accordion expansion.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
