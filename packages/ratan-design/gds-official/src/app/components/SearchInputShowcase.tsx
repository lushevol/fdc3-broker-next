import { useState } from 'react';
import { Search, X, Mic } from 'lucide-react';

export default function SearchInputShowcase() {
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [searchValue3, setSearchValue3] = useState('');
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);

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
        Search input
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Search input is a specialised text field designed for query entry,
        content filtering and search-triggered interactions. Height: 32px,
        padding: 12-16px, round: full, icon size: 16px.
      </p>

      {/* Basic search */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic search
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '400px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--sc-color-grey-500)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchValue1}
              onChange={(e) => setSearchValue1(e.target.value)}
              placeholder="Search"
              style={{
                width: '100%',
                height: '32px',
                paddingLeft: '40px',
                paddingRight: searchValue1 ? '40px' : '16px',
                backgroundColor: 'var(--sc-color-white)',
                border: '1px solid var(--sc-color-grey-300)',
                borderRadius: '24px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-500)';
                setIsFocused1(true);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
                setIsFocused1(false);
              }}
            />
            {searchValue1 && (
              <button
                onClick={() => setSearchValue1('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  padding: 0,
                  border: 'none',
                  background: 'var(--sc-color-grey-300)',
                  borderRadius: '50%',
                  color: 'var(--sc-color-white)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-400)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-300)';
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* With label */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With label
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div style={{ maxWidth: '400px' }}>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-label-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-label-text)',
                marginBottom: '8px',
              }}
            >
              Search API
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--sc-color-grey-500)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchValue2}
                onChange={(e) => setSearchValue2(e.target.value)}
                placeholder="Type to search"
                style={{
                  width: '100%',
                  height: '32px',
                  paddingLeft: '40px',
                  paddingRight: searchValue2 ? '40px' : '16px',
                  backgroundColor: 'var(--sc-color-white)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-blue-500)';
                  setIsFocused2(true);
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                  setIsFocused2(false);
                }}
              />
              {searchValue2 && (
                <button
                  onClick={() => setSearchValue2('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    padding: 0,
                    border: 'none',
                    background: 'var(--sc-color-grey-300)',
                    borderRadius: '50%',
                    color: 'var(--sc-color-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-grey-400)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-grey-300)';
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* With trailing icon (voice input) */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With trailing icon
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div style={{ maxWidth: '400px' }}>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-label-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-label-text)',
                marginBottom: '8px',
              }}
            >
              Search with voice
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--sc-color-grey-500)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchValue3}
                onChange={(e) => setSearchValue3(e.target.value)}
                placeholder="Search or speak"
                style={{
                  width: '100%',
                  height: '32px',
                  paddingLeft: '40px',
                  paddingRight: '70px',
                  backgroundColor: 'var(--sc-color-white)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-blue-500)';
                  setIsFocused3(true);
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                  setIsFocused3(false);
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                {searchValue3 && (
                  <button
                    onClick={() => setSearchValue3('')}
                    style={{
                      width: '20px',
                      height: '20px',
                      padding: 0,
                      border: 'none',
                      background: 'var(--sc-color-grey-300)',
                      borderRadius: '50%',
                      color: 'var(--sc-color-white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-400)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-300)';
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
                <button
                  onClick={() => console.log('Voice input activated')}
                  style={{
                    width: '28px',
                    height: '28px',
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--sc-color-blue-500)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-blue-50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Mic size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
