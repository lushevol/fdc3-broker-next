import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Check,
  MoreVertical,
  Edit,
  Copy,
  Archive,
  Trash2,
  User,
  Settings,
  LogOut,
  Search,
  Filter,
  GripVertical,
} from 'lucide-react';

export default function DropdownMenuShowcase() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleMultipleSelection = (option: string) => {
    setSelectedMultiple((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
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
        Dropdown menu
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Dropdown Menus allow users to select one or multiple options from a
        collapsible list for actions, filters, or settings without cluttering
        the UI.
      </p>

      {/* Basic Single-Select Menu */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Single-select menu
        </h3>

        <div style={{ position: 'relative', width: 'fit-content' }}>
          <button
            onClick={() => setIsBasicOpen(!isBasicOpen)}
            style={{
              height: '32px',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid var(--sc-color-grey-300)',
              borderRadius: '6px',
              backgroundColor: 'var(--sc-color-white)',
              color: 'var(--sc-color-foundation-content-body)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
            }}
          >
            Sort by
            <ChevronDown size={16} />
          </button>

          {isBasicOpen && (
            <div
              style={{
                position: 'absolute',
                top: '36px',
                left: 0,
                minWidth: '200px',
                backgroundColor:
                  'var(--sc-color-foundation-basic-container-layer)',
                border:
                  '1px solid var(--sc-color-foundation-basic-divider-base)',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                padding: '4px',
              }}
            >
              {['Name', 'Date modified', 'Date created', 'Size'].map(
                (option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedOption(option);
                      setIsBasicOpen(false);
                    }}
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 8px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor:
                        selectedOption === option
                          ? 'var(--sc-color-blue-50)'
                          : 'transparent',
                      color:
                        selectedOption === option
                          ? 'var(--sc-color-blue-600)'
                          : 'var(--sc-color-foundation-content-body)',
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.15s ease',
                      outline: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedOption !== option) {
                        e.currentTarget.style.backgroundColor =
                          'var(--sc-color-grey-50)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedOption !== option) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>{option}</span>
                    {selectedOption === option && (
                      <Check
                        size={16}
                        style={{ color: 'var(--sc-color-blue-600)' }}
                      />
                    )}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* Menu with Icons and Actions */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Menu with leading icons
        </h3>

        <div
          style={{
            width: '240px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '4px',
          }}
        >
          {[
            { icon: <Edit size={16} />, label: 'Edit', intent: 'neutral' },
            { icon: <Copy size={16} />, label: 'Duplicate', intent: 'neutral' },
            {
              icon: <Archive size={16} />,
              label: 'Archive',
              intent: 'neutral',
            },
          ].map((item, index) => (
            <button
              key={item.label}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 8px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: 'var(--sc-color-foundation-content-body)',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.15s ease',
                outline: 'none',
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
              <span>{item.label}</span>
            </button>
          ))}

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--sc-color-foundation-basic-divider-base)',
              margin: '4px 0',
            }}
          />

          <button
            style={{
              width: '100%',
              height: '32px',
              padding: '0 8px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--sc-color-red-550)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.15s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-red-50)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </section>

      {/* Multi-Select with Checkboxes */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Multi-select with checkboxes
        </h3>

        <div
          style={{
            width: '280px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '4px',
          }}
        >
          <div
            style={{
              padding: '8px',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--sc-color-grey-600)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              FILTER BY STATUS
            </div>
          </div>

          {['All items', 'Active', 'Pending', 'Completed', 'Archived'].map(
            (option) => (
              <button
                key={option}
                onClick={() => toggleMultipleSelection(option)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 8px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: 'var(--sc-color-foundation-content-body)',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: `1px solid ${selectedMultiple.includes(option) ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-400)'}`,
                    borderRadius: '3px',
                    backgroundColor: selectedMultiple.includes(option)
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {selectedMultiple.includes(option) && (
                    <Check
                      size={12}
                      style={{ color: 'var(--sc-color-white)' }}
                    />
                  )}
                </div>
                <span>{option}</span>
              </button>
            ),
          )}
        </div>

        {selectedMultiple.length > 0 && (
          <p
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-helper-text)',
              marginTop: '12px',
            }}
          >
            Selected: {selectedMultiple.join(', ')}
          </p>
        )}
      </section>

      {/* Collapsible Groups */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Collapsible groups
        </h3>

        <div
          style={{
            width: '280px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '4px',
          }}
        >
          {/* Account Group */}
          <button
            onClick={() =>
              setExpandedGroup(expandedGroup === 'account' ? null : 'account')
            }
            style={{
              width: '100%',
              height: '32px',
              padding: '0 8px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--sc-color-foundation-content-body)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              fontWeight: '500',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.15s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {expandedGroup === 'account' ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <span>Account</span>
          </button>

          {expandedGroup === 'account' && (
            <>
              {[
                { icon: <User size={16} />, label: 'Profile' },
                { icon: <Settings size={16} />, label: 'Settings' },
              ].map((item) => (
                <button
                  key={item.label}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 8px 0 32px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: 'var(--sc-color-foundation-content-body)',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.15s ease',
                    outline: 'none',
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
                  <span>{item.label}</span>
                </button>
              ))}
            </>
          )}

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--sc-color-foundation-basic-divider-base)',
              margin: '4px 0',
            }}
          />

          <button
            style={{
              width: '100%',
              height: '32px',
              padding: '0 8px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              color: 'var(--sc-color-foundation-content-body)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.15s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </section>

      {/* Menu with Descriptions */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Menu with descriptions
        </h3>

        <div
          style={{
            width: '320px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '4px',
          }}
        >
          {[
            {
              label: 'Standard account',
              description: 'For personal use with basic features',
            },
            {
              label: 'Business account',
              description: 'Advanced tools for teams and companies',
            },
            {
              label: 'Enterprise account',
              description: 'Custom solutions for large organisations',
            },
          ].map((item) => (
            <button
              key={item.label}
              style={{
                width: '100%',
                minHeight: '48px',
                padding: '8px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: 'var(--sc-color-foundation-content-body)',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'background-color 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span
                style={{
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  fontWeight: '500',
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: 'var(--sc-color-grey-600)',
                }}
              >
                {item.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Menu with Search */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Menu with search
        </h3>

        <div
          style={{
            width: '280px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '4px',
          }}
        >
          <div
            style={{
              padding: '8px',
              borderBottom:
                '1px solid var(--sc-color-foundation-basic-divider-base)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--sc-color-grey-600)',
                }}
              />
              <input
                type="text"
                placeholder="Search options..."
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 8px 0 32px',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '4px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  backgroundColor: 'var(--sc-color-white)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((option) => (
            <button
              key={option}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 8px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: 'var(--sc-color-foundation-content-body)',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      {/* Disabled Items */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Disabled items
        </h3>

        <div
          style={{
            width: '240px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '4px',
          }}
        >
          {[
            { label: 'Available option', disabled: false },
            { label: 'Disabled option', disabled: true },
            { label: 'Another option', disabled: false },
            { label: 'Also disabled', disabled: true },
          ].map((item) => (
            <button
              key={item.label}
              disabled={item.disabled}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 8px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: item.disabled
                  ? 'var(--sc-color-grey-400)'
                  : 'var(--sc-color-foundation-content-body)',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                textAlign: 'left',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                transition: 'background-color 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!item.disabled) {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.disabled) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
