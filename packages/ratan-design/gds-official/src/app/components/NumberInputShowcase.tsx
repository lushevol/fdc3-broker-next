import { useState } from 'react';
import {
  Plus,
  Minus,
  DollarSign,
  Info,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';

export default function NumberInputShowcase() {
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState('100.00');
  const [weight, setWeight] = useState('5.5');
  const [percentage, setPercentage] = useState('15');
  const [showTooltip, setShowTooltip] = useState(false);

  const incrementValue = (value: number, step: number = 1, max?: number) => {
    const newValue = value + step;
    return max !== undefined ? Math.min(newValue, max) : newValue;
  };

  const decrementValue = (value: number, step: number = 1, min: number = 0) => {
    const newValue = value - step;
    return Math.max(newValue, min);
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
        Number input
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Number input is a specialised form field designed for numeric data entry
        and controlled increment/decrement. It supports direct keyboard typing,
        stepper buttons, prefixes/suffixes, and semantic validation states.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Basic Number Input States */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            Basic number input
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
            }}
          >
            {/* Neutral State */}
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
                Quantity *
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setQuantity(val);
                  }}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 72px 0 12px',
                    border: '1px solid var(--sc-color-grey-300)',
                    borderRadius: '6px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    backgroundColor: 'var(--sc-color-white)',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-blue-500)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-grey-300)';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '32px',
                    display: 'flex',
                    borderLeft: '1px solid var(--sc-color-grey-300)',
                  }}
                >
                  <button
                    onClick={() => setQuantity(decrementValue(quantity))}
                    disabled={quantity <= 0}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: quantity <= 0 ? 'not-allowed' : 'pointer',
                      color:
                        quantity <= 0
                          ? 'var(--sc-color-grey-300)'
                          : 'var(--sc-color-foundation-content-body)',
                      borderRight: '1px solid var(--sc-color-grey-300)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (quantity > 0) {
                        e.currentTarget.style.backgroundColor =
                          'var(--sc-color-grey-50)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => setQuantity(incrementValue(quantity))}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-helper-text)',
                  marginTop: '6px',
                }}
              >
                Enter the quantity needed
              </p>
            </div>

            {/* With Prefix (Currency) */}
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
                Amount *
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-grey-600)',
                    fontWeight: '500',
                  }}
                >
                  SGD
                </span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 72px 0 52px',
                    border: '1px solid var(--sc-color-grey-300)',
                    borderRadius: '6px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    backgroundColor: 'var(--sc-color-white)',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-blue-500)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-grey-300)';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '32px',
                    display: 'flex',
                    borderLeft: '1px solid var(--sc-color-grey-300)',
                  }}
                >
                  <button
                    onClick={() => {
                      const val = parseFloat(amount) || 0;
                      setAmount(Math.max(0, val - 10).toFixed(2));
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderRight: '1px solid var(--sc-color-grey-300)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => {
                      const val = parseFloat(amount) || 0;
                      setAmount((val + 10).toFixed(2));
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* With Suffix (Unit) */}
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
                Weight
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 94px 0 12px',
                    border: '1px solid var(--sc-color-grey-300)',
                    borderRadius: '6px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    backgroundColor: 'var(--sc-color-white)',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-blue-500)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-grey-300)';
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: '72px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-grey-600)',
                    fontWeight: '500',
                  }}
                >
                  kg
                </span>
                <div
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '32px',
                    display: 'flex',
                    borderLeft: '1px solid var(--sc-color-grey-300)',
                  }}
                >
                  <button
                    onClick={() => {
                      const val = parseFloat(weight) || 0;
                      setWeight(Math.max(0, val - 0.5).toFixed(1));
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderRight: '1px solid var(--sc-color-grey-300)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => {
                      const val = parseFloat(weight) || 0;
                      setWeight((val + 0.5).toFixed(1));
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* With Percentage */}
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
                Discount rate
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 84px 0 12px',
                    border: '1px solid var(--sc-color-grey-300)',
                    borderRadius: '6px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    backgroundColor: 'var(--sc-color-white)',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-blue-500)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-grey-300)';
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: '72px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-grey-600)',
                    fontWeight: '500',
                  }}
                >
                  %
                </span>
                <div
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '32px',
                    display: 'flex',
                    borderLeft: '1px solid var(--sc-color-grey-300)',
                  }}
                >
                  <button
                    onClick={() => {
                      const val = parseInt(percentage) || 0;
                      setPercentage(Math.max(0, val - 5).toString());
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderRight: '1px solid var(--sc-color-grey-300)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => {
                      const val = parseInt(percentage) || 0;
                      setPercentage(Math.min(100, val + 5).toString());
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Validation States */}
        <section>
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
              gridTemplateColumns: '1fr 1fr',
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
                Order quantity *
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value="0"
                  readOnly
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 72px 0 12px',
                    border: '1px solid var(--sc-color-red-500)',
                    borderRadius: '6px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    backgroundColor: 'var(--sc-color-white)',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '32px',
                    display: 'flex',
                    borderLeft: '1px solid var(--sc-color-red-500)',
                  }}
                >
                  <button
                    disabled
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'not-allowed',
                      color: 'var(--sc-color-grey-300)',
                      borderRight: '1px solid var(--sc-color-red-500)',
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-red-500)',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AlertCircle size={12} />
                Quantity must be at least 1
              </p>
            </div>

            {/* Warning State */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  marginBottom: '8px',
                  fontWeight: '500',
                  position: 'relative',
                }}
              >
                Stock level *
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--sc-color-grey-600)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Info size={14} />
                </button>
                {showTooltip && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '4px',
                      backgroundColor: 'var(--sc-color-grey-900)',
                      color: 'var(--sc-color-white)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: 'var(--sc-text-description-main)',
                      lineHeight: '16px',
                      whiteSpace: 'nowrap',
                      zIndex: 1000,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    Minimum stock level is 50 units
                  </div>
                )}
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value="25"
                  readOnly
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 72px 0 12px',
                    border: '1px solid var(--sc-color-amber-500)',
                    borderRadius: '6px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    backgroundColor: 'var(--sc-color-white)',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '32px',
                    display: 'flex',
                    borderLeft: '1px solid var(--sc-color-amber-500)',
                  }}
                >
                  <button
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderRight: '1px solid var(--sc-color-amber-500)',
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-amber-600)',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AlertCircle size={12} />
                Stock level below minimum threshold
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
                Transfer amount
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-grey-600)',
                    fontWeight: '500',
                  }}
                >
                  $
                </span>
                <input
                  type="text"
                  value="500.00"
                  readOnly
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 72px 0 36px',
                    border: '1px solid var(--sc-color-green-600)',
                    borderRadius: '6px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-foundation-content-body)',
                    backgroundColor: 'var(--sc-color-white)',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '32px',
                    display: 'flex',
                    borderLeft: '1px solid var(--sc-color-green-600)',
                  }}
                >
                  <button
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderRight: '1px solid var(--sc-color-green-600)',
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--sc-color-foundation-content-body)',
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <p
                style={{
                  fontSize: 'var(--sc-text-description-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-green-600)',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle size={12} />
                Amount validated
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
                Item count (disabled)
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value="10"
                  disabled
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 72px 0 12px',
                    border: '1px solid var(--sc-color-grey-200)',
                    borderRadius: '6px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    color: 'var(--sc-color-grey-400)',
                    backgroundColor: 'var(--sc-color-grey-50)',
                    outline: 'none',
                    cursor: 'not-allowed',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    height: '32px',
                    display: 'flex',
                    borderLeft: '1px solid var(--sc-color-grey-200)',
                  }}
                >
                  <button
                    disabled
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'not-allowed',
                      color: 'var(--sc-color-grey-300)',
                      borderRight: '1px solid var(--sc-color-grey-200)',
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    disabled
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'not-allowed',
                      color: 'var(--sc-color-grey-300)',
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Read-only State */}
        <section>
          <h3
            style={{
              fontSize: 'var(--sc-text-title-main)',
              lineHeight: '26px',
              color: 'var(--sc-color-foundation-content-title)',
              marginBottom: '16px',
            }}
          >
            Read-only display
          </h3>

          <div style={{ maxWidth: '320px' }}>
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
              Total items
            </label>
            <div
              style={{
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                padding: '4px 0',
              }}
            >
              42
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
