import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';

export default function DropdownInputShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    'Singapore Dollar (SGD)',
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const countries = [
    'Singapore',
    'United States',
    'United Kingdom',
    'Australia',
    'Canada',
    'Germany',
    'France',
    'Japan',
    'South Korea',
    'India',
  ];

  const currencies = [
    'Singapore Dollar (SGD)',
    'US Dollar (USD)',
    'British Pound (GBP)',
    'Euro (EUR)',
    'Japanese Yen (JPY)',
    'Australian Dollar (AUD)',
  ];

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
      if (
        currencyRef.current &&
        !currencyRef.current.contains(event.target as Node)
      ) {
        setCurrencyOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        Dropdown input
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Dropdown Input is a single-line form control that allows users to select
        from a predefined list of options with labels, validation, and helper
        text.
      </p>

      {/* Basic Dropdown States */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Dropdown states
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}
        >
          {/* Rest State - Now Functional */}
          <div ref={dropdownRef}>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '8px',
                fontWeight: '500',
              }}
            >
              Select country *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={selectedCountry || ''}
                placeholder="Select a country"
                readOnly
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 36px 0 12px',
                  border: `1px solid ${isOpen ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
                  borderRadius: '6px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: selectedCountry
                    ? 'var(--sc-color-foundation-content-body)'
                    : 'var(--sc-color-grey-400)',
                  backgroundColor: 'var(--sc-color-white)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-blue-300)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-grey-300)';
                  }
                }}
              />
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})`,
                  color: 'var(--sc-color-grey-600)',
                  pointerEvents: 'none',
                  transition: 'transform 0.2s ease',
                }}
              />

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor:
                      'var(--sc-color-foundation-basic-container-layer)',
                    border:
                      '1px solid var(--sc-color-foundation-basic-divider-base)',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    maxHeight: '240px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Search */}
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
                        placeholder="Search countries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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

                  {/* Options */}
                  <div
                    style={{
                      overflowY: 'auto',
                      padding: '4px',
                    }}
                  >
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country}
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsOpen(false);
                            setSearchQuery('');
                          }}
                          style={{
                            width: '100%',
                            height: '36px',
                            padding: '0 8px',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: 'var(--sc-text-component-main)',
                            lineHeight: '22px',
                            color:
                              selectedCountry === country
                                ? 'var(--sc-color-blue-600)'
                                : 'var(--sc-color-foundation-content-body)',
                            backgroundColor:
                              selectedCountry === country
                                ? 'var(--sc-color-blue-50)'
                                : 'transparent',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedCountry !== country) {
                              e.currentTarget.style.backgroundColor =
                                'var(--sc-color-grey-50)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedCountry !== country) {
                              e.currentTarget.style.backgroundColor =
                                'transparent';
                            }
                          }}
                        >
                          <span>{country}</span>
                          {selectedCountry === country && (
                            <Check
                              size={16}
                              style={{ color: 'var(--sc-color-blue-600)' }}
                            />
                          )}
                        </button>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: '16px',
                          textAlign: 'center',
                          fontSize: 'var(--sc-text-component-main)',
                          lineHeight: '22px',
                          color: 'var(--sc-color-grey-400)',
                        }}
                      >
                        No countries found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
                marginTop: '6px',
              }}
            >
              Choose your country of residence
            </p>
          </div>

          {/* Disabled State */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-grey-400)',
                marginBottom: '8px',
                fontWeight: '500',
              }}
            >
              Select region
            </label>
            <div style={{ position: 'relative' }}>
              <button
                disabled
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 36px 0 12px',
                  border: '1px solid var(--sc-color-grey-200)',
                  borderRadius: '6px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-grey-300)',
                  backgroundColor: 'var(--sc-color-grey-50)',
                  textAlign: 'left',
                  cursor: 'not-allowed',
                  outline: 'none',
                  opacity: 0.6,
                }}
              >
                Select a region
              </button>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--sc-color-grey-400)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* With Selection and Clear */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With selection and clear action
        </h3>

        <div ref={currencyRef} style={{ maxWidth: '320px' }}>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
              marginBottom: '8px',
              fontWeight: '500',
            }}
          >
            Preferred currency
          </label>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 64px 0 12px',
                border: `1px solid ${currencyOpen ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
                borderRadius: '6px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                backgroundColor: 'var(--sc-color-white)',
                textAlign: 'left',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!currencyOpen) {
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-blue-300)';
                }
              }}
              onMouseLeave={(e) => {
                if (!currencyOpen) {
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                }
              }}
            >
              {selectedCurrency}
            </button>
            <div
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCurrency('Singapore Dollar (SGD)');
                }}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'var(--sc-color-grey-600)',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-100)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={14} />
              </button>
              <ChevronDown
                size={16}
                style={{
                  color: 'var(--sc-color-grey-600)',
                  marginRight: '4px',
                  transform: `rotate(${currencyOpen ? '180deg' : '0deg'})`,
                  transition: 'transform 0.2s ease',
                }}
              />
            </div>

            {/* Currency Dropdown Menu */}
            {currencyOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  backgroundColor:
                    'var(--sc-color-foundation-basic-container-layer)',
                  border:
                    '1px solid var(--sc-color-foundation-basic-divider-base)',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflow: 'auto',
                  padding: '4px',
                }}
              >
                {currencies.map((currency) => (
                  <button
                    key={currency}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setCurrencyOpen(false);
                    }}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 8px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      color:
                        selectedCurrency === currency
                          ? 'var(--sc-color-blue-600)'
                          : 'var(--sc-color-foundation-content-body)',
                      backgroundColor:
                        selectedCurrency === currency
                          ? 'var(--sc-color-blue-50)'
                          : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCurrency !== currency) {
                        e.currentTarget.style.backgroundColor =
                          'var(--sc-color-grey-50)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCurrency !== currency) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>{currency}</span>
                    {selectedCurrency === currency && (
                      <Check
                        size={16}
                        style={{ color: 'var(--sc-color-blue-600)' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Validation States - Static examples */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Validation states
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
          }}
        >
          {/* Error State */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '8px',
                fontWeight: '500',
              }}
            >
              Payment method *
            </label>
            <div style={{ position: 'relative' }}>
              <button
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 36px 0 12px',
                  border: '1px solid var(--sc-color-red-500)',
                  borderRadius: '6px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-grey-400)',
                  backgroundColor: 'var(--sc-color-white)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                Select payment method
              </button>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--sc-color-grey-600)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-red-500)',
                marginTop: '6px',
              }}
            >
              Payment method is required
            </p>
          </div>

          {/* Warning State */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '8px',
                fontWeight: '500',
              }}
            >
              Account type
            </label>
            <div style={{ position: 'relative' }}>
              <button
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 36px 0 12px',
                  border: '1px solid var(--sc-color-amber-500)',
                  borderRadius: '6px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  backgroundColor: 'var(--sc-color-white)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                Savings
              </button>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--sc-color-grey-600)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-amber-700)',
                marginTop: '6px',
              }}
            >
              Limited availability for this type
            </p>
          </div>

          {/* Success State */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '8px',
                fontWeight: '500',
              }}
            >
              Verification status
            </label>
            <div style={{ position: 'relative' }}>
              <button
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 36px 0 12px',
                  border: '1px solid var(--sc-color-green-500)',
                  borderRadius: '6px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  backgroundColor: 'var(--sc-color-white)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                Verified
              </button>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--sc-color-grey-600)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-green-700)',
                marginTop: '6px',
              }}
            >
              Account verified successfully
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
