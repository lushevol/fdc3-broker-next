import { useState } from 'react';
import {
  User,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Settings,
  Bell,
  CreditCard,
  Shield,
  Mail,
  Phone,
  Globe,
  Lock,
  Palette,
  HelpCircle,
} from 'lucide-react';

export default function ListShowcase() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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
        Lists
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        List is a structured container that displays multiple related items with
        consistent affordances. Use List Item for a single row and List Group to
        compose sections or cards of lists.
      </p>

      {/* Basic List */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic list with leading icons
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
              id: '1',
              label: 'Account settings',
              icon: <Settings size={16} />,
            },
            { id: '2', label: 'Notifications', icon: <Bell size={16} /> },
            {
              id: '3',
              label: 'Payment methods',
              icon: <CreditCard size={16} />,
            },
            {
              id: '4',
              label: 'Privacy and security',
              icon: <Shield size={16} />,
            },
          ].map((item, index) => (
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
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  minHeight: '56px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-100)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
              >
                <span
                  style={{
                    color: 'var(--sc-color-foundation-content-body)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  {item.label}
                </span>
                <ChevronRight
                  size={16}
                  style={{ color: 'var(--sc-color-grey-400)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* List with Description and Trailing Content */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With descriptions and trailing content
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
              id: '1',
              label: 'Email notifications',
              description:
                'Receive updates about your account activity and important announcements',
              icon: <Mail size={16} />,
              trailing: 'Daily',
            },
            {
              id: '2',
              label: 'SMS alerts',
              description:
                'Get important notifications via text message for urgent updates',
              icon: <Phone size={16} />,
              trailing: 'Enabled',
            },
            {
              id: '3',
              label: 'Push notifications',
              description:
                'Allow the app to send you push notifications on your device',
              icon: <Bell size={16} />,
              trailing: 'Off',
            },
          ].map((item, index) => (
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
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  minHeight: '72px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-100)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
              >
                <span
                  style={{
                    color: 'var(--sc-color-foundation-content-body)',
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: '3px',
                  }}
                >
                  {item.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      color: 'var(--sc-color-foundation-content-body)',
                      marginBottom: '4px',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: 'var(--sc-color-foundation-content-helper-text)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: 'var(--sc-color-foundation-content-helper-text)',
                    paddingTop: '3px',
                    flexShrink: 0,
                  }}
                >
                  {item.trailing}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* List with Eyebrow, Role, and Description */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Team members with eyebrow, role, and description
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
              id: '1',
              eyebrow: 'TEAM LEAD',
              name: 'Sarah Chen',
              role: 'Senior Product Manager',
              description: 'sarah.chen@standardchartered.com · London, UK',
              initials: 'SC',
              color: 'var(--sc-color-blue-500)',
            },
            {
              id: '2',
              eyebrow: 'ENGINEERING',
              name: 'James Wilson',
              role: 'Lead Developer',
              description: 'james.wilson@standardchartered.com · Singapore',
              initials: 'JW',
              color: 'var(--sc-color-green-500)',
            },
            {
              id: '3',
              eyebrow: 'DESIGN',
              name: 'Emma Thompson',
              role: 'UX Designer',
              description: 'emma.thompson@standardchartered.com · Hong Kong',
              initials: 'ET',
              color: 'var(--sc-color-amber-500)',
            },
          ].map((item, index) => (
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
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  minHeight: '72px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-100)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    flexShrink: 0,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    color: 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    fontWeight: '500',
                  }}
                >
                  {item.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '16px',
                      fontWeight: '500',
                      color: 'var(--sc-color-foundation-content-helper-text)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px',
                    }}
                  >
                    {item.eyebrow}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      color: 'var(--sc-color-foundation-content-body)',
                      marginBottom: '2px',
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '16px',
                      fontWeight: '500',
                      color: 'var(--sc-color-foundation-content-body)',
                      marginBottom: '4px',
                    }}
                  >
                    {item.role}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: 'var(--sc-color-foundation-content-helper-text)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Draggable List */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Draggable list with handles
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
            { id: '1', label: 'Introduction to the platform' },
            { id: '2', label: 'Getting started guide' },
            { id: '3', label: 'Core concepts and principles' },
            { id: '4', label: 'Advanced topics and best practices' },
          ].map((item, index) => (
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
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  minHeight: '56px',
                  cursor: 'grab',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.cursor = 'grabbing';
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-100)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.cursor = 'grab';
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
              >
                <GripVertical
                  size={16}
                  style={{ color: 'var(--sc-color-grey-400)', flexShrink: 0 }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collapsible List with Chevron */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Collapsible nested list
        </h3>

        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '12px',
          }}
        >
          Chevron points right when collapsed, down when expanded
        </p>

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
              id: '1',
              label: 'Account settings',
              icon: <Settings size={16} />,
              children: [
                'Profile information',
                'Password and security',
                'Preferences',
                'Privacy settings',
              ],
            },
            {
              id: '2',
              label: 'Notification preferences',
              icon: <Bell size={16} />,
              children: [
                'Email notifications',
                'SMS alerts',
                'Push notifications',
                'In-app notifications',
              ],
            },
            {
              id: '3',
              label: 'Appearance',
              icon: <Palette size={16} />,
              children: ['Theme', 'Language', 'Display density'],
            },
          ].map((item, index) => {
            const isExpanded = expandedItem === item.id;
            return (
              <div key={item.id}>
                {index > 0 &&
                  !isExpanded &&
                  expandedItem !== String(Number(item.id) - 1) && (
                    <div
                      style={{
                        height: '1px',
                        backgroundColor:
                          'var(--sc-color-foundation-basic-divider-base)',
                      }}
                    />
                  )}
                <div
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minHeight: '56px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    backgroundColor: isExpanded
                      ? 'var(--sc-color-grey-50)'
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-grey-100)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.backgroundColor = isExpanded
                      ? 'var(--sc-color-grey-50)'
                      : 'var(--sc-color-grey-50)';
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--sc-color-foundation-content-body)',
                      flexShrink: 0,
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                  <span
                    style={{
                      color: 'var(--sc-color-foundation-content-body)',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      color: 'var(--sc-color-foundation-content-body)',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                {isExpanded && (
                  <div
                    style={{
                      backgroundColor: 'var(--sc-color-grey-25)',
                      borderTop:
                        '1px solid var(--sc-color-foundation-basic-divider-base)',
                    }}
                  >
                    {item.children.map((child, childIndex) => (
                      <div
                        key={childIndex}
                        style={{
                          padding: '12px 16px 12px 56px',
                          display: 'flex',
                          alignItems: 'center',
                          minHeight: '48px',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                          borderTop:
                            childIndex > 0
                              ? '1px solid var(--sc-color-foundation-basic-divider-base)'
                              : 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'var(--sc-color-grey-50)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'var(--sc-color-grey-100)';
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'var(--sc-color-grey-50)';
                        }}
                      >
                        <span
                          style={{
                            fontSize: 'var(--sc-text-component-main)',
                            lineHeight: '22px',
                            color: 'var(--sc-color-foundation-content-body)',
                          }}
                        >
                          {child}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* List with Sections and Dividers */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Sectioned list with main title and section titles
        </h3>

        <div
          style={{
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {/* Main Title */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--sc-color-grey-25)',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            <h4
              style={{
                fontSize: 'var(--sc-text-title-main)',
                lineHeight: '26px',
                color: 'var(--sc-color-foundation-content-title)',
                margin: 0,
              }}
            >
              System preferences
            </h4>
          </div>

          {/* Section: General */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--sc-color-grey-25)',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: '500',
                color: 'var(--sc-color-foundation-content-helper-text)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              General
            </div>
          </div>

          {[
            {
              id: 'g1',
              label: 'Language and region',
              icon: <Globe size={16} />,
            },
            { id: 'g2', label: 'Appearance', icon: <Palette size={16} /> },
          ].map((item, index, arr) => (
            <div key={item.id}>
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  minHeight: '56px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-100)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
              >
                <span
                  style={{
                    color: 'var(--sc-color-foundation-content-body)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  {item.label}
                </span>
                <ChevronRight
                  size={16}
                  style={{ color: 'var(--sc-color-grey-400)' }}
                />
              </div>
              {index < arr.length - 1 && (
                <div
                  style={{
                    height: '1px',
                    backgroundColor:
                      'var(--sc-color-foundation-basic-divider-base)',
                  }}
                />
              )}
            </div>
          ))}

          {/* Divider */}
          <div
            style={{
              height: '8px',
              backgroundColor: 'var(--sc-color-grey-25)',
              borderTop:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          />

          {/* Section: Security */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--sc-color-grey-25)',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: '500',
                color: 'var(--sc-color-foundation-content-helper-text)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Security
            </div>
          </div>

          {[
            { id: 's1', label: 'Password', icon: <Lock size={16} /> },
            {
              id: 's2',
              label: 'Two-factor authentication',
              icon: <Shield size={16} />,
            },
          ].map((item, index, arr) => (
            <div key={item.id}>
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  minHeight: '56px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-100)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
              >
                <span
                  style={{
                    color: 'var(--sc-color-foundation-content-body)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                  }}
                >
                  {item.label}
                </span>
                <ChevronRight
                  size={16}
                  style={{ color: 'var(--sc-color-grey-400)' }}
                />
              </div>
              {index < arr.length - 1 && (
                <div
                  style={{
                    height: '1px',
                    backgroundColor:
                      'var(--sc-color-foundation-basic-divider-base)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
